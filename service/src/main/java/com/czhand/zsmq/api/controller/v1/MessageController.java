package com.czhand.zsmq.api.controller.v1;


import com.czhand.zsmq.api.dto.MessageBaseDTO;
import com.czhand.zsmq.api.dto.MessageSelfDTO;
import com.czhand.zsmq.api.dto.MessageUserDTO;
import com.czhand.zsmq.app.service.MessageBaseService;
import com.czhand.zsmq.domain.MessageBase;
import com.czhand.zsmq.domain.SysMenu;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.utils.ArgsUtils;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import com.github.pagehelper.PageInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import java.util.ArrayList;
import java.util.List;

/**
 * @author:WANGJING
 * @Date: 2019/1/14 15:18
 */
@Api(description = "消息API")
@RestController
@RequestMapping("/v1/message")
public class MessageController {
	@Autowired
	private MessageBaseService messageBaseService;

	private final static Logger logger = LoggerFactory.getLogger(MessageController.class);

	/**
	 * 创建消息
	 * @param messageBaseDTO
	 * @return 成功返回对象
	 */
	@ApiOperation("创建消息")
	@PostMapping("/create")
	public ResponseEntity<Data<MessageBaseDTO>> createMessage(@RequestBody @Valid MessageBaseDTO messageBaseDTO) {

		//判断参数是否为空
		if (ArgsUtils.checkArgsNull(messageBaseDTO)){
			throw new CommonException("参数不正确");
		}
		MessageBaseDTO messageBase1=new MessageBaseDTO();
		String message="成功";
		try {
			messageBase1=messageBaseService.createMessage(messageBaseDTO);
		} catch (Exception e) {
			message = e.getMessage();
		}
		return ResponseUtils.res(messageBase1,message);
	}

	/**
	 * 更新信息
	 * @param messageBaseDTO
	 * @return
	 */
	@ApiOperation("更新信息")
	@PostMapping("/update")
	public ResponseEntity<Data<MessageBaseDTO>> updateMessage(@RequestBody @Valid MessageBaseDTO messageBaseDTO) {
		//判断参数是否为空
		if (ArgsUtils.checkArgsNull(messageBaseDTO)){
			throw new CommonException("参数不正确");
		}
		MessageBaseDTO messageBase1=new MessageBaseDTO();
		String message="成功";
		try {
			messageBase1=messageBaseService.update(messageBaseDTO);
		} catch (Exception e) {
			e.printStackTrace();
			message = e.getMessage();
		}
		return ResponseUtils.res(messageBase1,message);
	}


	/**
	 * 删除一条信息
	 * @param id
	 * @return
	 */
	@ApiOperation("删除一条信息")
	@GetMapping("/delete/{id}")
	public ResponseEntity<Data<MessageBaseDTO>> updateMessage(@PathVariable("id") Long id) {
		//判断参数是否为空
		if (ArgsUtils.checkArgsNull(id)){
			throw new CommonException("参数不正确");
		}
		MessageBaseDTO messageBase1=new MessageBaseDTO();
		String message="成功";
		try {
			messageBase1=messageBaseService.delete(id);
		} catch (Exception e) {
			message = e.getMessage();
		}
		return ResponseUtils.res(messageBase1,message);
	}


	/**
	 * 1.分页查询 2.根据title模糊查询
	 *
	 * @param title 标题
	 * @param pageNo   分页查询中的参数pageNo
	 * @param pageSize 分页查询中的参数pageSize
	 * @return 列表数据
	 */
	@ApiOperation("分页查询,根据title模糊查询")
	@GetMapping("/queryAll")
	public ResponseEntity<Data< PageInfo<MessageBaseDTO>>>  queryAll(
			@RequestParam(required = false, name = "title") String title,
			@RequestParam(required = true, name = "pageNo") int pageNo,
			@RequestParam(required = true, name = "pageSize") int pageSize
	) {

		if (ArgsUtils.checkArgsNull(pageNo, pageSize)) {
			throw new CommonException("参数不正确");
		}
		  PageInfo<MessageBaseDTO> pageInfo = new PageInfo<MessageBaseDTO>();
		String message="成功";
		try {
			pageInfo=messageBaseService.queryAll(pageNo,pageSize,title);
		} catch (Exception e) {
			message = e.getMessage();

		}
		return ResponseUtils.res(pageInfo,message);
	}




	/**
	 * 查询单条信息
	 * @param id
	 * @return MessageBaseDTO
	 */
	@ApiOperation("查询单条信息")
	@PostMapping("/{id}")
	public ResponseEntity<Data<MessageBaseDTO>> queryOneMessage(@PathVariable("id") Long id) {
		//判断参数是否为空
		if (ArgsUtils.checkArgsNull(id)){
			throw new CommonException("参数不正确");
		}
		MessageBaseDTO messageBase1=new MessageBaseDTO();
		String message="成功";
		try {
			messageBase1=messageBaseService.queryOne(id);
		} catch (Exception e) {
			e.printStackTrace();
			message = e.getMessage();
		}
		return ResponseUtils.res(messageBase1,message);
	}



	/**
	 * 查询自己的消息列表
	 * @return 列表数据
	 */
	@ApiOperation("查询自己的消息列表")
	@GetMapping("/queryAllSelf")
	public ResponseEntity<Data<List<MessageSelfDTO>>>  queryAllSelf(@RequestParam(required = false, name = "content") @ApiParam("搜索字段") String content) {

		List<MessageSelfDTO> pageInfo = new ArrayList<>();
		String message="成功";
		try {
			pageInfo=messageBaseService.queryAllSelf(content);
		} catch (Exception e) {
			e.printStackTrace();
			message = e.getMessage();

		}
		return ResponseUtils.res(pageInfo,message);
	}



	/**
	 * 改变状态为已读
	 * @param messageBaseDTO
	 * @return
	 */
	@ApiOperation("改变状态为已读信息")
	@PostMapping("/readed")
	public ResponseEntity<Data<MessageUserDTO>> ReadedMessage(@ApiParam(defaultValue = "{\n" +
			"    \n" +
			"      \"id\":1,\n" +
			"      \"isAll\": 0,}") @RequestBody @Valid MessageBaseDTO messageBaseDTO) {
		//判断参数是否为空
		if (ArgsUtils.checkArgsNull(messageBaseDTO)){
			throw new CommonException("参数不正确");
		}
		MessageUserDTO messageBase1=new MessageUserDTO();
		String message="成功";
		try {
			messageBase1=messageBaseService.ReadedMessage(messageBaseDTO);
		} catch (Exception e) {
			e.printStackTrace();
			message = e.getMessage();
		}
		return ResponseUtils.res(messageBase1,message);
	}
}
