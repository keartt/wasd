package com.wasd.common.exception;

import lombok.Getter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class ErrorResponse {
    private final int code;
    private final String title;
    private final String msg;
    private final HttpStatus status;

    public ErrorResponse(ErrorCode errorCode, String msg) {
        this.code = errorCode.getCode();
        this.title = errorCode.getTitle();
        this.msg = msg;
        this.status = errorCode.getStatus();
    }

    // 실제로 리턴하는 에러 처리 부분
    public static ResponseEntity<ErrorResponse> error(WasdException e) {
        HttpHeaders headers = new HttpHeaders();
        // json 형식으로 리턴
        headers.add(HttpHeaders.CONTENT_TYPE, "application/json; charset=UTF-8");

        return ResponseEntity
                .status(e.getErrorCode().getStatus())
                .headers(headers)
                .body(new ErrorResponse(e.getErrorCode(), e.getMsg()));
    }
}
