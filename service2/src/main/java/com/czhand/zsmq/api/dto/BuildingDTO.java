package com.czhand.zsmq.api.dto;

import com.czhand.zsmq.domain.HouseStyle;
import com.czhand.zsmq.domain.Picture;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@ApiModel("楼盘消息")
public class BuildingDTO implements  Serializable{
        /**
         * 主键id
         */
        @ApiModelProperty("主键id")
        private Long id;

        /**
         * 发布人id
         */
        @ApiModelProperty("发布人id")
        private String userId;

        /**
         * 楼盘名称
         */
        @ApiModelProperty("楼盘名称")
        private String name;

        /**
         * 省
         */
        @ApiModelProperty("省")
        private String province;

        /**
         * 市
         */
        @ApiModelProperty("市")
        private String city;

        /**
         * 区
         */
        @ApiModelProperty("区")
        private String area;

        /**
         * 预定价格
         */
        @ApiModelProperty("预定价格")
        private BigDecimal estimatePrice;

        /**
         * 开盘时间
         */
        @ApiModelProperty("开盘时间")
        private Date openingTime;

        /**
         * 交房时间
         */
        @ApiModelProperty("交房时间")
        private Date deliveryTime;

        /**
         * 楼盘户型
         */
        @ApiModelProperty("楼盘户型")
        private List<HouseStyle> houseTypes;

        public List<HouseStyle> getHouseTypes() {
                return houseTypes;
        }

        public void setHouseTypes(List<HouseStyle> houseTypes) {
                this.houseTypes = houseTypes;
        }

        /**
         * 售楼处电话
         */
        @ApiModelProperty("售楼处电话")
        private String phone;

        /**
         * 开发商
         */
        @ApiModelProperty("开发商")
        private String developer;

        /**
         * 楼层状况
         */
        @ApiModelProperty("楼层状况")
        private Integer floorNumber;

        /**
         * 物业管理费
         */
        @ApiModelProperty("物业管理费")
        private BigDecimal anagementPrice;

        /**
         * 物业公司
         */
        @ApiModelProperty("物业公司")
        private String anagementCompany;

        /**
         * 车位数
         */
        @ApiModelProperty("车位数")
        private Integer parkingNumber;
        /**
         * 描述
         */
        @ApiModelProperty("描述")
        private String description;

        public String getDescription() {
                return description;
        }

        public void setDescription(String description) {
                this.description = description;
        }

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
        /**
         * 图片路劲
         *
         * @return CREATED_TIME - 创建时间
         */
        @ApiModelProperty("图片")

        private List<Picture> srcs;


        private static final long serialVersionUID = 1L;

        public List<Picture> getSrcs() {
                return srcs;
        }

        public void setSrcs(List<Picture> srcs) {
                this.srcs = srcs;
        }




        /**
         * 获取主键id
         *
         * @return id - 主键id
         */
        public Long getId() {
            return id;
        }

        /**
         * 设置主键id
         *
         * @param id 主键id
         */
        public void setId(Long id) {
            this.id = id;
        }

        /**
         * 获取发布人id
         *
         * @return user_id - 发布人id
         */
        public String getUserId() {
            return userId;
        }

        /**
         * 设置发布人id
         *
         * @param userId 发布人id
         */
        public void setUserId(String userId) {
            this.userId = userId;
        }

        /**
         * 获取楼盘名称
         *
         * @return name - 楼盘名称
         */
        public String getName() {
            return name;
        }

        /**
         * 设置楼盘名称
         *
         * @param name 楼盘名称
         */
        public void setName(String name) {
            this.name = name;
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
         * 获取预定价格
         *
         * @return estimate_price - 预定价格
         */
        public BigDecimal getEstimatePrice() {
            return estimatePrice;
        }

        /**
         * 设置预定价格
         *
         * @param estimatePrice 预定价格
         */
        public void setEstimatePrice(BigDecimal estimatePrice) {
            this.estimatePrice = estimatePrice;
        }

        /**
         * 获取开盘时间
         *
         * @return opening_time - 开盘时间
         */
        public Date getOpeningTime() {
            return openingTime;
        }

        /**
         * 设置开盘时间
         *
         * @param openingTime 开盘时间
         */
        public void setOpeningTime(Date openingTime) {
            this.openingTime = openingTime;
        }

        /**
         * 获取交房时间
         *
         * @return delivery_time - 交房时间
         */
        public Date getDeliveryTime() {
            return deliveryTime;
        }

        /**
         * 设置交房时间
         *
         * @param deliveryTime 交房时间
         */
        public void setDeliveryTime(Date deliveryTime) {
            this.deliveryTime = deliveryTime;
        }


        /**
         * 获取售楼处电话
         *
         * @return phone - 售楼处电话
         */
        public String getPhone() {
            return phone;
        }

        /**
         * 设置售楼处电话
         *
         * @param phone 售楼处电话
         */
        public void setPhone(String phone) {
            this.phone = phone;
        }

        /**
         * 获取开发商
         *
         * @return developer - 开发商
         */
        public String getDeveloper() {
            return developer;
        }

        /**
         * 设置开发商
         *
         * @param developer 开发商
         */
        public void setDeveloper(String developer) {
            this.developer = developer;
        }

        /**
         * 获取楼层状况
         *
         * @return floor_number - 楼层状况
         */
        public Integer getFloorNumber() {
            return floorNumber;
        }

        /**
         * 设置楼层状况
         *
         * @param floorNumber 楼层状况
         */
        public void setFloorNumber(Integer floorNumber) {
            this.floorNumber = floorNumber;
        }

        /**
         * 获取物业管理费
         *
         * @return anagement_price - 物业管理费
         */
        public BigDecimal getAnagementPrice() {
            return anagementPrice;
        }

        /**
         * 设置物业管理费
         *
         * @param anagementPrice 物业管理费
         */
        public void setAnagementPrice(BigDecimal anagementPrice) {
            this.anagementPrice = anagementPrice;
        }

        /**
         * 获取物业公司
         *
         * @return anagement_company - 物业公司
         */
        public String getAnagementCompany() {
            return anagementCompany;
        }

        /**
         * 设置物业公司
         *
         * @param anagementCompany 物业公司
         */
        public void setAnagementCompany(String anagementCompany) {
            this.anagementCompany = anagementCompany;
        }

        /**
         * 获取车位数
         *
         * @return parking_number - 车位数
         */
        public Integer getParkingNumber() {
            return parkingNumber;
        }

        /**
         * 设置车位数
         *
         * @param parkingNumber 车位数
         */
        public void setParkingNumber(Integer parkingNumber) {
            this.parkingNumber = parkingNumber;
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
         * 图片路劲
         *
         * @return CREATED_TIME - 创建时间
         */
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
    }

