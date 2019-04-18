package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.ArticleDTO;
import com.czhand.zsmq.app.service.ArticleService;
import com.czhand.zsmq.domain.Article;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.ArticleMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import com.czhand.zsmq.infra.utils.convertor.ConvertPageHelper;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/16 14:24
 * @@Description
 */
@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
     ArticleMapper articleMapper;
    /**
    *@Description 增加文章
    *@Param [articleDTO]
    *@Return com.czhand.zsmq.api.dto.ArticleDTO
    *@Author wyw
    *@Date 2019/4/16
    *@Time 15:22
    */
    @Override
    public ArticleDTO createArticle(ArticleDTO articleDTO) throws CommonException {
        Article article=ConvertHelper.convert(articleDTO,Article.class);
        article.setCreatedTime(new Date());
        int result=articleMapper.insertSelective(article);
        Long id=article.getId();
        if (result != 1) {
            throw new CommonException("插入失败");
        }
        return ConvertHelper.convert(articleMapper.selectByPrimaryKey(id), ArticleDTO.class);
    }
    /**
    *@Description 分页查询文章
    *@Param [pageNo, pageSize]
    *@Return com.github.pagehelper.PageInfo<com.czhand.zsmq.api.dto.ArticleDTO>
    *@Author wyw
    *@Date 2019/4/17
    *@Time 14:05
    */
    @Override
    public PageInfo<ArticleDTO> selectAllByPage(int pageNo, int pageSize) throws CommonException {
        PageHelper.startPage(pageNo,pageSize);
        Page<Article> buildingPage=buildingPage=(Page)articleMapper.selectAllByPage();
        Page<ArticleDTO> buildingDTOPage=ConvertPageHelper.convertPage(buildingPage,ArticleDTO.class);
        PageInfo<ArticleDTO> pageInfo=new PageInfo<>(buildingDTOPage);
        return pageInfo;
    }
    /**
    *@Description 查询所有文章
    *@Param []
    *@Return java.util.List<com.czhand.zsmq.api.dto.ArticleDTO>
    *@Author wyw
    *@Date 2019/4/17
    *@Time 14:05
    */
    @Override
    public List<ArticleDTO> selectAll() throws CommonException {
        List<Article> list=articleMapper.selectAll();
         return ConvertHelper.convertList(list, ArticleDTO.class);
    }
    /**
    *@Description 删除某条文章
    *@Param [id]
    *@Return java.util.List<com.czhand.zsmq.api.dto.ArticleDTO>
    *@Author wyw
    *@Date 2019/4/17
    *@Time 14:05
    */
    @Override
    public Integer deleteById(Long id) throws CommonException {
        Integer result= articleMapper.deleteByPrimaryKey(id);
        if (result != 1) {
            throw new CommonException("插入失败");
        }
        return result;
    }
    /**
    *@Description
    *@Param [id]
    *@Return com.czhand.zsmq.api.dto.ArticleDTO
    *@Author wyw
    *@Date 2019/4/17
    *@Time 23:07
    */
    @Override
    public ArticleDTO selectOne(Long id) throws CommonException {
        Article article=articleMapper.selectByPrimaryKey(id);
        return ConvertHelper.convert(article, ArticleDTO.class);
    }
    /**
    *@Description
    *@Param [id, isdel]
    *@Return java.lang.Integer
    *@Author wyw
    *@Date 2019/4/17
    *@Time 23:07
    */
    @Override
    public Integer stopOrStart(Long id, Integer isdel) throws CommonException {
        Article article=new Article();
        article.setId(id);
        article.setIsDel(isdel);
        int result=articleMapper.stopOrStart(article);
        if (result !=1){
            throw new CommonException("操作失败");
        }
        return result;
    }
}
