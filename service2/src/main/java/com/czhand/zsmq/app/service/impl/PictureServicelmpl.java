package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.PictureDTO;
import com.czhand.zsmq.app.service.PictureServices;
import com.czhand.zsmq.domain.Picture;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.BuildingMapper;
import com.czhand.zsmq.infra.mapper.PictureMapper;
import com.czhand.zsmq.infra.mapper.RentHouseMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @autor wyw
 * @data 2019/3/7 16:35
 */
@Component
public class PictureServicelmpl implements PictureServices {
    @Autowired
    PictureMapper pictureMapper;
    @Autowired
    BuildingMapper buildingMapper;
    @Autowired
    RentHouseMapper rentHouseMapper;
    @Override
    public PictureDTO insertPicture(String fileName,Integer type) throws CommonException {
        Picture picture=new Picture();
        long bId;
        picture.setSrc(fileName);
        picture.setType(type);
        picture.setCreateTime(new Date());
        picture.setUpdatedTime(new Date());
        if (type==1){
           bId =lastInsertBuildingId();
            System.out.print("123");
        }else {
            bId =lastInsertRentHouseId();
            System.out.print("123");
        }
        picture.setBelongId(++bId);

        int result=pictureMapper.insert(picture);
        if(result!=1){
            throw new CommonException("插入失败");
        }
        return ConvertHelper.convert(picture,PictureDTO.class);
    }

    @Override
    public long lastInsertBuildingId() throws CommonException {
        return buildingMapper.lastInsertBuildingId();
    }
    @Override
    public long lastInsertRentHouseId() throws CommonException {
        System.out.print("123");
        return rentHouseMapper.lastInsertRentHouseId();
    }
}
