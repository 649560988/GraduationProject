package com.czhand.zsmq.domain;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.*;

public class Picture implements Serializable {
    /**
     * 主键id
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * 房屋类别 1表示楼盘0表示出租屋
     */
    private Integer type;

    /**
     * 所属id 楼盘或出租屋id
     */
    @Column(name = "belong_id")
    private Integer belongId;

    /**
     * 创建时间
     */
    @Column(name = "CREATE_TIME")
    private Date createTime;

    /**
     * 更新时间
     */
    @Column(name = "UPDATED_TIME")
    private Date updatedTime;

    /**
     * 图片地址
     */
    private String src;

    private static final long serialVersionUID = 1L;

    /**
     * 获取主键id
     *
     * @return id - 主键id
     */
    public Integer getId() {
        return id;
    }

    /**
     * 设置主键id
     *
     * @param id 主键id
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * 获取房屋类别 1表示楼盘0表示出租屋
     *
     * @return type - 房屋类别 1表示楼盘0表示出租屋
     */
    public Integer getType() {
        return type;
    }

    /**
     * 设置房屋类别 1表示楼盘0表示出租屋
     *
     * @param type 房屋类别 1表示楼盘0表示出租屋
     */
    public void setType(Integer type) {
        this.type = type;
    }

    /**
     * 获取所属id 楼盘或出租屋id
     *
     * @return belong_id - 所属id 楼盘或出租屋id
     */
    public Integer getBelongId() {
        return belongId;
    }

    /**
     * 设置所属id 楼盘或出租屋id
     *
     * @param belongId 所属id 楼盘或出租屋id
     */
    public void setBelongId(Integer belongId) {
        this.belongId = belongId;
    }

    /**
     * 获取创建时间
     *
     * @return CREATE_TIME - 创建时间
     */
    public Date getCreateTime() {
        return createTime;
    }

    /**
     * 设置创建时间
     *
     * @param createTime 创建时间
     */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
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
     * 获取图片地址
     *
     * @return src - 图片地址
     */
    public String getSrc() {
        return src;
    }

    /**
     * 设置图片地址
     *
     * @param src 图片地址
     */
    public void setSrc(String src) {
        this.src = src;
    }
}