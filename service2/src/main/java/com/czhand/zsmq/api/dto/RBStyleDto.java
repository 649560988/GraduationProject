package com.czhand.zsmq.api.dto;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;

/**
 * @autor wyw
 * @data 2019/3/21 10:22
 */
@Api("楼盘出租房户型表")
public class RBStyleDto implements Serializable {
    @ApiModelProperty("主键id")
    private Long id;
    @ApiModelProperty("归属")
    private  long belongId;
    @ApiModelProperty("所属类型")
    private  int type;
}
