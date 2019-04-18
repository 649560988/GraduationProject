package com.czhand.zsmq.api.controller.v1;


import com.czhand.zsmq.api.dto.RolesMens;
import com.czhand.zsmq.api.dto.SysUserDTO;
import com.czhand.zsmq.app.service.SysUserDominService;
import com.czhand.zsmq.domain.SysUser;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.utils.ArgsUtils;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

/**
 * 用户基本信息
 *
 * @author WANGJING
 */
@Api(description = "用户基本操作API")
@RestController
@RequestMapping("/v1/sysUserDomin")
public class SysUserDominController {

	@Autowired
	private SysUserDominService userDominService;

	/**
	 * 更新个人信息
	 *
	 * @param sysUser
	 * @return
	 */
	@ApiOperation("更新个人信息")
	@PostMapping("/updateSelf")
	public ResponseEntity<Data<SysUserDTO>> updateSysUserSelf(@RequestBody SysUserDTO sysUser) {
		//判断参数是否为空
		if (ArgsUtils.checkArgsNull(sysUser)) {
			throw new CommonException("参数不正确");
		}
		SysUserDTO result = new SysUserDTO();
		String message = "成功";
		try {
			result = userDominService.updateSelf(sysUser);
		} catch (Exception e) {
			message = e.getMessage();
		}
		return ResponseUtils.res(result, message);
	}


	/**
	 * 更改密码 先验证手机号
	 *
	 * @param sysUserDTO 必须包含id  phone
	 * @return
	 */
	@ApiOperation("验证手机号")
	@PostMapping("/confirmPhone")
	public ResponseEntity<Data<SysUserDTO>> confirmSysUserPhone(@ApiParam(value = "{\n" +
			"\t\"id\":1,\n" +
			"\t\"telephone\":\"1115567889\"\n" +
			"}") @RequestBody SysUserDTO sysUserDTO) {
		//判断参数是否为空
		if (ArgsUtils.checkArgsNull(sysUserDTO)) {
			throw new CommonException("参数不正确");
		}
		SysUserDTO result = new SysUserDTO();
		String message = "成功";
		try {
			result = userDominService.confirmPhone(sysUserDTO);
		} catch (Exception e) {
			message = e.getMessage();
		}
		return ResponseUtils.res(result, message);
	}


	/**
	 * 修改用户密码
	 *
	 * @param hashMap
	 * @return
	 */
	@ApiOperation("修改密码")
	@PostMapping("/updatePwd")
	public ResponseEntity<Data<SysUserDTO>> updateSysUserPwd(@ApiParam(value = "{\n" +
			"\t\"id\":3,\n" +
			"\t\"oldPwd\":\"1234\",\n" +
			"\t\"newPwd1\":\"zld\",\n" +
			"\t\"newPwd2\":\"zld\"\n" +
			"}")@RequestBody HashMap<String, Object> hashMap) {
		//判断参数是否为空
		if (ArgsUtils.checkArgsNull(hashMap)) {
			throw new CommonException("参数不正确");
		}
		SysUserDTO result = new SysUserDTO();
		String message = "成功";
		try {
			result = userDominService.updateSysUserPwd(hashMap);
		} catch (Exception e) {
			message = e.getMessage();
		}
		return ResponseUtils.res(result, message);
	}


	/**
	 * 获取用户角色和菜单数组
	 *
	 * @param
	 * @return
	 */
	//@PreAuthorize("hasAnyRole('ADMIN','USER')")
	@ApiOperation("获取用户角色和菜单")
	@PostMapping("/queryRolesMenus")
	public ResponseEntity<Data<RolesMens>> queryRolesMenus() {
		RolesMens  result = new RolesMens();
		String message = "成功";
		try {
			result = userDominService.queryRolesMenus();
		} catch (Exception e) {
			message = e.getMessage();
		}
		return ResponseUtils.res(result, message);
	}

	/**
	 * 获取当前登录人的基本信息
	 *
	 * @param
	 * @return
	 */
	@ApiOperation("获取当前登录人的信息")
	@GetMapping("/getAuth")
	public ResponseEntity<Data<SysUserDTO>> getAuth() throws Exception {
		SysUserDTO result = new SysUserDTO();
		String message = "成功";
		try {
			 result = userDominService.selectAuth();
		} catch (Exception e) {
			message = "失败";
		}
		return ResponseUtils.res(result, message);
	}
}
