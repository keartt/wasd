// let gameInfoCount = 0;
var gameInfoList = [];
let saveGameInfoList = [];
$(function () {

    // 프로필 기본 정보 설정
    $('#email').val(oauthUserInfo.email);
    $('#nickname').val(oauthUserInfo.nickname);
    $('#profileImg').attr('src', (oauthUserInfo.profileImg?oauthUserInfo.profileImg:'http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg' ));

    initJoinCommon();

});

// STEP 변경 이벤트
function changeStep(stepVal) {

    // 사용자 정보 유효성검사
    if (stepVal === 2) {
        if (!validation(userJoinfields)) { return; }
    }

    $('.profile-info-box').css('display', 'none');  // info-box 제거
    $('#profile-info-box-step' + stepVal).css('display', 'flex');

    // step 버튼
    $('.profile-step-btn').removeClass('active');   // active 제거
    $('#profile-step-btn-' + stepVal).addClass('active');

    if (stepVal === 2 && $('.profile-info-game-box .profile-info-game-btn').length === 0) {
        openGameInfoPopup();
    }
}

// 회원가입
function userInfoSave(){

    if(saveGameInfoList.length === 0){
        alert('선호하는 게임을 선택하세요.');
        return;
    }

    // 사용자 정보
    var userInfoData = {
        nickname: $('#nickname').val(),
        yearOfBirth: parseInt($('#yearOfBirth').val(), 10),

        mbti: $('#mbti').val() === '' ? null : $('#mbti').val(),
        startTime: $('#startTime').val() === '' ? null : $('#startTime').val(),
        endTime: $('#endTime').val() === '' ? null : $('#endTime').val(),
        profileImg : $('#profileImg').attr('src'),
        gameInfoList : saveGameInfoList
    };


    $.ajax({
        url: '/user/',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(userInfoData),
        dataType: 'json',
        async: false,
        success: function (res) {
            window.location.href = '/main';
        },
        error: function (xhr) {
            const errorMessage = xhr.responseJSON?.message || '서버 오류가 발생했습니다. 다시 시도해 주세요.';
            alert(errorMessage);
        }
    });
}
