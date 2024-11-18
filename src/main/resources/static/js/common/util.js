const util ={
    ajaxPromise(param){
        if (param.contentType == 'json') {
            param.contentType = 'application/json';
            param.data = JSON.stringify(param.data);
        } else {
            param.contentType = 'application/x-www-form-urlencoded';
        }

        return new Promise((resolve, reject) => {
            $.ajax({
                url: param.url,
                type: param.method,
                data: param.data,
                contentType: param.contentType,
                dataType: param.dataType,
                beforeSend: () => {}, // 요청 전 실행
                complete: () => {}, // 요청 후 실행
                success: (data) => resolve(data),
                error: (error) => reject(error),
            });
        });
    },

    catchErr(param){
        try {
            var error = JSON.parse(param.err.responseText);
            console.error(error);
            if (error.code == '5007') { // == 404
                param.redirect = '/';
            }
        } catch (e) {
            console.error(param.err);
        } finally {
            this.alert('error', '오류 발생', param.msg + "\n 오류가 발생했습니다. \n 잠시 후 다시 시도해주세요");
            if (param.redirect) {
                window.href = param.redirect;
            }
        }
    },

    /**
     * 알림창 sweetalert2
     * parameter: (필수) icon			=> 'info', 'success', 'error', 'warning', 'question'.
     * 			  (필수) title			=> 알림 내용.
     * 			  (선택) text			=> 알림 세부 내용. (없는 경우 비우거나 undefined)
     * 			  (선택) confirmCallback	=> 확인 이후 진행할 function. (없는 경우 비우거나 undefined)
     * 			  (선택) cancelCallback	=> 취소 이후 진행할 function. (없는 경우 비우거나 undefined)
     * */
    alert: function(icon, title, text, confirmCallback, cancelCallback){
        return Swal.fire({
            icon : icon,
            title : title,
            html: text.replace(/\n/g, '<br>'),
            showConfirmButton: true,
            confirmButtonColor: "#3085D6",
            confirmButtonText: "확인",
            showCancelButton: icon == 'question',
            cancelButtonColor: "#DD3333",
            cancelButtonText: "취소",
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                container: 'custom-alert-container' // 스타일 변경하고 싶다면 새로만든 클래스 여기다 넣거나 sweetalert2.min 수정
            }
        }).then((result) => {
            if (result.isConfirmed) { //확인 시
                if(confirmCallback !== undefined) confirmCallback();
                return true;
            } else if (result.isDenied) { //취소 시
                if(confirmCallback !== undefined) cancelCallback();
                return false;
            }
        });
    },

    /**
     * 우측 상단 메시지
     * @param type info success warning error
     * @param title 제목
     * @param msg 메세지
     */
    msg : function(type, title, msg){
        toastr.options.escapeHtml = true;
        toastr.options.closeButton = true;
        toastr.options.newestOnTop = false;
        toastr.options.progressBar = true;
        toastr.options.positionClass = 'toast-top-right';
        switch(type){
            case 'info' :
                toastr.info(msg, title, {timeOut: 3000});
                break;
            case 'success' :
                toastr.success(msg, title, {timeOut: 3000});
                break;
            case 'warning' :
                toastr.warning(msg, title, {timeOut: 3000});
                break;
            case 'error' :
                toastr.error(msg, title, {timeOut: 3000});
                break;
        }
    },

}

