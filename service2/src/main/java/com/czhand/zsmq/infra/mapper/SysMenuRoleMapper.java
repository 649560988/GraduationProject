package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.SysMenuRole;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.springframework.stereotype.Component;

import java.util.List;
/**
 * 角色菜单关系
 *
 * @author linjing
 */
@Component
public interface SysMenuRoleMapper extends BaseMapper<SysMenuRole> {
    /**
     * 新增
     *
     * @param sysMenuRole
     */
    void insertSysMenuRole(SysMenuRole sysMenuRole);

    /**
     * 根据roleId物理删除sys_menu_role数据
     *
     * @param sysMenuRole
     */
    void deleteMenuRole(SysMenuRole sysMenuRole);

    /**
     * 根据roleId,查询MenuList
     *
     * @param roleId
     * @return SysMenu集合
     */
    List selectMenu(Long roleId);
}