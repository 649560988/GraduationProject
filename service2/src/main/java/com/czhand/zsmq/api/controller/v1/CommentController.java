package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.CommentDTO;
import com.czhand.zsmq.app.service.CommentService;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.CommentMapper;
import com.czhand.zsmq.infra.utils.ArgsUtils;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.util.List;

/**
 * @autor wyw
 * @data 2019/3/19 11:45
 */
@Api("评论信息")
@RestController
@RequestMapping("v1/wyw/comment")
public class CommentController {
    @Autowired
    private CommentService commentService;
    /**
     * 添加评论
     * return CommentDTO
     */
    @ApiOperation("添加评论")
    @GetMapping("/insertcomment/{Uid}/{Bid}/{type}/{comment}")
   public   ResponseEntity<Data<CommentDTO>> insertComment(
                                                            @PathVariable("Uid") Long Uid,
                                                            @PathVariable("Bid") Long Bid,
                                                            @PathVariable("type") Integer type,
                                                            @PathVariable("comment") String comment
                                                       )
   {
       if(ArgsUtils.checkArgsNull(Uid)){
           throw  new CommonException("参数为空");
       }
       if(ArgsUtils.checkArgsNull(Bid)){
           throw  new CommonException("参数为空");
       }
       if(ArgsUtils.checkArgsNull(type)){
           throw  new CommonException("参数为空");
       }
       if(ArgsUtils.checkArgsNull(comment)){
           throw  new CommonException("参数为空");
       }
     CommentDTO commentDTO= commentService.insertComment(Uid,Bid,type,comment);
       String message="添加成功";
       return ResponseUtils.res(commentDTO,message);
    }
    /**
     * 查询当前页面的评论
     * */
    @ApiOperation("查询当前页面的评论")
    @GetMapping("/selectcommentlist/{type}/{Bid}")
    public ResponseEntity<Data<List<CommentDTO>>> selectCommentList(@PathVariable("type") Integer type,@PathVariable("Bid") Long Bid){
        if(ArgsUtils.checkArgsNull(type)){
            throw new CommonException("参数为空");
        }
        if (ArgsUtils.checkArgsNull(Bid)){
            throw new CommonException("参数为空");
        }
        List<CommentDTO> commentDTO=commentService.selectCommentList(type,Bid);
        String message="成功";
        return ResponseUtils.res(commentDTO,message);
    }
}
