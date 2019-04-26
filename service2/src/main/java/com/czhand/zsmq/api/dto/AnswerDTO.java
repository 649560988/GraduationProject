package com.czhand.zsmq.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.Date;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/24 10:33
 * @@Description
 */
@ApiModel("回答")
public class AnswerDTO {
    /**
     * 主键id
     */
    @ApiModelProperty("主键id")
    private Long id;
    /**
     *回答人id
     * */
    @ApiModelProperty("回答人id")
    private Long userId;

    /**
     * 问题id
     */
    @ApiModelProperty("问题id")
    private  Long questionId;

    /**
     *回答人name
     * */
    @ApiModelProperty("回答人name")
    private String userName;

    /**
     *回答内容
     * */
    @ApiModelProperty("回答内容")
    private String content;

    /**
     *回答时间
     * */
    @ApiModelProperty("回答时间")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    private Date createdTime;

    /**
     *回答类型
     * */
    @ApiModelProperty("回答类型")
    private Integer type;

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

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
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

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }
}
