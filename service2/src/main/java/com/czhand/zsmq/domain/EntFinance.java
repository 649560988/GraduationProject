package com.czhand.zsmq.domain;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Table(name = "ent_finance")
public class EntFinance implements Serializable {

    /**
     * 主键id;主键id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 年;年
     */
    private String year;

    /**
     * 月;月
     */
    private String month;

    /**
     * 销售额;销售额(单位：万元)
     */
    private Double sale;

    /**
     * 纳税额;纳税额(单位：元)
     */
    private Double taxes;

    /**
     * 企业id;企业id
     */
    private String entId;

    /**
     * 版本号;版本号（暂定为1.0）
     */
    private Long version;

    /**
     * 创建人id;创建人id
     */
    private Long creationBy;

    /**
     * 创建时间;创建时间
     */
    private Date creationDate;

    /**
     * 更新人id;更新人id
     */
    private Long updateBy;

    /**
     * 更新时间;更新时间
     */
    private Date updateDate;

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

    public EntFinance() {

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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Double getSale() {
        return sale;
    }

    public void setSale(Double sale) {
        this.sale = sale;
    }

    public Double getTaxes() {
        return taxes;
    }

    public void setTaxes(Double taxes) {
        this.taxes = taxes;
    }

    public String getEntId() {
        return entId;
    }

    public void setEntId(String entId) {
        this.entId = entId;
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


    public EntFinance(Long creationBy) {
        this.creationBy = creationBy;
    }
}
