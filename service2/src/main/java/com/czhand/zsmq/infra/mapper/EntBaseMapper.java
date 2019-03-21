package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.EntBase;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface EntBaseMapper extends BaseMapper<EntBase> {

    EntBase queryOne(String organizationalCode);

    List<EntBase> queryAll();

    List<EntBase> queryAllByEntName(String entName);

    int queryExist(EntBase entBase);

    long queryEntId(String organizationalCode);

    EntBase querryEntBaseByUId(Long userId);
    
}