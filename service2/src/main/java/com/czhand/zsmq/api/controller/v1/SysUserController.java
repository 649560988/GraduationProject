package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.SysUserDTO;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.utils.ArgsUtils;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import com.czhand.zsmq.app.service.SysUserService;
import com.github.pagehelper.PageInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 用户管理
 *
 * @author linjing
 */
@RestController
@RequestMapping("/v1/sysuser")
@Api(description = "用户管理API")
public class SysUserController {

    @Autowired
    private SysUserService sysUserService;

    /**
     * 新增用户
     *
     * @param sysUserDTO 一条用户信息
     * @return 是否插入成功，成功为0，失败为1
     */
    @ApiOperation("新增用户")
    @PostMapping
    public ResponseEntity<Data<SysUserDTO>> createSysUser(@RequestBody @Valid @ApiParam("新增的用户对象") SysUserDTO sysUserDTO) {
        //判断参数是否为空
        if (ArgsUtils.checkArgsNull(sysUserDTO)) {
            throw new CommonException("参数不正确");
        }
        SysUserDTO result = null;
        String message = "成功";
        try {
            result = sysUserService.createSysUser(sysUserDTO);
        } catch (Exception e) {
            message = e.getMessage();
        }
        return ResponseUtils.res(result, message);
    }
    /**
     * 更新用户信息
     *
     * @param sysUserDTO 一条用户信息
     * @return 是否更新成功，成功为0，失败为1
     */
    @ApiOperation("更新用户信息")
    @PutMapping
    public ResponseEntity<Data<SysUserDTO>> updateSysMenu(@RequestBody @Valid @ApiParam("更新的用户对象") SysUserDTO sysUserDTO) {
        //禁止修改用户的登录名和密码
        sysUserDTO.setUserName(null);
        sysUserDTO.setTelephone(null);

        //判断参数是否为空
        if (ArgsUtils.checkArgsNull(sysUserDTO)) {
            throw new CommonException("参数不正确");
        }
        SysUserDTO result = null;
        String message = "成功";
        try {
            result = sysUserService.updateSysUser(sysUserDTO);
        } catch (Exception e) {
            message = e.getMessage();
        }

        return ResponseUtils.res(result, message);
    }

    /**
     * 查询一条用户详细信息
     *
     * @param id sys_user表Id
     * @return 一条用户详细信息
     */
    @ApiOperation("查询单条数据")
    @GetMapping("{id}")
    public ResponseEntity<Data<SysUserDTO>> selectOne(@PathVariable @ApiParam(value = "查询对象的ID",example = "1") Long id) {
        SysUserDTO sysUser = null;
        String message = "成功";
        try {
            sysUser = sysUserService.selectOne(id);
        } catch (Exception e) {
            message = "失败";
        }
        return ResponseUtils.res(sysUser, message);
    }

    /**
     * 1.分页查询 2.根据realName模糊查询
     *
     * @param realName 真实姓名
     * @param pageNo   分页查询中的参数pageNo
     * @param pageSize 分页查询中的参数pageSize
     * @return 列表数据
     */
    @ApiOperation("分页查询和根据真实姓名模糊查询")
    @GetMapping
    public ResponseEntity<Data<PageInfo<SysUserDTO>>> selectByRealName(
            @RequestParam(required = false, name = "realName") @ApiParam("真实姓名") String realName,
            @RequestParam(required = true, name = "pageNo") @ApiParam(value = "分页查询中的参数pageNo",example = "1") int pageNo,
            @RequestParam(required = true, name = "pageSize") @ApiParam(value = "分页查询中的参数pageSize",example = "10") int pageSize
    ) {
        PageInfo<SysUserDTO> sysUserPageInfo = null;
        String message = "成功";
        try {
            sysUserPageInfo = sysUserService.selectByRealName(realName, pageNo, pageSize);
        } catch (Exception e) {
            message = "失败";

        }
        return ResponseUtils.res(sysUserPageInfo, message);
    }

    /**
     * 禁用、启用用户
     *
     * @param id    要查询对象的ID
     * @param isdel 是否禁用：禁用为1，启用为0
     * @return 状态是否更新成功
     */
    @ApiOperation("禁用、启用用户")
    @GetMapping("/{id}/{isdel}")
    public ResponseEntity<Data<Integer>> stopOrStart(@PathVariable("id") @ApiParam(value = "要禁用对象的ID",example = "1") Long id,
                                                     @PathVariable("isdel") @ApiParam(value = "是否禁用，禁用为1，启用为0",example = "1") int isdel) {
        //判断参数是否为空
        if (ArgsUtils.checkArgsNull(id, isdel)) {
            throw new CommonException("参数不正确");
        }
        int result = 0;
        String message = "成功";
        try {
            result = sysUserService.stopOrStart(id, isdel);
        } catch (Exception e) {
            message = e.getMessage();
        }
        return ResponseUtils.res(result, message);
    }

    /**
     * 查询所有用户（包括企业信息，不包括角色信息）
     * @return 所有用户集合
     */
    @ApiOperation("查询所有用户")
    @GetMapping("/selectall")
    public ResponseEntity<Data<List<SysUserDTO>>> selectOne() {
        List<SysUserDTO> sysUser = null;
        String message = "成功";
        try {
            sysUser = sysUserService.selectAllUsers();
        } catch (Exception e) {
            message = "失败";
        }
        return ResponseUtils.res(sysUser, message);
    }
}
