package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.RentOrder;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface RentOrderMapper extends BaseMapper<RentOrder> {
    List<RentOrder> selectAllByStatus(@Param("status") Integer status);
    RentOrder upData( RentOrder rentOrder);
}