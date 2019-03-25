package com.czhand.zsmq.api.dto;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiOperation;

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
    @ApiModelProperty("房屋类别")
    private long houseStyleId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getBelongId() {
        return belongId;
    }

    public void setBelongId(long belongId) {
        this.belongId = belongId;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public long getHouseStyleId() {
        return houseStyleId;
    }

    public void setHouseStyleId(long houseStyleId) {
        this.houseStyleId = houseStyleId;
    }
}
