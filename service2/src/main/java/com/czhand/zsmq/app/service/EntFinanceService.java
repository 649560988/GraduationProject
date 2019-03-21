package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.ent.EntFinanceDTO;
import com.czhand.zsmq.domain.EntFinance;
import com.czhand.zsmq.infra.exception.CommonException;
import com.github.pagehelper.PageInfo;

import java.util.List;

/**
 * @author 秦玉杰
 * @Date 2019/01/29
 * */
public interface EntFinanceService {

    //查询所有企业财税信息
    List<EntFinance> selectAllFinance() throws CommonException;

    //根据企业编号查询财税信息
    List<EntFinance> selectFinanceByEntId(EntFinance entFinance) throws CommonException;

    //分页查询企业财税信息
    PageInfo<EntFinance> queryFinancePage(int pageNo, int pageSize) throws CommonException;

    List<EntFinanceDTO> queryFinance(String year) throws CommonException;
}
