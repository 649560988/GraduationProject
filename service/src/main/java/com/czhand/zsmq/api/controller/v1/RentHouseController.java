package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.RentHouseDTO;
import com.czhand.zsmq.app.service.RentHouseService;
import com.czhand.zsmq.domain.RentHouse;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.RentHouseMapper;
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
    /**
     * 根据地区查询
     * */
    @ApiOperation("根据地区查询所有出租房信息")
    @GetMapping("/selectBy")
    public  ResponseEntity<Data<List<RentHouseDTO>>> queryAllBuildingByArea(@PathVariable("province")  String province,
                                                                           @PathVariable("city") String city,
                                                                           @PathVariable("area")String area)
    {
        String message="查询成功";
        List<RentHouseDTO> list=rentHouseService.queryAllRentHouseByArea(province,city,area);
        return ResponseUtils.res(list,message);
    }
    /**
     * 根据id查询
     * */
    @ApiOperation("根据id查询出租房信息")
    @GetMapping("/{id}")
    public  ResponseEntity<Data<RentHouseDTO>> selectOneAndPicture(@PathVariable("id") long id){
        if(ArgsUtils.checkArgsNull(id)){
            throw  new CommonException("参数为空");
        }
        RentHouseDTO rentHouseDTO=new RentHouseDTO();
        String message="添加成功";
        try{
            rentHouseDTO=rentHouseService.selectOneAndPicture(id);
        }catch (Exception e){
            e.printStackTrace();
        }
        return ResponseUtils.res(rentHouseDTO,message);
    }
    /**
     * 添加出租房信息
     * */
    @ApiOperation("添加出租房信息")
    @PostMapping("/createRentHouse")
    public ResponseEntity<Data<RentHouseDTO>> createRentHouse(@RequestBody RentHouseDTO rentHouseDTO){
        String message="添加成功";
        rentHouseDTO=rentHouseService.createRentHouse(rentHouseDTO);
        return ResponseUtils.res(rentHouseDTO,message);
    }
}
