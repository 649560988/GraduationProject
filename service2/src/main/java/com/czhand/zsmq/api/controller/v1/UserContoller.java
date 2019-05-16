package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.controller.v1.validator.UserValidator;
import com.czhand.zsmq.api.dto.SysUserDTO;
import com.czhand.zsmq.app.service.EntBaseService;
import com.czhand.zsmq.app.service.UserEntService;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.utils.ArgsUtils;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @author:jpf
 * @Date: 2019/1/24 16:21
 */
@RestController
@RequestMapping("/user")
@Api(description = "用户注册")
public class UserContoller {
	@Autowired
	private UserValidator userValidator;
	protected Logger logger = LoggerFactory.getLogger(getClass());

//	@Autowired
//	private EntBaseService entBaseService;
	@Autowired
	private UserEntService userEntService;

//, @PathVariable("organizationalCode")@ApiParam(value = "组织机构代码") String organizationalCode

	/**
	 * 注册用户
	 * @Valid
	 * */
	@ApiOperation("注册用户")
	@PostMapping("/register")
	public ResponseEntity<Data<SysUserDTO>> registerUser(@RequestBody  SysUserDTO sysUserDTO) {
		//判断参数是否为空
		if (ArgsUtils.checkArgsNull(sysUserDTO)) {
			throw new CommonException("参数不正确");
		}
        SysUserDTO result = null;
		String message = "Register success";
		try {
			result =  userEntService.addEntUser(sysUserDTO);
			if (result == null) {
				message = "Register fail";
			}
		} catch (Exception e) {
			message = e.getMessage();
			logger.error("",e);
		}
		return ResponseUtils.res(result, message,HttpStatus.CREATED);
	}

	/**
	 * 注册用户
	 * */
//	@ApiOperation("注册用户")
//	@PostMapping("/register")
//	public ResponseEntity<Data<SysUserDTO>> createSysUserbyRegester(@RequestBody @Valid @ApiParam("注册的用户对象") SysUserDTO sysUserDTO) {
//		//判断参数是否为空
//		if (ArgsUtils.checkArgsNull(sysUserDTO)) {
//			throw new CommonException("参数不正确");
//		}
//		SysUserDTO result = null;
//		String message = "成功";
//		try {
//			result = userEntService.registerUser(sysUserDTO);
//		} catch (Exception e) {
//			message = e.getMessage();
//		}
//		return ResponseUtils.res(result, message);
//	}
//
//	@ApiOperation(value = "退出登陆", notes = "退出登陆")
//	@PostMapping("/logout")
//	public ResponseEntity<Data<SysUser>> logoutUser(@ApiIgnore Principal principal){
//
//		try {
//			CurrentUserUtils.clear(principal);
//		}catch (RuntimeException e){
//
//			e.printStackTrace();
//		}
//
//		return ResponseUtils.res(null,HttpStatus.NO_CONTENT);
//	}





}
