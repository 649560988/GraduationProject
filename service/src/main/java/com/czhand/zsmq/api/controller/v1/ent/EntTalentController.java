//package com.czhand.zsmq.api.controller.v1.ent;
//
//import com.czhand.zsmq.api.dto.ent.EntBaseDTO;
//import com.czhand.zsmq.infra.utils.web.ResponseUtils;
//import com.czhand.zsmq.infra.utils.web.dto.Data;
//import io.swagger.annotations.Api;
//import io.swagger.annotations.ApiOperation;
//import io.swagger.annotations.ApiParam;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
///**
// * @author:LVCHENBIN
// * @Date: 2019/1/22 15:18
// */
//@RestController
//@RequestMapping("/v1/enterprises/talent")
//@Api(description = "人才企业信息维护-控制器")
//public class EntTalentController {
//
//    /**
//     * 根据组织机构代码删除人才企业
//     *
//     * @param organizationalCode
//     * @return 成功返回对象
//     */
//    @ApiOperation("根据组织机构代码删除人才企业")
//    @DeleteMapping("/delete/{organizational_code}")
//    public ResponseEntity<Data<EntBaseDTO>> deleteEnterprise(
//            @PathVariable("organizational_code")
//            @ApiParam("待删除人才企业的组织机构代码") String organizationalCode) {
//
//
//        return ResponseUtils.res(new EntBaseDTO(), "33");
//    }
//
//}
