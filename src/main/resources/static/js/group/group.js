function initGroup() {

    // getGameInfoUser();
    recommendSlideEvent();
    userGameInfoSelectEvent();
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
    $('.rcm-group-item-list').slick({
        rows: 1,
        slidesToShow: 4,        // 화면에 몇개까지 보여질 것인지
        slidesToScroll: 1,      // 넘길 개수
        autoplay: true,         // 슬라이드 자동 넘기기
        autoplaySpeed: 2000,    // 자동 넘기기 시간
        arrows: false,           // 기본 화살표 비활성화
        prevArrow: $('#prev'), //이전 화살표만 변경
        nextArrow: $('#next'), //다음 화살표만 변경
        initialSlide: 0,
        draggable: false,
    });

    // 커스텀 버튼 이벤트 추가
    $('#prev').on('click', function() {
        $('.rcm-group-item-list').slick('slickPrev');
    });

    $('#next').on('click', function() {
        $('.rcm-group-item-list').slick('slickNext');
    });

}


function userGameInfoSelectEvent(){
    $('#userGameInfoSelect .selected-item').click(function () {
        $('#userGameInfoSelect').toggleClass('open');
    });

    $('#userGameInfoSelect .dropdown div').click(function () {
        var selectedValue = $(this).data('value');
        var selectedText = $(this).text();
        $('#selectedItem').html('<img src="/images/gameImg/' + selectedValue + '.png" />' + selectedText);
        $('#userGameInfoSelect').removeClass('open');
    });

    // 외부 클릭 시 dropdown 닫기
    $(document).click(function (event) {
        if (!$(event.target).closest('#userGameInfoSelect').length) {
            $('#userGameInfoSelect').removeClass('open');
        }
    });
}