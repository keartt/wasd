$(document).ready(function() {

    loadContentMain();
    $(document).on('click', '.group', function() {
        if($(this).hasClass('active')){ return; }

        $('.group').removeClass('active');
        $(this).addClass('active');
        loadContentMain();
    });
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
            }
        });
    }
}