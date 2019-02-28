package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.SysUserDTO;

public interface UserEntService {

    SysUserDTO addEntUser(SysUserDTO sysUserDTO,Long entId);

}
