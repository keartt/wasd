function initGroup() {
    getGameInfoUser();
    recommendSlideEvent();
    userGameInfoSelectEvent();  // select
}

// 사용자 관심 게임 조회
function getGameInfoUser(){
    $('#userGameInfoSelect .dropdown').empty();
    $.ajax({
        url: '/gameInfo/user',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (res) {
            if (res.length > 0) {
                // 첫 번째 데이터를 기본 선택값으로 설정
                var firstItem = res[0];
                $('#userGameInfoSelect #selectedItem').html('<img src="/images/gameImg/' + firstItem.gameId + '.png" /><span>' + firstItem.gameNm + '</span>');

                // 드롭다운 목록에 항목 추가
                var addTag = "";
                res.forEach(function (item) {
                    addTag += `
                    <div data-value="${item.gameId}"><img src="/images/gameImg/${item.gameId}.png"/><span>${item.gameNm}</span></div>
                    `;
                });
                $('#userGameInfoSelect .dropdown').append(addTag);
            } else {
                $('#userGameInfoSelect #selectedItem').text('게임 선택');
            }
        },
        error: function (xhr) {
            alert(xhr.responseJSON?.message || '서버 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    });
}

// 추천 그룹
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

// select 이벤트
function userGameInfoSelectEvent(){

    $('#userGameInfoSelect #selectedItem').click(function () {
        $('#userGameInfoSelect').toggleClass('open');
    });

    $('#userGameInfoSelect .dropdown div').click(function () {
        var selectedValue = $(this).data('value');
        var selectedText = $(this).text();
        $('#userGameInfoSelect #selectedItem').html('<img src="/images/gameImg/' + selectedValue + '.png" />' + selectedText);
        $('#userGameInfoSelect').removeClass('open');
    });

    $('.group-box').click(function (event) {
        if (!$(event.target).closest('#userGameInfoSelect').length) {
            $('#userGameInfoSelect').removeClass('open');
        }
    });

}

// 그룹 생성 버튼
function groupNew(){

    $.ajax({
        url: '/main/group/new',
        method: 'GET',
        success: function(response) {
            $('.popup-main-box').html(response);
            initGroupNew();
        },complete() {
            popupMainOpen();
        }
    });
}
