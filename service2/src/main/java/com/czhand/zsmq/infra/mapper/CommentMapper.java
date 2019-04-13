package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.Comment;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface CommentMapper extends BaseMapper<Comment> {
    List<Comment> selectCommentList(@Param("type") Integer type,@Param("Bid")Long Bid);
}