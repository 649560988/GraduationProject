package com.czhand.zsmq.api.controller.v1.ent;

import com.czhand.zsmq.api.dto.ent.EntListDTO;
import com.czhand.zsmq.api.dto.ent.EntListDTO;
import com.czhand.zsmq.app.service.EntListService;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.utils.ArgsUtils;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import com.github.pagehelper.PageInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @author:LVCHENBIN
 * @Date: 2019/1/22 15:18
 */
@RestController
@RequestMapping("/v1/enterprises/list")
@Api(description = "上市企业信息维护-控制器")
public class EntListController {

    @Autowired
    EntListService entListService;

    /**
     * 新增上市企业
     *
     * @param entListDTO
     * @return 成功返回对象
     */
    @ApiOperation("新增上市企业")
    @PostMapping
    public ResponseEntity<Data<EntListDTO>> create(
            @RequestBody @ApiParam("待新建上市企业的实体") EntListDTO entListDTO) {
        //判断参数合法性
        if (ArgsUtils.checkArgsNull(entListDTO)) {
            throw new CommonException("参数为空");
        }

        EntListDTO entListDTO1 = new EntListDTO();
        String message = "新建成功";
        try {
            entListDTO1 = entListService.create(entListDTO);
        } catch (Exception e) {
            message = "新建失败\n" + e.getMessage();
            return ResponseUtils.res(entListDTO1, message, HttpStatus.BAD_REQUEST);     //返回400
        }
        return ResponseUtils.res(entListDTO1, message, HttpStatus.CREATED);    //返回201
    }

    /**
     * 更新上市企业信息
     *
     * @param entListDTO
     * @return 成功返回对象
     */
    @ApiOperation("更新上市企业信息")
    @PutMapping
    public ResponseEntity<Data<EntListDTO>> update(
            @RequestBody @ApiParam("待更新上市企业的实体") EntListDTO entListDTO) {
        //判断参数合法性
        if (ArgsUtils.checkArgsNull(entListDTO)) {
            throw new CommonException("参数为空");
        }

        EntListDTO entListDTO1 = new EntListDTO();
        String message = "更新成功";
        try {
            entListDTO1 = entListService.update(entListDTO);
        } catch (Exception e) {
            message = "更新失败\n" + e.getMessage();
            return ResponseUtils.res(entListDTO1, message, HttpStatus.BAD_REQUEST);     //返回400
        }
        return ResponseUtils.res(entListDTO1, message, HttpStatus.OK);    //返回200
    }

    /**
     * 根据组织机构代码删除上市企业
     *
     * @param organizationalCode
     * @return 成功返回对象
     */
    @ApiOperation("根据组织机构代码删除上市企业")
    @DeleteMapping("/{organizational_code}")
    public ResponseEntity<Data<EntListDTO>> delete(
            @PathVariable("organizational_code")
            @ApiParam("待删除上市企业的组织机构代码") String organizationalCode) {
        //判断参数合法性
        if (ArgsUtils.checkArgsNull(organizationalCode)) {
            throw new CommonException("参数为空");
        }
        EntListDTO entListDTO = new EntListDTO();
        String message = "删除成功";
        try {
            entListDTO = entListService.delete(organizationalCode);
        } catch (Exception e) {
            message = "删除失败\n" + e.getMessage();
            return ResponseUtils.res(null, message, HttpStatus.BAD_REQUEST);
        }
        return ResponseUtils.res(null, message, HttpStatus.NO_CONTENT);
    }

    /**
     * 查询单个上市企业
     *
     * @param organizationalCode
     * @return 成功返回对象
     */
    @ApiOperation("查询单个上市企业")
    @GetMapping("/{organizational_code}")
    public ResponseEntity<Data<EntListDTO>> queryOneEnterprise(
            @PathVariable("organizational_code")
            @ApiParam("待查询上市企业的组织机构代码") String organizationalCode) {
        //参数合法性检查
        if (ArgsUtils.checkArgsNull(organizationalCode)) {
            throw new CommonException("参数为空");
        }

        EntListDTO entList1 = new EntListDTO();
        String message = "查询成功";
        try {
            entList1 = entListService.queryByOrg(organizationalCode);
        } catch (Exception e) {
            message = "查询失败\n" + e.getMessage();
        }

        return ResponseUtils.res(entList1, message);
    }

    /**
     * 查询所有上市企业
     *
     * @param pageNo   分页查询参数pageNo
     * @param pageSize 分页查询参数pageSize
     * @return 成功返回对象
     */
    @ApiOperation("查询所有上市企业，分页")
    @GetMapping
    public ResponseEntity<Data<PageInfo<EntListDTO>>> queryAll(
            @RequestParam(required = true, name = "pageNo") @ApiParam("当前页数") int pageNo,
            @RequestParam(required = true, name = "pageSize") @ApiParam("每页大小") int pageSize) {

        if (ArgsUtils.checkArgsNull(pageNo, pageSize)) {
            throw new CommonException("分页参数为空");
        }

        PageInfo<EntListDTO> pageInfo = null;
        String message = "查询成功";
        try {
            pageInfo = entListService.queryAll(pageNo, pageSize);
        } catch (Exception e) {
            message = "查询失败\n";
            message += e.getMessage();
        }

        return ResponseUtils.res(pageInfo, message);
    }


}
