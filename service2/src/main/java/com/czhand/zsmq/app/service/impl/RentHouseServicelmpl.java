package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.RentHouseDTO;
import com.czhand.zsmq.app.service.RentHouseService;
import com.czhand.zsmq.domain.RentHouse;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.RentHouseMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
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
    public RentHouseDTO selectOneAndPicture(Long id) {
       RentHouse rentHouse=rentHouseMapper.selectOneAndPicture(id);

        return ConvertHelper.convert(rentHouse,RentHouseDTO.class);
    }

    @Override
    public RentHouseDTO createRentHouse(RentHouseDTO rentHouseDTO,long Uid) {
        RentHouse rentHouse=ConvertHelper.convert(rentHouseDTO,RentHouse.class);
        rentHouse.setUserId(Uid);
        rentHouse.setCreatedTime(new Date());
        rentHouse.setUpdatedTime(new Date());
        int result=rentHouseMapper.insert(rentHouse);
        return  null;
    }

    @Override
    public List<RentHouseDTO> queryAllRentHouseByArea(String province, String city, String area) throws CommonException {
        List<RentHouse> rentHouses=rentHouseMapper.queryAllRentHouseByArea( province,  city,  area);
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
