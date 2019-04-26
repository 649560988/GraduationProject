package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.AnswerDTO;
import com.czhand.zsmq.app.service.AnswerService;
import com.czhand.zsmq.domain.Answer;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.AnswerMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/24 11:12
 * @@Description
 */
@Service
public class AnswerServiceImpl implements AnswerService {
    @Autowired
    private AnswerMapper answerMapper;

    @Override
    public List<AnswerDTO> selectAllById(Long id) throws CommonException {
        List<Answer> answerList=answerMapper.selectAllById(id);
        return ConvertHelper.convertList(answerList,AnswerDTO.class);
    }

    @Override
    public AnswerDTO insertOne(AnswerDTO answerDTO) throws CommonException {
        Answer answer=ConvertHelper.convert(answerDTO,Answer.class);
        answer.setCreatedTime(new Date());
        Integer result=answerMapper.insert(answer);
//        Long id=answer.
        if(result != 1){
            throw  new CommonException("增加失败");
        }
        return ConvertHelper.convert(answer,AnswerDTO.class);
    }
}
