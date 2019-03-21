package com.czhand.zsmq.app.service.impl;

 import com.czhand.zsmq.api.dto.HouseStyleDto;
 import com.czhand.zsmq.app.service.HouseStyleService;
 import com.czhand.zsmq.domain.HouseStyle;
 import com.czhand.zsmq.infra.exception.CommonException;
 import com.czhand.zsmq.infra.mapper.HouseStyleMapper;
 import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.stereotype.Service;

 import java.util.Date;
 import java.util.List;

 @Service
 public class HouseStyleServiceImpl implements HouseStyleService {

     @Autowired
      private HouseStyleMapper houseStyleMapper;
     /**
      * 查询所有房屋类型信息
      * */
     @Override
     public List<HouseStyleDto> queryAllHouseStyle() throws CommonException {
         List<HouseStyle> houseStyleList=houseStyleMapper.selectAll();
         return ConvertHelper.convertList(houseStyleList,HouseStyleDto.class);
     }
     /**
      * 添加房屋类型
      * */
     @Override
     public HouseStyleDto createHouseStyle(HouseStyleDto houseStyleDto) throws CommonException {
         HouseStyle houseStyle=ConvertHelper.convert(houseStyleDto,HouseStyle.class);
         houseStyle.setCreatedTime(new Date());
         houseStyle.setUpdatedTime(new Date());
         int result=houseStyleMapper.insert(houseStyle);
         Long id=houseStyle.getId();
         if(result!=1){
             throw new CommonException("插入失败");
         }
         return ConvertHelper.convert(houseStyleMapper.selectByPrimaryKey(id),HouseStyleDto.class);
     }
 }

//     @Override
//     public BuildingDTO createBuilding(BuildingDTO buildingDTO, Long Uid) throws CommonException {
//         Building building=ConvertHelper.convert(buildingDTO,Building.class);
//         building.setUserId(Uid);
//         int result=buildingMapper.insert(building);
//         Long Id=building.getId();
//         if(result!=1){
//             throw new CommonException("插入失败");
//         }
//         return ConvertHelper.convert(buildingMapper.selectByPrimaryKey(Id),BuildingDTO.class);
//     }
