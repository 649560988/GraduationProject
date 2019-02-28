package com.czhand.zsmq.domain;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;

@Table(name = "sys_menu_role")
public class SysMenuRole implements Serializable {
    /**
     * 主键id 
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 菜单id
     */
    @Column(name = "menu_id")
    private Long menuId;

    /**
     * 角色id 
     */
    @Column(name = "role_id")
    private Long roleId;

    /**
     * 版本号（暂定为1.0）
     */
    private Long version;

    /**
     * 创建人id 
     */
    @Column(name = "creation_by")
    private Long creationBy;

    /**
     * 创建时间 
     */
    @Column(name = "creation_date")
    private Date creationDate;

    /**
     * 更新人id 
     */
    @Column(name = "update_by")
    private Long updateBy;

    /**
     * 更新时间 
     */
    @Column(name = "update_date")
    private Date updateDate;

    private static final long serialVersionUID = 1L;

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
     * 获取菜单id
     *
     * @return menu_id - 菜单id
     */
    public Long getMenuId() {
        return menuId;
    }

    /**
     * 设置菜单id
     *
     * @param menuId 菜单id
     */
    public void setMenuId(Long menuId) {
        this.menuId = menuId;
    }

    /**
     * 获取角色id 
     *
     * @return role_id - 角色id 
     */
    public Long getRoleId() {
        return roleId;
    }

    /**
     * 设置角色id 
     *
     * @param roleId 角色id 
     */
    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    /**
     * 获取版本号（暂定为1.0）
     *
     * @return version - 版本号（暂定为1.0）
     */
    public Long getVersion() {
        return version;
    }

    /**
     * 设置版本号（暂定为1.0）
     *
     * @param version 版本号（暂定为1.0）
     */
    public void setVersion(Long version) {
        this.version = version;
    }

    /**
     * 获取创建人id 
     *
     * @return creation_by - 创建人id 
     */
    public Long getCreationBy() {
        return creationBy;
    }

    /**
     * 设置创建人id 
     *
     * @param creationBy 创建人id 
     */
    public void setCreationBy(Long creationBy) {
        this.creationBy = creationBy;
    }

    /**
     * 获取创建时间 
     *
     * @return creation_date - 创建时间 
     */
    public Date getCreationDate() {
        return creationDate;
    }

    /**
     * 设置创建时间 
     *
     * @param creationDate 创建时间 
     */
    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    /**
     * 获取更新人id 
     *
     * @return update_by - 更新人id 
     */
    public Long getUpdateBy() {
        return updateBy;
    }

    /**
     * 设置更新人id 
     *
     * @param updateBy 更新人id 
     */
    public void setUpdateBy(Long updateBy) {
        this.updateBy = updateBy;
    }

    /**
     * 获取更新时间 
     *
     * @return update_date - 更新时间 
     */
    public Date getUpdateDate() {
        return updateDate;
    }

    /**
     * 设置更新时间 
     *
     * @param updateDate 更新时间 
     */
    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }
}