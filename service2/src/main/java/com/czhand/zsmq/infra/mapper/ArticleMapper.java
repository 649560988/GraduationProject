package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.Article;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/16 14:22
 * @@Description
 */
@Component
public interface ArticleMapper extends BaseMapper<Article> {
    List<Article> selectAllByPage();
    Integer stopOrStart(Article article);
}
