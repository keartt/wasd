function initGroupDetail() {


}

// 그룹 정보 조회
function openGroupInfo(){

    var groupId = $('.group-detail.active').data('groupid')
    $.ajax({
        url:'/main/group/view',
        method:'GET',
        data:{
            groupId:groupId
        },
        success: function (res) {
            $('.popup-main-box').html(res);
            initGroupView();
            popupMainOpen();
        },
        error: function (xhr) {
            alert(xhr.responseText || '그룹 정보 조회 중 문제가 발생하였습니다. 잠시 후 다시 시도하세요.');
            popupMainClose();
        }
    })

}