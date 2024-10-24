var userInfo = {};
var gameInfoList = [];
var saveGameInfoList = [];
var oriGameInfoList = [];

function initProfileSettings() {

    initJoinCommon();

    // 사용자 정보 조회
    $.ajax({
        url: `/user/${oauthUserInfo.id}`,
        type: 'get',
        async: false,
        success: function (res) {
            userInfo = res;
            setUserInfoField(userInfo);
        }
    })
}




// STEP 변경 이벤트
function changeStep(param, stepVal) {

    if ($(param).hasClass('active')) {  // 이미 active 상태면 동작하지 않음
        return;
    }


    if(stepVal === 1){
        var isChangedGameInfoList = compareGameInfoLists(oriGameInfoList, saveGameInfoList);
        if (isChangedGameInfoList && confirm('변경된 게임 정보를 저장하시겠습니까?')) {
            if(saveGameInfoList.length === 0){
                alert('선호하는 게임을 선택하세요.');
                return;
            }
            saveUserGameInfo(true); // 변경된 정보 저장 요청
        }

    } else if (stepVal === 2) {
        if (!validation(userJoinfields)) { return; }    // 사용자 정보 유효성검사
        saveUserInfo(true); // 사용자 정보 변경된 값 저장
        getGameInfoUser();  // 사용자 게임 정보 조회
    }

    $('.profile-info-box').css('display', 'none');  // info-box 제거
    $('#profile-info-box-step' + stepVal).css('display', 'flex');

    // step 버튼
    $('.profile-step-btn').removeClass('active');   // active 제거
    $('#profile-step-btn-' + stepVal).addClass('active');

}

// 게임 정보 변경 확인
function compareGameInfoLists(oriGameInfoList, saveGameInfoList) {
    if (oriGameInfoList.length !== saveGameInfoList.length) {
        return true;
    }

    // oriGameInfoList를 기준으로 saveGameInfoList와 비교
    for (let i = 0; i < oriGameInfoList.length; i++) {
        const oriGame = oriGameInfoList[i];
        const saveGame = saveGameInfoList.find(game => game.gameId === oriGame.gameId);

        // saveGameInfoList에 동일한 gameId가 없으면 변경이 있다고 간주
        if (!saveGame) {
            return true;
        }

        // info 객체 내부의 내용 비교
        for (let key in oriGame.info) {
            if (oriGame.info[key] !== saveGame.info[key]) {
                return true; // 변경이 있는 경우
            }
        }
    }
    return false;   // 변경 사항이 없으면 false 반환
}

// 사용자 INPUT 필드 채우기
function setUserInfoField(paramUserInfo){
    for (const [id, value] of Object.entries(paramUserInfo)) {
        setFieldValue(id, value);
    }

    setTimeout(() => {
        $('.new-select-style').trigger('change');
    }, 1);
}

// 사용자 정보 저장 (changeCheck : 변경 내역 확인 여부)
function saveUserInfo(changeCheck){

    if (!validation(userJoinfields)) { return; }

    // 값 변경 확인
    var userInfoData = {};
    var userInfoChangeCount = 0;
    for (const [id, value] of Object.entries(userInfo)) {
        const $field = $(`#${id}`);
        if (!$field.length) continue;

        // 필드의 값 확인 (이미지이면 src, 아니면 value)
        const fieldVal = $field.is('img') ? $field.attr('src') : $field.val();
        userInfoData[id] = value;   // 기존값 추가

        if (fieldVal != (value ?? '')) {
            userInfoData[id] = fieldVal?fieldVal:null;    // 변경 값 추가
            userInfoChangeCount++;
        }
    }

    function sendUserInfo() {
        $.ajax({
            url: '/user/',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(userInfoData),
            dataType: 'json',
            async: false,
            success: function (res) {
                userInfo = res;
                setUserInfoField(userInfo);
                if (!changeCheck) {
                    alert('프로필 정보가 성공적으로 저장되었습니다.');
                }
            },
            error: function (xhr) {
                alert(xhr.responseJSON?.message || '서버 오류가 발생했습니다. 다시 시도해 주세요.');
                if (changeCheck) {
                    setUserInfoField(userInfo); // 수정 취소 -> 기존 값으로 리셋
                }
            }
        });
    }

    // 변경 내역 확인 후 진행
    if (changeCheck) {
        if (userInfoChangeCount > 0 && confirm('변경된 프로필 정보를 저장하시겠습니까?')) {
            sendUserInfo(); // 변경된 정보 저장 요청
        } else {
            setUserInfoField(userInfo); // 수정 취소 -> 기존 값으로 리셋
        }
    } else {
        sendUserInfo(); // 변경 사항 없이 저장 요청
    }
}

// 사용자 게임 정보 조회
function getGameInfoUser(){
    saveGameInfoList = []; // 초기화
    oriGameInfoList = [];

    $('.profile-info-gameAttr-box').empty();
    $('#profile-info-game-box').empty();

    $.ajax({
        url: '/gameInfo/user',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (res) {
            res.forEach(function (item, index) {

                $.ajax({
                    url: '/gameInfo/user/game',
                    type: 'GET',
                    data: {
                        gameId: item.gameId
                    },
                    async: false,
                    success: function (gameAttrRes) {
                        saveGameInfoList.push(gameAttrRes);
                        oriGameInfoList.push(gameAttrRes);
                    }
                });

                addGameBtn(item.gameId);    // 게임 버튼 추가
                if(index == 0){
                    changeGameAttr(item.gameId); // 첫 번째 게임의 속성 추가
                    openGameInfoPopupCheck();
                }
            });
        },
        error: function (xhr) {
            alert(xhr.responseJSON?.message || '서버 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    });
}

// 관심 게임 버튼 추가
function addGameBtn(gameId) {
    var addTag = `
        <button class="profile-info-game-btn" id="${gameId}">
            <img src="/images/gameImg/${gameId}.png" />
            <span class="profile-info-game-delete-btn" onclick="deleteGameInfo('${gameId}')">×</span>
        </button>
    `;
    $('#profile-info-game-box').append(addTag);
}

// 사용자 정보 저장
function saveUserGameInfo(changeCheck){
    if(saveGameInfoList.length === 0){
        alert('선호하는 게임을 선택하세요.');
        return;
    }
    $.ajax({
        url: '/gameInfo/user/game',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(saveGameInfoList),
        dataType: 'json',
        async: false,
        success: function (res) {
            if(!changeCheck)
                alert('게임 정보가 성공적으로 저장되었습니다.');

            oriGameInfoList = saveGameInfoList;
            $('.profile-info-game-box .profile-info-game-btn').first().trigger('click');    // 첫번째 게임에 select 옵션 추가
        },
        error: function (xhr) {
            alert(xhr.responseJSON?.message || '서버 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    });
}