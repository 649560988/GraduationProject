package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.app.service.SysParamService;
import com.czhand.zsmq.domain.SysParam;
import com.czhand.zsmq.domain.SysParamChildren;
import com.czhand.zsmq.domain.core.CurrentUser;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.SysParamChildrenMapper;
import com.czhand.zsmq.infra.mapper.SysParamMapper;
import com.czhand.zsmq.infra.utils.security.CurrentUserUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * @author 秦玉杰
 * @date 2019/01/10
 * */
@Service
public class SysParamServiceImpl implements SysParamService {

    @Autowired
    private SysParamMapper sysParamMapper;

    @Autowired
    private SysParamChildrenMapper sysParamChildrenMapper;

    public Long getUserId() {
        CurrentUser currentUser = CurrentUserUtils.get();
        Long userId=currentUser.getId();
        return userId;
    }

    @Override
    public SysParam addSysParam(SysParam sysParam) throws Exception {
        //判断是否已存在
        List<SysParam> sysParamList = sysParamMapper.selectByNameAndCode(sysParam);
        int result = 0;
        if(sysParamList.size() > 0){
            throw new CommonException("数据已存在");
        }
        sysParam.setVersion(1L);
        sysParam.setCreationBy(getUserId());
        sysParam.setCreationDate(new Date());
        sysParam.setUpdateBy(getUserId());
        sysParam.setUpdateDate(new Date());
        result = sysParamMapper.insertSelective(sysParam);
        if(result != 1){
            throw new CommonException("添加失败");
        }
        return sysParamMapper.selectByPrimaryKey(sysParam.getId());
    }

    @Override
    public SysParam deleteSysParam(Long id) throws Exception {
        //判断是否存在
        SysParam sysParam = new SysParam();
        SysParamChildren sysParamChildren = new SysParamChildren();
        sysParam.setId(id);
        sysParamChildren.setSysParamId(id.toString());
        SysParam sysParam1 = sysParamMapper.selectByPrimaryKey(sysParam);
        List<SysParamChildren> sysParamChildrenList = sysParamChildrenMapper.select(sysParamChildren);
        int result = 0;
        if(sysParam1 != null){
            result = sysParamMapper.deleteByPrimaryKey(sysParam);
            if(result == 1){
                if(sysParamChildrenList.size() > 0){
                    result = sysParamChildrenMapper.delete(sysParamChildren);
                    if(result != 1){
                        throw new CommonException("删除失败");
                    }
                }
            }else {
                throw new CommonException("删除失败");
            }
        }else {
            throw new CommonException("数据不存在");
        }
        return sysParamMapper.selectByPrimaryKey(id);
    }

    @Override
    public SysParam updateSysParam(SysParam sysParam) throws Exception {
        SysParam sysParam1 = sysParamMapper.selectByPrimaryKey(sysParam);
        int result = 0;
        if(sysParam1 != null){
            sysParam.setVersion(sysParam1.getVersion() + 1);
            sysParam.setUpdateBy(getUserId());
            sysParam.setUpdateDate(new Date());
            result = sysParamMapper.updateByPrimaryKeySelective(sysParam);
            if(result != 1){
                throw new CommonException("修改失败");
            }
        }else {
            throw new CommonException("数据不存在");
        }
        return sysParamMapper.selectByPrimaryKey(sysParam);
    }

    @Override
    public List<SysParam> selectAllParam() throws Exception {
        return sysParamMapper.selectAll();
    }

    @Override
    public SysParam selectParamById(SysParam sysParam) throws Exception {
        return sysParamMapper.selectByPrimaryKey(sysParam);
    }

    @Override
    public List<SysParam> selectParamByNameAndCode(SysParam sysParam) throws Exception {
        return sysParamMapper.select(sysParam);
    }
}
