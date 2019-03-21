package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.Building;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface BuildingMapper extends BaseMapper<Building> {
  Building selectOneAndPicture(Long id);
  List<Building> queryAllBuilding();
  List<Building> queryAllBuildingByArea(String province,String city,String area);
 }