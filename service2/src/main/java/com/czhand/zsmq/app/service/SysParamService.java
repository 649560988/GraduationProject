package com.czhand.zsmq.app.service;

import com.czhand.zsmq.domain.SysParam;
import com.czhand.zsmq.infra.exception.CommonException;

import java.util.List;

/**
 * @author 秦玉杰
 * @date 2019/01/10
 * */
public interface SysParamService {

    /**
     * 新增参数
     * */
    SysParam addSysParam(SysParam sysParam) throws Exception;

    /**
     * 删除参数
     * */
    SysParam deleteSysParam(Long id) throws Exception;

    /**
     * 修改参数
     * */
    SysParam updateSysParam(SysParam sysParam) throws Exception;

    /**
     * 查询所有参数
     * */
    List<SysParam> selectAllParam() throws Exception;

    /**
     * 根据父参数ID查询父参数
     * */
    SysParam selectParamById(SysParam sysParam) throws Exception;

    /**
     * 根据父参数名称或者父参数编码查询父参数
     * */
    List<SysParam> selectParamByNameAndCode(SysParam sysParam) throws Exception;

}
