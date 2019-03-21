package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.CommentDTO;
import com.czhand.zsmq.infra.exception.CommonException;

/**
 * @autor wyw
 * @data 2019/3/7 16:19
 */
public interface CommentService {
    CommentDTO insertComment(long Uid,long Bid,Integer type,String comment)throws CommonException;
}
