package com.czhand.zsmq.api.dto;

import com.czhand.zsmq.api.dto.ent.EntBaseDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
@ApiModel("用户DTO")
public class SysUserDTO implements Serializable {
    /**
     * 主键id 主键id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ApiModelProperty("主键id")
    private Long id;

    /**
     * 用户名 用户名
     */
    @ApiModelProperty("用户名")
    private String userName;

    /**
     * 真实姓名 真实姓名（默认填写手机号）
     */
    @ApiModelProperty("真实姓名")
    private String realName;

    /**
     * 密码 密码
     */
    @ApiModelProperty("密码")
    private String password;

    /**
     * 手机号 手机号
     */
    @ApiModelProperty("手机号")
    private String telephone;

    /**
     * 是否删除 删除标志，0表示未删除，1表示已删除
     */
    @ApiModelProperty("是否删除 删除标志，0表示未删除，1表示已删除")
    private Integer isDel;

    /**
     * 版本号 版本号（暂定为1.0）
     */
    @ApiModelProperty("版本号（暂定为1.0）")
    private Long version;

    /**
     * 创建人id 创建人id
     */
    @ApiModelProperty("创建人id")
    private Long creationBy;

    /**
     * 创建时间 创建时间
     */
    @ApiModelProperty("创建时间")
    private Date creationDate;

    /**
     * 更新人id 更新人id
     */
    @ApiModelProperty("更新人id")
    private Long updateBy;

    /**
     * 更新时间 更新时间
     */
    @ApiModelProperty("更新时间")
    private Date updateDate;

    private static final long serialVersionUID = 1L;
    /**
     * 用户角色集合
     */
    @ApiModelProperty("用户角色集合")
    private List<SysRoleDTO> sysRoles;

    @ApiModelProperty("企业基础信息DTO")
    private EntBaseDTO entBaseDTO;

    public EntBaseDTO getEntBaseDTO() {
        return entBaseDTO;
    }

    public void setEntBaseDTO(EntBaseDTO entBaseDTO) {
        this.entBaseDTO = entBaseDTO;
    }

    public List<SysRoleDTO> getSysRoles() {
        return sysRoles;
    }

    public void setSysRoles(List<SysRoleDTO> sysRoles) {
        this.sysRoles = sysRoles;
    }

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
     * 获取用户名 用户名
     *
     * @return user_name - 用户名 用户名
     */
    public String getUserName() {
        return userName;
    }

    /**
     * 设置用户名 用户名
     *
     * @param userName 用户名 用户名
     */
    public void setUserName(String userName) {
        this.userName = userName;
    }

    /**
     * 获取真实姓名 真实姓名（默认填写手机号）
     *
     * @return real_name - 真实姓名 真实姓名（默认填写手机号）
     */
    public String getRealName() {
        return realName;
    }

    /**
     * 设置真实姓名 真实姓名（默认填写手机号）
     *
     * @param realName 真实姓名 真实姓名（默认填写手机号）
     */
    public void setRealName(String realName) {
        this.realName = realName;
    }

    /**
     * 获取密码 密码
     *
     * @return password - 密码 密码
     */
    public String getPassword() {
        return password;
    }

    /**
     * 设置密码 密码
     *
     * @param password 密码 密码
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * 获取手机号 手机号
     *
     * @return telephone - 手机号 手机号
     */
    public String getTelephone() {
        return telephone;
    }

    /**
     * 设置手机号 手机号
     *
     * @param telephone 手机号 手机号
     */
    public void setTelephone(String telephone) {
        this.telephone = telephone;
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
}