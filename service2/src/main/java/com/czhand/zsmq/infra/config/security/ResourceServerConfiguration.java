package com.czhand.zsmq.infra.config.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;

import javax.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@EnableResourceServer
public class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {


    @Override
    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {



    }

    @Override
    public void configure(HttpSecurity http) throws Exception {

        http
                // we don't need CSRF because our token is invulnerable
                .csrf().disable()

                .exceptionHandling()
                .authenticationEntryPoint((request, response, accessDeniedException) -> {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                }).and()
                // don't create session
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()

                .authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS).permitAll()

                .antMatchers("/swagger-ui.html","/webjars/**","/v2/**","/swagger-resources/**").permitAll()
                .antMatchers("/oauth/**").permitAll()
                .antMatchers("/user/register").permitAll()
                .antMatchers("/v1/wyw/**").permitAll()
                .anyRequest().authenticated()
                .and().httpBasic();
//                .and().formLogin();
             //  .antMatchers("/**").access("#oauth2.hasScope('read')");

    }




}
