package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.RentOrderDTO;
import com.czhand.zsmq.app.service.RentOrderService;
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
 * @data 2019/4/30 15:59
 * @@Description
 */
@RestController
@RequestMapping("v1/wyw/rentOrder")
@Api("订单管理")
public class RentOrderController {
    @Autowired
    private RentOrderService rentOrderService;

    @ApiOperation("增加订单")
    @PostMapping("/insertOne")
    public ResponseEntity<Data<Integer>> insertOne(@RequestBody RentOrderDTO rentOrderDTO){
        if(ArgsUtils.checkArgsNull(rentOrderDTO)){
            throw new CommonException("参数为空");
        }
        Integer result=rentOrderService.insertOne(rentOrderDTO);
        String message="成功";
        return ResponseUtils.res(result,message);
    }

    @ApiOperation("查找订单")
    @GetMapping("/sellectAll")
    public ResponseEntity<Data<List<RentOrderDTO>>> sellectAll(){
        List<RentOrderDTO> rentOrderDTOList=rentOrderService.sellectAll();
        String message="成功";
        return  ResponseUtils.res(rentOrderDTOList,message);
    }

    @ApiOperation("跟新订单")
    @GetMapping("/updateOne/{id}/{status}")
    public ResponseEntity<Data<Integer>>updateOne(@PathVariable("id")Long id,@PathVariable("status") Integer status){
        if(ArgsUtils.checkArgsNull(id)){
            throw new CommonException("参数为空");
        }
        if(ArgsUtils.checkArgsNull(status)){
            throw new CommonException("参数为空");
        }
        Integer result=rentOrderService.updateOne(id,status);
        String message="成功";
        return  ResponseUtils.res(result,message);
    }
}
