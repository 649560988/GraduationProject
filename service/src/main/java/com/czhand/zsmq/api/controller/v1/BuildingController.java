package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.BuildingDTO;
import com.czhand.zsmq.app.service.BuildingServices;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.utils.ArgsUtils;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
            buildingDTO=buildingServices.queryOne(id);
        }catch (Exception e){
            e.printStackTrace();
        }
        return ResponseUtils.res(buildingDTO,message);
}
}
