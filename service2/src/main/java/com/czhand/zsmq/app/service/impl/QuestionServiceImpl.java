package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.QuestionDTO;
import com.czhand.zsmq.app.service.QuestionService;
import com.czhand.zsmq.domain.Question;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.QuestionMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/24 14:56
 * @@Description
 */
@Service
public class QuestionServiceImpl implements QuestionService {
    @Autowired
    private QuestionMapper questionMapper;
    /**
    *@Description
    *@Param [Integer type]
    *@Return java.util.List<com.czhand.zsmq.api.dto.QuestionDTO>
    *@Author wyw
    *@Date 2019/4/24
    *@Time 15:15
    */
    @Override
    public List<QuestionDTO> selectAll(Integer type) throws CommonException {
        List<Question> questionList=null;
        if (type==null || ("").equals(type)){
            questionList=questionMapper.selectAll();
        }else {
            questionList=questionMapper.selectAllByType(type);
        }
        return ConvertHelper.convertList(questionList, QuestionDTO.class);
    }

    /**
    *@Description
    *@Param [questionDTO]
    *@Return java.lang.Integer
    *@Author wyw
    *@Date 2019/4/24
    *@Time 15:15
    */
    @Override
    public Integer InsertOne(QuestionDTO questionDTO) throws CommonException {
        Question question =ConvertHelper.convert(questionDTO,Question.class);
        question.setCreatedTime(new Date());
        question.setCountAnswer(0);
        Integer result=questionMapper.insert(question);
        if(result != 1){
            throw  new CommonException("增加失败");
        }
        return result;
    }

    @Override
    public Integer updateOne(Long id, Integer count) throws CommonException {
        Question question=new Question();
        question.setId(id);
        question.setCountAnswer(++count);
        Integer result=questionMapper.updateOne(question);
        return result;
    }

    @Override
    public QuestionDTO selectOne(Long id) throws CommonException {
        Question question=questionMapper.selectByPrimaryKey(id);
        return ConvertHelper.convert(question,QuestionDTO.class);
    }
}
