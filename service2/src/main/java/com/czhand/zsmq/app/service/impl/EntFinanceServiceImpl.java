package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.ent.EntFinanceDTO;
import com.czhand.zsmq.app.service.EntFinanceService;
import com.czhand.zsmq.domain.EntBase;
import com.czhand.zsmq.domain.EntFinance;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.EntBaseMapper;
import com.czhand.zsmq.infra.mapper.EntFinanceMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * @author 秦玉杰
 * @Date 2019/01/29
 * */
@Service
public class EntFinanceServiceImpl implements EntFinanceService {

    @Autowired
    private EntFinanceMapper entFinanceMapper;

    @Autowired
    private EntBaseMapper entBaseMapper;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public List<EntFinance> selectAllFinance() throws CommonException {
        return entFinanceMapper.selectAll();
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public List<EntFinance> selectFinanceByEntId(EntFinance entFinance) throws CommonException {
        EntBase entBase = new EntBase();
        entBase.setId(Long.valueOf(entFinance.getEntId()));
        EntBase entBase1 = entBaseMapper.selectByPrimaryKey(entBase);
        if(entBase1 == null){
            throw new CommonException("企业不存在");
        }
        return entFinanceMapper.select(entFinance);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public PageInfo<EntFinance> queryFinancePage(int pageNo, int pageSize) throws CommonException {
        PageHelper.startPage(pageNo, pageSize);
        Page<EntFinance> entFinancePage = (Page) entFinanceMapper.selectAll();
        PageInfo<EntFinance> pageInfo = new PageInfo<>(entFinancePage);
        return pageInfo;
    }

    @Override
    public List<EntFinanceDTO> queryFinance(String year) throws CommonException {
        List<EntFinance> entFinanceList= entFinanceMapper.queryFinance(year);
        return ConvertHelper.convertList(entFinanceList,EntFinanceDTO.class);
    }

}
