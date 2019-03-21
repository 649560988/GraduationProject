package com.czhand.zsmq.domain;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;

@Table(name = "design_tenant")
public class DesignTenant implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 组织名
     */
    private String name;

    /**
     * 组织code
     */
    private String code;

    private String logo;

    private String owner;

    @Column(name = "object_version_number")
    private Long objectVersionNumber;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "creation_date")
    private Date creationDate;

    @Column(name = "last_updated_by")
    private Long lastUpdatedBy;

    @Column(name = "last_update_date")
    private Date lastUpdateDate;

    private static final long serialVersionUID = 1L;

    /**
     * @return id
     */
    public Long getId() {
        return id;
    }

    /**
     * @param id
     */
    public void setId(Long id) {
        this.id = id;
    }

    /**
     * 获取组织名
     *
     * @return name - 组织名
     */
    public String getName() {
        return name;
    }

    /**
     * 设置组织名
     *
     * @param name 组织名
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 获取组织code
     *
     * @return code - 组织code
     */
    public String getCode() {
        return code;
    }

    /**
     * 设置组织code
     *
     * @param code 组织code
     */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * @return logo
     */
    public String getLogo() {
        return logo;
    }

    /**
     * @param logo
     */
    public void setLogo(String logo) {
        this.logo = logo;
    }

    /**
     * @return owner
     */
    public String getOwner() {
        return owner;
    }

    /**
     * @param owner
     */
    public void setOwner(String owner) {
        this.owner = owner;
    }

    /**
     * @return object_version_number
     */
    public Long getObjectVersionNumber() {
        return objectVersionNumber;
    }

    /**
     * @param objectVersionNumber
     */
    public void setObjectVersionNumber(Long objectVersionNumber) {
        this.objectVersionNumber = objectVersionNumber;
    }

    /**
     * @return created_by
     */
    public Long getCreatedBy() {
        return createdBy;
    }

    /**
     * @param createdBy
     */
    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    /**
     * @return creation_date
     */
    public Date getCreationDate() {
        return creationDate;
    }

    /**
     * @param creationDate
     */
    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    /**
     * @return last_updated_by
     */
    public Long getLastUpdatedBy() {
        return lastUpdatedBy;
    }

    /**
     * @param lastUpdatedBy
     */
    public void setLastUpdatedBy(Long lastUpdatedBy) {
        this.lastUpdatedBy = lastUpdatedBy;
    }

    /**
     * @return last_update_date
     */
    public Date getLastUpdateDate() {
        return lastUpdateDate;
    }

    /**
     * @param lastUpdateDate
     */
    public void setLastUpdateDate(Date lastUpdateDate) {
        this.lastUpdateDate = lastUpdateDate;
    }
}