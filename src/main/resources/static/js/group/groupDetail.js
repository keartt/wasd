var groupDetail = {
    groupId: null,
    init() {
        this.groupId = $('.group-detail.active').data('groupid');
        this.domEvt();
    },

    domEvt() {
        $('#group-dtl-li').on('click', () => this.openGroupInfo());

    },

    // 그룹 정보 조회
    async openGroupInfo() {
        try {
            await Promise.all([
                // html
                util.ajaxPromise({ url: '/main/group/view', method: 'GET', dataType: 'html' })
                    .then(res => {
                        // initGroupView();
                        popupMainOpen();
                        $('.popup-main-box').html(res);
                    }),
                // json
                util.ajaxPromise({ url: `/group/${this.groupId}`, method: 'GET', dataType: 'json' })
                    .then(data => {
                        console.log(data);
                        // 그룹 정보로 HTML 요소 업데이트
                        $('.groupView-title-box img').attr('src', data.groupImg); // 이미지 업데이트
                        $('.groupView-title-box h1').text(data.groupNm); // 그룹 이름 업데이트
                        $('.groupView-info-limit-box .groupView-title').eq(0).find('span').text(`최대 ${data.maxUserCount}명`); // 최대 인원수
                        $('.groupView-info-limit-box .groupView-title').eq(1).find('span').eq(0).text(data.startTime ? data.startTime.substring(0, 5) : ''); // 시작 시간
                        $('.groupView-info-limit-box .groupView-title').eq(1).find('span').eq(1).text(data.startTime || data.endTime ? '~' : 'ALL TIME'); // 시간 표시
                        $('.groupView-info-limit-box .groupView-title').eq(1).find('span').eq(2).text(data.endTime ? data.endTime.substring(0, 5) : ''); // 종료 시간
                        $('.groupView-info-dc-box pre').text(data.groupDc); // 그룹 설명 업데이트
                        $('.groupView-gameNm img').attr('src', `/images/gameImg/${data.gameInfo.gameId}.png`); // 게임 이미지 업데이트
                        $('.groupView-gameNm span').text(data.gameInfo.gameNm); // 게임 이름 업데이트
                    })
            ]);
        } catch (error) {
            console.error(error)
            alert('그룹 정보 조회 중 문제가 발생하였습니다. 잠시 후 다시 시도하세요.');
            popupMainClose();
        }

        popupMainOpen();

    }
};

function initGroupDetail() {
    groupDetail.init();
}
