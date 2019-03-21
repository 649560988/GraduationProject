package com.czhand.zsmq.domain.core;

import com.czhand.zsmq.domain.SysRole;
import com.czhand.zsmq.domain.SysUser;
import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import javax.persistence.Column;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

public class CurrentUser extends User {


    private Long id;

    private String userName;

    private String realName;

    private String telephone;

    private Integer isDel;

    private Long version;

    private Long creationBy;

    private Date creationDate;

    private Long updateBy;

    private Date updateDate;



    private CurrentUser(String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
    }

    public static  CurrentUser newInstance(SysUser sysUser, List<SysRole> roles){

        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();

        for(SysRole role : roles){
            authorities.add(new SimpleGrantedAuthority(role.getCode()));
        }

        CurrentUser user = new CurrentUser(sysUser.getUserName(),
                sysUser.getPassword(),
                sysUser.getIsDel() == 0,
                true,
                true,
                true
                ,authorities);

        user.id = sysUser.getId();
        user.userName = sysUser.getUserName();
        user.realName = sysUser.getRealName();
        user.telephone = sysUser.getTelephone();
        user.isDel = sysUser.getIsDel();
        user.version = sysUser.getVersion();
        user.creationBy = sysUser.getCreationBy();
        user.creationDate = sysUser.getCreationDate();
        user.updateBy = sysUser.getUpdateBy();
        user.updateDate = sysUser.getUpdateDate();


        return user;
    }


    public Long getId() {
        return id;
    }

    public String getUserName() {
        return userName;
    }

    public String getRealName() {
        return realName;
    }

    public String getTelephone() {
        return telephone;
    }

    public Integer getIsDel() {
        return isDel;
    }

    public Long getVersion() {
        return version;
    }

    public Long getCreationBy() {
        return creationBy;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public Long getUpdateBy() {
        return updateBy;
    }

    public Date getUpdateDate() {
        return updateDate;
    }
}
