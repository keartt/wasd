var stompClient = null;
var username = null;
var roomNum = null;
var myDropzone = null;

function connect(e) {
    e.preventDefault();
    username = $('#name').val().trim();
    roomNum = !!$('#room').val() ? $('#room').val().trim() : null;

    if(username) {
        $('#username-page').addClass('hidden');
        $('#chat-page').removeClass('hidden');

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        // 디버그 출력을 비활성화
        stompClient.debug = function() {};

        stompClient.connect({}, onConnected, onError);
    }
}

function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/sub/chat/room/' + roomNum, onMessageReceived);

    var header = {
        priority : 'high',
        room : roomNum
    }

    // Tell your username to the server
    stompClient.send("/pub/chat/enter", header, // header
        JSON.stringify({sender: username, content: 'JOIN'})
    )

    $('.connecting').addClass('hidden');
}

function onError(e) {
    $('.connecting').text('Could not connect to WebSocket server. Please refresh this page to try again!');
    $('.connecting').css({'color': 'red'})
}

function disconnect() {
    if (stompClient) {
        var header = {
            priority: 'high',
            room: roomNum
        };
        stompClient.send("/pub/chat/enter", header,
            JSON.stringify({sender: username, content: 'LEAVE'})
        );
        stompClient.disconnect();
    }
}

function sendMessage(e) {
    e.preventDefault();
    var messageContent = $('#message').val().trim();
    if(stompClient) {
        var chatMessage = {
            sender: username,
        };
        // msg
        if (!!messageContent) {
            chatMessage.content = $('#message').val();
            // stompClient.send(destination, headers, body)
            stompClient.send("/pub/chat/message", {room : roomNum}, JSON.stringify(chatMessage));
            $('#message').val('');
        }
        // file
        if (myDropzone.files.length > 0) {

            Array.from(myDropzone.files).forEach(file => {
                var reader = new FileReader();

                // 파일을 Data URL 형식으로 읽어 Base64로 변환
                reader.readAsDataURL(file);

                reader.onload = function(event) {
                    chatMessage.base64 = event.target.result.split(',')[1];

                    stompClient.send("/pub/chat/message", {room : roomNum}, JSON.stringify(chatMessage));
                    myDropzone.removeAllFiles();
                };

                reader.onerror = function(error) {
                    console.error('Error reading file:', error);
                };
            });
        }
    }
}

function onMessageReceived(payload) {

    if (!!payload.headers["real-type"]){
        return screenReceived(payload);
    }

    var message = JSON.parse(payload.body);
    var $messageElement = $('<li>');

    if (message.content === 'JOIN' || message.content === 'LEAVE') {
        $messageElement.addClass('event-message');
        message.content += ' ' + message.sender;
    } else {
        $messageElement.addClass('chat-message');

        var avatarColor = getAvatarColor(message.sender);

        var $avatarElement = $('<i>').text(message.sender[0]).css('background-color', avatarColor);
        $messageElement.append($avatarElement);

        var $usernameElement = $('<span>').text(message.sender);
        $messageElement.append($usernameElement);
    }
    var $elem;
    if (!!message.base64){
        $elem = $('<img>').attr('src', 'data:image/jpeg;base64,' + message.base64);
    }else{
        $elem = $('<p>').text(message.content);
    }

    $messageElement.append($elem);
    if (message.sender === username){
        $messageElement.addClass('my-self')
    }

    $('#messageArea').append($messageElement);
    $('#messageArea').scrollTop($('#messageArea')[0].scrollHeight);
}

function getAvatarColor(messageSender) {
    var colors = [  '#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0' ];

    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

Dropzone.autoDiscover = false;
$( document ).ready(function () {
    $('#usernameForm').on('submit', connect);
    $('#messageForm').on('submit', sendMessage);

    myDropzone = new Dropzone("#dropzone", {
        url: "/upload", // 파일을 업로드할 URL
        autoProcessQueue: false, // 파일 자동 업로드 비활성화
        maxFilesize: 2, // 최대 파일 크기 (MB 단위)
        acceptedFiles: "image/*,application/pdf,.psd", // 허용되는 파일 타입
        addRemoveLinks: true, // 업로드된 파일을 제거할 수 있는 링크
        dictDefaultMessage: "Drag & Drop files here or click to upload", // 기본 메시지
        init: function() {
            this.on("success", function(file, response) {
                myDropzone.removeAllFiles();
            });
            this.on("error", function(file, response) {
                console.log("Error uploading file");
            });
        }
    });
});

$(window).on('beforeunload', function(e) {
    disconnect();
    //
    // sessionStorage.setItem('refresh', 'true');
    // var message = '정말로 페이지를 떠나시겠습니까?';
    // e.returnValue = message;
    // return message; // 이 줄은 주로 Chrome과 같은 브라우저에서 사용됨
});

