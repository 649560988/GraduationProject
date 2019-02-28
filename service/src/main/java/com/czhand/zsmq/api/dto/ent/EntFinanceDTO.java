package com.czhand.zsmq.api.dto.ent;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Date;
@ApiModel("企业财务信息DTO")
public class EntFinanceDTO implements Serializable {

    /** 主键id;主键id */
    @ApiModelProperty(value = "主键id", example = "0")
    private Long id ;

    /** 年;年 */
    @ApiModelProperty(value = "年", example = "2019")
    private String year ;

    /** 月;月 */
    @ApiModelProperty(value = "月", example = "12")
    private String month ;

    /** 销售额;销售额(单位：万元) */
    @ApiModelProperty(value = "销售额(单位：万元)", example = "0.0")
    private Double sale ;

    /** 纳税额;纳税额(单位：元) */
    @ApiModelProperty(value = "纳税额(单位：元)", example = "0.0")
    private Double taxes ;

    /** 企业id;企业id */
    @ApiModelProperty(value = "企业id", example = "1")
    private String entId ;

    /** 版本号;版本号（暂定为1.0） */
    @ApiModelProperty(value = "版本号", example = "1")
    private Long version ;

    /** 创建人id;创建人id */
    @ApiModelProperty(value = "年", example = "2019")
    private Long creationBy ;

    /** 创建时间;创建时间 */
    @ApiModelProperty(value = "创建时间", example = "2019-01-11 00:00:00")
    private Date creationDate ;

    /** 更新人id;更新人id */
    @ApiModelProperty(value = "更新人id", example = "1")
    private Long updateBy ;

    /** 更新时间;更新时间 */
    @ApiModelProperty(value = "更新时间", example = "2019-01-11 00:00:00")
    private Date updateDate ;

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
}
