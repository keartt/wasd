function initGroupNew() {
    groupImgUpload();   // 파일 업로드
    $('#groupImgResetBtn').click(); // 파일 리셋
    $('.groupNew-input-box .new-select-style').trigger('change');

    groupNewGameSelect(); // select option구성
    groupNewSelectEvent();
}

// 파일 업로드
function groupImgUpload() {

    $("#groupImgUploadBtn").click(function () {
        $('#groupImgFile').click();
    });

    // 파일이 선택되면 Base64로 변환하여 미리보기
    $("#groupImgFile").change(function (event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var base64Image = e.target.result;

                // 미리보기 이미지 src에 Base64 데이터 삽입
                $('#groupImg').attr('src', base64Image);
                $('#groupImg').show();

            }
            reader.readAsDataURL(file);
        }
    });

    // 파일 리셋
    $('#groupImgResetBtn').click(function () {
        var defaultImagePath = '/images/wasd_logo.png';
        var img = new Image();
        img.src = defaultImagePath;
        img.onload = function () {
            // 이미지를 Base64로 변환
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var base64Image = canvas.toDataURL('image/png');

            // Base64 이미지로 미리보기 설정
            $('#groupImg').attr('src', base64Image);
        };
    });
}


// 게임 조회
function groupNewGameSelect() {
    $('#groupNewGameSelect .dropdown').empty();
    $.ajax({
        url: '/gameInfo',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (res) {
            if (res.length > 0) {

                // 첫 번째 데이터를 기본 선택값으로 설정
                var firstItem = res[0];
                $('#groupNewGameSelect #selectedItem').html('<img src="/images/gameImg/' + firstItem.gameId + '.png" /><span>' + firstItem.gameNm + '</span>');


                // 드롭다운 목록에 항목 추가
                var addTag = "";
                res.forEach(function (item) {
                    addTag += `
                    <div class="dropdown-item" data-value="${item.gameId}"><img src="/images/gameImg/${item.gameId}.png"/><span>${item.gameNm}</span></div>
                    `;
                });
                $('#groupNewGameSelect .dropdown').append(addTag);
                getGameInfoAttr(firstItem.gameId);

            } else {
                $('#groupNewGameSelect #selectedItem').text('게임 선택');
            }
        },
        error: function (xhr) {
            alert(xhr.responseJSON?.message || '서버 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    });
}

function groupNewSelectEvent(){
    $('#groupNewGameSelect #selectedItem').click(function () {
        $('#groupNewGameSelect').toggleClass('open');
    });

    $('#groupNewGameSelect .dropdown .dropdown-item').click(function () {
        var selectedValue = $(this).data('value');
        var selectedText = $(this).text();
        var selectImg = $('#groupNewGameSelect #selectedItem img').attr('id') || 'groupNewSelect_null';

        $('#groupNewGameSelect').removeClass('open');
        if (selectImg.split('_')[1] != selectedValue) {
            $('#groupNewGameSelect #selectedItem').html('<img id="groupNewSelect_' + selectedValue + '" src="/images/gameImg/' + selectedValue + '.png" />' + selectedText);


            getGameInfoAttr(selectedValue);
        }

    });

    $('.groupNew-box').click(function (event) {
        if (!$(event.target).closest('#groupNewGameSelect').length) {
            $('#groupNewGameSelect').removeClass('open');
        }
    });
}


function getGameInfoAttr(targetGameId){
    $('.groupNew-gameAttr-box').empty();

    // 게임 속성 정보 조회
    $.ajax({
        url: '/gameInfo/' + targetGameId,
        type: 'get',
        dataType: 'json',
        async: false,
        success: function (res) {

            var infoData = Object.entries(res.info);    // info 객체에서 항목을 배열로 변환
            var $gameAttrBox = $('.groupNew-gameAttr-box');
            var $colDiv = $('<div class="groupNew-gameAttr-box-col"></div>');
            var count = 0;

            infoData.forEach(function ([key, value]) {
                var $wrapperDiv = $('<div class="input-wrapper-ph"></div>');
                var $select = $('<select id="' + key + '" class="gameInfo-select" required><option value="" ></option></select>');
                var $label = $('<label>' + value.infoNm + '</label>');

                // 속성 추가
                Object.entries(value).forEach(function ([optionKey, optionValue]) {
                    if (optionKey !== 'infoNm') {
                        // $select.append(`<option value="${optionKey}" ${gameAttrSelectCheck(key, optionKey)} >${optionValue}</option>`);
                        $select.append(`<option value="${optionKey}" >${optionValue}</option>`);
                    }
                });

                // wrapper에 select와 label 추가
                $wrapperDiv.append($select).append($label);
                $colDiv.append($wrapperDiv);

                count++;

                // 2개 아이템을 추가한 후 새로운 컬럼 div 생성
                if (count % 2 === 0) {
                    $gameAttrBox.append($colDiv);
                    $colDiv = $('<div class="groupNew-gameAttr-box-col"></div>'); // 새 컬럼 div
                }
            });

            // 마지막 컬럼 div가 비어있지 않으면 추가
            if ($colDiv.children().length > 0) {
                $gameAttrBox.append($colDiv);
            }

        }
    });

}