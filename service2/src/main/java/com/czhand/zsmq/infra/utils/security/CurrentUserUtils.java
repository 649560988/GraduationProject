package com.czhand.zsmq.infra.utils.security;

import com.czhand.zsmq.domain.core.CurrentUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Collection;


@Component
public class CurrentUserUtils {


    private static TokenStore tokenStore;

    @Autowired
    public CurrentUserUtils(TokenStore tokenStore){
        CurrentUserUtils.tokenStore = tokenStore;
    }




    /**
     *
     * 获取当前登陆人信息
     *
     * @return
     */
    public static CurrentUser get(){
        return  (CurrentUser)SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    }

    /**
     *
     * 清除当前登陆人信息
     *
     */
    public static void clear(Principal principal){

       tokenStore.findTokensByClientIdAndUserName(getClientId(principal),get().getUserName()).forEach((token)->{
           tokenStore.removeAccessToken(token);
       });

    }


    private static String getClientId(Principal principal) {
        Authentication client = (Authentication) principal;
        if (!client.isAuthenticated()) {
            throw new InsufficientAuthenticationException("The client is not authenticated.");
        }
        String clientId = client.getName();
        if (client instanceof OAuth2Authentication) {
            // Might be a client and user combined authentication
            clientId = ((OAuth2Authentication) client).getOAuth2Request().getClientId();
        }
        return clientId;
    }





}
