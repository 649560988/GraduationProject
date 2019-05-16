package com.czhand.zsmq.app.service.impl;


import com.czhand.zsmq.api.controller.v1.DemoController;
import com.czhand.zsmq.api.dto.RolesMens;
import com.czhand.zsmq.api.dto.SysUserDTO;
import com.czhand.zsmq.app.service.SysUserDominService;
import com.czhand.zsmq.domain.SysMenu;
import com.czhand.zsmq.domain.SysRole;
import com.czhand.zsmq.domain.SysUser;
import com.czhand.zsmq.domain.core.CurrentUser;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.SysMenuMapper;
import com.czhand.zsmq.infra.mapper.SysUserMapper;
import com.czhand.zsmq.infra.utils.MenuTreeUtil;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import com.czhand.zsmq.infra.utils.security.CurrentUserUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;


/**
 * @author WANGJING
 */
@Service
public class SysUserDominServiceImpl implements SysUserDominService {

	@Autowired
	private PasswordEncoder passwordEncoder;
	@Autowired
	private SysUserMapper sysUserMapper;

	@Autowired
	private SysMenuMapper sysMenuMapper;


	private final static Logger logger = LoggerFactory.getLogger(SysUserDominServiceImpl.class);


	public Long getUserId() {
		CurrentUser currentUser = CurrentUserUtils.get();
		Long userId = currentUser.getId();
		return userId;
	}

	/**
	 * 个人基础信息修改
	 *
	 * @param sysUserDTO
	 * @return
	 */
	@Override
	public SysUserDTO updateSelf(SysUserDTO sysUserDTO) throws Exception {
		SysUser sysUser = ConvertHelper.convert(sysUserDTO, SysUser.class);
		//获取用户信息
		sysUser.setUpdateBy(getUserId());
		SysUser sysUserOrigin = new SysUser();
		sysUserOrigin = sysUserMapper.selectByPrimaryKey(sysUser.getId());
		Long version = sysUserOrigin.getVersion() + 1;
		sysUser.setVersion(version);
		Long origin = sysUserMapper.selectIdByUserName(sysUser.getUserName());

		//查询手机号不是本id的
		SysUser originUser = sysUserMapper.selectPhoneById(sysUser);

		if (origin != null) {
			if (!origin.equals(sysUser.getId())) {
				throw new CommonException("用户名存在，请重新输入");
			}
		}
		if (originUser != null) {
				throw new CommonException("手机号存在，请重新输入");
		}
		int result = sysUserMapper.updateByPrimaryKeySelective(sysUser);
		if (result != 1) {
			throw new CommonException("更新失败");
		}
		return ConvertHelper.convert(sysUserMapper.selectByPrimaryKey(sysUser.getId()), SysUserDTO.class);
	}

	/**
	 * 手机号验证
	 *
	 * @param sysUserDTO
	 * @return
	 */
	@Override
	public SysUserDTO confirmPhone(SysUserDTO sysUserDTO) throws Exception {
		SysUser sysUser = ConvertHelper.convert(sysUserDTO, SysUser.class);
		SysUser sysUserOrigin ;
		sysUserOrigin = sysUserMapper.selectPhoneById(sysUser);
		//验证手机号成功
		if (sysUserOrigin == null) {
			throw new CommonException("确认手机号失败");
		}
		return ConvertHelper.convert(sysUserMapper.selectByPrimaryKey(sysUser.getId()), SysUserDTO.class);
	}

	/**
	 * 密码修改
	 *
	 * @param hashMap
	 * @return
	 */
	@Override
	public SysUserDTO updateSysUserPwd(HashMap<String, Object> hashMap) throws Exception {
		SysUser sysUser = new SysUser();
		Long id = Long.valueOf(String.valueOf(hashMap.get("id")));
		sysUser.setId(id);
		String oldPwd = String.valueOf(hashMap.get("oldPwd"));
		logger.info("输入的原始密码:{}", oldPwd);
		String newPwd1 = String.valueOf(hashMap.get("newPwd1"));
		String newPwd2 = String.valueOf(hashMap.get("newPwd2"));
		if (!newPwd1.equals(newPwd2)) {
			throw new CommonException("新密码两次输入不一致，请重新输入");
		}

		//验证旧密码
		logger.info("输入的密码加密后：{}", oldPwd);
		SysUser sysUserOld = sysUserMapper.selectOldPwdById(sysUser);
		String originPwd = sysUserOld.getPassword();
		if (!passwordEncoder.matches(oldPwd, originPwd)) {
			throw new CommonException("原始密码错误，请重新输入");
		}

		//更新新密码
		String newPwd = passwordEncoder.encode(newPwd1);
		sysUser.setPassword(newPwd);
		//获取用户信息
		sysUser.setUpdateBy(getUserId());
		//查询版本号
		SysUser sysUserOrigin = new SysUser();
		sysUserOrigin = sysUserMapper.selectByPrimaryKey(sysUser.getId());

		Long version = sysUserOrigin.getVersion() + 1;
		sysUser.setVersion(version);

		//更新
		int result = sysUserMapper.updateByPrimaryKeySelective(sysUser);
		if (result != 1) {
			throw new CommonException("更新失败");
		}
		return ConvertHelper.convert(sysUserMapper.selectByPrimaryKey(id), SysUserDTO.class);
	}

	/**
	 * 获取用户所有角色和所有菜单（去重）
	 *
	 * @param
	 * @return
	 */
	@Override
	public RolesMens queryRolesMenus() {
		//2.获取用户角色
		List<SysRole> maps = sysUserMapper.selectRolesById(getUserId());
		if (maps == null) {
			throw new CommonException("该用户没有角色");
		}
		//角色id数组
		List<Long> listIds = new ArrayList<>();
		for (SysRole sysRole : maps) {
			System.out.println(sysRole.getId() + "------------");
			Long roleId = sysRole.getId();
			listIds.add(roleId);
		}

		//3.根据角色数组查询所有的菜单
		List<SysMenu> mapList = sysMenuMapper.selectMenusByRole(listIds);

		//4.菜单数组进行去重
		Set<SysMenu> menuSet = new HashSet<>();

		//去重后的数组
		List<SysMenu> menuList = new ArrayList<>();
		for (SysMenu menu : mapList) {
			logger.info("======menu====" + menu);
			if (menuSet.add(menu)) {
				menuList.add(menu);
			}
		}
		//递归后的菜单
		List<SysMenu> sysMenus = MenuTreeUtil.formatMenu(menuList);

		//角色和去重递归后的集合
//		HashMap<Object,Object> result=new HashMap<>();
//		result.put("role",maps);
//		result.put("menu",sysMenus);

		RolesMens result = new RolesMens();
		result.setRoles(maps);
		result.setSysMenus(sysMenus);

		logger.info("hashSet后的menu" + menuList);
		logger.info("递归后的sysMenus" + sysMenus);

		return result;

	}

	/**
	 * 获取当前登录人的基本信息
	 *
	 * @param
	 * @return
	 */
	@Override
	public SysUserDTO selectAuth() throws CommonException {
		Long userId = getUserId();
		if (userId == null) {
			throw new CommonException("匿名用户！");
		}
		SysUser sysUser = sysUserMapper.selectAuth(userId);
		if (sysUser == null) {
			throw new CommonException("没有在数据库查到该用户");
		}
		return ConvertHelper.convert(sysUser, SysUserDTO.class);
	}
}
