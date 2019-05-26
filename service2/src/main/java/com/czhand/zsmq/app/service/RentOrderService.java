package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.RentOrderDTO;
import com.czhand.zsmq.infra.exception.CommonException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @autor wyw
 * @data 2019/3/7 16:19
 */
public interface RentOrderService {
    Integer insertOne(RentOrderDTO rentOrderDTO)throws CommonException;
    List<RentOrderDTO> sellectAll()throws CommonException;
    Integer updateOne(Long id,Integer status)throws CommonException;
}
