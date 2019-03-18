package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.BuildingDTO;
import com.czhand.zsmq.app.service.BuildingServices;
import com.czhand.zsmq.domain.Building;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.BuildingMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BuildingServicesImpl implements BuildingServices {

    @Autowired
    BuildingMapper buildingMapper;

    private final static Logger logger = LoggerFactory.getLogger(BuildingServicesImpl.class);
    /**
     * 根据位置查询所有楼盘信息
     * */
    @Override
    public List<BuildingDTO> queryAllBuildingByArea(String province,String city,String area) {
        List<Building> buildings=buildingMapper.queryAllBuildingByArea(province,city,area);
        return ConvertHelper.convertList(buildings,BuildingDTO.class);
    }
    /**
     * 添加楼盘信息
     * */
    @Override
    public BuildingDTO createBuilding(BuildingDTO buildingDTO, Long Uid) throws CommonException {
        Building building=ConvertHelper.convert(buildingDTO,Building.class);
        building.setUserId(Uid);
        int result=buildingMapper.insert(building);
        Long Id=building.getId();
        if(result!=1){
            throw new CommonException("插入失败");
        }
        return ConvertHelper.convert(buildingMapper.selectByPrimaryKey(Id),BuildingDTO.class);
    }

    /**
     * 根据id查询楼盘信息
     * */
    @Override
    public BuildingDTO selectOneAndPicture(Long id) {
        if (id== null){
            return null;
        } else {
         Building building=buildingMapper.selectOneAndPicture(id);
            return ConvertHelper.convert(building,BuildingDTO.class);
        }

    }
    /**
     * 查询所有楼盘信息
     * */
    @Override
    public List<BuildingDTO> queryAllBuilding() {
        List<Building> buildings=buildingMapper.queryAllBuilding();
        return ConvertHelper.convertList(buildings,BuildingDTO.class);
    }
}
