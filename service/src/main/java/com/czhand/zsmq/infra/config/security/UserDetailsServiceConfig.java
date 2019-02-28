package com.czhand.zsmq.infra.config.security;

import com.czhand.zsmq.domain.SysUser;
import com.czhand.zsmq.domain.core.CurrentUser;
import com.czhand.zsmq.infra.mapper.SysRoleMapper;
import com.czhand.zsmq.infra.mapper.SysUserMapper;
import com.czhand.zsmq.infra.mapper.SysUserRoleMapper;
import com.google.common.collect.Lists;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;



/**
 *
 * 目前还不完善 没有加上权限的控制  本次业务逻辑不需要进行后端权限控制
 */
@Component
public class UserDetailsServiceConfig implements UserDetailsService {


    @Autowired
    private SysUserMapper sysUserMapper;

    @Autowired
    private SysUserRoleMapper sysUserRoleMapper;

    @Autowired
    private SysRoleMapper sysRoleMapper;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        SysUser sysUserQuery = new SysUser();
        sysUserQuery.setUserName(username);
        SysUser sysUser =  sysUserMapper.selectOne(sysUserQuery);

        if (sysUser == null)
        {
            throw new UsernameNotFoundException("Account Not Exist");
        }

        return CurrentUser.newInstance(sysUser,Lists.newArrayList());
    }
}
