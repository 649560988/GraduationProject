package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.SysRole;
import com.czhand.zsmq.domain.SysUserRole;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.springframework.stereotype.Component;

import java.util.List;
/**
 * 角色用户管理
 *
 * @author linjing
 */
@Component
public interface SysUserRoleMapper extends BaseMapper<SysUserRole> {
    /**
     * 新增
     *
     * @param sysUserRole 用户角色信息
     */
    void insertSysUserRole(SysUserRole sysUserRole);

    /**
     * 物理删除sys_user_role表数据
     *
     * @param sysUserRole 用户角色信息
     */
    void deleteSysUserRole(SysUserRole sysUserRole);

    /**
     * 根据userId查询roleId，roleName
     *
     * @param userId 用户id
     * @return SysRole集合
     */
    List<SysRole> selectRole(Long userId);
    Integer addRole(Long id);
}