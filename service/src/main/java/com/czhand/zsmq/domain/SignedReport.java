package com.czhand.zsmq.domain;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;

@Table(name = "signed_report")
public class SignedReport implements Serializable {
    /**
     * 主键id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 举报人id
     */
    @Column(name = "informer_id")
    private Long informerId;

    /**
     * 举报用户名
     */
    @Column(name = "informer_username")
    private String informerUsername;

    /**
     * 举报人联系方式
     */
    @Column(name = "informer_phone")
    private String informerPhone;

    /**
     * 被举报用户id
     */
    @Column(name = "against_id")
    private Long againstId;

    /**
     * 被举报用户名
     */
    @Column(name = "against_username")
    private String againstUsername;

    /**
     * 被举报信息id
     */
    @Column(name = "info_id")
    private String infoId;

    /**
     * 举报类型
     */
    @Column(name = "violation_type")
    private String violationType;

    /**
     * 举报描述
     */
    @Column(name = "violation_content")
    private String violationContent;

    /**
     * 是否解决 0:已解决1：待解决2：处理中
     */
    @Column(name = "is_resolve")
    private Integer isResolve;

    /**
     * 创建时间
     */
    @Column(name = "CREATED_TIME")
    @CreatedDate
    private Date createdTime;

    /**
     * 更新时间
     */
    @Column(name = "UPDATED_TIME")
    @LastModifiedDate
    private Date updatedTime;

    private static final long serialVersionUID = 1L;

    /**
     * 获取主键id
     *
     * @return id - 主键id
     */
    public Long getId() {
        return id;
    }

    /**
     * 设置主键id
     *
     * @param id 主键id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * 获取举报人id
     *
     * @return informer_id - 举报人id
     */
    public Long getInformerId() {
        return informerId;
    }

    /**
     * 设置举报人id
     *
     * @param informerId 举报人id
     */
    public void setInformerId(Long informerId) {
        this.informerId = informerId;
    }

    /**
     * 获取举报用户名
     *
     * @return informer_username - 举报用户名
     */
    public String getInformerUsername() {
        return informerUsername;
    }

    /**
     * 设置举报用户名
     *
     * @param informerUsername 举报用户名
     */
    public void setInformerUsername(String informerUsername) {
        this.informerUsername = informerUsername;
    }

    /**
     * 获取举报人联系方式
     *
     * @return informer_phone - 举报人联系方式
     */
    public String getInformerPhone() {
        return informerPhone;
    }

    /**
     * 设置举报人联系方式
     *
     * @param informerPhone 举报人联系方式
     */
    public void setInformerPhone(String informerPhone) {
        this.informerPhone = informerPhone;
    }

    /**
     * 获取被举报用户id
     *
     * @return against_id - 被举报用户id
     */
    public Long getAgainstId() {
        return againstId;
    }

    /**
     * 设置被举报用户id
     *
     * @param againstId 被举报用户id
     */
    public void setAgainstId(Long againstId) {
        this.againstId = againstId;
    }

    /**
     * 获取被举报用户名
     *
     * @return against_username - 被举报用户名
     */
    public String getAgainstUsername() {
        return againstUsername;
    }

    /**
     * 设置被举报用户名
     *
     * @param againstUsername 被举报用户名
     */
    public void setAgainstUsername(String againstUsername) {
        this.againstUsername = againstUsername;
    }

    /**
     * 获取被举报信息id
     *
     * @return info_id - 被举报信息id
     */
    public String getInfoId() {
        return infoId;
    }

    /**
     * 设置被举报信息id
     *
     * @param infoId 被举报信息id
     */
    public void setInfoId(String infoId) {
        this.infoId = infoId;
    }

    /**
     * 获取举报类型
     *
     * @return violation_type - 举报类型
     */
    public String getViolationType() {
        return violationType;
    }

    /**
     * 设置举报类型
     *
     * @param violationType 举报类型
     */
    public void setViolationType(String violationType) {
        this.violationType = violationType;
    }

    /**
     * 获取举报描述
     *
     * @return violation_content - 举报描述
     */
    public String getViolationContent() {
        return violationContent;
    }

    /**
     * 设置举报描述
     *
     * @param violationContent 举报描述
     */
    public void setViolationContent(String violationContent) {
        this.violationContent = violationContent;
    }

    /**
     * 获取是否解决 0:已解决1：待解决2：处理中
     *
     * @return is_resolve - 是否解决 0:已解决1：待解决2：处理中
     */
    public Integer getIsResolve() {
        return isResolve;
    }

    /**
     * 设置是否解决 0:已解决1：待解决2：处理中
     *
     * @param isResolve 是否解决 0:已解决1：待解决2：处理中
     */
    public void setIsResolve(Integer isResolve) {
        this.isResolve = isResolve;
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
}