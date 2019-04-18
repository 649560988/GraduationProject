package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.ArticleDTO;
import com.czhand.zsmq.infra.exception.CommonException;
import com.github.pagehelper.PageInfo;

import java.util.List;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/16 14:23
 * @@Description
 */
public interface ArticleService {
    ArticleDTO createArticle(ArticleDTO articleDTO) throws CommonException;
    PageInfo<ArticleDTO> selectAllByPage(int pageNo, int pageSize)throws CommonException;
    List<ArticleDTO> selectAll() throws  CommonException;
    Integer deleteById(Long id) throws  CommonException;
    ArticleDTO selectOne(Long id)throws CommonException;
    Integer stopOrStart(Long id,Integer isdel)throws CommonException;
}
