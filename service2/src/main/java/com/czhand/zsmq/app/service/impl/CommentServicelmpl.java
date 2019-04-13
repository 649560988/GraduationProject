package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.CommentDTO;
import com.czhand.zsmq.app.service.CommentService;
import com.czhand.zsmq.domain.Comment;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.CommentMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Method;
import java.util.Date;
import java.util.List;

/**
 * @autor wyw
 * @data 2019/3/19 11:11
 */
@Service
public class CommentServicelmpl implements CommentService {
   /**
   *@Description  查寻当前记录下的评论
   *@Param [type,Bid]
   *@Return List<CommentDTO>
   *@Author wyw
   *@Date 2019/4/11
   *@Time 10:40
   */
    @Autowired
    private CommentMapper commentMapper;
    @Override
    public List<CommentDTO> selectCommentList(Integer type,long Bid) {
        List<Comment> comment=commentMapper.selectCommentList(type,Bid);
        return ConvertHelper.convertList(comment,CommentDTO.class);
    }
    @Override
    public CommentDTO insertComment(long Uid,long Bid,Integer type,String comment) throws CommonException {
        Class<?> aClass=null;
        Comment myComment=null;
        try {
            aClass=Class.forName("com.czhand.zsmq.domain.Comment");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        try {
             myComment=(Comment) aClass.newInstance();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }
        myComment.setUserId(Uid);
        myComment.setBelongId(Bid);
        myComment.setContent(comment);
        myComment.setType(type);
        myComment.setCreatedTime(new Date());
        myComment.setUpdatedTime(new Date());
        int result=commentMapper.insert(myComment);
        if (result !=1){
            throw new CommonException("插入失败");
        }
        return ConvertHelper.convert(myComment,CommentDTO.class);
    }
}
