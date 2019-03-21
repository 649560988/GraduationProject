package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.SysUserDTO;
import com.czhand.zsmq.infra.exception.CommonException;

public interface UserEntService {

    SysUserDTO addEntUser(SysUserDTO sysUserDTO);

    /**
     * 注册用户
     *
     * @param sysUser 用户信息
     * @return 成功为0，失败为1
     * @throws CommonException
     */
//    SysUserDTO registerUser(SysUserDTO sysUserDT);
}
