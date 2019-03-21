package com.czhand.zsmq.api.handler;

import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;


/**
 * 全局错误处理  待完善
 *
 */
@ControllerAdvice
public class WebExceptionHandler {

    private final static Logger logger = LoggerFactory.getLogger(WebExceptionHandler.class);

    @ResponseBody
    @ExceptionHandler(Throwable.class)
    public ResponseEntity<Data<String>> handleException(Throwable e){

        if(e instanceof AuthenticationException){
            return ResponseUtils.res("error",e.getMessage(),HttpStatus.UNAUTHORIZED);
        }

        return ResponseUtils.res("error",e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
    }


}
