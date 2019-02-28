package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.BuildingDTO;
import com.czhand.zsmq.app.service.BuildingServices;
import com.czhand.zsmq.domain.Building;
import com.czhand.zsmq.infra.mapper.BuildingMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BuildingServicesImpl implements BuildingServices {

    @Autowired
    BuildingMapper buildingMapper;

    private final static Logger logger = LoggerFactory.getLogger(BuildingServicesImpl.class);
    @Override
    public BuildingDTO queryOne(Long id) {
        if (id== null){
            return null;
        } else {
            Building building=buildingMapper.selectByPrimaryKey(id);
            return ConvertHelper.convert(building,BuildingDTO.class);
        }

    }
}
