package com.czhand.zsmq.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.Date;

@ApiModel("评论")
public class CommentDTO {
    /**
     * 主键id 主键
     */
    @ApiModelProperty("主键id 主键")
    private Long id;

    /**
     * 用户id
     */
    @ApiModelProperty("用户id")
    private Long userId;
    /**
     * 房屋类别 1表示楼盘0表示出租屋
     */
    @ApiModelProperty("type")
    private Integer type;

    /**
     * 评论人姓名
     */
    @ApiModelProperty("userName")
    private String userName;

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

    public Long getBelongId() {
        return belongId;
    }

    public void setBelongId(Long belongId) {
        this.belongId = belongId;
    }

    /**
     * 所属id 楼盘或出租屋id
     */

    @ApiModelProperty("belong_id")
    private Long belongId;
    /**
     * 评论内容
     */
    @ApiModelProperty("评论内容")
    private String content;

    /**
     * 评论板块id
     */
    @ApiModelProperty("评论板块id")
    private Long commentId;

    /**
     * 创建时间
     */
    @ApiModelProperty("创建时间")
    @CreatedDate
    // @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone="GMT+8")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date createdTime;

    /**
     * 更新时间
     */
    @ApiModelProperty("更新时间")
    @LastModifiedDate
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date updatedTime;

    /**
     * 点赞数
     */
    @ApiModelProperty("点赞数")
    private Integer great;

    /**
     * 不符合
     */
    @ApiModelProperty("不符合")
    private Integer bad;

    private static final long serialVersionUID = 1L;

    /**
     * 获取主键id 主键
     *
     * @return id - 主键id 主键
     */
    public Long getId() {
        return id;
    }

    /**
     * 设置主键id 主键
     *
     * @param id 主键id 主键
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * 获取用户id
     *
     * @return user_id - 用户id
     */
    public Long getUserId() {
        return userId;
    }

    /**
     * 设置用户id
     *
     * @param userId 用户id
     */
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    /**
     * 获取评论内容
     *
     * @return content - 评论内容
     */
    public String getContent() {
        return content;
    }

    /**
     * 设置评论内容
     *
     * @param content 评论内容
     */
    public void setContent(String content) {
        this.content = content;
    }

    /**
     * 获取评论板块id
     *
     * @return comment_id - 评论板块id
     */
    public Long getCommentId() {
        return commentId;
    }

    /**
     * 设置评论板块id
     *
     * @param commentId 评论板块id
     */
    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    /**
     * 获取创建时间
     *
     * @return CREATED_TIME - 创建时间
     */
    public Date getCreatedTime() {
        return createdTime;
    }

    /**
     * 设置创建时间
     *
     * @param createdTime 创建时间
     */
    public void setCreatedTime(Date createdTime) {
        this.createdTime = createdTime;
    }

    /**
     * 获取更新时间
     *
     * @return UPDATED_TIME - 更新时间
     */
    public Date getUpdatedTime() {
        return updatedTime;
    }

    /**
     * 设置更新时间
     *
     * @param updatedTime 更新时间
     */
    public void setUpdatedTime(Date updatedTime) {
        this.updatedTime = updatedTime;
    }

    /**
     * 获取点赞数
     *
     * @return great - 点赞数
     */
    public Integer getGreat() {
        return great;
    }

    /**
     * 设置点赞数
     *
     * @param great 点赞数
     */
    public void setGreat(Integer great) {
        this.great = great;
    }

    /**
     * 获取不符合
     *
     * @return bad - 不符合
     */
    public Integer getBad() {
        return bad;
    }

    /**
     * 设置不符合
     *
     * @param bad 不符合
     */
    public void setBad(Integer bad) {
        this.bad = bad;
    }
}
