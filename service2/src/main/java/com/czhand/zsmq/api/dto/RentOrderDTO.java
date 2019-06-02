package com.czhand.zsmq.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.data.annotation.CreatedDate;

import java.util.Date;

@ApiModel("订单")
public class RentOrderDTO {
    /**
     * 主键id 主键
     */
    @ApiModelProperty("键id")
    private Long id;

    /**
     * 创建时间
     */
    @ApiModelProperty("创建时间")
    @CreatedDate
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    private Date createdTime;

    /**
     * 用户id
     */
    @ApiModelProperty("用户id")
    private Long userId;
    /**
     * isdel
     */
    @ApiModelProperty("quxiao")
    private Integer isdel;
    /**
     * 用户name
     */
    @ApiModelProperty("用户name")
    private String userName;
    /**
     * 出租房id
     */
    @ApiModelProperty("出租房id")
    private Long houseId;
    @ApiModelProperty("出租房name")
    private String houseName;
    @ApiModelProperty("租赁type")
    private Integer type;
    @ApiModelProperty("出租id")
    private Long rentUserId;

    @ApiModelProperty("租赁人name")
    private String rentUserName;

    /**
     * 租赁时常 有1，3，6月，1年选择
     */
    @ApiModelProperty("租赁时常")
    private Integer rentTime;
    @ApiModelProperty("交易状态  0：预定  1：待审核 2：交易成功")
    private Integer status;
    /**
     * 交付金额
     */
    @ApiModelProperty("交付金额")
    private String money;
    @ApiModelProperty("联系方式")
    private String phone;
    public void setIsdel(Integer isdel) {
        this.isdel = isdel;
    }

    public Integer getIsdel() {
        return isdel;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Date createdTime) {
        this.createdTime = createdTime;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getHouseId() {
        return houseId;
    }

    public void setHouseId(Long houseId) {
        this.houseId = houseId;
    }

    public String getHouseName() {
        return houseName;
    }

    public void setHouseName(String houseName) {
        this.houseName = houseName;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Long getRentUserId() {
        return rentUserId;
    }

    public void setRentUserId(Long rentUserId) {
        this.rentUserId = rentUserId;
    }

    public String getRentUserName() {
        return rentUserName;
    }

    public void setRentUserName(String rentUserName) {
        this.rentUserName = rentUserName;
    }

    public Integer getRentTime() {
        return rentTime;
    }

    public void setRentTime(Integer rentTime) {
        this.rentTime = rentTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getMoney() {
        return money;
    }

    public void setMoney(String money) {
        this.money = money;
    }
}
