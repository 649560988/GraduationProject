package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.RentHouseDTO;
import com.czhand.zsmq.app.service.RentHouseService;
import com.czhand.zsmq.domain.RentHouse;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.RentHouseMapper;
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
    public ResponseEntity<Data<List<RentHouseDTO>>> queryAllRentHouse(){
        String message="查询成功";
        List<RentHouseDTO> list=rentHouseService.queryAllRentHouse();
        return ResponseUtils.res(list,message);
    }
    /**
     * 根据地区查询
     * */
    @ApiOperation("根据地区查询所有出租房信息")
    @GetMapping("/selectBy/{province}/{city}/{area}")
    public  ResponseEntity<Data<List<RentHouseDTO>>> queryAllRentHousrByArea(@PathVariable("province")  String province,
                                                                           @PathVariable("city") String city,
                                                                           @PathVariable("area")String area)
    {
        if(ArgsUtils.checkArgsNull(province)){
            throw  new CommonException("参数为空");
        }
        if(ArgsUtils.checkArgsNull(city)){
            throw  new CommonException("参数为空");
        }
        if(ArgsUtils.checkArgsNull(area)){
            throw  new CommonException("参数为空");
        }
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
        String message="查询成功";
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
    @PostMapping("/createRentHouse/{id}")
    public ResponseEntity<Data<RentHouseDTO>> createRentHouse(@RequestBody RentHouseDTO rentHouseDTO,@PathVariable("id") long Uid){
        if(ArgsUtils.checkArgsNull(rentHouseDTO)){
            throw  new CommonException("参数为空");
        }
        if(ArgsUtils.checkArgsNull(Uid)){
            throw  new CommonException("参数为空");
        }
        String message="添加成功";
        rentHouseDTO=rentHouseService.createRentHouse(rentHouseDTO,Uid);
        return ResponseUtils.res(rentHouseDTO,message);
    }
    @ApiOperation("分页查询")
    @GetMapping("selectAllByPage")
    public ResponseEntity<Data<PageInfo<RentHouseDTO>>> selectAllByPage(
            @RequestParam(required = true, name = "pageNo") @ApiParam(value = "分页查询中的参数pageNo",example = "1") int pageNo,
            @RequestParam(required = true, name = "pageSize") @ApiParam(value = "分页查询中的参数pageSize",example = "10") int pageSize
    ){
        PageInfo<RentHouseDTO> rentHouseDTOPageInfo=null;
        String message = "成功";
        try {
            rentHouseDTOPageInfo = rentHouseService.selectAllByPage( pageNo, pageSize);
        } catch (Exception e) {
            message = "失败";

        }
        return ResponseUtils.res(rentHouseDTOPageInfo, message);
    }
    /**
     * 禁用、启用用户
     *
     * @param id    要查询对象的ID
     * @param isdel 是否禁用：禁用为1，启用为0
     * @return 状态是否更新成功
     */
    @ApiOperation("禁用、启用用户")
    @GetMapping("/stopOrStart/{id}/{isdel}")
    public ResponseEntity<Data<Integer>> stopOrStart(@PathVariable("id") @ApiParam(value = "要禁用对象的ID",example = "1") Long id,
                                                     @PathVariable("isdel") @ApiParam(value = "是否禁用，禁用为1，启用为0",example = "1") int isdel) {
        if (ArgsUtils.checkArgsNull(id, isdel)) {
            throw new CommonException("参数不正确");
        }
        int result= 0;
        String message = "成功";
        try{
            result=rentHouseService.stopOrStart(id, isdel);
        }catch (Exception e){
           e.printStackTrace();
        }
        return ResponseUtils.res(result, message);
    }

}
