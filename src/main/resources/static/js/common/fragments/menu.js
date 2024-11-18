$(document).ready(function() {
    
    $(document).off('click', '.group').on('click', '.group', function() {
        if($(this).hasClass('active')){ return; }

        $('.group').removeClass('active');
        $(this).addClass('active');
        getContentMain();
    });

    $('.group-main').trigger('click');    // 처음 active 추가

    getMyGroupList();       // 내 그룹 불러오기
});

// 선택 페이지 불러오기
function getContentMain(){

    var url = $('.group.active').data('url');

    if(url === '/logout'){
        window.location.href = url;
    } else{
        $.ajax({
            url: url,
            method: 'GET',
            success: function(res) {
                $('.content-main').html(res);
                if (url === '/main/profile') {
                    initProfileSetting();  // 프로필 관련 초기화
                } else if (url === '/main/group') {
                    initGroup();    // 그룹 관련 초기화
                } else if (url.startsWith('/main/group/')) {
                    groupDetail.init();
                    // initGroupDetail();  // 그룹 상세 관련 초기화
                }
            }
        });
    }
}



// 내 그룹 불러오기
function getMyGroupList(){

    $('#myGroups').empty(); // 초기화

    $.ajax({
        url:'/group/user',
        method: 'GET',
        async: false,
        dataType: 'json',
        success: function(res) {

            $('#main-group').attr("data-groups", (res.length || 0) + ' GROUP');  // 참여 그룹 수

            var addTag = '';
            res.forEach(function (item) {
                addTag += `
                        <div class="groups-collection">
                            <div class="unread group group-detail" role="button" data-url="/main/group/${item.groupId}" data-groupid="${item.groupId}" data-groupnm="${item.groupNm}">
                                <div class="group-icon"><img src="${item.groupImg}" /></div>
                            </div>
                        </div>
                    `;
            });
            $('#myGroups').append(addTag);

        }
    })
}