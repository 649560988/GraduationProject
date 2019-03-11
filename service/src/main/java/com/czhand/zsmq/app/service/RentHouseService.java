package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.RentHouseDTO;

import java.util.List;

/**
 * @autor wyw
 * @data 2019/3/7 16:18
 */
public interface RentHouseService {
    List<RentHouseDTO> queryAllRentHouse();
    List<RentHouseDTO> selectOneAndPicture(Long id);
}
