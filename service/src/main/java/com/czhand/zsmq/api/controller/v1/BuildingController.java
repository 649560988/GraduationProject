package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.BuildingDTO;
import com.czhand.zsmq.app.service.BuildingServices;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.utils.ArgsUtils;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @autor wyw
 * @data 2019/2/28 9:54
 */
@Api("楼盘信息")
@RestController
@RequestMapping("v1/wyw/building")
public class BuildingController {
    @Autowired
    private BuildingServices buildingServices;

/**
 * 查询单条信息
 * return BuildingDTO
 */
    @ApiOperation("查询单条信息")
    @GetMapping("/{id}")
    public ResponseEntity<Data<BuildingDTO>> queryOne(@PathVariable("id") Long id){
        if(ArgsUtils.checkArgsNull(id)){
            throw  new CommonException("参数为空");
        }
        BuildingDTO buildingDTO=new BuildingDTO();
        String message="查询成功";
        try{
               buildingDTO=buildingServices.selectOneAndPicture(id);
        }catch (Exception e){
            e.printStackTrace();
        }
        return ResponseUtils.res(buildingDTO,message);
 }
 /**
  * 根据地址查询
  * */
 @ApiOperation("根据地址查询楼盘信息")
 @GetMapping("/selectBy/{province}/{city}/{area}")
 public  ResponseEntity<Data<List<BuildingDTO>>> queryAllBuildingByArea(@PathVariable("province")  String province,
                                                                        @PathVariable("city") String city,
                                                                        @PathVariable("area")String area)
 {
     String message="查询成功";
     List<BuildingDTO> list=buildingServices.queryAllBuildingByArea(province,city,area);
     return ResponseUtils.res(list,message);
 }
 /**
  *查询所有楼盘信息
  * */
 @ApiOperation("查询所有楼盘信息")
    @GetMapping("/selectAll")
    public ResponseEntity<Data<List<BuildingDTO>>> queryAllBuilding(){
//     BuildingDTO buildingDTO=new BuildingDTO();
     String message="查询成功";
     List<BuildingDTO> list=buildingServices.queryAllBuilding();
     return ResponseUtils.res(list,message);
 }
 /**
  * 添加楼盘信息
  * */
 @ApiOperation("添加楼盘信息")
    @PostMapping("/createBuilding/{Uid}")
    public ResponseEntity<Data<BuildingDTO>> createBuilding(@RequestBody BuildingDTO buildingDTO,@PathVariable("Uid") Long Uid){
     String message="添加成功";
     buildingDTO=buildingServices.createBuilding( buildingDTO,Uid);
     return ResponseUtils.res(buildingDTO,message);
 }
}

