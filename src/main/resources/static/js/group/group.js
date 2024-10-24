function initGroup() {

    // getGameInfoUser();
    recommendSlideEvent();
}

// 사용자 관심 게임 조회
function getGameInfoUser(){
    $.ajax({
        url: '/gameInfo/user',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (res) {
            console.log(res);
            res.forEach(function (item, index) {

            });
        },
        error: function (xhr) {
            alert(xhr.responseJSON?.message || '서버 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    });
}


function recommendSlideEvent(){
    $('.rcm-group-content').slick({
        slidesToShow: 5,        // 화면에 몇개까지 보여질 것인지
        slidesToScroll: 1,      // 넘길 개수
        autoplay: true,         // 슬라이드 자동 넘기기
        autoplaySpeed: 2000,    // 자동 넘기기 시간
        draggable: true,        // 드래그
    });
}