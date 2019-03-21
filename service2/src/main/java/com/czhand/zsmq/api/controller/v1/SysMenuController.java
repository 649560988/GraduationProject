package com.czhand.zsmq.api.controller.v1;


import com.czhand.zsmq.api.dto.SysMenuDTO;
import com.czhand.zsmq.app.service.SysMenuService;
import com.czhand.zsmq.domain.SysMenu;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.utils.ArgsUtils;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * @author WANGJING
 * @date 2018/01/03
 */
@Api(description = "菜单API")
@RestController
@RequestMapping("/v1/sysMenu")
public class SysMenuController {

	@Autowired
	private SysMenuService sysMenuService;

	private final static Logger logger = LoggerFactory.getLogger(SysMenuController.class);

	/**
	 * 创建一条新的菜单信息
	 * @param
	 * @return
	 */
	@ApiOperation("建一条新的菜单信息")
	@PostMapping("/create")
	public ResponseEntity<Data<SysMenuDTO>> createSysMenu(@ApiParam(value = "测试数据如下：{\n" +
			"\t\"menuName\":\"0123test\",\n" +
			"\t\"language\":\"zh_CN\",\n" +
			"\t\"parentId\":\"7\",\n" +
			"    \"route\":\"qwerewqwedfdew\",\n" +
			"    \"sort\":1\n" +
			"}") @RequestBody @Valid SysMenuDTO sysMenuDTO) {

		//判断参数是否为空
		if (ArgsUtils.checkArgsNull(sysMenuDTO)){
			throw new CommonException("参数不正确");
		}
		SysMenuDTO result = new SysMenuDTO();
		String message="成功";
		try {
			result=sysMenuService.creat(sysMenuDTO);
		} catch (Exception e) {
			message = e.getMessage();
		}

		//ConvertHelper
		return ResponseUtils.res(result,message);
	}

	/**
	 * 禁用，启用
	 * @param
	 * @return
	 */
	@ApiOperation("禁用，启用菜单")
	@PutMapping("/delete/{id}/{isdel}")
	public ResponseEntity<Data<SysMenuDTO>> deleteSysMenu(@ApiParam(value = "菜单id",example = "1") @PathVariable("id") Long id,
													   @ApiParam(value = "禁用启用状态，禁用传1，启用传0",example = "1") @PathVariable("isdel") int isdel) {
		//判断参数是否为空
		if (ArgsUtils.checkArgsNull(id)){
			throw new CommonException("参数不正确");
		}
		SysMenuDTO result = new SysMenuDTO();
		String message="成功";
		try {
			result=sysMenuService.delete(id,isdel);
		} catch (Exception e) {
			message = e.getMessage();
		}
		return ResponseUtils.res(result,message);
	}

	/**
	 * 更新一条菜单信息
	 * @param
	 * @return
	 */
	@ApiOperation("更新一条菜单信息")
	@PutMapping("/update")
	public ResponseEntity<Data<SysMenuDTO>> updateSysMenu(@ApiParam(value = "测试数据如下:{\n" +
			"\t\"id\":22,\n" +
			"\t\"menuName\":\"cd999\",\n" +
			"\t\"language\":\"zh_CN\",\n" +
			"\t\"parentId\":\"0\",\n" +
			"    \"route\":\"1111\",\n" +
			"    \"sort\":\"3\"\n" +
			"}")@RequestBody  SysMenuDTO sysMenuDTO) {

		//判断参数是否为空
		if (ArgsUtils.checkArgsNull(sysMenuDTO)){
			throw new CommonException("参数不正确");
		}
		SysMenuDTO result = new SysMenuDTO();
		String message="成功";
		try {
			result=sysMenuService.update(sysMenuDTO);
		} catch (Exception e) {
			message = e.getMessage();
		}
		return ResponseUtils.res(result,message);
	}

	/**
	 * 根据父节点递归查询所有子节点
	 * @param
	 * @return
	 */
	@ApiOperation("查询菜单树")
	@PostMapping("/list")
	public ResponseEntity<Data<List<SysMenuDTO>>> listSysMenu(@ApiParam(value = "测试数据如下{\n" +
			"\t\n" +
			"\t\"language\":\"zh_CN\",\n" +
			"\t\"parentId\":\"0\"\n" +
			"}")@RequestBody @Valid SysMenuDTO sysMenuDTO) {

		List<SysMenuDTO> list=null;
		String message="查询成功";
		try {
			list=sysMenuService.selectByParentId(sysMenuDTO);
			logger.info("list{}",list);
		} catch (Exception e) {
			logger.info("Exception{}",e.getMessage());
			message="查询失败";
		}
		return ResponseUtils.res(list,message);
	}

	/**
	 * 查询单条菜单信息
	 * @param id
	 * @return
	 */
	@ApiOperation("查询单条菜单信息")
	@GetMapping("/query/{id}")
	public ResponseEntity<Data<SysMenuDTO>> queryOneMenu(@ApiParam(value = "菜单id",example = "1")@PathVariable Long id) {
		SysMenuDTO sysMenu=new SysMenuDTO();
		String message="查询成功";
		try {
			sysMenu=sysMenuService.selectById(id);
		} catch (Exception e) {
			message="查询失败";
		}
		return ResponseUtils.res(sysMenu,message);
	}

	/**
	 * 查询菜单列表
	 * @param
	 * @return
	 */
	@ApiOperation("查询菜单列表")
	@GetMapping("/queryList")
	public ResponseEntity<Data<List<SysMenuDTO> >>  queryListSysMenu() {

		List<SysMenuDTO> list=new ArrayList<>();
		String message="查询成功";
		try {
			list=sysMenuService.selectList();
		} catch (Exception e) {
			message="查询失败";
		}
		return ResponseUtils.res(list,message);
	}

}
