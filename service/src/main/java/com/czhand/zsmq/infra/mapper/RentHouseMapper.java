package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.RentHouse;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface RentHouseMapper extends BaseMapper<RentHouse> {
    List<RentHouse> queryAllRentHouse();
    List<RentHouse> selectOneAndPicture(Long id);
}