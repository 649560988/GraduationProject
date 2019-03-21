package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.ent.EntBaseDTO;
import com.czhand.zsmq.infra.exception.CommonException;
import com.github.pagehelper.PageInfo;

/**
 * @author:LVCHENBIN
 * @Date: 2019/1/22 15:30
 */
public interface EntBaseService {

    //创建企业
    EntBaseDTO createEnterprise(EntBaseDTO entBase) throws CommonException;

    //更新企业
    EntBaseDTO updateEnterprise(EntBaseDTO entBase) throws CommonException;

    //删除企业
    EntBaseDTO deleteEnterprise(String organizationalCode) throws CommonException;

    //查询企业
    EntBaseDTO queryOneEnterprise(String organizationalCode) throws CommonException;

    //查询所有企业
    PageInfo<EntBaseDTO> queryAllEnterprise(int pageNo, int pageSize) throws CommonException;

    //模糊查询企业，by企业名称
    PageInfo<EntBaseDTO> queryAllByEntName(String entName, int pageNo, int pageSize) throws CommonException;

    //查询企业是否重复
    boolean queryExistEnterprise(EntBaseDTO entBase) throws CommonException;

    //查询企业Id
    long queryEntId(String organizationalCode) throws CommonException;


}
