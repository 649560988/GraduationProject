package com.czhand.zsmq.domain;

import com.fasterxml.jackson.annotation.JsonFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/24 10:11
 * @@Description
 */
@Table(name = "answer")
public class Answer implements Serializable {
    /**
     * 主键id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    /**
     *回答人id
     * */
    @Column(name = "user_id")
    private Long userId;

    /**
     * 问题id
     */
    @Column(name = "question_id")
    private  Long questionId;

    /**
     *回答人name
     * */
    @Column(name = "user_name")
    private String userName;

    /**
     *回答内容
     * */
    @Column(name = "content")
    private String content;

    /**
     *回答时间
     * */
    @Column(name = "created_time")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    private Date createdTime;

    /**
     *回答类型
     * */
    @Column(name = "type")
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

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
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
