package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.SysUserDTO;
import com.czhand.zsmq.app.service.UserEntService;
import com.czhand.zsmq.domain.SysUser;
import com.czhand.zsmq.domain.SysUserRole;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.SysUserMapper;
import com.czhand.zsmq.infra.mapper.SysUserRoleMapper;
import com.czhand.zsmq.infra.mapper.UserEntMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

/**
 * @autor wyw
 * @data 2019/4/10 10:43
 */
@Service
public class UserEntServiceImpl implements UserEntService {
    @Autowired
    private UserEntMapper userEntMapper;

    @Autowired
    private SysUserMapper sysUserMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private SysUserRoleMapper sysUserRoleMapper;


    @Transactional(rollbackFor = Exception.class)
    @Override
    public SysUserDTO addEntUser(SysUserDTO sysUserDTO) {

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
        Long id=sysUser.getId();
        SysUserRole sysUserRole=new SysUserRole();
        sysUserRole.setUserId(id);
        sysUserRole.setRoleId(4l);
        sysUserRole.setCreationBy(1l);
        sysUserRole.setUpdateDate(new Date());
        sysUserRole.setVersion(1l);
        sysUserRoleMapper.insert(sysUserRole);
        if (result != 1 && sysUser.getId() == null) {
            throw new CommonException("创建用户失败");
        }
        SysUserDTO sysUserDTOResult = ConvertHelper.convert(sysUserMapper.selectByPrimaryKey(sysUser.getId()), SysUserDTO.class);


        return sysUserDTOResult;
    }

}
