package com.czhand.zsmq.api.dto.ent;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.Date;

@ApiModel("企业基础信息DTO")
public class EntBaseDTO {

    @ApiModelProperty(value = "主键id", example = "1")
    private Long id;

    /**
     * 企业名称 所有人可见
     */
    @ApiModelProperty(value = "企业名称", example = "德宜电器")
    private String entName;

    /**
     * 企业简称 所有人可见
     */
    @ApiModelProperty(value = "企业简称", example = "德电")
    private String entShortName;

    /**
     * 企业简介 所有人可见
     */
    @ApiModelProperty(value = "企业简介", example = "巴拉巴拉巴拉巴拉")
    private String entAbstract;

    /**
     * 地址 所有人可见
     */
    @ApiModelProperty(value = "地址", example = "尼泊尔")
    private String address;

    /**
     * 法人代表 所有人可见
     */
    @ApiModelProperty(value = "法人代表", example = "王俊凯")
    private String corporation;

    /**
     * 法人代表电话 所有人可见
     */
    @ApiModelProperty(value = "法人代表电话", example = "19288776666")
    private String corporationTel;

    /**
     * 注册资本 所有人可见
     */
    @ApiModelProperty(value = "注册资本", example = "2500孟加拉币")
    private String registeredCapital;

    /**
     * 成立日期 所有人可见
     */
    @ApiModelProperty(value = "成立日期", example = "2012-09-22 20:09:50")
    private Date establishDate;

    /**
     * 工商注册号 所有人可见
     */
    @ApiModelProperty(value = "工商注册号", example = "0916-28735283")
    private String registrationNum;

    /**
     * 组织机构代码 所有人可见（和企业人员关联）
     */
    @ApiModelProperty(value = "组织机构代码", example = "00100001-2")
    private String organizationalCode;

    /**
     * 股东 所有人可见
     */
    @ApiModelProperty(value = "股东", example = "李承晚")
    private String shareholder;

    /**
     * 联系人 政府人员可见
     */
    @ApiModelProperty(value = "联系人", example = "大卫·芬奇")
    private String contacts;

    /**
     * 联系人电话 政府人员可见
     */
    @ApiModelProperty(value = "联系人电话", example = "052-37689944")
    private String contactsTel;

    /**
     * 实际用地面积 政府人员可见
     */
    @ApiModelProperty(value = "实际用地面积", example = "0.01平方米")
    private String siteArea;

    /**
     * 土地证面积 政府人员可见
     */
    @ApiModelProperty(value = "土地证面积", example = "0.0001平方千米")
    private String landArea;

    /**
     * 房产证面积 政府人员可见
     */
    @ApiModelProperty(value = "房产证面积", example = "0.00009平方千米")
    private String propertyArea;

    /**
     * 是否删除 ，0表示未删除，1表示已删除
     */
    @ApiModelProperty(value = "删除标志", example = "0")
    private Integer isDel;

    /**
     * 版本号 （暂定为1.0）
     */
    @ApiModelProperty(value = "版本号", example = "1")
    private Long version;

    /**
     * 创建人id
     */
    @ApiModelProperty(value = "创建人id", example = "11")
    private Long creationBy;

    /**
     * 创建时间
     */
    @ApiModelProperty(value = "创建时间", example = "2019-01-24 16:57:43")
    private Date creationDate;

    /**
     * 更新人id
     */
    @ApiModelProperty(value = "更新人id", example = "11")
    private Long updateBy;

    /**
     * 更新时间
     */
    @ApiModelProperty(value = "更新时间", example = "2019-01-24 16:57:43")
    private Date updateDate;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEntName() {
        return entName;
    }

    public void setEntName(String entName) {
        this.entName = entName;
    }

    public String getEntShortName() {
        return entShortName;
    }

    public void setEntShortName(String entShortName) {
        this.entShortName = entShortName;
    }

    public String getEntAbstract() {
        return entAbstract;
    }

    public void setEntAbstract(String entAbstract) {
        this.entAbstract = entAbstract;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCorporation() {
        return corporation;
    }

    public void setCorporation(String corporation) {
        this.corporation = corporation;
    }

    public String getCorporationTel() {
        return corporationTel;
    }

    public void setCorporationTel(String corporationTel) {
        this.corporationTel = corporationTel;
    }

    public String getRegisteredCapital() {
        return registeredCapital;
    }

    public void setRegisteredCapital(String registeredCapital) {
        this.registeredCapital = registeredCapital;
    }

    public Date getEstablishDate() {
        return establishDate;
    }

    public void setEstablishDate(Date establishDate) {
        this.establishDate = establishDate;
    }

    public String getRegistrationNum() {
        return registrationNum;
    }

    public void setRegistrationNum(String registrationNum) {
        this.registrationNum = registrationNum;
    }

    public String getOrganizationalCode() {
        return organizationalCode;
    }

    public void setOrganizationalCode(String organizationalCode) {
        this.organizationalCode = organizationalCode;
    }

    public String getShareholder() {
        return shareholder;
    }

    public void setShareholder(String shareholder) {
        this.shareholder = shareholder;
    }

    public String getContacts() {
        return contacts;
    }

    public void setContacts(String contacts) {
        this.contacts = contacts;
    }

    public String getContactsTel() {
        return contactsTel;
    }

    public void setContactsTel(String contactsTel) {
        this.contactsTel = contactsTel;
    }

    public String getSiteArea() {
        return siteArea;
    }

    public void setSiteArea(String siteArea) {
        this.siteArea = siteArea;
    }

    public String getLandArea() {
        return landArea;
    }

    public void setLandArea(String landArea) {
        this.landArea = landArea;
    }

    public String getPropertyArea() {
        return propertyArea;
    }

    public void setPropertyArea(String propertyArea) {
        this.propertyArea = propertyArea;
    }

    public Integer getIsDel() {
        return isDel;
    }

    public void setIsDel(Integer isDel) {
        this.isDel = isDel;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public Long getCreationBy() {
        return creationBy;
    }

    public void setCreationBy(Long creationBy) {
        this.creationBy = creationBy;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public Long getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(Long updateBy) {
        this.updateBy = updateBy;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }
}
