package com.czhand.zsmq.domain;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.*;

@Table(name = "sys_role")
public class SysRole implements Serializable {
    /**
     * 主键id 主键id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 角色名 角色名
     */
    private String name;

    /**
     * 是否删除 删除标志，0表示未删除，1表示已删除
     */
    @Column(name = "is_del")
    private Integer isDel;

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

    /**
     * 权限编码
     */
    private String code;

    private static final long serialVersionUID = 1L;

    /**
     * 角色菜单权限集合
     */
    @Transient
    private List<SysMenu> sysMenus;

    public List<SysMenu> getSysMenus() {
        return sysMenus;
    }

    public void setSysMenus(List<SysMenu> sysMenus) {
        this.sysMenus = sysMenus;
    }

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
     * 获取角色名 角色名
     *
     * @return name - 角色名 角色名
     */
    public String getName() {
        return name;
    }

    /**
     * 设置角色名 角色名
     *
     * @param name 角色名 角色名
     */
    public void setName(String name) {
        this.name = name;
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

    /**
     * 获取权限编码
     *
     * @return code - 权限编码
     */
    public String getCode() {
        return code;
    }

    /**
     * 设置权限编码
     *
     * @param code 权限编码
     */
    public void setCode(String code) {
        this.code = code;
    }
}