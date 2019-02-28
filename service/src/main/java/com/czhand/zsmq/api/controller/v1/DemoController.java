package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.DemoDTO;
import com.czhand.zsmq.domain.core.CurrentUser;
import com.czhand.zsmq.infra.utils.security.CurrentUserUtils;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("v1/demos")  // 注意这里使用的是 复数
@Api(description = "演示控制器")
public class DemoController {


    /**
     * 统一使用slf4j 记录日志
     *
     */
    private final static Logger logger = LoggerFactory.getLogger(DemoController.class);


    @GetMapping
    @ApiOperation(value = "示例代码  查询对象")
    public ResponseEntity<Data<DemoDTO>> get(@RequestParam("name")@ApiParam("查询对象的name") String name){

        CurrentUser user =  CurrentUserUtils.get();
        logger.info("user:{}",user);

        return ResponseUtils.res(new DemoDTO());
    }

    @GetMapping("{id}")
    @ApiOperation(value = "示例代码  查询对象")
    public ResponseEntity<Data<DemoDTO>> getById(@PathVariable("id")@ApiParam(value = "查询对象的",example = "123") Long id){

        CurrentUser user =  CurrentUserUtils.get();
        logger.info("user:{}",user);

        return ResponseUtils.res(new DemoDTO());
    }


    @PostMapping
    @ApiOperation(value = "示例代码  新增对象")
    public ResponseEntity<Data<DemoDTO>> creat(@RequestBody @ApiParam("新增对象") DemoDTO dto){

        return ResponseUtils.res(new DemoDTO(),HttpStatus.CREATED);  // 返回201
    }

    @PutMapping
    @ApiOperation(value = "示例代码 单个更新对象")
    public ResponseEntity<Data<DemoDTO>> update(@RequestBody @ApiParam("需要更新的对象") DemoDTO dto){

        return ResponseUtils.res(new DemoDTO());
    }



    @PatchMapping
    @ApiOperation(value = "示例代码  批量更新")
    public ResponseEntity<Data<DemoDTO>> updatePatch(@RequestBody @ApiParam("需要批量更新的对象") DemoDTO dto){

        return ResponseUtils.res(new DemoDTO());
    }


    /**
     * 必须使用delete 并且返回204
     * @param id
     * @return
     */
    @DeleteMapping
    @ApiOperation(value = "示例代码 删除对象")
    public ResponseEntity<Data<DemoDTO>> delete(@RequestParam("id") @ApiParam(value = "需要删除对象的id",example = "123") Long id){

        return ResponseUtils.res(null,HttpStatus.NO_CONTENT);  //返回204
    }








}
