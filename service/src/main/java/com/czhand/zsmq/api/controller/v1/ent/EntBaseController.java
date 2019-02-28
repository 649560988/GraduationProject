package com.czhand.zsmq.api.controller.v1.ent;

import com.czhand.zsmq.api.dto.ent.EntBaseDTO;
import com.czhand.zsmq.app.service.EntBaseService;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

/**
 * @author:LVCHENBIN
 * @Date: 2019/1/22 15:18
 */
@RestController
@RequestMapping("/v1/enterprises/base")
@Api(description = "企业基础信息维护-控制器")
public class EntBaseController {

    @Autowired
    private EntBaseService entBaseService;

    /**
     * 创建企业
     *
     * @param entBase
     * @return 成功返回对象
     */
    @ApiOperation("新建企业")
    @PostMapping
    public ResponseEntity<Data<EntBaseDTO>> createEnterprise(
            @RequestBody @ApiParam("待新建企业的实体") EntBaseDTO entBase) {
        //判断参数合法性
        if (ArgsUtils.checkArgsNull(entBase)) {
            throw new CommonException("参数为空");
        }

        EntBaseDTO entBase1 = new EntBaseDTO();
        String message = "新建成功";
        try {
            entBase1 = entBaseService.createEnterprise(entBase);
        } catch (Exception e) {
            message = "新建失败\n" + e.getMessage();
            return ResponseUtils.res(entBase1, message, HttpStatus.BAD_REQUEST);     //返回400
        }
        return ResponseUtils.res(entBase1, message, HttpStatus.CREATED);    //返回201
    }

    /**
     * 更新企业
     *
     * @param entBase
     * @return 成功返回对象
     */
    @ApiOperation("更新企业信息")
    @PutMapping
    public ResponseEntity<Data<EntBaseDTO>> updateEnterprise(
            @RequestBody @ApiParam("待更新企业的实体") EntBaseDTO entBase) {
        //参数合法性检查
        if (ArgsUtils.checkArgsNull(entBase)) {
            throw new CommonException("参数为空");
        }

        EntBaseDTO entBase1 = new EntBaseDTO();
        String message = "更新成功";
        try {
            entBase1 = entBaseService.updateEnterprise(entBase);
        } catch (Exception e) {
            message = "更新失败\n" + e.getMessage();
        }

        return ResponseUtils.res(entBase1, message, HttpStatus.OK);
    }


    /**
     * 根据组织机构代码删除企业
     *
     * @param organizationalCode
     * @return 成功返回对象
     */
    @ApiOperation("删除企业")
    @DeleteMapping("/{organizational_code}")
    public ResponseEntity<Data<EntBaseDTO>> deleteEnterprise(
            @PathVariable("organizational_code")
            @ApiParam(value = "企业的组织机构代码", example = "21627366") String organizationalCode) {
        //参数合法性检查
        if (ArgsUtils.checkArgsNull(organizationalCode)) {
            throw new CommonException("参数为空");
        }

        EntBaseDTO entBase1 = new EntBaseDTO();
        String message = "删除成功";
        try {
            entBase1 = entBaseService.deleteEnterprise(organizationalCode);
        } catch (Exception e) {
            message = "删除失败\n" + e.getMessage();
            return ResponseUtils.res(null, message, HttpStatus.BAD_REQUEST);
        }
        return ResponseUtils.res(null, message, HttpStatus.NO_CONTENT);
    }

    /**
     * 查询单个企业
     *
     * @param organizationalCode
     * @return 成功返回对象
     */
    @ApiOperation("查询企业")
    @GetMapping("/{organizational_code}")
    public ResponseEntity<Data<EntBaseDTO>> queryOneEnterprise(
            @PathVariable("organizational_code")
            @ApiParam("企业的组织机构代码") String organizationalCode) {
        //参数合法性检查
        if (ArgsUtils.checkArgsNull(organizationalCode)) {
            throw new CommonException("参数为空");
        }

        EntBaseDTO entBase1 = new EntBaseDTO();
        String message = "查询成功";
        try {
            entBase1 = entBaseService.queryOneEnterprise(organizationalCode);
        } catch (Exception e) {
            message = "查询失败\n" + e.getMessage();
        }

        return ResponseUtils.res(entBase1, message);
    }

    /**
     * 查询所有企业(未删除)
     *
     * @param pageNo   分页查询参数pageNo
     * @param pageSize 分页查询参数pageSize
     * @return 成功返回对象
     */
    @ApiOperation("查询所有未删除企业，分页")
    @GetMapping
    public ResponseEntity<Data<PageInfo<EntBaseDTO>>> queryAllEnterprise(
            @RequestParam(required = true, name = "pageNo") @ApiParam("当前页数") int pageNo,
            @RequestParam(required = true, name = "pageSize") @ApiParam("每页大小") int pageSize) {

        if (ArgsUtils.checkArgsNull(pageNo, pageSize)) {
            throw new CommonException("分页参数为空");
        }

        PageInfo<EntBaseDTO> pageInfo = new PageInfo<>();
        String message = "查询成功";
        try {
            pageInfo = entBaseService.queryAllEnterprise(pageNo, pageSize);
        } catch (Exception e) {
            message = "查询失败\n";
            message += e.getMessage();
        }

        return ResponseUtils.res(pageInfo, message);
    }

    /**
     * 查询企业(未删除)
     *
     * @param entName  企业名称
     * @param pageNo   分页查询参数
     * @param pageSize 分页查询参数
     * @return 成功返回对象
     */
    @ApiOperation("查询未删除企业，by企业名称模糊匹配，分页")
    @GetMapping("/{ent_name}")
    public ResponseEntity<Data<PageInfo<EntBaseDTO>>> queryAllByName(
            @PathVariable("ent_name") @ApiParam("企业名称") String entName,
            @RequestParam(required = true, name = "pageNo") @ApiParam("当前页数") int pageNo,
            @RequestParam(required = true, name = "pageSize") @ApiParam("每页大小") int pageSize) {
        //参数合法性检查
        if (ArgsUtils.checkArgsNull(entName, pageNo, pageSize)) {
            throw new CommonException("查询必要的参数为空");
        }

        PageInfo<EntBaseDTO> pageInfo = new PageInfo<>();
        String message = "查询成功";
        try {
            pageInfo = entBaseService.queryAllByEntName(entName, pageNo, pageSize);
        } catch (Exception e) {
            message = "查询失败\n";
            message += e.getMessage();
        }

        return ResponseUtils.res(pageInfo, message);
    }

    /**
     * 查询企业是否已存在
     *
     * @param entBase
     * @return 成功返回对象
     */
    @ApiOperation("查询企业是否已存在")
    @PostMapping("/queryExist")
    public ResponseEntity<Data<EntBaseDTO>> queryExistEnterprise(
            @RequestBody @Valid @ApiParam("查询企业的实体") EntBaseDTO entBase) {

        if (ArgsUtils.checkArgsNull(entBase)) {
            throw new CommonException("参数为空");
        }

        EntBaseDTO entBase1 = new EntBaseDTO();
        boolean result;
        String message;
        try {
            result = entBaseService.queryExistEnterprise(entBase);
            entBase1 = entBaseService.queryOneEnterprise(entBase.getOrganizationalCode());
            message = "查询成功，是否存在的结果为：" + result;
        } catch (Exception e) {
            message = "查询失败\n";
            message += e.getMessage();
        }

        return ResponseUtils.res(entBase1, message);
    }

    /**
     * 查询企业ID
     *
     * @param organizationalCode
     * @return entId
     */
    @ApiOperation("查询企业ID")
    @GetMapping("/entids/{organizational_code}")
    public ResponseEntity<Data<Long>> queryEntId(
            @PathVariable("organizational_code")
            @ApiParam("待查询企业的组织机构代码") String organizationalCode) {
        //参数合法性检查
        if (ArgsUtils.checkArgsNull(organizationalCode)) {
            throw new CommonException("组织机构代码参数为空");
        }

        long entId = 0L;
        String message = "查询成功";
        try {
            entId = entBaseService.queryEntId(organizationalCode);
        } catch (Exception e) {
            message = "查询失败\n" + e.getMessage();
        }

        return ResponseUtils.res(entId, message);
    }

    /**
     * TODO
     * excel批量导入企业
     *
     * @param excl
     * @return 成功返回对象
     */
    @ApiOperation("excel批量导入企业")
    @PostMapping(value = "/exclImport")
    public ResponseEntity<Data<List<EntBaseDTO>>> importExcl(
            @RequestParam("file")
            @ApiParam("导入excel文件") MultipartFile excl) {
//        ResponseEntity<Data<EntBaseDTO>> result = new ResponseEntity<Data<EntBaseDTO>>();
//
//        if (!excl.isEmpty()) {//说明文件不为空
//            try {
//                String fileName = excl.getOriginalFilename();
//                InputStream is = excl.getInputStream();//转化为流的形式
//                List<EntBaseDTO> listMer = new ArrayList<>();
//                List<Row> list = ExcelUtil.getExcelRead(fileName, is, true);
//                //首先是读取行 也就是一行一行读，然后在取到列，遍历行里面的行，根据行得到列的值
//                for (Row row : list) {
//                    /****************得到每个元素的值start**********************/
//                    Cell cell_0 = row.getCell(0);
//                    Cell cell_1 = row.getCell(1);
//                    Cell cell_2 = row.getCell(2);
//                    Cell cell_3 = row.getCell(3);
//                    /*****************得到每个元素的值end**********************/
//                    /******************解析每个元素的值start*******************/
//                    //得到列的值，也就是你需要解析的字段的值
//                    String bookName = ExcelUtil.getValue(cell_0);
//                    String editor = ExcelUtil.getValue(cell_1);
//                    String express = ExcelUtil.getValue(cell_2);
//                    String version = ExcelUtil.getValue(cell_3);
//                    /******************解析每个元素的值end*******************/
//                    /****************将读取出来的数值进行包装start***********/
//                    EntBaseDTO entBase = new EntBaseDTO();
//                    entBase.setName(bookName);
//                    entBase.setAuthor(editor);
//                    entBase.setPress(express);
//                    entBase.setEdition(version);
//                    entBase.setStatus("1");
//                    entBase.setExtend1(DateUtil.getCurDateStr());
//                    listMer.add(entBase);
//                    /**************将读取出来的数值进行包装end**************/
//                }
//                if (listMer.size() > 0) {
//                    for (EntBaseDTO item : listMer) {
//                    }
//                }
//                result.setSuccess(true);
//                result.setSuccessMessage("导入成功！");
//            } catch (Exception e) {
//                e.printStackTrace();
//                result.setSuccess(false);
//                result.setErrorMessage("导入出现异常！");
//            }
//        } else {
//            result.setSuccess(false);
//            result.setErrorMessage("导入的文件为空！");
//        }
        List<EntBaseDTO> result = new ArrayList<>();
        return ResponseUtils.res(result, "批量导入企业数据成功");
    }

}
