package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.EntFinance;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.springframework.stereotype.Component;

import java.util.List;


@Component
public interface EntFinanceMapper extends BaseMapper<EntFinance> {

    List<EntFinance> queryFinance(String year);
}
