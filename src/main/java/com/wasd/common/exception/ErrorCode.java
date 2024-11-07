package com.wasd.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    ETC(500, "기타 오류", HttpStatus.INTERNAL_SERVER_ERROR),

    DB(5003, "DB 처리 오류", HttpStatus.INTERNAL_SERVER_ERROR),
    FILE(5004, "파일처리오류", HttpStatus.INTERNAL_SERVER_ERROR),
    AUTH(5005, "유저 권한 없음 오류", HttpStatus.FORBIDDEN),
    BAD_REQ(5006, "잘못된 요청 데이터", HttpStatus.BAD_REQUEST),
    NO_DATA(5007, "해당 데이터 없음", HttpStatus.NOT_FOUND)
    ;

    private final int code;
    private final String title;
    private final HttpStatus status;

    ErrorCode(int code, String title, HttpStatus status) {
        this.code = code;
        this.title = title;
        this.status = status;
    }
}
