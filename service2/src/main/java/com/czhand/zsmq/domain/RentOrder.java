package com.czhand.zsmq.domain;

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
    @CreatedDate
    private Date createdTime;

    /**
     * 用户id
     */
    @Column(name = "user_id")
    private Long userId;

    /**
     * 出租房id
     */
    @Column(name = "house_id")
    private String houseId;

    /**
     * 租赁时常 有1，3，6月，1年选择
     */
    @Column(name = "rent_time")
    private Integer rentTime;

    /**
     * 交付金额
     */
    private String money;

    private static final long serialVersionUID = 1L;

    /**
     * 获取主键id 主键
     *
     * @return id - 主键id 主键
     */
    public Long getId() {
        return id;
    }

    /**
     * 设置主键id 主键
     *
     * @param id 主键id 主键
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * 获取创建时间
     *
     * @return CREATED_TIME - 创建时间
     */
    public Date getCreatedTime() {
        return createdTime;
    }

    /**
     * 设置创建时间
     *
     * @param createdTime 创建时间
     */
    public void setCreatedTime(Date createdTime) {
        this.createdTime = createdTime;
    }

    /**
     * 获取用户id
     *
     * @return user_id - 用户id
     */
    public Long getUserId() {
        return userId;
    }

    /**
     * 设置用户id
     *
     * @param userId 用户id
     */
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    /**
     * 获取出租房id
     *
     * @return house_id - 出租房id
     */
    public String getHouseId() {
        return houseId;
    }

    /**
     * 设置出租房id
     *
     * @param houseId 出租房id
     */
    public void setHouseId(String houseId) {
        this.houseId = houseId;
    }

    /**
     * 获取租赁时常 有1，3，6月，1年选择
     *
     * @return rent_time - 租赁时常 有1，3，6月，1年选择
     */
    public Integer getRentTime() {
        return rentTime;
    }

    /**
     * 设置租赁时常 有1，3，6月，1年选择
     *
     * @param rentTime 租赁时常 有1，3，6月，1年选择
     */
    public void setRentTime(Integer rentTime) {
        this.rentTime = rentTime;
    }

    /**
     * 获取交付金额
     *
     * @return money - 交付金额
     */
    public String getMoney() {
        return money;
    }

    /**
     * 设置交付金额
     *
     * @param money 交付金额
     */
    public void setMoney(String money) {
        this.money = money;
    }
}