package com.czhand.zsmq.domain;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.*;

@Table(name = "sys_menu")
public class SysMenu implements Serializable {
    /**
     * 主键id 主键id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 菜单名 菜单名
     */
    @Column(name = "menu_name")
    private String menuName;

    /**
     * 语言 语言
     */
    private String language;

    /**
     * 父级id 父级id
     */
    @Column(name = "parent_id")
    private Long parentId;

    /**
     * 路由 菜单对应页面
     */
    private String route;

    /**
     * 排序
     */
    private Long sort;

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

	@Transient
	private List<SysMenu> children;

	public List<SysMenu> getChildren() {
		return children;
	}

	public void setChildren(List<SysMenu> children) {
		this.children = children;
	}

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
     * 获取菜单名 菜单名
     *
     * @return menu_name - 菜单名 菜单名
     */
    public String getMenuName() {
        return menuName;
    }

    /**
     * 设置菜单名 菜单名
     *
     * @param menuName 菜单名 菜单名
     */
    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    /**
     * 获取语言 语言
     *
     * @return language - 语言 语言
     */
    public String getLanguage() {
        return language;
    }

    /**
     * 设置语言 语言
     *
     * @param language 语言 语言
     */
    public void setLanguage(String language) {
        this.language = language;
    }

    /**
     * 获取父级id 父级id
     *
     * @return parent_id - 父级id 父级id
     */
    public Long getParentId() {
        return parentId;
    }

    /**
     * 设置父级id 父级id
     *
     * @param parentId 父级id 父级id
     */
    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    /**
     * 获取路由 菜单对应页面
     *
     * @return route - 路由 菜单对应页面
     */
    public String getRoute() {
        return route;
    }

    /**
     * 设置路由 菜单对应页面
     *
     * @param route 路由 菜单对应页面
     */
    public void setRoute(String route) {
        this.route = route;
    }

    /**
     * 获取排序
     *
     * @return sort - 排序
     */
    public Long getSort() {
        return sort;
    }

    /**
     * 设置排序
     *
     * @param sort 排序
     */
    public void setSort(Long sort) {
        this.sort = sort;
    }

    /**
     * @return is_del
     */
    public Integer getIsDel() {
        return isDel;
    }

    /**
     * @param isDel
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