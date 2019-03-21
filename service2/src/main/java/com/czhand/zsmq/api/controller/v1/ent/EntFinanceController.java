package com.czhand.zsmq.api.controller.v1.ent;

import com.czhand.zsmq.api.dto.ent.EntFinanceDTO;
import com.czhand.zsmq.app.service.EntFinanceService;
import com.czhand.zsmq.domain.EntFinance;
import com.czhand.zsmq.infra.exception.CommonException;
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

import java.util.ArrayList;
import java.util.List;

/**
 * @author 秦玉杰
 * @Date 2019/01/29
 */
@RestController
@RequestMapping("/v1/enterprises/finance")
@Api(description = "财税信息维护-控制器")
public class EntFinanceController {

    @Autowired
    private EntFinanceService entFinanceService;

    /**
     * 查询所有企业财税信息
     *
     * @param
     * @return 成功返回对象
     */
    @ApiOperation("查询所有企业财税信息")
    @GetMapping("/selectAllFinance")
    public ResponseEntity<Data<List<EntFinance>>> selectAllFinance() {
        List<EntFinance> entFinanceList = new ArrayList<>();
        try {
            entFinanceList = entFinanceService.selectAllFinance();
        } catch (CommonException e) {
            throw new CommonException(e.getMessage());
        }
        return ResponseUtils.res(entFinanceList);
    }

    /**
     * 根据企业编号查询财税信息
     *
     * @param entId
     * @return 成功返回对象
     */
    @ApiOperation("根据企业编号查询财税信息")
    @GetMapping("/selectFinanceByEntId/{entId}")
    public ResponseEntity<Data<List<EntFinance>>> selectFinanceByEntId(@PathVariable @ApiParam(value = "企业编号", example = "123") String entId) {
        List<EntFinance> entFinanceList = new ArrayList<>();
        EntFinance entFinance = new EntFinance();
        entFinance.setEntId(entId);
        try {
            entFinanceList = entFinanceService.selectFinanceByEntId(entFinance);
        } catch (CommonException e) {
            throw new CommonException(e.getMessage());
        }
        return ResponseUtils.res(entFinanceList);
    }

    /**
     * 分页查询企业财税信息
     *
     * @param pageNo   分页查询参数pageNo
     * @param pageSize 分页查询参数pageSize
     * @return 成功返回对象
     */
    @ApiOperation("根据企业编号查询财税信息")
    @GetMapping("/queryFinancePage")
    public ResponseEntity<Data<PageInfo<EntFinance>>> queryFinancePage(
            @RequestParam(required = true, name = "pageNo") @ApiParam("当前页数") int pageNo,
            @RequestParam(required = true, name = "pageSize") @ApiParam("每页数量") int pageSize) {
        if (ArgsUtils.checkArgsNull(pageNo, pageSize)) {
            throw new CommonException("分页参数为空");
        }

        PageInfo<EntFinance> pageInfo = new PageInfo<>();
        try {
            pageInfo = entFinanceService.queryFinancePage(pageNo, pageSize);
        } catch (CommonException e) {
            throw new CommonException(e.getMessage());
        }
        return ResponseUtils.res(pageInfo);
    }

    @ApiOperation("查询财税信息列表")
    @GetMapping("/queryFinance/{year}")
    public ResponseEntity<Data<List<EntFinanceDTO>>> queryFinance(
            @PathVariable @ApiParam(value = "年份", example = "2019") String year) {
        List<EntFinanceDTO> entFinanceList = null;
        try {
            entFinanceList = entFinanceService.queryFinance(year);
        } catch (CommonException e) {
            throw new CommonException(e.getMessage());
        }

        return ResponseUtils.res(entFinanceList);
    }

}
