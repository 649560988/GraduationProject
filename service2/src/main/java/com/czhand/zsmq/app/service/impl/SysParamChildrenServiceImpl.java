package com.czhand.zsmq.app.service.impl;

import com.czhand.zsmq.app.service.SysParamChildrenService;
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
public class SysParamChildrenServiceImpl implements SysParamChildrenService {

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
    public SysParamChildren addSysParamChild(SysParamChildren sysParamChildren) throws Exception {
        //判断父参数ID是否存在
        SysParam sysParam = new SysParam();
        sysParam.setId(Long.valueOf(sysParamChildren.getSysParamId()));
        SysParam sysParam1 = sysParamMapper.selectByPrimaryKey(sysParam);
        int result = 0;
        if(sysParam1 != null){
            //判断数据是否已存在
            List<SysParamChildren> sysParamChildrenList = sysParamChildrenMapper.selectByParamIdAndName(sysParamChildren);
            if(sysParamChildrenList.size() > 0){
                throw new CommonException("数据已存在");
            }
            sysParamChildren.setVersion(1L);
            sysParamChildren.setCreationBy(getUserId());
            sysParamChildren.setCreationDate(new Date());
            sysParamChildren.setUpdateBy(getUserId());
            sysParamChildren.setUpdateDate(new Date());
            result = sysParamChildrenMapper.insertSelective(sysParamChildren);
            if(result != 1){
                throw new CommonException("添加失败");
            }
        }else {
            throw new CommonException("数据不存在");
        }
        return sysParamChildrenMapper.selectByPrimaryKey(sysParamChildren.getId());
    }

    @Override
    public SysParamChildren deleteSysParamChild(Long id) throws Exception {
        //判断数据是否存在
        SysParamChildren sysParamChildren = new SysParamChildren();
        sysParamChildren.setId(id);
        SysParamChildren sysParamChildren1 = sysParamChildrenMapper.selectByPrimaryKey(sysParamChildren);
        int result = 0;
        if(sysParamChildren1 != null){
            result = sysParamChildrenMapper.deleteByPrimaryKey(sysParamChildren);
            if(result != 1){
                throw new CommonException("删除失败");
            }
        }else {
            throw new CommonException("数据不存在");
        }
        return sysParamChildren1;
    }

    @Override
    public SysParamChildren updateSysParamChild(SysParamChildren sysParamChildren) throws Exception {
        //判断数据是否存在
        SysParamChildren sysParamChildren1 = sysParamChildrenMapper.selectByPrimaryKey(sysParamChildren);
        int result = 0;
        if(sysParamChildren1 != null){
            sysParamChildren.setVersion(sysParamChildren1.getVersion() + 1);
            sysParamChildren.setUpdateBy(getUserId());
            sysParamChildren.setUpdateDate(new Date());
            result = sysParamChildrenMapper.updateByPrimaryKeySelective(sysParamChildren);
            if(result != 1){
                throw new CommonException("修改失败");
            }
        }else {
            throw new CommonException("数据不存在");
        }
        return sysParamChildren1;
    }

    @Override
    public List<SysParamChildren> selectAllParamChild() throws Exception {
        return sysParamChildrenMapper.selectAll();
    }

    @Override
    public List<SysParamChildren> getChildParam(Long id) throws Exception {
        SysParamChildren sysParamChildren = new SysParamChildren();
        sysParamChildren.setSysParamId(id.toString());
        return sysParamChildrenMapper.getChildParam(sysParamChildren);
    }

    @Override
    public List<SysParamChildren> selectChildParamByIdAndName(SysParamChildren sysParamChildren) throws Exception {
        return sysParamChildrenMapper.select(sysParamChildren);
    }
}
