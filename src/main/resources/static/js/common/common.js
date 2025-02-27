$(function () {
    
    // select 스타일 적용
    $(document).off('change', '.new-select-style').on('change', '.new-select-style', function () {
        if ($(this).val() == '') {
            $(this).css('color', 'rgba(211, 211, 211, 0.5)');
        } else {
            $(this).css('color', 'lightgrey');
        }
    });

    $('.new-select-style').trigger('change');
});

// 유효성 검사
function validation(fields) {
    if (fields == null) {
        return false;
    } else {
        for (const field of fields) {
            const {id, name, pattern, message} = field;
            const value = $('#' + id).val().trim();

            if (!value) {
                util.alert('info', name + '은(는) 필수 입력 항목입니다.', '', async () => $('#' + id).focus(),undefined);
                return false;
            }

            if (pattern != null && !pattern.test(value)) {
                util.alert('info', message, '', async () =>$('#' + id).focus(),undefined);
                return false;
            }
        }
        return true;
    }
}

// input, select 값 채우기
function setFieldValue(id, value){
    const $field = $(`#${id}`);
    if(!$field.length){
        return;
    }

    if($field.prop('tagName').toLowerCase() === 'img' ){
        $field.attr('src', value?value:'http://img1.kakaocdn.net/thumb/R640x640.q70/?fname=http://t1.kakaocdn.net/account_images/default_profile.jpeg');
    } else{
        $field.val(value);
    }
}

// 팝업창 열기
function popupMainOpen(){
    $('.popup-main').addClass('active');

    setTimeout(function () {
        $('.popup-main-box').scrollTop(0);
    }, 50);

}
// 팝업창 닫기
function popupMainClose(){
    $('.popup-main-box').empty();
    $('.popup-main').removeClass('active');
}