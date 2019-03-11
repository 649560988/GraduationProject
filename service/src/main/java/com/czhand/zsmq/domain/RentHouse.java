package com.czhand.zsmq.domain;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.*;

@Table(name = "rent_house")
public class RentHouse implements Serializable {
    /**
     * 主键id 主键id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 发布人id
     */
    @Column(name = "user_id")
    private Long userId;

    /**
     * 省
     */
    private String province;

    /**
     * 市
     */
    private String city;

    /**
     * 区
     */
    private String area;

    /**
     * 小区名 小区名
     */
    @Column(name = "community_name")
    private String communityName;

    /**
     * 楼栋号
     */
    @Column(name = "building_number")
    private String buildingNumber;

    /**
     * 单元号
     */
    private String unit;

    /**
     * 房间号
     */
    @Column(name = "house_numbers")
    private String houseNumbers;

    /**
     * 房间面积
     */
    @Column(name = "house_area")
    private String houseArea;

    /**
     * 户型
     */
    @Column(name = "house_style")
    private String houseStyle;

    /**
     * 朝向
     */
    private String oriented;

    /**
     * 楼层
     */
    private String floor;

    /**
     * 装修
     */
    private String decoration;

    /**
     * 租金
     */
    private String rent;

    /**
     * 付款类型
     */
    @Column(name = "payment_type")
    private String paymentType;

    /**
     * 房东名称
     */
    @Column(name = "landlord_name")
    private String landlordName;

    /**
     * 房屋描述
     */
    @Column(name = "house_description")
    private String houseDescription;

    /**
     * 出租要求
     */
    @Column(name = "rental_request")
    private String rentalRequest;

    /**
     * 联系方式
     */
    @Column(name = "contact_information")
    private String contactInformation;

    /**
     * 创建时间
     */
    @Column(name = "CREATED_TIME")
    @CreatedDate
    private Date createdTime;

    /**
     * 更新时间
     */
    @Column(name = "UPDATED_TIME")
    @LastModifiedDate
    private Date updatedTime;

    /**
     * 是否出租 0出租1未租
     */
    @Column(name = "is_rent")
    private Integer isRent;

    public List<Picture> getSrcs() {
        return srcs;
    }

    public void setSrcs(List<Picture> srcs) {
        this.srcs = srcs;
    }

    /**
     * 图片路jin

     *
     * @return CREATED_TIME - 创建时间
     */
    @Transient
    private List<Picture> srcs;
    private static final long serialVersionUID = 1L;

    /**
     * 获取主键id 主键id
     *
     * @return id - 主键id 主键id
     */
    public Long getId() {
        return id;
    }

    /**
     * 设置主键id 主键id
     *
     * @param id 主键id 主键id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * 获取发布人id
     *
     * @return user_id - 发布人id
     */
    public Long getUserId() {
        return userId;
    }

    /**
     * 设置发布人id
     *
     * @param userId 发布人id
     */
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    /**
     * 获取省
     *
     * @return province - 省
     */
    public String getProvince() {
        return province;
    }

    /**
     * 设置省
     *
     * @param province 省
     */
    public void setProvince(String province) {
        this.province = province;
    }

    /**
     * 获取市
     *
     * @return city - 市
     */
    public String getCity() {
        return city;
    }

    /**
     * 设置市
     *
     * @param city 市
     */
    public void setCity(String city) {
        this.city = city;
    }

    /**
     * 获取区
     *
     * @return area - 区
     */
    public String getArea() {
        return area;
    }

    /**
     * 设置区
     *
     * @param area 区
     */
    public void setArea(String area) {
        this.area = area;
    }

    /**
     * 获取小区名 小区名
     *
     * @return community_name - 小区名 小区名
     */
    public String getCommunityName() {
        return communityName;
    }

    /**
     * 设置小区名 小区名
     *
     * @param communityName 小区名 小区名
     */
    public void setCommunityName(String communityName) {
        this.communityName = communityName;
    }

    /**
     * 获取楼栋号
     *
     * @return building_number - 楼栋号
     */
    public String getBuildingNumber() {
        return buildingNumber;
    }

    /**
     * 设置楼栋号
     *
     * @param buildingNumber 楼栋号
     */
    public void setBuildingNumber(String buildingNumber) {
        this.buildingNumber = buildingNumber;
    }

    /**
     * 获取单元号
     *
     * @return unit - 单元号
     */
    public String getUnit() {
        return unit;
    }

    /**
     * 设置单元号
     *
     * @param unit 单元号
     */
    public void setUnit(String unit) {
        this.unit = unit;
    }

    /**
     * 获取房间号
     *
     * @return house_numbers - 房间号
     */
    public String getHouseNumbers() {
        return houseNumbers;
    }

    /**
     * 设置房间号
     *
     * @param houseNumbers 房间号
     */
    public void setHouseNumbers(String houseNumbers) {
        this.houseNumbers = houseNumbers;
    }

    /**
     * 获取房间面积
     *
     * @return house_area - 房间面积
     */
    public String getHouseArea() {
        return houseArea;
    }

    /**
     * 设置房间面积
     *
     * @param houseArea 房间面积
     */
    public void setHouseArea(String houseArea) {
        this.houseArea = houseArea;
    }

    /**
     * 获取户型
     *
     * @return house_style - 户型
     */
    public String getHouseStyle() {
        return houseStyle;
    }

    /**
     * 设置户型
     *
     * @param houseStyle 户型
     */
    public void setHouseStyle(String houseStyle) {
        this.houseStyle = houseStyle;
    }

    /**
     * 获取朝向
     *
     * @return oriented - 朝向
     */
    public String getOriented() {
        return oriented;
    }

    /**
     * 设置朝向
     *
     * @param oriented 朝向
     */
    public void setOriented(String oriented) {
        this.oriented = oriented;
    }

    /**
     * 获取楼层
     *
     * @return floor - 楼层
     */
    public String getFloor() {
        return floor;
    }

    /**
     * 设置楼层
     *
     * @param floor 楼层
     */
    public void setFloor(String floor) {
        this.floor = floor;
    }

    /**
     * 获取装修
     *
     * @return decoration - 装修
     */
    public String getDecoration() {
        return decoration;
    }

    /**
     * 设置装修
     *
     * @param decoration 装修
     */
    public void setDecoration(String decoration) {
        this.decoration = decoration;
    }

    /**
     * 获取租金
     *
     * @return rent - 租金
     */
    public String getRent() {
        return rent;
    }

    /**
     * 设置租金
     *
     * @param rent 租金
     */
    public void setRent(String rent) {
        this.rent = rent;
    }

    /**
     * 获取付款类型
     *
     * @return payment_type - 付款类型
     */
    public String getPaymentType() {
        return paymentType;
    }

    /**
     * 设置付款类型
     *
     * @param paymentType 付款类型
     */
    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }

    /**
     * 获取房东名称
     *
     * @return landlord_name - 房东名称
     */
    public String getLandlordName() {
        return landlordName;
    }

    /**
     * 设置房东名称
     *
     * @param landlordName 房东名称
     */
    public void setLandlordName(String landlordName) {
        this.landlordName = landlordName;
    }

    /**
     * 获取房屋描述
     *
     * @return house_description - 房屋描述
     */
    public String getHouseDescription() {
        return houseDescription;
    }

    /**
     * 设置房屋描述
     *
     * @param houseDescription 房屋描述
     */
    public void setHouseDescription(String houseDescription) {
        this.houseDescription = houseDescription;
    }

    /**
     * 获取出租要求
     *
     * @return rental_request - 出租要求
     */
    public String getRentalRequest() {
        return rentalRequest;
    }

    /**
     * 设置出租要求
     *
     * @param rentalRequest 出租要求
     */
    public void setRentalRequest(String rentalRequest) {
        this.rentalRequest = rentalRequest;
    }

    /**
     * 获取联系方式
     *
     * @return contact_information - 联系方式
     */
    public String getContactInformation() {
        return contactInformation;
    }

    /**
     * 设置联系方式
     *
     * @param contactInformation 联系方式
     */
    public void setContactInformation(String contactInformation) {
        this.contactInformation = contactInformation;
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
     * 获取更新时间
     *
     * @return UPDATED_TIME - 更新时间
     */
    public Date getUpdatedTime() {
        return updatedTime;
    }

    /**
     * 设置更新时间
     *
     * @param updatedTime 更新时间
     */
    public void setUpdatedTime(Date updatedTime) {
        this.updatedTime = updatedTime;
    }

    /**
     * 获取是否出租 0出租1未租
     *
     * @return is_rent - 是否出租 0出租1未租
     */
    public Integer getIsRent() {
        return isRent;
    }

    /**
     * 设置是否出租 0出租1未租
     *
     * @param isRent 是否出租 0出租1未租
     */
    public void setIsRent(Integer isRent) {
        this.isRent = isRent;
    }
}