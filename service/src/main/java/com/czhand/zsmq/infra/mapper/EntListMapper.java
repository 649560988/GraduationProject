package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.EntList;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.springframework.stereotype.Component;

@Component
public interface EntListMapper extends BaseMapper<EntList> {

    EntList selectByEntId(long entId);

}
