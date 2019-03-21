package com.czhand.zsmq.domain;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;

@Table(name = "sys_param_children")
public class SysParamChildren implements Serializable {
    /**
     * 主键id 主键id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 父参数编码 父参数编码
     */
    @Column(name = "sys_param_id")
    private String sysParamId;

    /**
     * 参数名称 参数名称
     */
    @Column(name = "param_name")
    private String paramName;

    /**
     * 参数编码 参数编码
     */
    @Column(name = "param_code")
    private String paramCode;

    /**
     * 序号 序号
     */
    private Long sort;

    /**
     * 版本号 版本号（暂定为1.0）
     */
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
     * 获取父参数编码 父参数编码
     *
     * @return sys_param_id - 父参数编码 父参数编码
     */
    public String getSysParamId() {
        return sysParamId;
    }

    /**
     * 设置父参数编码 父参数编码
     *
     * @param sysParamId 父参数编码 父参数编码
     */
    public void setSysParamId(String sysParamId) {
        this.sysParamId = sysParamId;
    }

    /**
     * 获取参数名称 参数名称
     *
     * @return param_name - 参数名称 参数名称
     */
    public String getParamName() {
        return paramName;
    }

    /**
     * 设置参数名称 参数名称
     *
     * @param paramName 参数名称 参数名称
     */
    public void setParamName(String paramName) {
        this.paramName = paramName;
    }

    /**
     * 获取参数编码 参数编码
     *
     * @return param_code - 参数编码 参数编码
     */
    public String getParamCode() {
        return paramCode;
    }

    /**
     * 设置参数编码 参数编码
     *
     * @param paramCode 参数编码 参数编码
     */
    public void setParamCode(String paramCode) {
        this.paramCode = paramCode;
    }

    /**
     * 获取序号 序号
     *
     * @return sort - 序号 序号
     */
    public Long getSort() {
        return sort;
    }

    /**
     * 设置序号 序号
     *
     * @param sort 序号 序号
     */
    public void setSort(Long sort) {
        this.sort = sort;
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