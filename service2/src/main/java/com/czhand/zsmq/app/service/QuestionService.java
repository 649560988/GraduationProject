package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.QuestionDTO;
import com.czhand.zsmq.domain.Question;
import com.czhand.zsmq.infra.exception.CommonException;

import java.util.List;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/24 11:12
 * @@Description
 */
public interface QuestionService {
    List<QuestionDTO> selectAll(Integer type)throws CommonException;
    Integer InsertOne(QuestionDTO questionDTO)throws  CommonException;
    Integer updateOne(Long id,Integer count)throws  CommonException;
    QuestionDTO selectOne(Long id)throws  CommonException;
}
