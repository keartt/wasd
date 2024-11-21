var userJoinfields = [
    {
        id: 'email',
        name: '이메일',
        pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        message: '유효한 이메일 주소 형식이 아닙니다. 예시: test@test.com'
    },
    {
        id: 'nickname',
        name: '닉네임',
        pattern: /^.{1,20}$/, // 닉네임의 길이를 1~20자로 제한
        message: '닉네임은 1자 이상 20자 이하로 입력해야 합니다.'
    },
    {
        id: 'yearOfBirth',
        name: '생년월일',
        pattern: null, // 1900~2099 사이의 년도만 허용
        message: null
    }
];

// 공통 사용 함수
function initJoinCommon(){
    saveGameInfoList = [];
    createMbtiOption();         // 성격 유형 option 추가
    clickInfoBoxGameBtn();      // 게임 정보 게임 선택
    closeGameInfoPopupTarget(); // 팝업창 닫기
    clickPopupBoxGameBtn();     //  팝업 게임 선택
    changeGameInfoSelect();     // 게임 속성 변경 시 데이터 저장
    profileImgUpload();         // 프로필 파일 업로드 관련 설정
    getGameInfo();              // 게임 정보 조회
}

// 게임 정보 게임 선택
function clickInfoBoxGameBtn(){
    $(document).off('click', '.profile-info-game-box .profile-info-game-btn').on('click', '.profile-info-game-box .profile-info-game-btn', function () {
        // 변경된 경우에만 적용
        if ($(this).hasClass('select'))
            return;
        changeGameAttr($(this).attr('id'));
    });
}

//  팝업 게임 선택
function clickPopupBoxGameBtn(){
    $(document).off('click', '.gameInfo-popup-gamebox .profile-info-game-btn').on('click', '.gameInfo-popup-gamebox .profile-info-game-btn', function () {
        $('.gameInfo-popup-gamebox .profile-info-game-btn').removeClass('select');
        $(this).addClass('select');
    });
}

// 팝업창 닫기
function closeGameInfoPopupTarget(){
    $("#gameInfo-popup").click(function (event) {
        if ($(event.target).is("#gameInfo-popup")) {
            closeGameInfoPopup();
        }
    });
}

// 게임 속성 변경 시 데이터 저장
function changeGameInfoSelect(){
    $(document).off('change', '.gameInfo-select').on('change', '.gameInfo-select', function () {
        saveGameAttr();
    });
}

// 성격 유형 option 추가
function createMbtiOption(){
    $.ajax({
        url: '/user/mbti',
        type: 'get',
        async: false,
        success: function (res) {
            res.forEach(function (mbti) {
                $('#mbti').append(`<option value="${mbti}">${mbti}</option>`);
            });
        }
    });
}

// 프로필 파일 업로드 관련
function profileImgUpload(){

    // 파일 업로드 클릭 이벤트
    $('#profileImgUploadBtn').on('click', function () {
        $('#profileImgFile').click();
    });

    // 파일이 선택되면 Base64로 변환하여 미리보기
    $('#profileImgFile').on('change', function (event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var base64Image = e.target.result;

                // 미리보기 이미지 src에 Base64 데이터 삽입
                $('#profileImg').attr('src', base64Image);
                $('#profileImg').show();

            }
            reader.readAsDataURL(file);
        }
    });
}


// 게임 목록 팝업 닫기
function closeGameInfoPopup() {
    $("#gameInfo-popup").hide();
}

// 게임 추가
function addPopupGameInfo() {
    var selectGameInfo = $('.gameInfo-popup-gamebox .profile-info-game-btn.select');
    if (selectGameInfo.length === 0) {
        util.alert('info', '선호하는 게임을 선택하세요.', '',undefined,undefined);
        return;
    }

    var gameId = selectGameInfo.attr('id').split('-')[1];
    var addTag = `
        <button class="profile-info-game-btn" id="${gameId}">
            <img src="/images/gameImg/${gameId}.png" />
            <span class="profile-info-game-delete-btn" onclick="deleteGameInfo('${gameId}')">×</span>
        </button>
    `;
    $('#profile-info-game-box').append(addTag);

    changeGameAttr(gameId);

    openGameInfoPopupCheck();   //  게임 추가 버튼 출력 여부
    closeGameInfoPopup();       //  팝업 게임 선택창 닫기
}

// 게임 제거
function deleteGameInfo(gameId) {
    var delGameIndex = saveGameInfoList.findIndex(game => game.gameId === gameId);  // 저장 데이터 삭제
    if (delGameIndex >= 0) {
        saveGameInfoList.splice(delGameIndex, 1);
    }

    var delGameId = $('.profile-info-game-box .profile-info-game-btn.select').attr('id');
    $('#profile-info-game-box').find(`#${gameId}`).remove();    // 선호 게임 버튼 삭제
    openGameInfoPopupCheck();   // 게임 추가 버튼

    if (gameId === delGameId) {
        $('.profile-info-gameAttr-box').empty();    // 게임 속성 초기화
        $('.profile-info-game-box .profile-info-game-btn').first().trigger('click');    // 첫번째 게임에 select 옵션 추가
    }

    // 게임 모두 삭제했을 경우 추가 팝업 띄우기
    if ($('.profile-info-game-box .profile-info-game-btn').length === 0) {
        openGameInfoPopup()
    }
}


// 게임 속성 저장
function saveGameAttr(){
    var selectGameId = $('.profile-info-game-box .profile-info-game-btn.select').attr('id');
    var selectGameNm = $('#gameNm').text();
    var currentGameInfo = {
        gameId: selectGameId,
        gameNm: selectGameNm,
        info: {}
    };

    // 각 select 필드의 값을 저장
    $('.profile-info-gameAttr-box-col select').each(function () {
        var id = $(this).attr('id'); // select 요소의 id 값
        var value = $(this).val() || '';   // 사용자가 선택한 값
        currentGameInfo.info[id] = value; // 게임 정보에 저장
    });

    // 이미 저장된 게임이 있는지 확인 (배열에서 찾아서 업데이트)
    var existingGameIndex = saveGameInfoList.findIndex(game => game.gameId == selectGameId);
    if (existingGameIndex !== -1) { // 기존에 저장된 게임 정보 업데이트
        saveGameInfoList[existingGameIndex] = currentGameInfo;
    } else {    // 새로운 게임 정보 추가
        saveGameInfoList.push(currentGameInfo);
    }

}

// 게임 속성 창 변경
function changeGameAttr(gameId){

    // 기존 입력값 저장
    if ($('.profile-info-gameAttr-box').children().length > 0) {
        saveGameAttr();
    }

    $('.profile-info-gameAttr-box').empty();    // 초기화

    // 선택한 게임 select 클래스 적용
    $('.profile-info-game-box .profile-info-game-btn').removeClass('select');
    $(`#${gameId}`).addClass('select');

    var savedGameInfo = saveGameInfoList.find(game => game.gameId === gameId);

    // select optiop 체크 여부
    function gameAttrSelectCheck(key, optionKey) {
        if (!savedGameInfo)
            return '';

        var savedInfo = savedGameInfo.info;
        return savedInfo[key] === optionKey ? 'selected' : '';
    }

    // 게임 속성 정보 조회
    $.ajax({
        url: '/gameInfo/' + gameId,
        type: 'get',
        dataType: 'json',
        async: false,
        success: function (res) {
            // 게임명
            var addTag = `
                <div class="profile-info-gameAttr-box-title">
                    | <span id="gameNm">${res.gameNm}</span>
                </div>
            `;
            $('.profile-info-gameAttr-box').prepend(addTag);    // 맨 앞에 추가

            var infoData = Object.entries(res.info);    // info 객체에서 항목을 배열로 변환
            var $gameAttrBox = $('.profile-info-gameAttr-box');
            var $colDiv = $('<div class="profile-info-gameAttr-box-col"></div>');
            var count = 0;

            infoData.forEach(function ([key, value]) {
                var $wrapperDiv = $('<div class="input-wrapper-ph"></div>');
                var $select = $('<select id="' + key + '" class="gameInfo-select" required><option value="" ></option></select>');
                var $label = $('<label>' + value.infoNm + '</label>');

                // 속성 추가
                Object.entries(value).forEach(function ([optionKey, optionValue]) {
                    if (optionKey !== 'infoNm') {
                        $select.append(`<option value="${optionKey}" ${gameAttrSelectCheck(key, optionKey)} >${optionValue}</option>`);
                    }
                });

                // wrapper에 select와 label 추가
                $wrapperDiv.append($select).append($label);
                $colDiv.append($wrapperDiv);

                count++;

                // 2개 아이템을 추가한 후 새로운 컬럼 div 생성
                if (count % 2 === 0) {
                    $gameAttrBox.append($colDiv);
                    $colDiv = $('<div class="profile-info-gameAttr-box-col"></div>'); // 새 컬럼 div
                }
            });

            // 마지막 컬럼 div가 비어있지 않으면 추가
            if ($colDiv.children().length > 0) {
                $gameAttrBox.append($colDiv);
            }

        }, complete(){
            saveGameAttr(); // 새로운 게임 option 생성 후 디폴트 값 저장
        }
    });
}


// 게임 추가 버튼 출력 여부
function openGameInfoPopupCheck() {
    if ($('.profile-info-game-box .profile-info-game-btn').length === gameInfoList.length) {
        $('#game-add-btn').hide();
    } else {
        $('#game-add-btn').show();
    }
}

// 게임 정보 조회
function getGameInfo(){
    $.ajax({
        url: '/gameInfo',
        type: 'get',
        dataType: 'json',
        async: false,
        success: function (res) {
            gameInfoList = res;
        },
        error: function (xhr) {
            util.alert('error', xhr.responseJSON.msg || '게임 정보 조회 중 문제가 발생하였습니다. 잠시 후 다시 시도하세요.' ,'',undefined,undefined);
        }
    });
}

// 게임 목록 팝업 열기
function openGameInfoPopup() {

    if(gameInfoList.length == 0){
        getGameInfo();
    }

    // 기존 박스 정보 조회
    var gameArr = [];
    $('#profile-info-game-box .profile-info-game-btn').each(function () {
        gameArr.push($(this).attr('id'));
    });

    $('#gameInfo-popup-gamebox').empty();

    var addTag = ``;
    gameInfoList.forEach(function (item) {
        // 이미 내 게임 목록에 있으면 추가x
        if (gameArr.includes(item.gameId)) {
            return;
        }
        addTag += `
            <button class="profile-info-game-btn" id="popup-${item.gameId}">
                <span title="${item.gameNm}">
                    <img src="/images/gameImg/${item.gameId}.png" />
                </span>
            </button>
        `;
    });
    $("#gameInfo-popup-gamebox").append(addTag);
    $("#gameInfo-popup").show().css("display", "flex");

}