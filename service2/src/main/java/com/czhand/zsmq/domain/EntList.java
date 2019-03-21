package com.czhand.zsmq.domain;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Table(name = "ent_list")
public class EntList implements Serializable {

    private static final long serialVersionUID = 222L;

    /**
     * 主键id;主键id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 企业id;关联ent_base的id
     */
    @Column(name = "ent_id")
    private Long entId;

    /**
     * 类别;类别
     */
    @Column(name = "type")
    private String type;

    /**
     * 上市时间;上市时间
     */
    @Column(name = "list_date")
    private Date listDate;

    /**
     * 股权代码;股权代码
     */
    @Column(name = "stock_code")
    private String stockCode;

    /**
     * 备注;备注
     */
    @Column(name = "remark")
    private String remark;

    /**
     * 版本号;版本号（暂定为1.0）
     */
    @Column(name = "version")
    private Long version;

    /**
     * 创建人id;创建人id
     */
    @Column(name = "creation_by")
    private Long creationBy;

    /**
     * 创建时间;创建时间
     */
    @Column(name = "creation_date")
    private Date creationDate;

    /**
     * 更新人id;更新人id
     */
    @Column(name = "update_by")
    private Long updateBy;

    /**
     * 更新时间;更新时间
     */
    @Column(name = "update_date")
    private Date updateDate;

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEntId() {
        return this.entId;
    }

    public void setEntId(Long entId) {
        this.entId = entId;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getListDate() {
        return this.listDate;
    }

    public void setListDate(Date listDate) {
        this.listDate = listDate;
    }

    public String getStockCode() {
        return this.stockCode;
    }

    public void setStockCode(String stockCode) {
        this.stockCode = stockCode;
    }

    public String getRemark() {
        return this.remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Long getVersion() {
        return this.version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public Long getCreationBy() {
        return this.creationBy;
    }

    public void setCreationBy(Long creationBy) {
        this.creationBy = creationBy;
    }

    public Date getCreationDate() {
        return this.creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public Long getUpdateBy() {
        return this.updateBy;
    }

    public void setUpdateBy(Long updateBy) {
        this.updateBy = updateBy;
    }

    public Date getUpdateDate() {
        return this.updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

}