package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.ent.EntListDTO;
import com.czhand.zsmq.infra.exception.CommonException;
import com.github.pagehelper.PageInfo;

/**
 * @author:LVCHENBIN
 * @Date: 2019/1/23 12:30
 */
public interface EntListService {

    //新增上市企业
    EntListDTO create(EntListDTO entListDTO) throws CommonException;

    //更新上市企业
    EntListDTO update(EntListDTO entListDTO) throws CommonException;

    //删除上市企业
    EntListDTO delete(String organizationalCode) throws CommonException;

    //查询一个上市企业
    EntListDTO queryByOrg(String organizationalCode) throws CommonException;

    //查询所有上市企业
    PageInfo<EntListDTO> queryAll(int pageNo, int pageSize) throws CommonException;



}
