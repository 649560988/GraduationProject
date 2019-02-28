package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.SysRoleDTO;
import com.czhand.zsmq.app.service.SysRoleService;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.utils.ArgsUtils;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import com.github.pagehelper.PageInfo;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 角色管理
 *
 * @author linjing
 */
@RestController
@RequestMapping("/v1/sysrole")
public class SysRoleController {

    @Autowired
    private SysRoleService sysRoleService;

    /**
     * 新增角色
     *
     * @param sysRoleDTO 角色信息
     * @return 是否插入成功，成功为0，失败为1
     */
    @ApiOperation("新增角色")
    @PostMapping
    public ResponseEntity<Data<SysRoleDTO>> createSysRole(@RequestBody @Valid @ApiParam("要插入的角色信息") SysRoleDTO sysRoleDTO) {

        //判断参数是否为空
        if (ArgsUtils.checkArgsNull(sysRoleDTO)) {
            throw new CommonException("参数不正确");
        }

        SysRoleDTO result = null;
        String message = "成功";
        try {
            result = sysRoleService.createSysRole(sysRoleDTO);
        } catch (Exception e) {
            message = "失败";
        }
        return ResponseUtils.res(result, message);
    }

    /**
     * 更新角色信息
     *
     * @param sysRoleDTO 角色信息
     * @return 是否更新成功，成功为0，失败为1
     */
    @ApiOperation("更新角色信息")
    @PutMapping
    public ResponseEntity<Data<SysRoleDTO>> updateSysRole(@RequestBody @Valid @ApiParam("需要更新的角色信息") SysRoleDTO sysRoleDTO) {
        //判断参数是否为空
        if (ArgsUtils.checkArgsNull(sysRoleDTO)) {
            throw new CommonException("参数不正确");
        }
        SysRoleDTO result = null;
        String message = "成功";
        try {
            result = sysRoleService.updateSysRole(sysRoleDTO);
        } catch (Exception e) {
            message = "失败";
        }
        return ResponseUtils.res(result, message);

    }

    /**
     * 查询单条数据
     *
     * @param id sys_role表id
     * @return 一条角色信息
     */
    @ApiOperation("查询单条数据")
    @GetMapping("{id}")
    public ResponseEntity<Data<SysRoleDTO>> selectOneRole(@PathVariable @ApiParam(value = "要查询的角色ID",example = "1") Long id) {

        SysRoleDTO sysRoleDTO = null;
        String message = "成功";
        try {
            sysRoleDTO = sysRoleService.selectOne(id);
        } catch (Exception e) {
            message = "失败";
        }
        return ResponseUtils.res(sysRoleDTO, message);
    }

    /**
     * 禁用、启用角色
     *
     * @param id    sys_role表id
     * @param isdel 1为禁用，0为启用
     * @return 状态是否改变成功，1为失败，0为成功
     */
    @ApiOperation("禁用、启用角色")
    @GetMapping("/{id}/{isdel}")
    public ResponseEntity<Data<Integer>> stopOrStartRole(@PathVariable("id") @ApiParam(value = "要禁用的角色ID" ,example = "1") Long id,
                                                         @PathVariable("isdel") @ApiParam(value = "是否要禁用，1为禁用，0为启用",example = "1") int isdel) {
        //判断参数是否为空
        if (ArgsUtils.checkArgsNull(id, isdel)) {
            throw new CommonException("参数不正确");
        }
        int result = 0;
        String message = "成功";
        try {
            result = sysRoleService.stopOrStart(id, isdel);
        } catch (Exception e) {
            message = "失败";
        }
        return ResponseUtils.res(result, message);
    }

    /**
     * 查询所有角色
     *
     * @return 所有启用角色
     */
    @ApiOperation("查询所有角色")
    @GetMapping
    public ResponseEntity<Data<List<SysRoleDTO>>> selectAllRole() {
        List<SysRoleDTO> sysRoles = null;
        String message = "成功";
        try {
            sysRoles = sysRoleService.selectAllRole();
        } catch (Exception e) {
            message = "失败";
        }
        return ResponseUtils.res(sysRoles, message);

    }

    /**
     * 分页查询,查询禁用、启用角色，模糊查询
     *
     * @param pageNo   分页查询中的参数pageNo
     * @param pageSize 分页查询中的参数pageSize
     * @param isDel    1为禁用，0为启用
     * @param name     角色名称
     * @return 分页角色结果集
     */
    @ApiOperation("分页查询,查询禁用、启用角色，模糊查询")
    @GetMapping("/pagerole")
    public  ResponseEntity<Data<PageInfo<SysRoleDTO>>> selectPageRole(
            @RequestParam(required = true, name = "pageNo") @ApiParam(value = "分页查询中的参数pageNo" ,example = "2") int pageNo,
            @RequestParam(required = true, name = "pageSize") @ApiParam(value = "分页查询中的参数pageSize",example = "10") int pageSize,
            @RequestParam(required = false, name = "isDel") String isDel,
            @RequestParam(required = false, name = "name") String name) {

        PageInfo<SysRoleDTO> sysRoles= null;
        String message = "成功";
        try {
            sysRoles = sysRoleService.selectPageRole(pageNo, pageSize, isDel, name);
        } catch (Exception e) {
            message = "失败";
        }
        return ResponseUtils.res(sysRoles, message);

    }
}
