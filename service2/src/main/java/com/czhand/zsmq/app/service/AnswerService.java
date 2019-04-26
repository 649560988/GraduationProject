package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.AnswerDTO;
import com.czhand.zsmq.infra.exception.CommonException;

import java.util.List;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/24 11:13
 * @@Description
 */
public interface AnswerService {
    List<AnswerDTO> selectAllById(Long id)throws CommonException;
    AnswerDTO insertOne(AnswerDTO answerDTO)throws CommonException;
}
