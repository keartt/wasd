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

}

