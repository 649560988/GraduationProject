package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.HouseStyleDto;
import com.czhand.zsmq.infra.exception.CommonException;

import java.util.List;

public interface HouseStyleService {
    List<HouseStyleDto> queryAllHouseStyle()throws CommonException;
    HouseStyleDto createHouseStyle(HouseStyleDto houseStyleDto)throws CommonException;
}
