package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.MessageUser;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;

@Component
public interface MessageUserMapper extends BaseMapper<MessageUser> {
	MessageUser selectByUidAndMid(MessageUser messageUser);

	int  deleteNotIn(HashMap<String,Object> map);

	int deleteByMid(Long id);

	int insertNew(MessageUser messageUser);

	List<Long> selectByMid(Long messageId);

	int updateToRead(MessageUser messageUser);
}