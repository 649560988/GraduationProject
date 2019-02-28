package com.czhand.zsmq.app.service.impl;


import com.czhand.zsmq.api.dto.SysMenuDTO;
import com.czhand.zsmq.app.service.SysMenuService;
import com.czhand.zsmq.domain.SysMenu;
import com.czhand.zsmq.domain.core.CurrentUser;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.SysMenuMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import com.czhand.zsmq.infra.utils.security.CurrentUserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 * @author WANGJING
 * @date 2018/01/03
 */
@Service
public class SysMenuServiceImpl implements SysMenuService {
	@Autowired
	private SysMenuMapper sysMenuMapper;


	/**
	 * 添加菜单
	 *
	 * @param sysMenuDTO
	 * @return
	 */
	@Override
	public SysMenuDTO creat(SysMenuDTO sysMenuDTO) throws Exception {

		//获取用户信息
		sysMenuDTO.setVersion(1L);
		sysMenuDTO.setCreationBy(getUserId());
		sysMenuDTO.setUpdateBy(getUserId());
		sysMenuDTO.setCreationDate(new Date());
		sysMenuDTO.setUpdateDate(new Date());
		sysMenuDTO.setIsDel(0);

		SysMenu sysMenu=ConvertHelper.convert(sysMenuDTO,SysMenu.class);
		int result = sysMenuMapper.insert(sysMenu);
		if (result != 1) {
			throw new CommonException("插入失败");
		}
		return ConvertHelper.convert(sysMenuMapper.selectByPrimaryKey(sysMenu.getId()),SysMenuDTO.class);
	}

	/**
	 * 禁用启用菜单
	 *
	 * @param id
	 * @return
	 */
	@Override
	public SysMenuDTO delete(Long id, int isdel) throws Exception {
		SysMenu sysMenu = new SysMenu();
		//获取用户信息
		sysMenu.setId(id);
		sysMenu.setUpdateBy(getUserId());
		sysMenu.setIsDel(isdel);
		int result = sysMenuMapper.deleteByMid(sysMenu);
		if (result != 1) {
			throw new CommonException("操作失败");
		}

		return ConvertHelper.convert(sysMenuMapper.selectByPrimaryKey(id),SysMenuDTO.class);
	}

	/**
	 * 更新菜单
	 *
	 * @param sysMenuDTO
	 * @return
	 */
	@Override
	public SysMenuDTO update(SysMenuDTO sysMenuDTO) throws Exception {

		//获取用户信息
		sysMenuDTO.setUpdateBy(getUserId());
		SysMenu sysMenuOrigin = new SysMenu();
		sysMenuOrigin = sysMenuMapper.selectByPrimaryKey(sysMenuDTO.getId());
		Long version = sysMenuOrigin.getVersion() + 1;
		sysMenuDTO.setVersion(version);

		SysMenu sysMenu=ConvertHelper.convert(sysMenuDTO,SysMenu.class);
		int result = sysMenuMapper.updateByPrimaryKeySelective(sysMenu);
		if (result != 1) {
			throw new CommonException("更新失败");
		}
		return ConvertHelper.convert(sysMenuMapper.selectByPrimaryKey(sysMenu.getId()),SysMenuDTO.class);
	}

	/**
	 * 查询单条
	 *
	 * @param id
	 * @return
	 */
	@Override
	public SysMenuDTO selectById(Long id) throws Exception {
		return ConvertHelper.convert(sysMenuMapper.selectByPrimaryKey(id),SysMenuDTO.class);
	}


	/**
	 * 根据父节点查询
	 *
	 * @param sysMenuDTO
	 * @return
	 */
	@Override
	public List<SysMenuDTO> selectByParentId(SysMenuDTO sysMenuDTO) throws Exception {
		SysMenu sysMenu=ConvertHelper.convert(sysMenuDTO,SysMenu.class);
		sysMenu.setId(sysMenu.getParentId());
		List<SysMenu> sysMenuList = sysMenuMapper.selectByParentId(sysMenu);
		sysMenuList = getList(sysMenuList);
		return ConvertHelper.convertList(sysMenuList,SysMenuDTO.class);
	}

	/**
	 * 递归
	 */
	private List<SysMenu> getList(List<SysMenu>  sysMenuList) {
		for (SysMenu sysMenu : sysMenuList) {
			List<SysMenu> sysMenuList1 = sysMenuMapper.selectByParentId(sysMenu);
			if (!sysMenuList1.isEmpty()) {
				getList(sysMenuList1);
			}
			sysMenu.setChildren(sysMenuList1);
		}
		return sysMenuList;
	}


	public Long getUserId() {
		CurrentUser currentUser=CurrentUserUtils.get();
		Long userId=currentUser.getId();
		return userId;
	}

	/**
	 * 查询所有
	 */
	@Override
	public List<SysMenuDTO> selectList() throws Exception {
		return ConvertHelper.convertList(sysMenuMapper.selectAll(),SysMenuDTO.class);
	}
}
