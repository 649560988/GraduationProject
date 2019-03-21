package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.app.service.SysParamChildrenService;
import com.czhand.zsmq.domain.SysParamChildren;
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
 * 子参数管理
 *
 * @author 秦玉杰
 */
@RestController
@RequestMapping("/v1/sysParamChildren")
@Api(description = "子参数管理API")
public class SysParamChildrenController {

    private final static Logger logger = LoggerFactory.getLogger(SysParamChildrenController.class);

    @Autowired
    private SysParamChildrenService sysParamChildrenService;

    /**
     * 新增子参数
     *
     * @param sysParamChildren
     * @return
     * */
    @ApiOperation("新增子参数")
    @PostMapping("/addParamChild")
    public ResponseEntity<Data<SysParamChildren>> addParamChild(@RequestBody @Valid @ApiParam("新增对象") SysParamChildren sysParamChildren){
        SysParamChildren result = new SysParamChildren();
        String message = "新建成功";
        if(!ArgsUtils.checkArgsNull(sysParamChildren)){
            if("".equals(sysParamChildren.getParamName().trim()) || "".equals(sysParamChildren.getParamCode().trim())
                    || "".equals(sysParamChildren.getSysParamId().trim())){
                throw new CommonException("参数不正确");
            }else {
                try {
                    result = sysParamChildrenService.addSysParamChild(sysParamChildren);
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
     * 删除子参数
     *
     * @param id
     * @return
     * */
    @ApiOperation("删除子参数")
    @DeleteMapping("/deleteParamChild/{id}")
    public ResponseEntity<Data<SysParamChildren>> deleteParamChild(@PathVariable("id") @ApiParam(value = "需要删除的子参数的ID",example = "123") Long id){
        SysParamChildren result = new SysParamChildren();
        String message = "删除成功";
        if(!ArgsUtils.checkArgsNull(id)){
            try {
                result = sysParamChildrenService.deleteSysParamChild(id);
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
     * 修改子参数
     *
     * @param sysParamChildren
     * @retrun
     * */
    @ApiOperation("修改子参数")
    @PutMapping("/updateParamChild")
    public ResponseEntity<Data<SysParamChildren>> updateParamChild(@RequestBody @Valid @ApiParam("需要更新的对象") SysParamChildren sysParamChildren){
        SysParamChildren result = new SysParamChildren();
        String message = "更新成功";
        if(!ArgsUtils.checkArgsNull(sysParamChildren)){
            try {
                result = sysParamChildrenService.updateSysParamChild(sysParamChildren);
            }catch (Exception e){
                message = "更新失败\n" + e.getMessage();
            }
        }else {
            throw new CommonException("参数不正确");
        }
        return ResponseUtils.res(result, message, HttpStatus.OK);
    }

    /**
     * 查询所有子参数
     *
     * @param
     * @return
     * */
    @ApiOperation("查询所有子参数")
    @GetMapping("/selectAllParamChild")
    public ResponseEntity<Data<List<SysParamChildren>>> selectAllParamChild(){
        List<SysParamChildren> sysParamChildrenList = new ArrayList<>();
        String message = "查询成功";
        try {
            sysParamChildrenList = sysParamChildrenService.selectAllParamChild();
        }catch (Exception e){
            message = "查询失败\n" + e.getMessage();
        }
        return ResponseUtils.res(sysParamChildrenList,message);
    }

    /**
     * 根据ID查询子参数
     *
     * @param
     * @return
     * */
    @ApiOperation("根据父参数ID查询子参数")
    @GetMapping("/getChildParam/{id}")
    public ResponseEntity<Data<List<SysParamChildren>>> getChildParam(@PathVariable("id") @ApiParam(value = "父参数的ID",example = "123") Long id){
        List<SysParamChildren> sysParamChildrenList = new ArrayList<>();
        String message = "查询成功";
        if(!ArgsUtils.checkArgsNull(id)){
            try {
                sysParamChildrenList = sysParamChildrenService.getChildParam(id);
            }catch (Exception e){
                message = "查询失败\n" + e.getMessage();
            }
        }else {
            throw new CommonException("参数不正确");
        }
        return ResponseUtils.res(sysParamChildrenList, message);
    }

    /**
     * 根据父参数ID和子参数名称查询子参数信息
     *
     * @param
     * @return
     * */
    @ApiOperation("根据父参数ID和子参数名称查询子参数信息")
    @PostMapping("/selectChildParamByIdAndName")
    public ResponseEntity<Data<List<SysParamChildren>>> selectChildParamByIdAndName(@RequestBody @Valid @ApiParam("查询条件") SysParamChildren sysParamChildren){
        List<SysParamChildren> paramChildrenList = new ArrayList<>();
        String message = "查询成功";
        if (!ArgsUtils.checkArgsNull(sysParamChildren)){
            try {
                paramChildrenList = sysParamChildrenService.selectChildParamByIdAndName(sysParamChildren);
            }catch (Exception e){
                message = "查询失败\n" + e.getMessage();
            }
        }else {
            throw new CommonException("参数不正确");
        }
        return ResponseUtils.res(paramChildrenList, message);
    }

}
