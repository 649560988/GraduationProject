package com.czhand.zsmq.infra.aop;

import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Map;

@Aspect
@Component
public class ResponseAcpect {

    private final static Logger logger = LoggerFactory.getLogger(ResponseAcpect.class);


    /**
     *
     * 处理 /oauth/token 接口返回值  加上参数 type 就返回包装类型
     *
     * @param proceedingJoinPoint
     * @return
     * @throws Throwable
     */
    @Around("execution(* org.springframework.security.oauth2.provider.endpoint.TokenEndpoint.postAccessToken(..))")
    public Object doAroundAdvice(ProceedingJoinPoint proceedingJoinPoint) throws  Throwable{

        Object[] args =  proceedingJoinPoint.getArgs();
        Map<String, String> parameters = null;
        if(args.length==2 && (args[1] instanceof Map)){
            parameters = (Map<String, String>)args[1];
            String type = parameters.get("type");
            if(!StringUtils.isEmpty(type)){
                ResponseEntity<OAuth2AccessToken> result =  (ResponseEntity<OAuth2AccessToken>)proceedingJoinPoint.proceed(args);
                return ResponseUtils.res(result.getBody());
            }
        }
        return proceedingJoinPoint.proceed(proceedingJoinPoint.getArgs());
    }









}
