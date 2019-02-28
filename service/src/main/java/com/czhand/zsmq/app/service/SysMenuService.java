package com.czhand.zsmq.app.service;



import com.czhand.zsmq.api.dto.SysMenuDTO;
import com.czhand.zsmq.domain.SysMenu;

import java.util.HashMap;
import java.util.List;

/**
 * @author WANGJING
 * @date 2018/01/03
 */
public interface SysMenuService {

	/**
	 * 添加菜单
	 * @param sysMenu
	 * @return
	 */
	SysMenuDTO creat(SysMenuDTO sysMenuDTO) throws Exception;

	/**
	 * 禁用启用菜单
	 * @param id
	 * @return
	 */
	SysMenuDTO delete(Long id, int isdel)throws Exception;

	/**
	 * 更新菜单
	 * @param sysMenuDTO
	 * @return
	 */
	SysMenuDTO update(SysMenuDTO sysMenuDTO)throws Exception;

	/**
	 * 查询一个菜单
	 *
	 * @param id
	 * @return
	 */
	SysMenuDTO selectById(Long id)throws Exception;

	/**
	 * 根据父节点查询
	 * @param sysMenuDTO
	 * @return
	 */
	List<SysMenuDTO> selectByParentId(SysMenuDTO sysMenuDTO)throws Exception;


	/**
	 * 查询所有
	 * @param
	 * @return
	 */
	List<SysMenuDTO> selectList()throws Exception;
}
