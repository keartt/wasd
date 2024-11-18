package com.wasd.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(WasdException.class)
    public ResponseEntity<ErrorResponse> handleStudyException(WasdException ex) {
        if (ex.getErrorCode().getCode() != 500) log.error("", ex);

        log.error("[{}] :::: {}", ex.getErrorCode().getTitle(), ex.getMsg());
        return ErrorResponse.error(ex);
    }

    //@ExceptionHandler(Exception.class)
    //public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
    //    log.error("", ex);
    //    HttpStatus status;
    //
    //    return handleStudyException(new WasdException(ErrorCode.ETC, ex.getMessage()));
    //}

}
