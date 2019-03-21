package com.czhand.zsmq.api.dto;

import com.czhand.zsmq.domain.SysMenu;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;


@ApiModel("菜单DTO")
public class SysMenuDTO implements Serializable{

	@ApiModelProperty(value = "id",example = "")
	private Long id;

    /**
     * 菜单名 菜单名
     */
	@ApiModelProperty(value = "菜单名",example = "test")
    private String menuName;

    /**
     * 语言 语言
     */
	@ApiModelProperty(value = "语言",example = "zh_CN")
	private String language;

    /**
     * 父级id 父级id
     */
	@ApiModelProperty(value = "父级id",example ="1")
    private Long parentId;

    /**
     * 路由 菜单对应页面
     */
	@ApiModelProperty(value = "路由",example = "test")
    private String route;

    /**
     * 排序
     */
	@ApiModelProperty(value = "排序字段",example = "2")
    private Long sort;

	@ApiModelProperty(value = "1禁用0启用",example = "1")
	private Integer isDel;

    /**
     * 版本号 版本号（暂定为1.0）
     */
	@ApiModelProperty("版本号")
    private Long version;

    /**
     * 创建人id 创建人id
     */
	@ApiModelProperty("创建人id")
	private Long creationBy;

    /**
     * 创建时间 创建时间
     */
	@ApiModelProperty("创建时间")
	private Date creationDate;

    /**
     * 更新人id 更新人id
     */
    @Column(name = "更新人id")
    private Long updateBy;

    /**
     * 更新时间 更新时间
     */
	@ApiModelProperty("更新时间")
    private Date updateDate;


	private static final long serialVersionUID = 1L;

	@Transient
	@ApiModelProperty("子菜单")
	private List<SysMenu> children;






	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getMenuName() {
		return menuName;
	}

	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public String getRoute() {
		return route;
	}

	public void setRoute(String route) {
		this.route = route;
	}

	public Long getSort() {
		return sort;
	}

	public void setSort(Long sort) {
		this.sort = sort;
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

	public List<SysMenu> getChildren() {
		return children;
	}

	public void setChildren(List<SysMenu> children) {
		this.children = children;
	}
}