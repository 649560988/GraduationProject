package com.czhand.zsmq.domain;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/24 10:10
 * @@Description
 */
@Table(name = "question")
public class Question implements Serializable {
    /**
     * 主键id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 问题发布人id
     */
    @Column(name = "user_id")
    private  Long userId;

    /**
     * 问题类型
     */
    @Column(name = "type")
    private  Integer type;

    /**
     * 问题发布人姓名
     */
    @Column(name = "user_name")
    private  String userName;

    /**
     * 问题描述
     */
    @Column(name = "description")
    private  String description;

    /**
     * 问题内容
     */
    @Column(name = "content")
    private  String content;

    @Column(name = "created_time")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    private Date createdTime;

    @Column(name = "count_answer")
    private Integer countAnswer;

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
