package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.PictureDTO;
import com.czhand.zsmq.app.service.PictureServices;
import com.czhand.zsmq.domain.Picture;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.PictureMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * @autor wyw
 * @data 2019/3/7 16:35
 */
@Component
public class PictureServicelmpl implements PictureServices {
    @Autowired
    PictureMapper pictureMapper;
    @Override
    public PictureDTO insertPicture(String fileName,Long id,Integer type) throws CommonException {
        Picture picture=new Picture();
        picture.setSrc(fileName);
        picture.setBelongId(id);
        picture.setType(type);
        int result=pictureMapper.insert(picture);
        if(result!=1){
            throw new CommonException("插入失败");
        }
        return ConvertHelper.convert(picture,PictureDTO.class);
    }
}
