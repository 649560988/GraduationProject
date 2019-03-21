package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.app.service.SysParamService;
import com.czhand.zsmq.domain.SysParam;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.utils.ArgsUtils;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

/**
 * 参数管理
 *
 * @author 秦玉杰
 */
@RestController
@RequestMapping("/v1/sysParam")
@Api(description = "参数管理API")
public class SysParamController {

    private final static Logger logger = LoggerFactory.getLogger(SysParamController.class);

    @Autowired
    private SysParamService sysParamService;

    /**
     * 新增参数
     *
     * @param sysParam
     * @return
     * */
    @ApiOperation("新增参数")
    @PostMapping("/addParam")
    public ResponseEntity<Data<SysParam>> addSysParam(@RequestBody @Valid @ApiParam("新增对象") SysParam sysParam){
        SysParam result = new SysParam();
        String message = "新建成功";
        if(!ArgsUtils.checkArgsNull(sysParam)){
            if("".equals(sysParam.getParamName().trim()) || "".equals(sysParam.getParamCode().trim())){
                throw new CommonException("参数不正确");
            }else {
                try {
                    result = sysParamService.addSysParam(sysParam);
                }catch (Exception e){
                    message = "新建失败\n" + e.getMessage();
                    return ResponseUtils.res(result, message, HttpStatus.BAD_REQUEST);
                }
            }
        }else {
            throw new CommonException("参数不正确");
        }
        return ResponseUtils.res(result, message, HttpStatus.CREATED);
    }

    /**
     * 删除参数
     *
     * @param id
     * @return
     * */
    @ApiOperation("删除参数")
    @DeleteMapping("/deleteParam/{id}")
    public ResponseEntity<Data<SysParam>> deleteParam(@PathVariable("id") @ApiParam(value = "需要删除的父参数的ID",example = "123") Long id){
        SysParam result = new SysParam();
        String message = "删除成功";
        if(!ArgsUtils.checkArgsNull(id)){
            try {
                result = sysParamService.deleteSysParam(id);
            }catch (Exception e){
                message = "删除失败\n" + e.getMessage();
                return ResponseUtils.res(null, message, HttpStatus.BAD_REQUEST);
            }
        }else {
            throw new CommonException("参数不正确");
        }
        return ResponseUtils.res(null, message, HttpStatus.NO_CONTENT);
    }

    /**
     * 修改参数
     *
     * @param sysParam
     * @retrun
     * */
    @ApiOperation("修改参数")
    @PutMapping("/updateParam")
    public ResponseEntity<Data<SysParam>> updateParam(@RequestBody @Valid @ApiParam("需要更新的对象") SysParam sysParam){
        SysParam result = new SysParam();
        String message = "更新成功";
        if(!ArgsUtils.checkArgsNull(sysParam)){
            try {
                result = sysParamService.updateSysParam(sysParam);
            }catch (Exception e){
                message = "更新失败\n" + e.getMessage();
            }
        }else {
            throw new CommonException("参数不正确");
        }
        return ResponseUtils.res(result, message, HttpStatus.OK);
    }

    /**
     * 查询所有参数
     *
     * @param
     * @return 成功返回对象集合
     * */
    @ApiOperation("查询所有参数")
    @GetMapping("/selectAllParam")
    public ResponseEntity<Data<List<SysParam>>> selectAllParam(){
        List<SysParam> sysParamList = new ArrayList<>();
        String message = "查询成功";
        try {
            sysParamList = sysParamService.selectAllParam();
        }catch (Exception e){
            message = "查询失败\n" + e.getMessage();
        }
        return ResponseUtils.res(sysParamList, message);
    }

    /**
     * 根据父参数ID查询父参数
     *
     * @param id
     * @return 成功返回对象
     * */
    @ApiOperation("根据父参数ID查询父参数")
    @GetMapping("/selectParamById/{id}")
    public ResponseEntity<Data<SysParam>> selectParamById(@PathVariable("id") @ApiParam(value = "父参数的ID",example = "123") Long id){
        SysParam sysParam = new SysParam();
        sysParam.setId(id);
        String message = "查询成功";
        SysParam sysParam1 = new SysParam();
        try {
            sysParam1 = sysParamService.selectParamById(sysParam);
        }catch (Exception e){
            message = "查询失败\n" + e.getMessage();
        }
        return ResponseUtils.res(sysParam1, message);
    }

    /**
     * 根据父参数名称或者父参数编码查询父参数
     *
     * @param sysParam
     * @return 成功返回对象
     * */
    @ApiOperation("根据父参数名称或者父参数编码查询父参数")
    @PostMapping("/selectParamByNameAndCode")
    public ResponseEntity<Data<List<SysParam>>> selectParamByNameAndCode(@RequestBody @Valid @ApiParam("查询条件") SysParam sysParam){
        List<SysParam> sysParamList = new ArrayList<>();
        String message = "查询成功";
        try {
            sysParamList = sysParamService.selectParamByNameAndCode(sysParam);
        }catch (Exception e){
            message = "查询失败\n" + e.getMessage();
        }
        return ResponseUtils.res(sysParamList,message);
    }

}
