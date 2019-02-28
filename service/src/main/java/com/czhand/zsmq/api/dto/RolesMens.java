package com.czhand.zsmq.api.dto;

import com.czhand.zsmq.domain.SysMenu;
import com.czhand.zsmq.domain.SysRole;

import java.util.List;

/**
 * @author:WANGJING
 * @Date: 2019/1/24 14:37
 */
public class RolesMens {

	List<SysRole> roles;

	List<SysMenu> sysMenus;

	public List<SysRole> getRoles() {
		return roles;
	}

	public void setRoles(List<SysRole> roles) {
		this.roles = roles;
	}

	public List<SysMenu> getSysMenus() {
		return sysMenus;
	}

	public void setSysMenus(List<SysMenu> sysMenus) {
		this.sysMenus = sysMenus;
	}
}
