package com.czhand.zsmq.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;
import java.util.Date;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/16 14:21
 * @@Description
 */
@ApiModel("文章")
public class ArticleDTO implements Serializable {
    /**
     * 主键id
     */
    @ApiModelProperty("主键id")
    private Long id;
    /**
     * 发布人Id
     */
    @ApiModelProperty("发布人Id")
    private Long userId;
    /**
     * 发布人xingm
     */
    @ApiModelProperty("发布人姓名")
    private  String userName;
    /**
     * title
     */
    @ApiModelProperty("文章标题")
    private  String title;
    /**
     * title
     */
    @ApiModelProperty("文章内容")
    private  String content;
    /**
     * 是否删除
     */
    @ApiModelProperty("是否删除")
    private  Integer isDel;
    /**
     * 创建时间
     */
    @ApiModelProperty("创建时间")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    private Date createdTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
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

    public Date getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Date createdTime) {
        this.createdTime = createdTime;
    }

    public Integer getIsDel() {
        return isDel;
    }

    public void setIsDel(Integer isDel) {
        this.isDel = isDel;
    }
}
