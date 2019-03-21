package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.SysUserDTO;
import com.czhand.zsmq.domain.SysUser;
import com.czhand.zsmq.infra.exception.CommonException;
import com.github.pagehelper.PageInfo;

import java.util.List;

/**
 * 用户管理
 *
 * @author linjing
 */
public interface SysUserService {




    /**
     * 新增用户
     *
     * @param sysUserDTO 用户信息
     * @return 是否插入成功，成功为0，失败为1
     * @throws CommonException
     */
    SysUserDTO createSysUser(SysUserDTO sysUserDTO) throws CommonException;








    /**
     * 更新用户
     *
     * @param sysUserDTO 用户信息
     * @return 是否更新成功，成功为0，失败为1
     * @throws CommonException
     */
    SysUserDTO updateSysUser(SysUserDTO sysUserDTO) throws CommonException;

    /**
     * 查询一条用户详细信息
     *
     * @param id sys_user表id
     * @return 一条用户信息
     */
    SysUserDTO selectOne(Long id);

    /**
     * 1.分页查询 2.根据realName模糊查询
     *
     * @param realName 用户真实姓名
     * @param pageNo   分页查询中的参数pageNo
     * @param pageSize 分页查询中的参数pageSize
     * @return 列表数据
     */
    PageInfo<SysUserDTO> selectByRealName(String realName, int pageNo, int pageSize);

    /**
     * 禁用、启用用户
     *
     * @param id    sys_user表id
     * @param isdel 用户状态：禁用为1，启用为0
     * @return 状态是否更新成功
     * @throws Exception
     */
    int stopOrStart(Long id, int isdel) throws CommonException;

    /**
     * 查询所有用户（包括企业信息，不包括角色信息）
     * @return 所有用户集合
     */
    List<SysUserDTO> selectAllUsers();


}
