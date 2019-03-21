package com.czhand.zsmq.api.dto;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

public class MessageUserDTO implements Serializable {
    /**
     * 主键id 主键id
     */
    private Long id;

    /**
     * 信息id 信息id
     */
    private Long messageId;

    /**
     * 用户id 用户id
     */
    private Long userId;

    /**
     * 是否已阅 是否已阅，0表示未阅，1表示已阅
     */
    private Integer isRead;

    /**
     * 版本号 版本号（暂定为1.0）
     */
    private Long version;

    /**
     * 创建人id 创建人id
     */
    private Long creationBy;

    /**
     * 创建时间 创建时间
     */
    private Date creationDate;

    /**
     * 更新人id 更新人id
     */
    private Long updateBy;

    /**
     * 更新时间 更新时间
     */
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
     * 获取信息id 信息id
     *
     * @return message_id - 信息id 信息id
     */
    public Long getMessageId() {
        return messageId;
    }

    /**
     * 设置信息id 信息id
     *
     * @param messageId 信息id 信息id
     */
    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }

    /**
     * 获取用户id 用户id
     *
     * @return user_id - 用户id 用户id
     */
    public Long getUserId() {
        return userId;
    }

    /**
     * 设置用户id 用户id
     *
     * @param userId 用户id 用户id
     */
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    /**
     * 获取是否已阅 是否已阅，0表示未阅，1表示已阅
     *
     * @return is_read - 是否已阅 是否已阅，0表示未阅，1表示已阅
     */
    public Integer getIsRead() {
        return isRead;
    }

    /**
     * 设置是否已阅 是否已阅，0表示未阅，1表示已阅
     *
     * @param isRead 是否已阅 是否已阅，0表示未阅，1表示已阅
     */
    public void setIsRead(Integer isRead) {
        this.isRead = isRead;
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