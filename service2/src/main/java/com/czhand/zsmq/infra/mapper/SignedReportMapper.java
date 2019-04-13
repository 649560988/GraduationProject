package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.SignedReport;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface SignedReportMapper extends BaseMapper<SignedReport> {
    List<SignedReport> selectAllByPage();
}