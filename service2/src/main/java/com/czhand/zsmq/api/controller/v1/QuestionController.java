package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.QuestionDTO;
import com.czhand.zsmq.app.service.QuestionService;
import com.czhand.zsmq.domain.Question;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.utils.ArgsUtils;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/24 14:39
 * @@Description
 */
@Api("问题管理")
@RestController
@RequestMapping("v1/wyw/question")
public class QuestionController {
    @Autowired
    private QuestionService questionService;
    /**
    *@Description
    *@Param [QuestionDTO]
    *@Return org.springframework.http.ResponseEntity<com.czhand.zsmq.infra.utils.web.dto.Data<java.util.List<com.czhand.zsmq.api.dto.QuestionDTO>>>
    *@Author wyw
    *@Date 2019/4/24
    *@Time 14:42
    */
    @ApiOperation("按类别查询所有问题")
    @GetMapping("/selectAll")
    public ResponseEntity<Data<List<QuestionDTO>>> selectAll(@RequestParam(required = false,name = "type")Integer type){
        List<QuestionDTO> questionDTOList=questionService.selectAll(type);
        String message = "成功";
        return ResponseUtils.res(questionDTOList, message);
    }

    /**
    *@Description
    *@Param [questionDTO]
    *@Return org.springframework.http.ResponseEntity<com.czhand.zsmq.infra.utils.web.dto.Data<java.lang.Integer>>
    *@Author wyw
    *@Date 2019/4/25
    *@Time 11:15
    */
    @ApiOperation("增加问题")
    @PostMapping("/insertOne")
    public ResponseEntity<Data<Integer>> InsertOne(@RequestBody QuestionDTO questionDTO){
        if(ArgsUtils.checkArgsNull(questionDTO)){
            throw new CommonException("参数为空");
        }
        Integer result=questionService.InsertOne(questionDTO);
        String message="成功";
        return ResponseUtils.res(result,message);
    }
    /**
    *@Description
    *@Param [id, number]
    *@Return org.springframework.http.ResponseEntity<com.czhand.zsmq.infra.utils.web.dto.Data<java.lang.Integer>>
    *@Author wyw
    *@Date 2019/4/25
    *@Time 14:37
    */
    @ApiOperation("跟新问题回答数量")
    @PutMapping("/updateOne/{id}/{number}")
    public ResponseEntity<Data<Integer>> updateOne(@PathVariable("id")Long id,@PathVariable("number") Integer number){
        if(ArgsUtils.checkArgsNull(id)){
            throw new CommonException("参数为空");
        }
        if(ArgsUtils.checkArgsNull(number)){
            throw new CommonException("参数为空");
        }
        Integer result=questionService.updateOne(id,number);
        String message="成功";
        return ResponseUtils.res(result,message);
    }
    @ApiOperation("查找一条信息")
    @GetMapping("/selectOne/{id}")
    public ResponseEntity<Data<QuestionDTO>> selectOne(@PathVariable("id")Long id){
        if(ArgsUtils.checkArgsNull(id)) {
            throw new CommonException("参数为空");
        }
        QuestionDTO result=questionService.selectOne(id);
        String message="成功";
        return ResponseUtils.res(result,message);
    }
}
