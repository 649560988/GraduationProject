package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.RentHouseDTO;
import com.czhand.zsmq.infra.exception.CommonException;
import com.github.pagehelper.PageInfo;

import java.util.List;

/**
 * @autor wyw
 * @data 2019/3/7 16:18
 */
public interface RentHouseService {
    List<RentHouseDTO> queryAllRentHouse(Integer type)throws CommonException;
    RentHouseDTO selectOneAndPicture(Long id)throws CommonException;
    List<RentHouseDTO> queryAllRentHouseByArea(String province,String city,String area)throws CommonException;
    RentHouseDTO createRentHouse(RentHouseDTO rentHouseDTO,long Uid,Integer type)throws CommonException;
    PageInfo<RentHouseDTO> selectAllByPage(int pageNo, int pageSize);
    int stopOrStart(Long id,int isdel) throws CommonException;
}
