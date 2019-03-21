package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.SysMenuDTO;
import com.czhand.zsmq.api.dto.SysRoleDTO;
import com.czhand.zsmq.app.service.SysRoleService;
import com.czhand.zsmq.domain.SysMenu;
import com.czhand.zsmq.domain.SysMenuRole;
import com.czhand.zsmq.domain.SysRole;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.SysMenuRoleMapper;
import com.czhand.zsmq.infra.mapper.SysRoleMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import com.czhand.zsmq.infra.utils.convertor.ConvertPageHelper;
import com.czhand.zsmq.infra.utils.security.CurrentUserUtils;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * 角色管理
 *
 * @author linjing
 */
@Service
public class SysRoleServiceImpl implements SysRoleService {
    @Autowired
    private SysRoleMapper sysRoleMapper;

    @Autowired
    private SysMenuRoleMapper sysMenuRoleMapper;

    /**
     * 获取 userId
     *
     * @return userId
     */
    Long getRoleUserId() {
        return CurrentUserUtils.get().getId();
    }

    /**
     * 新增角色
     *
     * @param sysRoleDTO 角色信息
     * @return 是否插入成功，成功为0，失败为1
     * @throws CommonException
     */
    @Override
    public SysRoleDTO createSysRole(SysRoleDTO sysRoleDTO) throws CommonException {
        SysRole sysRole = ConvertHelper.convert(sysRoleDTO,SysRole.class);
        sysRole.setVersion(1L);
        sysRole.setCreationBy(getRoleUserId());
        sysRole.setUpdateBy(getRoleUserId());
        sysRole.setCreationDate(new Date());
        sysRole.setUpdateDate(new Date());
        int result = sysRoleMapper.insertSelective(sysRole);
        if (result != 1) {
            throw new CommonException("创建用户失败");
        }
        List<SysMenuDTO> menuDTOS= ConvertHelper.convertList(sysRole.getSysMenus(),SysMenuDTO.class);
        //关联角色
        addMenu(menuDTOS,sysRole.getId());
        SysRoleDTO sysRoleResult = ConvertHelper.convert(sysRoleMapper.selectByPrimaryKey(sysRole.getId()),SysRoleDTO.class);
        List<SysMenuDTO> menuDTOList= ConvertHelper.convertList(sysMenuRoleMapper.selectMenu(sysRole.getId()),SysMenuDTO.class);
        sysRoleResult.setSysMenus(menuDTOList);
        return sysRoleResult;
    }

    /**
     * 更新角色信息
     *
     * @param sysRoleDTO 角色信息
     * @return 是否更新成功，成功为0，失败为1
     * @throws CommonException
     */
    @Override
    public SysRoleDTO updateSysRole(SysRoleDTO sysRoleDTO) throws CommonException {
        SysRole sysRole = ConvertHelper.convert(sysRoleDTO,SysRole.class);
        sysRole.setVersion(sysRole.getVersion() + 1);
        sysRole.setUpdateBy(getRoleUserId());
        sysRole.setUpdateDate(new Date());
        int result = sysRoleMapper.updateByPrimaryKeySelective(sysRole);
        if (result != 1) {
            throw new CommonException("更新失败");
        }
        //如果修改了菜单,先删除原有菜单，再关联菜单
        if (sysRoleDTO.getSysMenus().size() != 0) {
            Long roleId = sysRole.getId();
            SysMenuRole sysMenuRole = new SysMenuRole();
            sysMenuRole.setRoleId(roleId);
            sysMenuRoleMapper.deleteMenuRole(sysMenuRole);
            //关联菜单信息
            addMenu(sysRoleDTO.getSysMenus(),sysRole.getId());
        }
        SysRoleDTO sysRoleResult = ConvertHelper.convert(sysRoleMapper.selectByPrimaryKey(sysRole.getId()),SysRoleDTO.class);
        sysRoleResult.setSysMenus(ConvertHelper.convertList(sysMenuRoleMapper.selectMenu(sysRole.getId()),SysMenuDTO.class));
        return sysRoleResult;
    }

    /**
     * 关联菜单
     * @param menuDTOList 角色的菜单集合
     * @param roleId  角色ID
     */
    public void addMenu(List<SysMenuDTO> menuDTOList,Long roleId ) {
        List<SysMenu> sysMenuList= ConvertHelper.convertList(menuDTOList,SysMenu.class);
        for (SysMenu sysMenu : sysMenuList) {
            SysMenuRole menuRole = new SysMenuRole();
            menuRole.setMenuId(sysMenu.getId());
            menuRole.setRoleId(roleId);
            menuRole.setVersion(1L);
            menuRole.setCreationBy(getRoleUserId());
            menuRole.setUpdateBy(getRoleUserId());
            menuRole.setCreationDate(new Date());
            menuRole.setUpdateDate(new Date());
            sysMenuRoleMapper.insertSysMenuRole(menuRole);
        }
    }

    /**
     * 查询单条数据
     *
     * @param id sys_role表id
     * @return 一条角色信息
     */
    @Override
    public SysRoleDTO selectOne(Long id) throws CommonException {
        SysRole sysRole = sysRoleMapper.selectByPrimaryKey(id);
        if (sysRole == null || ("").equals(sysRole)) {
            //能走过，但是不抛出异常信息
            throw new CommonException("没有该条记录");
        }
        SysRoleDTO sysRoleDTO=ConvertHelper.convert(sysRole,SysRoleDTO.class);
        sysRoleDTO.setSysMenus(ConvertHelper.convertList(sysMenuRoleMapper.selectMenu(sysRole.getId()),SysMenuDTO.class));
        return sysRoleDTO;
    }

    /**
     * 禁用、启用角色
     *
     * @param id    sys_role表id
     * @param isdel 1为禁用，0为启用
     * @return 状态是否改变成功，1为失败，0为成功
     * @throws Exception
     */
    @Override
    public int stopOrStart(Long id, int isdel) throws CommonException {
        SysRole sysRole = new SysRole();
        sysRole.setId(id);
        sysRole.setUpdateBy(getRoleUserId());
        sysRole.setIsDel(isdel);
        int result = sysRoleMapper.stopOrStart(sysRole);
        if (result != 1 && result != 0) {
            throw new CommonException("操作失败");
        }
        return result;
    }

    /**
     * 查询所有角色
     *
     * @return 所有启用角色
     * @throws CommonException
     */
    @Override
    public List<SysRoleDTO> selectAllRole() throws CommonException {
        int isDel = 0;
        List<SysRole> sysRoleList = sysRoleMapper.selectAllRole(isDel, null);
        List<SysRoleDTO> sysRoleDTO=ConvertHelper.convertList(sysRoleList,SysRoleDTO.class);
        return sysRoleDTO;
    }

    /**
     * 分页查询
     *
     * @param pageNo   分页查询中的参数pageNo
     * @param pageSize 分页查询中的参数pageSize
     * @param isDel    1为禁用，0为启用
     * @param name     角色名称
     * @return 分页角色结果集
     * @throws CommonException
     */
    @Override
    public PageInfo<SysRoleDTO> selectPageRole(int pageNo, int pageSize, String isDel, String name) throws CommonException {
        PageHelper.startPage(pageNo, pageSize);
        Page<SysRole> sysRoles = null;
        if (isDel == null || isDel.equals("")) {
            sysRoles = (Page)sysRoleMapper.selectAllRoles(name);
        } else {
            int isdel = Integer.parseInt(isDel);
            sysRoles = (Page)sysRoleMapper.selectAllRole(isdel, name);
        }
        Page<SysRoleDTO> page= ConvertPageHelper.convertPage(sysRoles,SysRoleDTO.class);
        PageInfo<SysRoleDTO> pageInfo = new PageInfo<>(page);
        return pageInfo;
    }
}