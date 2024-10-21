var userInfo = {};

$(function () {

    // 성격 유형 option 추가
    $.ajax({
        url: '/user/mbti',
        type: 'get',
        async : false,
        success: function (res) {
            res.forEach(function (mbti) {
                $('#mbti').append(`<option value="${mbti}">${mbti}</option>`);
            });
        }
    });

    // 사용자 정보 조회
    $.ajax({
        url:`/user/${oauthUserInfo.id}`,
        type: 'get',
        async : false,
        success: function (res) {
            userInfo = res;
            setUserInfoField(userInfo);
        }
    })

    // 파일 업로드 클릭 이벤트
    $('#profileImgUploadBtn').on('click', function () {
        $('#profileImgFile').click();
    });

    // 파일이 선택되면 Base64로 변환하여 미리보기
    $('#profileImgFile').on('change', function (event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var base64Image = e.target.result;

                // 미리보기 이미지 src에 Base64 데이터 삽입
                $('#profileImg').attr('src', base64Image);
                $('#profileImg').show();

            }
            reader.readAsDataURL(file);
        }
    });


});


// STEP 변경 이벤트
function changeStep(stepVal) {

    // 사용자 정보 유효성검사
    if (stepVal === 2) {
        const fields = [
            {
                id: 'email',
                name: '이메일',
                pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: '유효한 이메일 주소 형식이 아닙니다. 예시: test@test.com'
            },
            {
                id: 'nickname',
                name: '닉네임',
                pattern: /^.{1,20}$/, // 닉네임의 길이를 1~20자로 제한
                message: '닉네임은 1자 이상 20자 이하로 입력해야 합니다.'
            },
            {
                id: 'yearOfBirth',
                name: '생년월일',
                pattern: null, // 1900~2099 사이의 년도만 허용
                message: null
            }
        ];
        if (!validation(fields)) { return; }

        // 값 변경 확인
        var userInfoData = {};
        var userInfoChangeCount = 0;
        for (const [id, value] of Object.entries(userInfo)) {
            const $field = $(`#${id}`);
            if (!$field.length) continue;

            // 필드의 값 확인 (이미지이면 src, 아니면 value)
            const fieldVal = $field.is('img') ? $field.attr('src') : $field.val();
            userInfoData[id] = value;   // 기존값 추가

            if (fieldVal != (value ?? '')) {
                userInfoData[id] = fieldVal?fieldVal:null;    // 변경 값 추가
                userInfoChangeCount++;
            }
        }

        if(userInfoChangeCount > 0  && confirm('변경된 프로필 정보를 적용하시겠습니까?')){  // 사용자 정보 수정

            $.ajax({
                url: '/user/',
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(userInfoData),
                dataType: 'json',
                async: false,
                success: function (res) {
                    userInfo = res;
                    setUserInfoField(userInfo);
                },
                error: function (xhr) {
                    alert(xhr.responseJSON?.message || '서버 오류가 발생했습니다. 다시 시도해 주세요.');
                    setUserInfoField(userInfo); // 수정 취소 -> 기존 값으로 리셋
                }
            });
        } else{
            setUserInfoField(userInfo); // 수정 취소 -> 기존 값으로 리셋
        }
    }

    $('.profile-info-box').css('display', 'none');  // info-box 제거
    $('#profile-info-box-step' + stepVal).css('display', 'flex');

    // step 버튼
    $('.profile-step-btn').removeClass('active');   // active 제거
    $('#profile-step-btn-' + stepVal).addClass('active');

}

// 사용자 INPUT 필드 채우기
function setUserInfoField(paramUserInfo){
    for (const [id, value] of Object.entries(paramUserInfo)) {
        setFieldValue(id, value);
    }

    setTimeout(() => {
        $('.new-select-style').trigger('change');
    }, 1);
}