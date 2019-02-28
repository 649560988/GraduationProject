package com.czhand.zsmq.domain;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.*;

@Table(name = "message_base")
public class MessageBase implements Serializable {
    /**
     * 主键id 主键id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 标题 标题
     */
    private String title;

    /**
     * 是否所有可见 用于标记是否要设置查阅权限 0是部分可见，1是所有可见
     */
    @Column(name = "is_all")
    private Integer isAll;

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
     * 正文 正文
     */
    private String content;


	@Transient
	private List<Long> users;

	public List<Long> getUsers() {
		return users;
	}
	public void setUsers(List<Long> users) {
		this.users = users;
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
     * 获取标题 标题
     *
     * @return title - 标题 标题
     */
    public String getTitle() {
        return title;
    }

    /**
     * 设置标题 标题
     *
     * @param title 标题 标题
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * 获取是否所有可见 用于标记是否要设置查阅权限 0是部分可见，1是所有可见
     *
     * @return is_all - 是否所有可见 用于标记是否要设置查阅权限 0是部分可见，1是所有可见
     */
    public Integer getIsAll() {
        return isAll;
    }

    /**
     * 设置是否所有可见 用于标记是否要设置查阅权限 0是部分可见，1是所有可见
     *
     * @param isAll 是否所有可见 用于标记是否要设置查阅权限 0是部分可见，1是所有可见
     */
    public void setIsAll(Integer isAll) {
        this.isAll = isAll;
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
     * 获取正文 正文
     *
     * @return content - 正文 正文
     */
    public String getContent() {
        return content;
    }

    /**
     * 设置正文 正文
     *
     * @param content 正文 正文
     */
    public void setContent(String content) {
        this.content = content;
    }
}