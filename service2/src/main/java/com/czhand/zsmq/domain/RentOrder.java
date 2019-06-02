package com.czhand.zsmq.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.data.annotation.CreatedDate;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;

@Table(name = "rent_order")
public class RentOrder implements Serializable {
    /**
     * 主键id 主键
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 创建时间
     */
    @Column(name = "CREATED_TIME")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    private Date createdTime;

    /**
     * 用户id
     */
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "status")
    private Integer status;

    /**
     * 用户name
     */
    @Column(name = "user_name")
    private String userName;
    /**
     * 出租房id
     */
    @Column(name = "house_id")
    private Long houseId;
    @Column(name = "house_name")
    private String houseName;

    @Column(name = "rent_user_id")
    private Long rentUserId;

    @Column(name = "rent_user_name")
    private String rentUserName;

    @Column(name = "type")
    private Integer type;
    @Column(name = "isdel")
    private Integer isdel;
    /**
     * 租赁时常 有1，3，6月，1年选择
     */
    @Column(name = "rent_time")
    private Integer rentTime;

    /**
     * 交付金额
     */
    @Column(name = "money")
    private String money;
    @Column(name = "phone")
    private String phone;
    public Integer getIsdel() {
        return isdel;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setIsdel(Integer isdel) {
        this.isdel = isdel;
    }

    private static final long serialVersionUID = 1L;

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

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
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

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getRentTime() {
        return rentTime;
    }

    public void setRentTime(Integer rentTime) {
        this.rentTime = rentTime;
    }

    public String getMoney() {
        return money;
    }

    public void setMoney(String money) {
        this.money = money;
    }
}