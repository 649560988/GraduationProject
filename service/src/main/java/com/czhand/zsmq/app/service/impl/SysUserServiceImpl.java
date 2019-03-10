package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.SysRoleDTO;
import com.czhand.zsmq.api.dto.SysUserDTO;
import com.czhand.zsmq.api.dto.ent.EntBaseDTO;
import com.czhand.zsmq.domain.EntBase;
import com.czhand.zsmq.domain.SysRole;
import com.czhand.zsmq.domain.SysUser;
import com.czhand.zsmq.domain.SysUserRole;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.EntBaseMapper;
import com.czhand.zsmq.infra.mapper.SysUserMapper;
import com.czhand.zsmq.infra.mapper.SysUserRoleMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import com.czhand.zsmq.infra.utils.convertor.ConvertPageHelper;
import com.czhand.zsmq.infra.utils.security.CurrentUserUtils;
import com.czhand.zsmq.app.service.SysUserService;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * 用户管理
 *
 * @author linjing
 */
@Service
public class SysUserServiceImpl implements SysUserService {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SysUserMapper userMapper;

    @Autowired
    private SysUserRoleMapper sysUserRoleMapper;

    @Autowired
    private EntBaseMapper entBaseMapper;

    /**
     * 获取 userId
     *
     * @return userId
     */
    Long getUserId() {
        return CurrentUserUtils.get().getId();
    }


    /**
     * 注册用户
     *
     * @param SysUserDTO 用户信息
     * @return 成功为0，失败为1
     * @throws CommonException
     */
    @Override
    public SysUserDTO registerUser(SysUserDTO sysUserDTO) {
        SysUser sysUser = ConvertHelper.convert(sysUserDTO, SysUser.class);
        //验证登录名是否唯一
        SysUser sUser = userMapper.isUserName(sysUser.getUserName());
        if (sUser != null) {
            throw new CommonException("该用户已经存在");
        }

        //验证电话号码是否唯一
        SysUser sUser2 = userMapper.isTel(sysUser.getTelephone());
        if (sUser2 != null) {
            throw new CommonException("该电话号码已经存在");
        }

        //加密密码
        String newPwd = passwordEncoder.encode(sysUser.getPassword());
        sysUser.setPassword(newPwd);
        sysUser.setVersion(1L);
        sysUser.setCreationBy(getUserId());
        sysUser.setUpdateBy(getUserId());
        sysUser.setCreationDate(new Date());
        sysUser.setUpdateDate(new Date());
        int result = userMapper.insert(sysUser);
        Long Id=sysUser.getId();
//        Long Id=building.getId();
//        if(result!=1){
//            throw new CommonException("插入失败");
//        }
//        return ConvertHelper.convert(buildingMapper.selectByPrimaryKey(Id),BuildingDTO.class);
        if (result != 1) {
            throw new CommonException("创建用户失败");
        }
//        SysUserDTO sysUserDTOResult = ConvertHelper.convert(userMapper.selectByPrimaryKey(sysUser.getId()), SysUserDTO.class);
//        return ConvertHelper.convert(sysUserDTOResult, SysUserDTO.class);
        return ConvertHelper.convert(userMapper.selectByPrimaryKey(Id),SysUserDTO.class);
    }

    /**
     * 新增用户
     *
     * @param sysUserDTO 用户信息
     * @return 是否插入成功，成功为0，失败为1
     * @throws CommonException
     */
    @Override
    public SysUserDTO createSysUser(SysUserDTO sysUserDTO) throws CommonException {
        SysUser sysUser = ConvertHelper.convert(sysUserDTO, SysUser.class);
        //验证登录名是否唯一
        SysUser sUser = userMapper.isUserName(sysUser.getUserName());
        if (sUser != null) {
            throw new CommonException("该用户已经存在");
        }

        //验证电话号码是否唯一
        SysUser sUser2 = userMapper.isTel(sysUser.getTelephone());
        if (sUser2 != null) {
            throw new CommonException("该电话号码已经存在");
        }

        //加密密码
        String newPwd = passwordEncoder.encode(sysUser.getPassword());
        sysUser.setPassword(newPwd);
        sysUser.setVersion(1L);
        sysUser.setCreationBy(getUserId());
        sysUser.setUpdateBy(getUserId());
        sysUser.setCreationDate(new Date());
        sysUser.setUpdateDate(new Date());

        int result = userMapper.insertSelective(sysUser);
        if (result != 1) {
            throw new CommonException("创建用户失败");
        }
        //关联角色信息
        addRoles(ConvertHelper.convertList(sysUserDTO.getSysRoles(), SysRole.class), sysUser.getId());
        List<SysRole> roleList = sysUser.getSysRoles();
        SysUserDTO sysUserDTOResult = ConvertHelper.convert(userMapper.selectByPrimaryKey(sysUser.getId()), SysUserDTO.class);
        sysUserDTOResult.setSysRoles(ConvertHelper.convertList(roleList, SysRoleDTO.class));
        return ConvertHelper.convert(sysUserDTOResult, SysUserDTO.class);
    }
    /**
     * 更新用户
     *
     * @param sysUserDTO 用户信息
     * @return 是否更新成功，成功为0，失败为1
     * @throws CommonException
     */
    @Override
    public SysUserDTO updateSysUser(SysUserDTO sysUserDTO) throws CommonException {
        SysUser sysUser = ConvertHelper.convert(sysUserDTO, SysUser.class);
        if (sysUserDTO.getPassword() != null && sysUserDTO.getPassword() != "") {
            String newPwd = passwordEncoder.encode(sysUser.getPassword());
            sysUser.setPassword(newPwd);
        }
        sysUser.setVersion(sysUser.getVersion() + 1);
        sysUser.setUpdateBy(getUserId());
        sysUser.setUpdateDate(new Date());
        int result = userMapper.updateByPrimaryKeySelective(sysUser);
        if (result != 1) {
            throw new CommonException("用户更新失败");
        }
        List<SysRole> roleList = ConvertHelper.convertList(sysUser.getSysRoles(), SysRole.class);
        //如果修改了角色
        if (roleList.size() != 0) {
            //删除角色
            Long userId = sysUser.getId();
            SysUserRole sysUserRole = new SysUserRole();
            sysUserRole.setUserId(userId);
            try {
                sysUserRoleMapper.deleteSysUserRole(sysUserRole);
            } catch (Exception e) {
                throw new CommonException("删除角色失败");
            }
            //重新关联角色信息
            addRoles(roleList, sysUser.getId());
        }
        SysUserDTO sysUserDTOResult = ConvertHelper.convert(userMapper.selectByPrimaryKey(sysUser.getId()), SysUserDTO.class);
        sysUserDTOResult.setSysRoles(ConvertHelper.convertList(userMapper.selectRolesById(sysUser.getId()), SysRoleDTO.class));
        return sysUserDTOResult;
    }

    /**
     * 关联角色
     *
     * @param roleList 用户角色信息
     * @param userId   用户ID
     * @return
     * @throws CommonException
     */
    public boolean addRoles(List<SysRole> roleList, Long userId) throws CommonException {
        for (SysRole sysRole : roleList) {

            SysUserRole sysUR = new SysUserRole();
            sysUR.setRoleId(sysRole.getId());
            sysUR.setUserId(userId);
            sysUR.setVersion(1L);
            sysUR.setCreationBy(getUserId());
            sysUR.setUpdateBy(getUserId());
            sysUR.setCreationDate(new Date());
            sysUR.setUpdateDate(new Date());
            try {
                sysUserRoleMapper.insertSysUserRole(sysUR);
            } catch (Exception e) {
                throw new CommonException("关联角色失败");
            }
        }
        return true;
    }

    /**
     * 查询一条用户详细信息
     *
     * @param id sys_user表id
     * @return 用户信息
     */
    @Override
    public SysUserDTO selectOne(Long id) {
        SysUser sysUser = userMapper.selectByPrimaryKey(id);
        SysUserDTO sysUserDTO = ConvertHelper.convert(sysUser, SysUserDTO.class);
        sysUserDTO.setSysRoles(ConvertHelper.convertList(sysUserRoleMapper.selectRole(sysUser.getId()), SysRoleDTO.class));
        return sysUserDTO;
    }

    /**
     * 1.分页查询 2.根据realName模糊查询
     *
     * @param realName 用户真实姓名
     * @param pageNo   分页查询中的参数pageNo
     * @param pageSize 分页查询中的参数pageSize
     * @return 列表数据
     */
    @Override
    public PageInfo<SysUserDTO> selectByRealName(String realName, int pageNo, int pageSize) {
        PageHelper.startPage(pageNo, pageSize);
        Page<SysUser> sysUserList = null;
        if (realName == null || ("").equals(realName)) {
            sysUserList = (Page) userMapper.selectAll();
        } else {
            sysUserList = (Page) userMapper.selectByRealName(realName);
        }
        Page<SysUserDTO> page = ConvertPageHelper.convertPage(sysUserList, SysUserDTO.class);
        PageInfo<SysUserDTO> pageInfo = new PageInfo<>(page);
        return pageInfo;
    }

    /**
     * 禁用、启用用户
     *
     * @param id    sys_user表id
     * @param isdel 用户状态：禁用为1，启用为0
     * @return 状态是否更新成功
     * @throws CommonException
     */
    @Override
    public int stopOrStart(Long id, int isdel) throws CommonException {
        SysUser sysUser = new SysUser();
        sysUser.setId(id);
        sysUser.setUpdateBy(getUserId());
        sysUser.setIsDel(isdel);
        int result = userMapper.stopOrStart(sysUser);
        if (result != 1 && result != 0) {
            throw new CommonException("操作失败");
        }
        return result;
    }

    /**
     * 查询所有用户
     * @return 所有用户信息（包括企业信息，不包括角色信息）
     */
    @Override
    public List<SysUserDTO> selectAllUsers() {
        List<SysUser> sysUserList = userMapper.selectAll();
        List<SysUserDTO> sysUserDTOList= ConvertHelper.convertList(sysUserList,SysUserDTO.class);
        for (SysUserDTO sysUserDTO :sysUserDTOList) {
            EntBase entBase= entBaseMapper.querryEntBaseByUId(sysUserDTO.getId());
            if (entBase!=null){
                sysUserDTO.setEntBaseDTO(ConvertHelper.convert(entBase,EntBaseDTO.class));
            }
        }
        return sysUserDTOList;
    }
}
