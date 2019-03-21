package com.czhand.zsmq.api.dto;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.io.Serializable;
import java.util.Date;

/**
 * @autor wyw
 * @data 2019/3/21 10:17
 */
@Api("房屋户型")
public class HouseStyleDto implements Serializable {
    /**
     * 主键id
     */
    @ApiModelProperty("主键id")
    private Long id;

    @ApiModelProperty("户型名字")
    private  String name;

    /**
     * 创建时间
     */
    @ApiModelProperty("创建时间")
    @CreatedDate
    private Date createdTime;

    /**
     * 更新时间
     */
    @ApiModelProperty("更新时间")
    @LastModifiedDate
    private Date updatedTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Date createdTime) {
        this.createdTime = createdTime;
    }

    public Date getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(Date updatedTime) {
        this.updatedTime = updatedTime;
    }
}
