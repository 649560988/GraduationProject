package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.SysUserDTO;
import com.czhand.zsmq.app.service.UserEntService;
import com.czhand.zsmq.domain.SysUser;
import com.czhand.zsmq.domain.UserEnt;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.SysUserMapper;
import com.czhand.zsmq.infra.mapper.UserEntMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
public class UserEntServiceImpl implements UserEntService {


    @Autowired
    private UserEntMapper userEntMapper;

    @Autowired
    private SysUserMapper sysUserMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Transactional(rollbackFor = Exception.class)
    @Override
    public SysUserDTO addEntUser(SysUserDTO sysUserDTO, Long entId) {

        SysUser sysUser = ConvertHelper.convert(sysUserDTO, SysUser.class);
        //验证登录名是否唯一
        if (sysUserMapper.isUserName(sysUser.getUserName()) != null) {
            throw new CommonException("该用户已经存在");
        }
        //验证电话号码是否唯一
        if (sysUserMapper.isTel(sysUser.getTelephone()) != null) {
            throw new CommonException("该电话号码已经存在");
        }

        //加密密码
        sysUser.setPassword(passwordEncoder.encode(sysUser.getPassword()));
        sysUser.setVersion(1L);
        sysUser.setIsDel(0);
        sysUser.setCreationDate(new Date());
        sysUser.setUpdateDate(new Date());
        int result = sysUserMapper.insertSelective(sysUser);
        if (result != 1 && sysUser.getId() == null) {
            throw new CommonException("创建用户失败");
        }

        UserEnt userEnt = new UserEnt();
        userEnt.setEntId(entId);
        userEnt.setUserId(sysUser.getId());
        userEnt.setVersion(1L);
        userEnt.setCreationDate(new Date());
        userEnt.setUpdateDate(new Date());

        if(userEntMapper.insertSelective(userEnt)!=1){
            throw new CommonException("创建用户失败");
        }

        SysUserDTO sysUserDTOResult = ConvertHelper.convert(sysUserMapper.selectByPrimaryKey(sysUser.getId()), SysUserDTO.class);


        return sysUserDTOResult;
    }
}
