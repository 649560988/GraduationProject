package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.api.dto.MessageSelfDTO;
import com.czhand.zsmq.domain.MessageBase;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface MessageBaseMapper extends BaseMapper<MessageBase> {
    List<MessageBase> queryAll(@Param("title") String title);

	List<MessageSelfDTO> queryReadAll(@Param("content")String content);

	List<MessageSelfDTO> queryContainSelf(@Param("userId")Long userId,@Param("content")String content);
}