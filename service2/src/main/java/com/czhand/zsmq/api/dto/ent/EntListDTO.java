package com.czhand.zsmq.api.dto.ent;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.Date;

@ApiModel("上市企业DTO")
public class EntListDTO {

    @ApiModelProperty(value = "主键id", example = "1")
    private Long id;

    /**
     * 企业id;关联ent_base的id
     */
    @ApiModelProperty(value = "企业id", example = "16")
    private Long entId;

    /**
     * 类别;类别
     */
    @ApiModelProperty(value = "类别", example = "高新技术企业")
    private String type;

    /**
     * 上市时间;上市时间
     */
    @ApiModelProperty(value = "上市时间", example = "1239200023")
    private Date listDate;

    /**
     * 股权代码;股权代码
     */
    @ApiModelProperty(value = "股权代码", example = "iusu391934")
    private String stockCode;

    /**
     * 备注;备注
     */
    @ApiModelProperty(value = "备注", example = "无")
    private String remark;

    /**
     * 版本号;版本号（暂定为1.0）
     */
    @ApiModelProperty(value = "版本", example = "1")
    private Long version;

    /**
     * 创建人id;创建人id
     */
    @ApiModelProperty(value = "创建人id", example = "11")
    private Long creationBy;

    /**
     * 创建时间;
     */
    @ApiModelProperty(value = "创建时间", example = "123234523")
    private Date creationDate;

    /**
     * 更新人id;
     */
    @ApiModelProperty(value = "更新人id", example = "11")
    private Long updateBy;

    /**
     * 更新时间;
     */
    @ApiModelProperty(value = "更新时间", example = "123234523")
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
