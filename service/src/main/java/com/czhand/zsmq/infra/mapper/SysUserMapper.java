package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.api.dto.SysUserDTO;
import com.czhand.zsmq.domain.SysRole;
import com.czhand.zsmq.domain.SysUser;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 用户管理
 *
 * @author linjing
 */
@Component
public interface SysUserMapper extends BaseMapper<SysUser> {
	@Select("select * from sys_user where user_name=#{username}")
	List<SysUser> isUserExit(String username);
	/**
	 * 1.分页查询 2.根据realName模糊查询
	 *
	 * @param realName 用户真实姓名
	 * @return sysUser集合
	 */
	List<SysUser> selectByRealName(String realName);

	/**
	 * 禁用、启用用户
	 *
	 * @param sysUser
	 * @return
	 */
	int stopOrStart(SysUser sysUser);

	/**
	 * 密码修改，需要验证手机号
	 *
	 * @param sysUser
	 * @return
	 */
	SysUser selectPhoneById(SysUser sysUser);

	/**
	 * 验证旧密码
	 *
	 * @param sysUser
	 * @return
	 */
	SysUser selectOldPwdById(SysUser sysUser);

	/**
	 * 根据userName查询id
	 *
	 * @param userName
	 * @return
	 */
	Long selectIdByUserName(String userName);

	/**
	 * 根据id查询roles
	 *
	 * @param Id
	 * @return
	 */
	List<SysRole> selectRolesById(Long Id);

	/**
	 * 验证登录名是否唯一
	 *
	 * @param userName SysUser实体中的userName属性
	 * @return
	 */
	SysUser isUserName(String userName);

	/**
	 * 验证电话是否唯一
	 *
	 * @param tel SysUser实体中的telephone属性
	 * @return
	 */
	SysUser isTel(String tel);
	Integer insertByRegister(SysUser sysUser);
}