// stompClient.send(destination, headers, body)
var stompClient = null;
var groupId = null;
var header = {};



function connect(id) {
    $('.groupDetail-chat-list-box').empty();

    // set data
    header = {
        // priority: 'high',
        groupId: id,
    }

    // connect
    stompClient = Stomp.over(new SockJS('/ws'));
    stompClient.debug = function() {}; // 디버그 출력을 비활성화
    stompClient.connect({}, onConnected, onError);
    
    // 접속
    function onConnected() {
        // Subscribe to the Public Topic
        stompClient.subscribe('/sub/chat/group/' + header.groupId, onMessageReceived);

        // Tell your username to the server
        stompClient.send("/pub/chat/enter", header, makeMsg('JOIN'));
    }

    // 연결 에러처리
    function onError(e) {
        console.error(e);
    }
}

// 연결 종료
function disconnect() {
    console.log('disconnect', stompClient != null)
    if (stompClient) {
        stompClient.send("/pub/chat/enter", header, makeMsg('LEAVE'));
        stompClient.disconnect();
        stompClient.unsubscribe();
    }
}


// 발신
function sendMessage() {
    var messageContent = $('#chat-text').val();
    if (messageContent.trim() == '' || stompClient == null) return;

    stompClient.send("/pub/chat/message", header, makeMsg(messageContent));
    $('#chat-text').val('');
}

// 수신
function onMessageReceived(payload) {
    var msgData = JSON.parse(payload.body); // 응답 데이터 파싱

    // 참여 유저 목록 변경 이벤트
    if (Array.isArray(msgData)) {
        changeActiveUsers(msgData);
        return;
    }

    // 메시지가 입장 또는 퇴장일 경우
    var isMine = msgData.userId == oauthUserInfo.id;
    if (msgData.msg == 'JOIN' || msgData.msg == 'LEAVE') {

        var active = msgData.msg == 'JOIN';
        util.msg('info', '알림', `${isMine ? '' : `${msgData.nickname}님이 `} ${active ? '입장' : '퇴장'} 하셨습니다.`);
        //TODO [KSH] 좌측 active 처리
        return;
    }

    let currentTime = (() => {
        const now = new Date();
        return `${now.getFullYear()}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    })();

    /*// 동일 시간대(분단위) 에 보낸 메시지가 있을 경우 추가
    var $targetDiv = $('.groupDetail-chat-content').filter(function() {
        var findSrc = $(this).find('img').attr('src');
        var findDate = $(this).find('.chat-info-title-date').text().trim();

        return findSrc === msgData.profileImg && findDate === currentTime;
    });

    if ($targetDiv.length > 0 && $targetDiv.is(':last')) {
        // 메시지만 추가
        $targetDiv.find('.chat-info-message').append(`<pre>${msgData.msg}</pre>`);
    }*/

    // 내 메시지인지 여부에 따라서 좌측 우측 설정
    // 새로운 메시지 div
    let $msgDiv = $(`<div class="groupDetail-chat-content ${isMine ? ' my-msg' : ''}" ">
            <img src="${msgData.profileImg}" alt="프로필 사진"/>
            <div class="groupDetail-chat-info">
                <div class="chat-info-title">
                    <span class="chat-info-title-username">${msgData.nickname}</span>
                </div>
                <div class="chat-info-message">
                    <pre>${msgData.msg}</pre>
                </div>
            </div>
        </div>`)

    // 시간 왼쪽 오른쪽 설정
    var $timeDiv = $(`<span class="chat-info-title-date">${currentTime}</span>`)
    $msgDiv.find('.chat-info-title')[isMine ? 'prepend' : 'append']($timeDiv);

    $('.groupDetail-chat-list-box').append($msgDiv);
    $('.groupDetail-chat-list-box').scrollTop($('.groupDetail-chat-list-box')[0].scrollHeight);
}

// 참여 유저 목록 변경 이벤트
function changeActiveUsers(userList) {
    $('#chat-user-list').empty();
    userList.forEach((user) => {
        var isLeader = user.role == 0;
        var $userDiv = $(`<div class="groupDetail-info-user">
                            <img src="${user.profileImg}" alt="프로필이미지"/>
                            ${isLeader ? '<i class="fa-solid fa-crown"></i>' : ''}
                            <span>${user.nickname}</span>
                            <div class="status-indicator ${user.active ? 'active' : ''}"></div>
                        </div>`);

        (isLeader ? $('#chat-user-list').prepend($userDiv) : $('#chat-user-list').append($userDiv));
    });
}

function makeMsg(msg) {
    return JSON.stringify({
        msg: msg,
        userId: oauthUserInfo.id
    });
}