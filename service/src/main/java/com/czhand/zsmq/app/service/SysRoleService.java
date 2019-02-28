package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.SysRoleDTO;
import com.czhand.zsmq.infra.exception.CommonException;
import com.github.pagehelper.PageInfo;

import java.util.List;

/**
 * 角色管理
 *
 * @author linjing
 */
public interface SysRoleService {

    /**
     * 新增角色
     *
     * @param sysRoleDTO 角色信息
     * @return 是否插入成功，成功为0，失败为1
     * @throws CommonException
     */
    SysRoleDTO createSysRole(SysRoleDTO sysRoleDTO) throws CommonException;

    /**
     * 更新角色信息
     *
     * @param sysRoleDTO 角色信息
     * @return 是否更新成功，成功为0，失败为1
     * @throws CommonException
     */
    SysRoleDTO updateSysRole(SysRoleDTO sysRoleDTO) throws CommonException;

    /**
     * 查询单条数据
     *
     * @param id sys_role表id
     * @return 一条角色信息
     */
    SysRoleDTO selectOne(Long id) throws CommonException;

    /**
     * 禁用、启用角色
     *
     * @param id    sys_role表id
     * @param isdel 1为禁用，0为启用
     * @return 状态是否改变成功，1为失败，0为成功
     * @throws CommonException
     */
    int stopOrStart(Long id, int isdel) throws CommonException;

    /**
     * 查询所有角色
     *
     * @return 所有启用角色
     * @throws CommonException
     */
    List<SysRoleDTO> selectAllRole() throws CommonException;

    /**
     * 分页查询
     *
     * @param pageNo   分页查询中的参数pageNo
     * @param pageSize 分页查询中的参数pageSize
     * @param isDel    1为禁用，0为启用
     * @param name     角色名称
     * @return 分页角色结果集
     * @throws Exception
     */
    PageInfo<SysRoleDTO> selectPageRole(int pageNo, int pageSize, String isDel, String name) throws CommonException;

}
