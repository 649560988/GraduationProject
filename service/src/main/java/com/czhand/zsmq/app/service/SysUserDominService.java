package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.RolesMens;
import com.czhand.zsmq.api.dto.SysUserDTO;
import com.czhand.zsmq.domain.SysUser;
import com.czhand.zsmq.infra.exception.CommonException;

import java.util.HashMap;

/**
 * @author WANGJING
 */
public interface SysUserDominService {

	/**
	 * 个人基础信息修改
	 * @param sysUserDTO
	 * @return
	 */
	public SysUserDTO updateSelf(SysUserDTO sysUserDTO)throws Exception;


	/**
	 *手机号验证
	 * @param sysUserDTO
	 * @return
	 */
	public SysUserDTO confirmPhone(SysUserDTO sysUserDTO)throws Exception;


	/**
	 *密码修改
	 * @param hashMap
	 * @return
	 */
	SysUserDTO updateSysUserPwd(HashMap<String, Object> hashMap)throws Exception ;

	/**
	 * 获取用户所有角色和所有菜单（去重）
	 * @param
	 * @return
	 */
	RolesMens queryRolesMenus();


	/**
	 * 获取当前登录人的基本信息
	 * @param
	 * @return
	 */
	SysUserDTO selectAuth() throws CommonException;
}
