package com.czhand.zsmq.infra.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.encoding.Md5PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.InMemoryTokenStore;

@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfiguration  extends AuthorizationServerConfigurerAdapter {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenStore tokenStore;


    @Autowired
    private UserDetailsService userDetailsService;


    @Bean
    public TokenStore tokenStore()
    {
        return new InMemoryTokenStore();
    }


    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints)
    {
        endpoints.tokenStore(tokenStore).authenticationManager(authenticationManager).userDetailsService(userDetailsService);
    }


    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) throws Exception {

//        security.tokenKeyAccess("permitAll()")
//                .checkTokenAccess("permitAll()");
//        security.passwordEncoder(new BCryptPasswordEncoder());
        security.allowFormAuthenticationForClients();
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception
    {

        clients.inMemory()
                .withClient("client")
                .secret("secret")
                .scopes("read","write")
           //     .authorities("ROLE_USER")
                .authorizedGrantTypes("password", "refresh_token","authorization_code", "implicit")
                .autoApprove(true)
                .accessTokenValiditySeconds(60*60)
                .refreshTokenValiditySeconds(60 * 60 * 24);

    }


}
