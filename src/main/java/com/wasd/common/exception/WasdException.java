package com.wasd.common.exception;

import lombok.Getter;

@Getter
public class WasdException extends RuntimeException{
    private final ErrorCode errorCode;
    private final String msg;

    public WasdException(ErrorCode errorCode, String msg) {
        super(errorCode.name());
        this.errorCode = errorCode;
        this.msg = msg;
    }
}
