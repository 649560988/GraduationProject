package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.RentHouseDTO;
import com.czhand.zsmq.app.service.RentHouseService;
import com.czhand.zsmq.domain.RentHouse;
import com.czhand.zsmq.infra.mapper.RentHouseMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @autor wyw
 * @data 2019/3/11 16:26
 */
@Service
public class RentHouseServicelmpl implements RentHouseService {
    /**
     * 根据id查询
     * */
    @Autowired
    RentHouseMapper rentHouseMapper;

    @Override
    public List<RentHouseDTO> selectOneAndPicture(Long id) {
        List<RentHouse> rentHouses=rentHouseMapper.selectOneAndPicture(id);

        return ConvertHelper.convertList(rentHouses,RentHouseDTO.class);
    }

    /**
     * 查询所有出租房信息
     * */
    @Override
    public List<RentHouseDTO> queryAllRentHouse() {
        List<RentHouse> buildings=rentHouseMapper.queryAllRentHouse();
        return ConvertHelper.convertList(buildings,RentHouseDTO.class);
    }
}
