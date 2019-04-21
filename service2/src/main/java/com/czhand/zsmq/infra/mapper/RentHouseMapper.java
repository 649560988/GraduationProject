package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.RentHouse;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface RentHouseMapper extends BaseMapper<RentHouse> {
    List<RentHouse> queryAllRentHouse(@Param("type") Integer type);
    RentHouse selectOneAndPicture(Long id);
    List<RentHouse> queryAllRentHouseByArea(String province, String city, String area);
    long lastInsertRentHouseId();
    List<RentHouse>selectAllByPage();
    int stopOrStart(RentHouse rentHouse);
}