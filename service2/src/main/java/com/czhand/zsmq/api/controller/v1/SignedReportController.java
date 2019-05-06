package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.SingerReportDTO;
import com.czhand.zsmq.app.service.SignedReportService;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.utils.ArgsUtils;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import com.github.pagehelper.PageInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/11 22:21
 * @@Description 举报控制器
 */
@Api("举报控制器")
@RestController
@RequestMapping("v1/wyw/signedreport")
public class SignedReportController {
    @Autowired
    private SignedReportService signedReportService;
    /**
    *@Description 增加举报内容
    *@Param SingerReportDTO
    *@Return SingerReportDTO
    *@Author wyw
    *@Date 2019/4/11
    *@Time 22:24
    */
    @ApiOperation("增加举报内容")
    @PostMapping("/InsertSignedReport/{againstId}/{informerId}/{type}/{info_id}")
    public ResponseEntity<Data<Integer>>InsertSignedReport(@RequestBody SingerReportDTO singerReportDTO,
                                                           @PathVariable("againstId") Long againstId,
                                                           @PathVariable("informerId") Long informerId,
                                                           @PathVariable("type") Integer type,
                                                           @PathVariable("info_id") Long info_id
                                                           ){
        if(ArgsUtils.checkArgsNull(singerReportDTO)){
            throw new CommonException("参数为空");
        }
        String message="成功";
        Integer result=signedReportService.InsertSignedReport(singerReportDTO,againstId,informerId,type,info_id);
        return ResponseUtils.res(result,message);
    }
    /**
    *@Description 查询所有举报内容
    *@Param [pageNo, pageSize]
    *@Return org.springframework.http.ResponseEntity<com.czhand.zsmq.infra.utils.web.dto.Data<com.github.pagehelper.PageInfo<com.czhand.zsmq.api.dto.SingerReportDTO>>>
    *@Author wyw
    *@Date 2019/4/12
    *@Time 10:24
    */
    @ApiOperation("查询所有举报内容")
    @GetMapping("/selectAll")
    public  ResponseEntity<Data<PageInfo<SingerReportDTO>>> SelectAll(
            @RequestParam(required = true, name = "pageNo") @ApiParam(value = "分页查询中的参数pageNo",example = "1") int pageNo,
            @RequestParam(required = true, name = "pageSize") @ApiParam(value = "分页查询中的参数pageSize",example = "10") int pageSize
    ){
        PageInfo<SingerReportDTO> singerReportDTOPageInfo=null;
        String message="成功";
        try {
            singerReportDTOPageInfo=signedReportService.selectAll(pageNo, pageSize);
        }catch (Exception e){
            message = "失败";
        }
        return  ResponseUtils.res(singerReportDTOPageInfo,message);
    }
    
}
