package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.api.dto.RentOrderDTO;
import com.czhand.zsmq.app.service.RentOrderService;
import com.czhand.zsmq.domain.RentOrder;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.RentOrderMapper;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/5/3 21:32
 * @@Description
 */
@Service

public class RentOrderServicelmpl implements RentOrderService {

    @Autowired
    private RentOrderMapper rentOrderMapper;
    /**
    *@Description
    *@Param [rentOrderDTO]
    *@Return java.lang.Integer
    *@Author wyw
    *@Date 2019/5/4
    *@Time 12:44
    */
    @Override
    public Integer insertOne(RentOrderDTO rentOrderDTO) throws CommonException {
        RentOrder rentOrder=ConvertHelper.convert(rentOrderDTO,RentOrder.class);
        rentOrder.setCreatedTime(new Date());
        Integer result=rentOrderMapper.insert(rentOrder);
        if(result != 1){
            throw new CommonException("插入失败");
        }
        return result;
    }

    @Override
    public List<RentOrderDTO> sellectAll(Integer status) throws CommonException {
        List<RentOrder> rentOrderList=rentOrderMapper.selectAllByStatus(status);
        return ConvertHelper.convertList(rentOrderList,RentOrderDTO.class);
    }

    @Override
    public RentOrderDTO updateOne(Long id, Integer status) throws CommonException {
        RentOrder rentOrder=new RentOrder();
        rentOrder.setId(id);
        rentOrder.setStatus(status);
        RentOrder rentOrder1=rentOrderMapper.upData(rentOrder);
        return ConvertHelper.convert(rentOrder1,RentOrderDTO.class);
    }
}
