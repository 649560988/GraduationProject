package com.czhand.zsmq.app.service.impl;


import com.czhand.zsmq.api.dto.MessageBaseDTO;
import com.czhand.zsmq.api.dto.MessageSelfDTO;
import com.czhand.zsmq.api.dto.MessageUserDTO;
import com.czhand.zsmq.app.service.MessageBaseService;
import com.czhand.zsmq.domain.MessageBase;
import com.czhand.zsmq.domain.MessageUser;
import com.czhand.zsmq.domain.core.CurrentUser;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.MessageBaseMapper;
import com.czhand.zsmq.infra.mapper.MessageUserMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import com.czhand.zsmq.infra.utils.security.CurrentUserUtils;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 * @author:WANGJING
 * @Date: 2019/1/14 15:38
 */
@Service
public class MessageBaseServiceImpl implements MessageBaseService {
	@Autowired
	private MessageBaseMapper messageBaseMapper;


	@Autowired
	private MessageUserMapper messageUserMapper;

	private final static Logger logger = LoggerFactory.getLogger(MessageBaseServiceImpl.class);


	public Long getUserId() {
		CurrentUser currentUser = CurrentUserUtils.get();
		Long userId = currentUser.getId();
		return userId;
	}


	/**
	 * 创建消息
	 *
	 * @param messageBaseDTO
	 * @return 成功返回1
	 */
	@Transactional(rollbackFor = Exception.class)
	@Override
	public MessageBaseDTO createMessage(MessageBaseDTO messageBaseDTO) throws CommonException {
		MessageBase messageBase=ConvertHelper.convert(messageBaseDTO,MessageBase.class);
		//全员可见
		//获取用户信息
		messageBase.setVersion(1L);
		messageBase.setCreationBy(getUserId());
		messageBase.setUpdateBy(getUserId());
		messageBase.setCreationDate(new Date());
		messageBase.setUpdateDate(new Date());
		messageBase.setIsDel(0);

		int result = messageBaseMapper.insert(messageBase);
		Long Id = messageBase.getId();

		//部分人可见
		if (messageBase.getIsAll() == 0) {
			if (messageBase.getUsers() == null) {
				throw new CommonException("消息可见对象为空");
			}
			try {
				for (Long userId : messageBase.getUsers()) {
					MessageUser messageUser = new MessageUser();
					messageUser.setVersion(1L);
					messageBase.setId(null);
					messageUser.setCreationBy(getUserId());
					messageUser.setUpdateBy(getUserId());
					messageUser.setCreationDate(new Date());
					messageUser.setUpdateDate(new Date());
					messageUser.setIsRead(0);
					messageUser.setMessageId(Id);
					messageUser.setUserId(userId);
					messageUserMapper.insert(messageUser);
				}
			} catch (Exception e) {
				throw new CommonException("添加消息可见人失败");
			}
		}
		if (result != 1) {
			throw new CommonException("插入失败");
		}
		return ConvertHelper.convert(messageBaseMapper.selectByPrimaryKey(Id),MessageBaseDTO.class);

	}

	/**
	 * 更新一条信息
	 *
	 * @param messageBaseDTO
	 * @return
	 */
	@Override
	public MessageBaseDTO update(MessageBaseDTO messageBaseDTO) throws CommonException {
		MessageBase messageBase=ConvertHelper.convert(messageBaseDTO,MessageBase.class);
		MessageBase messageBase1 = messageBaseMapper.selectByPrimaryKey(messageBase);
		int result;
		if (messageBase1 != null) {
			messageBase.setVersion(messageBase1.getVersion() + 1);
			messageBase.setUpdateBy(getUserId());
			messageBase.setUpdateDate(new Date());
			result = messageBaseMapper.updateByPrimaryKeySelective(messageBase);
			if (result != 1) {
				throw new CommonException("修改失败");
			}
		} else {
			throw new CommonException("数据不存在");
		}
		//部分人可见
		if (messageBase.getIsAll() == 0 && messageBase.getUsers() != null) {
			for (Long userId : messageBase.getUsers()) {
				MessageUser messageUser = new MessageUser();
				messageUser.setMessageId(messageBase.getId());
				messageUser.setId(null);
				messageUser.setCreationDate(new Date());
				messageUser.setUpdateDate(new Date());
				messageUser.setUserId(userId);
				messageUser.setCreationBy(getUserId());
				messageUser.setUpdateBy(getUserId());
				messageUser.setIsRead(0);
				MessageUser origin = messageUserMapper.selectByUidAndMid(messageUser);
				if (origin == null) {
					messageUserMapper.insert(messageUser);
				}
			}
			//删除消息不可见者
			HashMap<String, Object> hashMap = new HashMap<>();
			hashMap.put("ids", messageBase.getUsers());
			hashMap.put("messageId", messageBase.getId());
			messageUserMapper.deleteNotIn(hashMap);
		} else {
			messageUserMapper.deleteByMid(messageBase.getId());
			throw new CommonException("消息可见对象为空");
		}
		return ConvertHelper.convert(messageBaseMapper.selectByPrimaryKey(messageBase.getId()),MessageBaseDTO.class);
	}

	@Override
	public MessageBaseDTO delete(Long id) throws CommonException {
		//删除消息
		//int result = messageBaseMapper.deleteByPrimaryKey(id);
		MessageBase messageBase = new MessageBase();
		messageBase.setIsDel(1);
		messageBase.setId(id);
		messageBase.setUpdateBy(getUserId());
		messageBase.setUpdateDate(new Date());
		messageBase.setVersion(messageBaseMapper.selectByPrimaryKey(id).getVersion() + 1);
		int result = messageBaseMapper.updateByPrimaryKeySelective(messageBase);
		//删除关联
		messageUserMapper.deleteByMid(id);
		if (result !=1) {
			throw new CommonException("删除失败");
		}
		return ConvertHelper.convert(messageBaseMapper.selectByPrimaryKey(id),MessageBaseDTO.class);

	}

	@Override
	public PageInfo<MessageBaseDTO> queryAll(int pageNo, int pageSize, String title) {
		PageHelper.startPage(pageNo, pageSize);
		List<MessageBase> list = null;
		list = messageBaseMapper.queryAll(title);
		List<MessageBaseDTO> baseDTOList=ConvertHelper.convertList(list,MessageBaseDTO.class);
		PageInfo<MessageBaseDTO> pageInfo = new PageInfo<>(baseDTOList);
		return pageInfo;
	}


	@Override
	public MessageBaseDTO queryOne(Long id) {
		MessageBase messageBase=messageBaseMapper.selectByPrimaryKey(id);
		List<Long> users=messageUserMapper.selectByMid(id);
		if (users!=null&& messageBase!=null){
			messageBase.setUsers(users);
		}

		return ConvertHelper.convert(messageBase,MessageBaseDTO.class);
	}


	@Override
	public List<MessageSelfDTO> queryAllSelf(String content) {
		//查询所有人可见的消息+自己可见的消息
		List<MessageSelfDTO> list=messageBaseMapper.queryReadAll(content);
		List<MessageSelfDTO> list1=messageBaseMapper.queryContainSelf(getUserId(),content);
		for (MessageSelfDTO messageSelfDTO:list1){
			list.add(messageSelfDTO);
		}
		return list;
	}


	/**
	 * 改变状态为已读
	 * @param messageBaseDTO
	 * @return
	 */
	@Override
	public MessageUserDTO ReadedMessage(MessageBaseDTO messageBaseDTO) {
		MessageBase messageBase=ConvertHelper.convert(messageBaseDTO,MessageBase.class);
		//判断isAll
		MessageUser messageUser = new MessageUser();
		messageUser.setUpdateBy(getUserId());
		messageUser.setUpdateDate(new Date());
		//如果全体可见，就插入一条已读
		if (messageBaseDTO.getIsAll()==1){
		messageUser.setVersion(1L);
		messageBase.setId(null);
		messageUser.setCreationBy(getUserId());
		messageUser.setCreationDate(new Date());
		messageUser.setIsRead(1);
		messageUser.setMessageId(messageBase.getId());
		messageUser.setUserId(getUserId());
		messageUserMapper.insert(messageUser);
		return ConvertHelper.convert(messageUserMapper.selectByPrimaryKey(messageUser.getId()),MessageUserDTO.class);
		}
		//部分可见的只需要改变状态
		messageUser.setIsRead(1);
		messageUser.setUserId(getUserId());
		messageUser.setMessageId(messageBaseDTO.getId());

		int result=messageUserMapper.updateToRead(messageUser);
		if (result != 1) {
			throw new CommonException("更新数据失败！");
		}
		return ConvertHelper.convert(messageUserMapper.selectByUidAndMid(messageUser),MessageUserDTO.class);
	}
}
