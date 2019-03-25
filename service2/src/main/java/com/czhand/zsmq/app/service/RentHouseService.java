package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.RentHouseDTO;
import com.czhand.zsmq.infra.exception.CommonException;

import java.util.List;

/**
 * @autor wyw
 * @data 2019/3/7 16:18
 */
public interface RentHouseService {
    List<RentHouseDTO> queryAllRentHouse();
    RentHouseDTO selectOneAndPicture(Long id);
    List<RentHouseDTO> queryAllRentHouseByArea(String province,String city,String area)throws CommonException;
    RentHouseDTO createRentHouse(RentHouseDTO rentHouseDTO,long Uid);
}
