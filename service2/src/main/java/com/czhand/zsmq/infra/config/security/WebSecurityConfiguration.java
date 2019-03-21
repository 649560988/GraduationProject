package com.czhand.zsmq.infra.config.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
public class WebSecurityConfiguration extends GlobalAuthenticationConfigurerAdapter {


    private final static Logger logger = LoggerFactory.getLogger(WebSecurityConfiguration.class);

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public void init(AuthenticationManagerBuilder auth) throws Exception {
        //TODO:use md5
        auth.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder);
    }





}
