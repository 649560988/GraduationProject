package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.SysRole;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
/**
 * 角色管理
 *
 * @author linjing
 */
public interface SysRoleMapper extends BaseMapper<SysRole> {

        /**
         * 禁用、启用角色
         *
         * @param sysRole
         * @return
         */
        int stopOrStart(SysRole sysRole);

        /**
         * 查询所有用户
         * @param isDel
         * @param roleName
         * @return
         */
        List<SysRole> selectAllRole(@Param("isDel") int isDel, @Param("roleName") String roleName);

        /**
         * 查询所有用户 分页查询+模糊查询
         *
         * @param roleName
         * @return
         */
        List<SysRole> selectAllRoles(@Param("roleName") String roleName);
}