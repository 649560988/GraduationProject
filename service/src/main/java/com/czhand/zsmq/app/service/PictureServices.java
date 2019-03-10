package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.PictureDTO;
import com.czhand.zsmq.infra.exception.CommonException;

import java.util.List;

/**
 * @autor wyw
 * @data 2019/3/7 16:17
 */
public interface PictureServices {
    List<PictureDTO> insertPictures(List<String> srcs)throws CommonException;
}
