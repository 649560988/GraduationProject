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
    public List<PictureDTO> insertPictures(List<String> srcs) throws CommonException {
        List<Picture> list =new ArrayList<>();
        for(int i=0;i<srcs.size();i++){
            Picture picture=new Picture();
            picture.setBelongId(1);
            picture.setType(1);
            picture.setSrc(srcs.get(i));
            list.add(picture);
        }
        pictureMapper.insertPictures(list);
        return ConvertHelper.convertList(list,PictureDTO.class);
    }
}
