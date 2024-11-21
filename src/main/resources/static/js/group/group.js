


function initGroup() {
    getGameInfoUser();          // 게임 목록
    // recommendSlideEvent();      // 추천 그룹 이벤트
    userGameInfoSelectEvent();  // select
}

// 사용자 관심 게임 조회
function getGameInfoUser() {
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
                $('#userGameInfoSelect #selectedItem').html('<img src="/images/gameImg/' + firstItem.gameId + '.png" /><span data-game="' + firstItem.gameId + '">' + firstItem.gameNm + '</span>');

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
            util.alert('error', xhr.responseJSON.msg || '서버 오류가 발생했습니다. 다시 시도해 주세요.' ,'',undefined,undefined);
        }, complete() {
            getAllGroupList();      // 모든 그룹
            getRcmGroupList();    // 추천 그룹 목록 조회
        }
    });
}

// 추천 그룹
// function recommendSlideEvent() {
//     $('.rcm-group-item-list').slick({
//         rows: 1,
//         slidesToShow: 4,        // 화면에 몇개까지 보여질 것인지
//         slidesToScroll: 1,      // 넘길 개수
//         autoplay: true,         // 슬라이드 자동 넘기기
//         autoplaySpeed: 2000,    // 자동 넘기기 시간
//         arrows: false,           // 기본 화살표 비활성화
//         prevArrow: $('#prev'), //이전 화살표만 변경
//         nextArrow: $('#next'), //다음 화살표만 변경
//         initialSlide: 0,
//         draggable: false,
//     });
//
//     // 커스텀 버튼 이벤트 추가
//     $('#prev').on('click', function () {
//         $('.rcm-group-item-list').slick('slickPrev');
//     });
//
//     $('#next').on('click', function () {
//         $('.rcm-group-item-list').slick('slickNext');
//     });
//
// }

// select 이벤트
function userGameInfoSelectEvent() {

    $('#userGameInfoSelect #selectedItem').click(function () {
        $('#userGameInfoSelect').toggleClass('open');
    });

    $('#userGameInfoSelect .dropdown div').click(function () {

        var currentValue = $('#userGameInfoSelect #selectedItem span').data('game');
        var selectedValue = $(this).data('value');
        var selectedText = $(this).text();

        if(currentValue != selectedValue){
            $('#userGameInfoSelect #selectedItem').html('<img src="/images/gameImg/' + selectedValue + '.png" /><span data-game="' + selectedValue + '">' + selectedText + '</span>');
            getAllGroupList(); // 그룹 목록 조회
            getRcmGroupList();    // 추천 그룹 목록 조회
        }
        $('#userGameInfoSelect').removeClass('open');
    });

    $('.group-box').click(function (event) {
        if (!$(event.target).closest('#userGameInfoSelect').length) {
            $('#userGameInfoSelect').removeClass('open');
        }
    });

}

// 그룹 생성 버튼
function groupNew() {

    $.ajax({
        url: '/main/group/new',
        method: 'GET',
        success: function (res) {
            $('.popup-main-box').html(res);
            initGroupNew();
        }, complete() {
            popupMainOpen();
        }
    });
}

// 그룹 목록 조회
function getAllGroupList() {

    var gameId = $('#userGameInfoSelect #selectedItem span').data('game');

    $('.all-group-content-box').empty();

    $.ajax({
        url: '/group/game/' + gameId,
        method: 'GET',
        dataType: 'json',
        async: false,
        success: function (res) {

            var addTag = '';

            if(res.length > 0){

                addTag += '<div class="all-group-content">';
                res.forEach(function (item) {
                    addTag += `
                        <div class="all-group-item-box">
                            <div class="all-group-item-img">
                                <img src="${item.groupImg || '/images/gameImg/'+gameId+'.png'}">
                            </div>
                            <div class="all-group-item-dc-box">
                                <div class="dc-title-box">
                                    <span>［</span>
                                    <div class="dc-title">${item.groupNm}</div>
                                    <span>］</span>
                                </div>
                                <div class="dc-content">
                                    <pre>${item.groupDc}</pre>
                                </div>
                                <div class="dc-limit">
                                    <div class="dc-limit-info">
                                        <div>
                                            <i class="fa-solid fa-user"></i>
                                            <span>${item.userCount} / ${item.maxUserCount}</span>
                                        </div>
                                        <div>
                                            <i class="fa-regular fa-clock"></i>
                                            <span>${item.startTime ? item.startTime.slice(0, 5) : ''} ${item.startTime || item.endTime ? '~' : 'ALL TIME'} ${item.endTime ? item.endTime.slice(0, 5) : ''}</span>
                                        </div>
                                    </div>
                                    <div class="dc-limit-btn-box">
                                        <span title="그룹 정보"><button class="dc-limit-info-btn bt" onclick="infoGroup(${item.groupId})"><i class="fa-solid fa-info"></i></button></span>
                                        <span title="그룹 참여"><button class="dc-limit-join-btn bt" onclick="joinGroup(${item.groupId}, '${item.groupNm}')"><i class="fa-solid fa-arrow-right-to-bracket"></i></button></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });
                addTag += '</div>';

            }else{
                addTag += `
                    <div style="text-align: center">
                        현재 참여 가능한 그룹이 없습니다. <br>새 그룹을 등록해보세요:)
                    </div>
                `;
            }
            $('.all-group-content-box').append(addTag);
        }
    });
}

// 추천 게임 목록
function getRcmGroupList(){

    // 슬라이더 초기화가 되었으면 unslick 호출
    if ($('.rcm-group-item-list').hasClass('slick-initialized')) {
        $('.rcm-group-item-list').slick('unslick');
    }
    $('.rcm-group-item-list').empty();

    var gameId = $('#userGameInfoSelect #selectedItem span').data('game');

    $.ajax({
        url: '/group/game/' + gameId + '/recommend',
        method: 'GET',
        dataType: 'json',
        async: false,
        success: function (res) {

            if(res.length == 0){
                $('.rcm-group-box').css('display', 'none');
            }

            var addRcmTag = '';
            res.forEach(function (item) {
                addRcmTag += `
                    <div class="rcm-group-item-box">

                        <div class="rcm-group-item-img">
                            <img src="${item.groupImg || '/images/gameImg/'+this.gameId+'.png'}">
                        </div>
                        <div class="rcm-group-item-dc-box">
                            <div class="dc-title-box">
                                <span>［</span>
                                <div class="dc-title">${item.groupNm}</div>
                                <span>］</span>
                            </div>
                            <div class="dc-content">
                                <pre>${item.groupDc}</pre>
                            </div>
                            <div class="dc-limit">
                                <div class="dc-limit-info">
                                    <div>
                                        <i class="fa-solid fa-user"></i>
                                        <span>${item.userCount} / ${item.maxUserCount}</span>
                                    </div>
                                    <div>
                                        <i class="fa-regular fa-clock"></i>
                                        <span>${item.startTime ? item.startTime.slice(0, 5) : ''} ${item.startTime || item.endTime ? '~' : 'ALL TIME'} ${item.endTime ? item.endTime.slice(0, 5) : ''}</span>
                                    </div>
                                </div>
                                <div class="dc-limit-btn-box">
                                    <span title="그룹 정보"><button class="dc-limit-info-btn bt" onclick="infoGroup(${item.groupId})"><i class="fa-solid fa-info"></i></button></span>
                                    <span title="그룹 참여"><button class="dc-limit-join-btn bt" onclick="joinGroup(${item.groupId}, '${item.groupNm}')"><i class="fa-solid fa-arrow-right-to-bracket"></i></button></span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            $('.rcm-group-item-list').append(addRcmTag);

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
            $('#prev').off('click').on('click', function () {
                $('.rcm-group-item-list').slick('slickPrev');
            });

            $('#next').off('click').on('click', function () {
                $('.rcm-group-item-list').slick('slickNext');
            });

        }
    });
}


// 그룹 참여
function joinGroup(groupId, groupNm){

    // 참여 질문 확인 이벤트
    var joinAlertOk = async () =>{

        await util.ajaxPromise({
            url: '/group/join',
            method: 'POST',
            contentType :'json',
            data:{
                groupId:groupId
            },
            dataType: 'json'
        }).then(res =>{
            getMyGroupList();   // 내 그룹 새로고침
            // 생성한 방으로 화면 전환
            $("[data-groupid='"+ groupId+"']").trigger("click");
        }).catch(xhr =>
            util.alert('error', xhr.responseJSON.msg || '서버 오류가 발생했습니다. 다시 시도해 주세요.' ,'',undefined,undefined)
        );

    }

    util.alert('question',
        `[ ${groupNm} ] 그룹에 참여하시겠습니까?`,
        '',
        joinAlertOk,
        undefined
    );
}

// 그룹 정보 조회
function infoGroup(groupId){
    // HTML 가져오기
    util.ajaxPromise({
        url: '/main/group/view',
        method: 'GET',
        dataType: 'html'
    }).then(res => {
        $('.popup-main-box').html(res);
        groupView.init(groupId);
    }).catch(e => util.catchErr({err: e, msg: '그룹 정보 조회 중', redirect: '/'}));
}

