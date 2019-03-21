package com.czhand.zsmq.infra.mapper;

import com.czhand.zsmq.domain.SysParamChildren;
import com.czhand.zsmq.infra.utils.mapper.BaseMapper;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author 秦玉杰
 * @date 2019/01/10
 * */
@Component
public interface SysParamChildrenMapper extends BaseMapper<SysParamChildren> {

    List<SysParamChildren> selectByParamIdAndName(SysParamChildren sysParamChildren);

    List<SysParamChildren> getChildParam(SysParamChildren sysParamChildren);

}