package com.czhand.zsmq.app.service;

import com.czhand.zsmq.domain.SysParamChildren;
import com.czhand.zsmq.infra.exception.CommonException;

import java.util.List;

/**
 * @author 秦玉杰
 * @date 2019/01/10
 * */
public interface SysParamChildrenService {

    /**
     * 新增子参数
     * */
    SysParamChildren addSysParamChild(SysParamChildren sysParamChildren) throws Exception;

    /**
     * 删除子参数
     * */
    SysParamChildren deleteSysParamChild(Long id) throws Exception;

    /**
     * 修改子参数
     * */
    SysParamChildren updateSysParamChild(SysParamChildren sysParamChildren) throws Exception;

    /**
     * 查询所有子参数
     * */
    List<SysParamChildren> selectAllParamChild() throws Exception;

    /**
     * 根据ID查询子参数
     * */
    List<SysParamChildren> getChildParam(Long id) throws Exception;

    /**
     * 根据父参数ID和子参数名称查询子参数信息
     * */
    List<SysParamChildren> selectChildParamByIdAndName(SysParamChildren sysParamChildren) throws Exception;
}
