var groupDetail = {
    groupId: null,
    groupNm:null,
    init() {
        this.destroy();
        this.groupId = $('.group-detail.active').data('groupid');
        this.groupNm = $('.group-detail.active').data('groupnm');
        $('#groupDetail-info-title').text(this.groupNm);
        this.domEvt();
        connect(this.groupId);
    },

    domEvt() {
        $(document).off('click', '.group-icon').on('click', '.group-icon',
            () => this.destroy());

        // 그룹 정보 조회
        $('#group-dtl-info').on('click', async () => {

            var htmlData = await util.ajaxPromise({
                url: '/main/group/view',
                method: 'GET',
                dataType: 'html'
            });
            $('.popup-main-box').html(htmlData);

            groupView.init(this.groupId);
        });

        // 그룹 나가기
        $('#group-dtl-exit').on('click', async ()=>{

            // 나가기 질문 확인 이벤트
            var exitAlertOk = async () =>{

                await util.ajaxPromise({
                    url: `/group/${this.groupId}`,
                    method: 'DELETE',
                    dataType: 'json'
                }).then(res =>{
                    if(res != null){
                        $('.group-main').trigger('click');  // 그룹 목록 화면 전환
                        getMyGroupList(); // 내 참여 그룹 리셋
                        this.destroy();
                    }
                }).catch(xhr =>
                    util.alert('error', xhr.responseJSON.msg || '서버 오류가 발생했습니다. 다시 시도해 주세요.' ,'',undefined,undefined)
                );

            }

            await util.alert('question',
                `[${this.groupNm}] 그룹을 나가시겠습니까?`,
                '그룹장인 경우 다른 사용자에게 권한이 이전됩니다.\n또한, 그룹에 남아있는 사람이 없을 경우, 그룹은 자동으로 삭제됩니다.',
                exitAlertOk,
                undefined
            );
        });
 
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

    // 초기화 (중복 방지)
    destroy(){
        this.groupId = null;
        this.groupNm = null,
        $('#group-dtl-info').off('click');
        $('#chat-submit').off('click', sendMessage);
        $('#chat-text').off('keydown');
        window.removeEventListener('beforeunload', disconnect);
        disconnect();
    }
};
