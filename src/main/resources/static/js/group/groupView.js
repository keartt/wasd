var groupView = {

    groupId: null,
    init(groupId){
        this.destroy();

        this.groupId = groupId; // ID 설정
        this.setGroupInfo();    // 그룹정보 설정

        this.domEvt();          // 이벤트
    },
    domEvt(){
        $('.popup-main-close-btn').on('click', () => {  // 팝업 창 닫으면 내용 초기화
            this.destroy();
        });
    },
    async setGroupInfo() {

        try {
            // 그룹 정보 JSON 조회
            var groupData = await util.ajaxPromise({
                url: `/group/${this.groupId}`,
                method: 'GET',
                dataType: 'json'
            });

            // 그룹 정보로 HTML 요소 업데이트
            $('.groupView-title-box img').attr('src', groupData.groupImg);
            $('.groupView-title-box h1').text(groupData.groupNm);
            $('.groupView-info-limit-box .groupView-title').eq(0).find('span').text(`최대 ${groupData.maxUserCount}명`);
            $('.groupView-info-limit-box .groupView-title').eq(1).find('span').eq(0).text(groupData.startTime ? groupData.startTime.substring(0, 5) : '');
            $('.groupView-info-limit-box .groupView-title').eq(1).find('span').eq(1).text(groupData.startTime || groupData.endTime ? '~' : 'ALL TIME');
            $('.groupView-info-limit-box .groupView-title').eq(1).find('span').eq(2).text(groupData.endTime ? groupData.endTime.substring(0, 5) : '');
            $('.groupView-info-dc-box pre').text(groupData.groupDc);
            $('.groupView-gameNm img').attr('src', `/images/gameImg/${groupData.gameInfo.gameId}.png`);
            $('.groupView-gameNm span').text(groupData.gameInfo.gameNm);

            // 게임 정보 JSON 조회
            var gameInfoData = await util.ajaxPromise({
                url: `/gameInfo/${groupData.gameInfo.gameId}`,
                method: 'GET',
                dataType: 'json'
            });

            // 그룹 정보의 value 값 한글명으로 변환
            $('#groupView-gameInfo').empty();
            var addTag='';
            for (const gameAttr in gameInfoData.info) {
                var selectedValue = groupData.gameInfo.info[gameAttr] || '';            // 그룹장이 선택한 값
                var selectedText = gameInfoData.info[gameAttr][selectedValue] || '';    // 선택한 값의 이름
                addTag += `
                    <div class="groupView-gameInfo-col-item">
                        <label>${gameInfoData.info[gameAttr].infoNm}</label>
                        <input type="text" value="${selectedText}" disabled>
                    </div>
                `;
            }
            $('#groupView-gameInfo').append(addTag);

            popupMainOpen(); // 팝업 OPEN

        } catch (error) {
            util.alert('error', '그룹 정보 조회 중 문제가 발생하였습니다. 잠시 후 다시 시도하세요.', '',undefined,undefined);

            popupMainClose();
            this.destroy();
        }
    },
    destroy(){
        this.groupId = null;
        $('.popup-main-close-btn').off('click');
    }
}