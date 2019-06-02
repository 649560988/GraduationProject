package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.BuildingDTO;
import com.czhand.zsmq.api.dto.SingerReportDTO;
import com.czhand.zsmq.app.service.SignedReportService;
import com.czhand.zsmq.domain.SignedReport;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.SignedReportMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import com.czhand.zsmq.infra.utils.convertor.ConvertPageHelper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import com.github.pagehelper.Page;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * @autor wyw
 * @data 2019/4/10 21:32
 */
@Service
public class SignedReportServicelmpl implements SignedReportService {
    @Autowired
    private SignedReportMapper signedReportMapper;
    /**
    *@Description 添加举报信息
    *@Param [singerReportDTO]
    *@Return java.lang.Integer
    *@Author wyw
    *@Date 2019/4/12
    *@Time 10:07
    */
    @Override
    public Integer InsertSignedReport(SingerReportDTO singerReportDTO,Long againstId,Long informerId,Integer type,Long info_id) throws CommonException {
        SignedReport signedReport=ConvertHelper.convert(singerReportDTO,SignedReport.class);
        signedReport.setUpdatedTime(new Date());
        signedReport.setCreatedTime(new Date());
        signedReport.setAgainstId(againstId);
        signedReport.setInformerId(informerId);
        signedReport.setType(type);
        signedReport.setInfoId(info_id);
        signedReport.setIsResolve(0);
        Integer result=signedReportMapper.insert(signedReport);
        if (result != 1) {
            throw new CommonException("插入失败");
        }
        return result;
    }
    /**
    *@Description 分页查询所有举报信息
    *@Param [pageNo, pageSize]
    *@Return com.github.pagehelper.PageInfo<com.czhand.zsmq.api.dto.SingerReportDTO>
    *@Author wyw
    *@Date 2019/4/12
    *@Time 10:35
    */
    @Override
    public PageInfo<SingerReportDTO> selectAll(int pageNo, int pageSize) {
        PageHelper.startPage(pageNo,pageSize);
        Page<SignedReport> signedReports= (Page)signedReportMapper.selectAllByPage();
        Page<SingerReportDTO> singerReportDTOS=ConvertPageHelper.convertPage(signedReports,SingerReportDTO.class);
        PageInfo<SingerReportDTO> singerReportDTOPageInfo=new PageInfo<>(singerReportDTOS);
        return singerReportDTOPageInfo;
    }

    @Override
    public Integer upDataOne(Long id) {
        Integer result=signedReportMapper.updataOne(id);
        if(result!=1){
            throw new CommonException("插入失败");
        }
        return result;
    }
}
