package com.czhand.zsmq.domain;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;

@Table(name = "ent_base")
public class EntBase implements Serializable {

    private static final long serialVersionUID = 111L;

    /**
     * 主键id 主键id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 企业名称 所有人可见
     */
    @Column(name = "ent_name")
    private String entName;

    /**
     * 企业简称 所有人可见
     */
    @Column(name = "ent_short_name")
    private String entShortName;

    /**
     * 企业简介 所有人可见
     */
    @Column(name = "ent_abstract")
    private String entAbstract;

    /**
     * 地址 所有人可见
     */
    @Column(name = "address")
    private String address;

    /**
     * 法人代表 所有人可见
     */
    @Column(name = "corporation")
    private String corporation;

    /**
     * 法人代表电话 所有人可见
     */
    @Column(name = "corporation_tel")
    private String corporationTel;

    /**
     * 注册资本 所有人可见
     */
    @Column(name = "registered_capital")
    private String registeredCapital;

    /**
     * 成立日期 所有人可见
     */
    @Column(name = "establish_date")
    private Date establishDate;

    /**
     * 工商注册号 所有人可见
     */
    @Column(name = "registration_num")
    private String registrationNum;

    /**
     * 组织机构代码 所有人可见（和企业人员关联）
     */
    @Column(name = "organizational_code")
    private String organizationalCode;

    /**
     * 股东 所有人可见
     */
    @Column(name = "shareholder")
    private String shareholder;

    /**
     * 联系人 政府人员可见
     */
    @Column(name = "contacts")
    private String contacts;

    /**
     * 联系人电话 政府人员可见
     */
    @Column(name = "contacts_tel")
    private String contactsTel;

    /**
     * 实际用地面积 政府人员可见
     */
    @Column(name = "site_area")
    private String siteArea;

    /**
     * 土地证面积 政府人员可见
     */
    @Column(name = "land_area")
    private String landArea;

    /**
     * 房产证面积 政府人员可见
     */
    @Column(name = "property_area")
    private String propertyArea;

    /**
     * 是否删除 删除标志，0表示未删除，1表示已删除
     */
    @Column(name = "is_del")
    private Integer isDel;

    /**
     * 版本号 版本号（暂定为1.0）
     */
    @Column(name = "version")
    private Long version;

    /**
     * 创建人id 创建人id
     */
    @Column(name = "creation_by")
    private Long creationBy;

    /**
     * 创建时间 创建时间
     */
    @Column(name = "creation_date")
    private Date creationDate;

    /**
     * 更新人id 更新人id
     */
    @Column(name = "update_by")
    private Long updateBy;

    /**
     * 更新时间 更新时间
     */
    @Column(name = "update_date")
    private Date updateDate;

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
     * 获取企业名称 所有人可见
     *
     * @return ent_name - 企业名称 所有人可见
     */
    public String getEntName() {
        return entName;
    }

    /**
     * 设置企业名称 所有人可见
     *
     * @param entName 企业名称 所有人可见
     */
    public void setEntName(String entName) {
        this.entName = entName;
    }

    /**
     * 获取企业简称 所有人可见
     *
     * @return ent_short_name - 企业简称 所有人可见
     */
    public String getEntShortName() {
        return entShortName;
    }

    /**
     * 设置企业简称 所有人可见
     *
     * @param entShortName 企业简称 所有人可见
     */
    public void setEntShortName(String entShortName) {
        this.entShortName = entShortName;
    }

    /**
     * 获取企业简介 所有人可见
     *
     * @return ent_abstract - 企业简介 所有人可见
     */
    public String getEntAbstract() {
        return entAbstract;
    }

    /**
     * 设置企业简介 所有人可见
     *
     * @param entAbstract 企业简介 所有人可见
     */
    public void setEntAbstract(String entAbstract) {
        this.entAbstract = entAbstract;
    }

    /**
     * 获取地址 所有人可见
     *
     * @return address - 地址 所有人可见
     */
    public String getAddress() {
        return address;
    }

    /**
     * 设置地址 所有人可见
     *
     * @param address 地址 所有人可见
     */
    public void setAddress(String address) {
        this.address = address;
    }

    /**
     * 获取法人代表 所有人可见
     *
     * @return corporation - 法人代表 所有人可见
     */
    public String getCorporation() {
        return corporation;
    }

    /**
     * 设置法人代表 所有人可见
     *
     * @param corporation 法人代表 所有人可见
     */
    public void setCorporation(String corporation) {
        this.corporation = corporation;
    }

    /**
     * 获取法人代表电话 所有人可见
     *
     * @return corporation_tel - 法人代表电话 所有人可见
     */
    public String getCorporationTel() {
        return corporationTel;
    }

    /**
     * 设置法人代表电话 所有人可见
     *
     * @param corporationTel 法人代表电话 所有人可见
     */
    public void setCorporationTel(String corporationTel) {
        this.corporationTel = corporationTel;
    }

    /**
     * 获取注册资本 所有人可见
     *
     * @return registered_capital - 注册资本 所有人可见
     */
    public String getRegisteredCapital() {
        return registeredCapital;
    }

    /**
     * 设置注册资本 所有人可见
     *
     * @param registeredCapital 注册资本 所有人可见
     */
    public void setRegisteredCapital(String registeredCapital) {
        this.registeredCapital = registeredCapital;
    }

    /**
     * 获取成立日期 所有人可见
     *
     * @return establish_date - 成立日期 所有人可见
     */
    public Date getEstablishDate() {
        return establishDate;
    }

    /**
     * 设置成立日期 所有人可见
     *
     * @param establishDate 成立日期 所有人可见
     */
    public void setEstablishDate(Date establishDate) {
        this.establishDate = establishDate;
    }

    /**
     * 获取工商注册号 所有人可见
     *
     * @return registration_num - 工商注册号 所有人可见
     */
    public String getRegistrationNum() {
        return registrationNum;
    }

    /**
     * 设置工商注册号 所有人可见
     *
     * @param registrationNum 工商注册号 所有人可见
     */
    public void setRegistrationNum(String registrationNum) {
        this.registrationNum = registrationNum;
    }

    /**
     * 获取组织机构代码 所有人可见（和企业人员关联）
     *
     * @return organizational_code - 组织机构代码 所有人可见（和企业人员关联）
     */
    public String getOrganizationalCode() {
        return organizationalCode;
    }

    /**
     * 设置组织机构代码 所有人可见（和企业人员关联）
     *
     * @param organizationalCode 组织机构代码 所有人可见（和企业人员关联）
     */
    public void setOrganizationalCode(String organizationalCode) {
        this.organizationalCode = organizationalCode;
    }

    /**
     * 获取股东 所有人可见
     *
     * @return shareholder - 股东 所有人可见
     */
    public String getShareholder() {
        return shareholder;
    }

    /**
     * 设置股东 所有人可见
     *
     * @param shareholder 股东 所有人可见
     */
    public void setShareholder(String shareholder) {
        this.shareholder = shareholder;
    }

    /**
     * 获取联系人 政府人员可见
     *
     * @return contacts - 联系人 政府人员可见
     */
    public String getContacts() {
        return contacts;
    }

    /**
     * 设置联系人 政府人员可见
     *
     * @param contacts 联系人 政府人员可见
     */
    public void setContacts(String contacts) {
        this.contacts = contacts;
    }

    /**
     * 获取联系人电话 政府人员可见
     *
     * @return contacts_tel - 联系人电话 政府人员可见
     */
    public String getContactsTel() {
        return contactsTel;
    }

    /**
     * 设置联系人电话 政府人员可见
     *
     * @param contactsTel 联系人电话 政府人员可见
     */
    public void setContactsTel(String contactsTel) {
        this.contactsTel = contactsTel;
    }

    /**
     * 获取实际用地面积 政府人员可见
     *
     * @return site_area - 实际用地面积 政府人员可见
     */
    public String getSiteArea() {
        return siteArea;
    }

    /**
     * 设置实际用地面积 政府人员可见
     *
     * @param siteArea 实际用地面积 政府人员可见
     */
    public void setSiteArea(String siteArea) {
        this.siteArea = siteArea;
    }

    /**
     * 获取土地证面积 政府人员可见
     *
     * @return land_area - 土地证面积 政府人员可见
     */
    public String getLandArea() {
        return landArea;
    }

    /**
     * 设置土地证面积 政府人员可见
     *
     * @param landArea 土地证面积 政府人员可见
     */
    public void setLandArea(String landArea) {
        this.landArea = landArea;
    }

    /**
     * 获取房产证面积 政府人员可见
     *
     * @return property_area - 房产证面积 政府人员可见
     */
    public String getPropertyArea() {
        return propertyArea;
    }

    /**
     * 设置房产证面积 政府人员可见
     *
     * @param propertyArea 房产证面积 政府人员可见
     */
    public void setPropertyArea(String propertyArea) {
        this.propertyArea = propertyArea;
    }

    /**
     * 获取是否删除 删除标志，0表示未删除，1表示已删除
     *
     * @return is_del - 是否删除 删除标志，0表示未删除，1表示已删除
     */
    public Integer getIsDel() {
        return isDel;
    }

    /**
     * 设置是否删除 删除标志，0表示未删除，1表示已删除
     *
     * @param isDel 是否删除 删除标志，0表示未删除，1表示已删除
     */
    public void setIsDel(Integer isDel) {
        this.isDel = isDel;
    }

    /**
     * 获取版本号 版本号（暂定为1.0）
     *
     * @return version - 版本号 版本号（暂定为1.0）
     */
    public Long getVersion() {
        return version;
    }

    /**
     * 设置版本号 版本号（暂定为1.0）
     *
     * @param version 版本号 版本号（暂定为1.0）
     */
    public void setVersion(Long version) {
        this.version = version;
    }

    /**
     * 获取创建人id 创建人id
     *
     * @return creation_by - 创建人id 创建人id
     */
    public Long getCreationBy() {
        return creationBy;
    }

    /**
     * 设置创建人id 创建人id
     *
     * @param creationBy 创建人id 创建人id
     */
    public void setCreationBy(Long creationBy) {
        this.creationBy = creationBy;
    }

    /**
     * 获取创建时间 创建时间
     *
     * @return creation_date - 创建时间 创建时间
     */
    public Date getCreationDate() {
        return creationDate;
    }

    /**
     * 设置创建时间 创建时间
     *
     * @param creationDate 创建时间 创建时间
     */
    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    /**
     * 获取更新人id 更新人id
     *
     * @return update_by - 更新人id 更新人id
     */
    public Long getUpdateBy() {
        return updateBy;
    }

    /**
     * 设置更新人id 更新人id
     *
     * @param updateBy 更新人id 更新人id
     */
    public void setUpdateBy(Long updateBy) {
        this.updateBy = updateBy;
    }

    /**
     * 获取更新时间 更新时间
     *
     * @return update_date - 更新时间 更新时间
     */
    public Date getUpdateDate() {
        return updateDate;
    }

    /**
     * 设置更新时间 更新时间
     *
     * @param updateDate 更新时间 更新时间
     */
    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }
}