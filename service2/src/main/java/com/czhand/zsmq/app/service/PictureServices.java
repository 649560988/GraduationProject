package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.PictureDTO;
import com.czhand.zsmq.infra.exception.CommonException;

import java.util.List;

/**
 * @autor wyw
 * @data 2019/3/7 16:17
 */
public interface PictureServices {
    PictureDTO insertPicture(String fileName,Integer type)throws CommonException;
     long lastInsertBuildingId()throws CommonException;
    long lastInsertRentHouseId() throws CommonException;
}
