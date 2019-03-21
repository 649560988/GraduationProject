package com.czhand.zsmq.api.controller.v1.validator;


import com.czhand.zsmq.domain.SysUser;
import com.czhand.zsmq.infra.mapper.SysUserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserValidator {
    @Autowired
	SysUserMapper userMapper;
    public Boolean isUserLegal(SysUser user){
        return !user.getUserName().equals("")&&!user.getPassword().equals("");
    }
    public Boolean isUserExits(SysUser user){
        List<SysUser> users = userMapper.isUserExit(user.getUserName());

        return users!=null&&users.size()>0;
    }

}
