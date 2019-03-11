package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.RentHouseDTO;
import com.czhand.zsmq.app.service.RentHouseService;
import com.czhand.zsmq.domain.RentHouse;
import com.czhand.zsmq.infra.mapper.RentHouseMapper;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @autor wyw
 * @data 2019/3/11 16:20
 */
@Api("出租房管理")
@RestController
@RequestMapping("v1/wyw/renthouse")
public class RentHouseController {
    @Autowired
    RentHouseService rentHouseService;
    /**
     *查询所有楼盘信息
     * */
    @ApiOperation("查询所有出租房信息")
    @GetMapping("/selectAll")
    public ResponseEntity<Data<List<RentHouseDTO>>> queryAllBuilding(){
        String message="查询成功";
        List<RentHouseDTO> list=rentHouseService.queryAllRentHouse();
        return ResponseUtils.res(list,message);
    }
}
