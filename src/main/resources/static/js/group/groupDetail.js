var groupDetail = {
    groupId: null,
    init() {
        this.destroy();
        this.groupId = $('.group-detail.active').data('groupid');
        this.domEvt();
        connect(this.groupId);
    },

    domEvt() {
        $(document).off('click', '.group-icon').on('click', '.group-icon',
            () => this.destroy());

        // 그룹 정보 조회
        $('#group-dtl-li').on('click', this.openGroupInfo);
 
        // 채팅 입력
        $('#chat-submit').on('click', sendMessage);
        $('#chat-text').on('keydown', function(event) {
            if (event.key === 'Enter') { // 엔터 키가 눌렸을 때
                event.preventDefault();  // 기본 동작인 새 줄 추가를 방지
                sendMessage();
            }
        });

        // 창닫기 - 채팅종료
        window.addEventListener('beforeunload', disconnect);

        // 다른 그룹 선택 - 채팅종료
    },

    // 그룹 정보 조회
    async openGroupInfo() {
        this.groupId = $('.group-detail.active').data('groupid');

        // HTML 가져오기
        var htmlData = await util.ajaxPromise({
            url: '/main/group/view',
            method: 'GET',
            dataType: 'html'
        });
        $('.popup-main-box').html(htmlData);

        groupView.init(this.groupId);
    },

    // 초기화 (중복 방지)
    destroy(){
        this.groupId = null;
        $('#group-dtl-li').off('click', this.openGroupInfo.bind(this));
        $('#chat-submit').off('click', sendMessage);
        $('#chat-text').off('keydown');
        window.removeEventListener('beforeunload', disconnect);
        disconnect();
    }
};
