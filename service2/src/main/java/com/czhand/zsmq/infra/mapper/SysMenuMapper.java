package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.SysMenu;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;

/**
 * @author WANGJING
 * @date 2018/01/03
 */
@Component
public interface SysMenuMapper extends BaseMapper<SysMenu> {

	/**
	 * 查询菜单树的数据源
	 * 父级为0 的为第一层
	 * @param sysMenu
	 * @return
	 */
	List<SysMenu>selectByParentId(SysMenu sysMenu);

	/**
	 * 根据删除menu
	 * @param sysMenu
	 * @return
	 */
	int deleteByMid(SysMenu sysMenu);

	/**
	 * 根据role查询menus
	 * @param ids
	 * @return
	 */
	List<SysMenu> selectMenusByRole(List<Long> ids);
}