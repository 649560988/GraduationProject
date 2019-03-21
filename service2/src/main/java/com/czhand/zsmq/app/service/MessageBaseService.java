package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.MessageBaseDTO;
import com.czhand.zsmq.api.dto.MessageSelfDTO;
import com.czhand.zsmq.api.dto.MessageUserDTO;
import com.czhand.zsmq.domain.MessageBase;
import com.czhand.zsmq.infra.exception.CommonException;
import com.github.pagehelper.PageInfo;

import java.util.List;

/**
 * @author:WANGJING
 * @Date: 2019/1/14 15:37
 */
public interface MessageBaseService {

	/**
	 * 创建消息
	 * @param messageBaseDTO
	 * @return 成功实体
	 */
	MessageBaseDTO createMessage(MessageBaseDTO messageBaseDTO) throws CommonException;

	/**
	 * 更新一条信息
	 * @param messageBaseDTO
	 * @return
	 */
	MessageBaseDTO update(MessageBaseDTO messageBaseDTO) throws CommonException;

	/**
	 * 删除一条信息
	 * @param id
	 * @return true
	 */
	MessageBaseDTO  delete(Long id) throws CommonException;


	/**
	 *分页查询全部，模糊查询title
	 * @param pageNo
	 * @param pageSize
	 * @param title
	@return true
	 */
	PageInfo<MessageBaseDTO> queryAll(int pageNo, int pageSize, String title);



	/**
	 * 查询单条信息
	 * @param id
	 * @return MessageBaseDTO
	 */
	MessageBaseDTO queryOne(Long id);


	/**
	 * 查询当前用户的信息列表
	 * @param
	 * @return List<MessageSelfDTO>
	 */
	List<MessageSelfDTO> queryAllSelf(String content);

	/**
	 * 改变状态为已读
	 * @param messageBaseDTO
	 * @return
	 */
	MessageUserDTO ReadedMessage(MessageBaseDTO messageBaseDTO);
}
