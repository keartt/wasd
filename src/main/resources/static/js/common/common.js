$(function () {
    
    // select 스타일 적용
    $(document).on('change', '.new-select-style', function () {
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
            const value = $('#' + id).val();

            if (!value) {
                alert(name + '은(는) 필수 입력 항목입니다.');
                $('#' + id).focus();
                return false;
            }

            if (pattern != null && !pattern.test(value)) {
                alert(message);
                $('#' + id).focus();
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
        $field.attr('src', value);
    } else{
        $field.val(value);
    }
}