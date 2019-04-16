package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.SingerReportDTO;
import com.czhand.zsmq.domain.SignedReport;
import com.czhand.zsmq.infra.exception.CommonException;
import com.github.pagehelper.PageInfo;

/**
 * @autor wyw
 * @data 2019/3/7 16:20
 */
public interface SignedReportService {
    Integer InsertSignedReport(SingerReportDTO singerReportDTO,Long againstId,Long informerId,Integer type,Long info_id)throws CommonException;
    PageInfo<SingerReportDTO> selectAll(int pageNo, int pageSize);
}
