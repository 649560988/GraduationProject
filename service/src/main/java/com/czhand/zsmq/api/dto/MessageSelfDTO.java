package com.czhand.zsmq.api.dto;

import io.swagger.annotations.ApiModelProperty;

import javax.persistence.Column;
import java.util.Date;

/**
 * @author:WANGJING
 * @Date: 2019/2/18 11:19
 */
public class MessageSelfDTO {
	/**
	 * 主键id 主键id
	 */
	@ApiModelProperty("主键id")
	private Long id;

	/**
	 * 标题 标题
	 */
	@ApiModelProperty("标题")
	private String title;

	/**
	 * 正文 正文
	 */
	@ApiModelProperty("正文")
	private String content;

	/**
	 * 是否所有可见 用于标记是否要设置查阅权限 0是部分可见，1是所有可见
	 */
	@ApiModelProperty("是否所有可见 用于标记是否要设置查阅权限 0是部分可见，1是所有可见")
	private Integer isAll;

	/**
	 * 是否删除 删除标志，0表示未删除，1表示已删除
	 */
	@ApiModelProperty("是否删除 删除标志，0表示未删除，1表示已删除")
	private Integer isDel;

	/**
	 * 是否已阅 是否已阅，0表示未阅，1表示已阅
	 */
	private Integer isRead;

	/**
	 * 更新时间 更新时间
	 */
	@ApiModelProperty("更新时间")
	private Date updateDate;


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Integer getIsAll() {
		return isAll;
	}

	public void setIsAll(Integer isAll) {
		this.isAll = isAll;
	}

	public Integer getIsDel() {
		return isDel;
	}

	public void setIsDel(Integer isDel) {
		this.isDel = isDel;
	}

	public Integer getIsRead() {
		return isRead;
	}

	public void setIsRead(Integer isRead) {
		this.isRead = isRead;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
}
