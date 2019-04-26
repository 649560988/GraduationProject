package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.AnswerDTO;
import com.czhand.zsmq.app.service.AnswerService;
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
 * @data 2019/4/24 14:32
 * @@Description
 */
@Api("回答")
@RestController
@RequestMapping("v1/wyw/answer")
public class AnswerController {
    @Autowired
    private AnswerService answerService;


    @ApiOperation("查询所有答案")
    @GetMapping("/selectAll/{id}")
    public ResponseEntity<Data<List<AnswerDTO>>>selectAllById(@PathVariable("id") Long id){
        if(ArgsUtils.checkArgsNull(id)){
            throw  new CommonException("参数为空");
        }
        List<AnswerDTO> answerDTOList=answerService.selectAllById(id);
        String message="成功";
        return ResponseUtils.res(answerDTOList,message);
    }

    @ApiOperation("增加答案")
    @PostMapping("/insertOne")
    public ResponseEntity<Data<AnswerDTO>>insertOne(@RequestBody AnswerDTO answerDTO){
        if(ArgsUtils.checkArgsNull(answerDTO)){
            throw  new CommonException("参数为空");
        }
        AnswerDTO result=answerService.insertOne(answerDTO);
        String message="成功";
        return ResponseUtils.res(result,message);
    }
}
