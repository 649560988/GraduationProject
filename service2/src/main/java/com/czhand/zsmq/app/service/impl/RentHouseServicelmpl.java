package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.RentHouseDTO;
import com.czhand.zsmq.app.service.RentHouseService;
import com.czhand.zsmq.domain.RentHouse;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.RentHouseMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import com.czhand.zsmq.infra.utils.convertor.ConvertPageHelper;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
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
    @Autowired
    RentHouseMapper rentHouseMapper;

    /**
     * 根据id查询
     * */
    @Override
    public RentHouseDTO selectOneAndPicture(Long id) {
       RentHouse rentHouse=rentHouseMapper.selectOneAndPicture(id);

        return ConvertHelper.convert(rentHouse,RentHouseDTO.class);
    }

    /**
     * 创建出租房
     * */
    @Override
    public RentHouseDTO createRentHouse(RentHouseDTO rentHouseDTO,long Uid) {
        RentHouse rentHouse=ConvertHelper.convert(rentHouseDTO,RentHouse.class);
        rentHouse.setUserId(Uid);
        rentHouse.setIsRent(0);
        rentHouse.setCreatedTime(new Date());
        rentHouse.setUpdatedTime(new Date());
        int result=rentHouseMapper.insert(rentHouse);
        return  null;
    }

    /**
     * 按要求查找房子
     * */
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
    /**
     *
     * */
    @Override
    public PageInfo<RentHouseDTO> selectAllByPage(int pageNo, int pageSize) {
        PageHelper.startPage(pageNo,pageSize);
        Page<RentHouse> rentHouses=null;
        rentHouses=(Page)rentHouseMapper.selectAllByPage();
        Page<RentHouseDTO> rentHouseDTOS=ConvertPageHelper.convertPage(rentHouses,RentHouseDTO.class);
        PageInfo<RentHouseDTO> pageInfo=new PageInfo<>(rentHouseDTOS);
        return  pageInfo;
    }

    @Override
    public int stopOrStart(Long id, int isrent) throws CommonException {
        RentHouse rentHouse=new RentHouse();
        rentHouse.setId(id);
        rentHouse.setIsRent(isrent);
        int result=rentHouseMapper.stopOrStart(rentHouse);
        if (result != 1 && result != 0) {
            throw new CommonException("操作失败");
        }
        return result;
    }
}
