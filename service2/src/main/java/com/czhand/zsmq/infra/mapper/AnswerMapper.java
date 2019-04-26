package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.Answer;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/24 14:04
 * @@Description
 */
@Component
public interface AnswerMapper extends BaseMapper<Answer> {
    List<Answer>selectAllById(@Param("questionId") Long id);
}
