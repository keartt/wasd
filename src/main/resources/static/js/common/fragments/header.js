$(document).ready(function() {
    
    // loadContentMain();
    $(document).on('click', '.group', function() {
        if($(this).hasClass('active')){ return; }

        $('.group').removeClass('active');
        $(this).addClass('active');
        loadContentMain();
    });

    // $('#main-profile').trigger('click');    // 처음 active 추가
    $('.group-main').trigger('click');    // 처음 active 추가
});

// 선택 페이지 로드
function loadContentMain(){

    var url = $('.group.active').attr('attr-url');

    if(url === '/logout'){
        window.location.href = url;
    } else{
        $.ajax({
            url: url,
            method: 'GET',
            success: function(response) {
                $('.content-main').html(response);

                if (url === '/main/profile') {
                    initProfileSetting();  // 프로필 관련 초기화
                } else if (url === '/main/group') {
                    initGroup();    // 그룹 관련 초기화
                } else if (url.startsWith('/main/group/')) {
                    initGroupDetail();  // 그룹 상세 관련 초기화
                }
            }
        });
    }
}