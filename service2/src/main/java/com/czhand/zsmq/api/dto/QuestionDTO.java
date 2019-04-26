package com.czhand.zsmq.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.io.Serializable;
import java.util.Date;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/24 10:34
 * @@Description
 */
@ApiModel("问题")
public class QuestionDTO implements Serializable {
    /**
     * 主键id
     */
    @ApiModelProperty("主键id")
    private Long id;

    /**
     * 问题发布人id
     */
    @ApiModelProperty("问题发布人id")
    private  Long userId;

    /**
     * 问题类型
     */
    @ApiModelProperty("问题类型")
    private  Integer type;

    /**
     * 问题发布人姓名
     */
    @ApiModelProperty("问题发布人姓名")
    private  String userName;

    /**
     * 问题描述
     */
    @ApiModelProperty("问题描述")
    private  String description;

    /**
     * 问题内容
     */
    @ApiModelProperty("问题内容")
    private  String content;

    @ApiModelProperty("创建时间")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    private Date createdTime;

    /**
     * 数量
     */
    @ApiModelProperty("数量")
    private  Integer countAnswer;

    public Integer getCountAnswer() {
        return countAnswer;
    }

    public void setCountAnswer(Integer countAnswer) {
        this.countAnswer = countAnswer;
    }

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

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
}
