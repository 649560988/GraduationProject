package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.BuildingDTO;
import com.czhand.zsmq.api.dto.RBStyleDto;
import com.czhand.zsmq.app.service.BuildingServices;
import com.czhand.zsmq.domain.Building;
import com.czhand.zsmq.domain.HouseStyle;
import com.czhand.zsmq.domain.RBStyle;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.BuildingMapper;
import com.czhand.zsmq.infra.mapper.RBStyleMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import com.czhand.zsmq.infra.utils.convertor.ConvertPageHelper;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class BuildingServicesImpl implements BuildingServices {

    @Autowired
    BuildingMapper buildingMapper;
    @Autowired
    RBStyleMapper rbStyleMapper;

    private final static Logger logger = LoggerFactory.getLogger(BuildingServicesImpl.class);

    @Override
    public PageInfo<BuildingDTO> selectAllByPage(int pageNo, int pageSize) {
        PageHelper.startPage(pageNo,pageSize);
        Page<Building> buildingPage=null;
        buildingPage=(Page)buildingMapper.selectAllByPage();
        Page<BuildingDTO> buildingDTOPage=ConvertPageHelper.convertPage(buildingPage,BuildingDTO.class);
        PageInfo<BuildingDTO> pageInfo=new PageInfo<>(buildingDTOPage);
        return pageInfo;
    }

    /**
     * 根据位置查询所有楼盘信息
     */
    @Override
    public List<BuildingDTO> queryAllBuildingByArea(String province, String city, String area)throws CommonException {
        List<Building> buildings = buildingMapper.queryAllBuildingByArea(province, city, area);
        return ConvertHelper.convertList(buildings, BuildingDTO.class);
    }

    /**
     * 添加楼盘信息
     */
    @Override
    public BuildingDTO createBuilding(BuildingDTO buildingDTO, Long Uid) throws CommonException {
        Building building = ConvertHelper.convert(buildingDTO, Building.class);
        building.setUserId(Uid);
        building.setProvince("江苏省");
        building.setCity("常州市");
        building.setArea("天宁区");
        building.setCreatedTime(new Date());
        building.setUpdatedTime(new Date());
        int result = buildingMapper.insert(building);
        Long Id = building.getId();
        if (result != 1) {
            throw new CommonException("插入失败");
        }
        List<HouseStyle> houseStyleList=ConvertHelper.convertList(building.getHouseStyles(),HouseStyle.class);
        addHouseStyle(houseStyleList,building.getId());
        return ConvertHelper.convert(buildingMapper.selectByPrimaryKey(Id), BuildingDTO.class);
    }

    /**
     * 根据id查询楼盘信息
     */
    @Override
    public BuildingDTO selectOneAndPicture(Long id)throws CommonException {
        if (id == null) {
            return null;
        } else {
            Building building = buildingMapper.selectOneAndPicture(id);
            return ConvertHelper.convert(building, BuildingDTO.class);
        }

    }

    /**
     * 查询所有楼盘信息
     */
    @Override
    public List<BuildingDTO> queryAllBuilding()throws CommonException {
        List<Building> buildings = buildingMapper.queryAllBuilding();
        return ConvertHelper.convertList(buildings, BuildingDTO.class);
    }
    /**
     * 关联房间类型表
     * */
    public boolean addHouseStyle(List<HouseStyle> houseStyleList,Long bId)throws CommonException{
        for(HouseStyle houseStyle:houseStyleList){
            RBStyle rbStyle1=new RBStyle();
            rbStyle1.setBelongId(bId);
            rbStyle1.setType(1);
            rbStyle1.setHouseStyleId(houseStyle.getId());
            try {
               rbStyleMapper.insert(rbStyle1);
            } catch (Exception e) {
                throw new CommonException("关联房屋类型失败");
            }
        }
        return true;
    }
}

