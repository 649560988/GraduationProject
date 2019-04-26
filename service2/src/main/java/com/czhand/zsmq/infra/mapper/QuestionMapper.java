package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.Question;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/24 13:56
 * @@Description
 */
@Component
public interface QuestionMapper extends BaseMapper<Question> {
    List<Question>selectAllByType(@Param("type") Integer type);
    Integer updateOne(Question question);
}
