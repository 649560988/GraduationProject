package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.BuildingDTO;
import com.czhand.zsmq.infra.exception.CommonException;

import java.util.List;

/**
 * @autor wyw
 * @data 2019/2/28 9:54
 */

public interface BuildingServices {
    /**
     * 查询单条信息
     */
    BuildingDTO selectOneAndPicture(Long id)throws CommonException;;
    List<BuildingDTO> queryAllBuilding()throws CommonException;;
    List<BuildingDTO> queryAllBuildingByArea(String province,String city,String area )throws CommonException;;
    BuildingDTO createBuilding(BuildingDTO buildingDTO)throws CommonException;
}
