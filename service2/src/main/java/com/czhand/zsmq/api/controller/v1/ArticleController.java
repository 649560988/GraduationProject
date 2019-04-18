package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.ArticleDTO;
import com.czhand.zsmq.app.service.ArticleService;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.utils.ArgsUtils;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import com.github.pagehelper.PageInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @version 1.0
 * @autor wyw
 * @data 2019/4/16 14:21
 * @@Description 文章发布管理
 */
@Api("文章发布管理")
@RestController
@RequestMapping("v1/wyw/article")
public class ArticleController {
    @Autowired
    private ArticleService articleService;
    /**
    *@Description 增加文章
    *@Param [articleDTO]
    *@Return org.springframework.http.ResponseEntity<com.czhand.zsmq.infra.utils.web.dto.Data<com.czhand.zsmq.api.dto.ArticleDTO>>
    *@Author wyw
    *@Date 2019/4/16
    *@Time 15:19
    */
    @ApiOperation("增加文章")
    @PostMapping("/createArticle")
    public ResponseEntity<Data<ArticleDTO>> createArticle(@RequestBody ArticleDTO articleDTO){
        if(ArgsUtils.checkArgsNull(articleDTO)){
            throw  new CommonException("参数为空");
        }
        String message="添加成功";
        ArticleDTO result=articleService.createArticle(articleDTO);
        return ResponseUtils.res(result,message);
    }
    /**
    *@Description 查询所有文章
    *@Param []
    *@Return org.springframework.http.ResponseEntity<com.czhand.zsmq.infra.utils.web.dto.Data<java.util.List<com.czhand.zsmq.api.dto.ArticleDTO>>>
    *@Author wyw
    *@Date 2019/4/17
    *@Time 13:43
    */
    @ApiOperation("查询所有文章")
    @GetMapping("/selectAll")
    public ResponseEntity<Data<List<ArticleDTO>>> selectAll(){
        String message="成功";
        List<ArticleDTO> articleDTOList=articleService.selectAll();
        return ResponseUtils.res(articleDTOList,message);
    }
    /**
    *@Description 删除一条记录
    *@Param [id]
    *@Return org.springframework.http.ResponseEntity<com.czhand.zsmq.infra.utils.web.dto.Data<java.util.List<com.czhand.zsmq.api.dto.ArticleDTO>>>
    *@Author wyw
    *@Date 2019/4/17
    *@Time 14:00
    */
    @ApiOperation("删除一条记录")
    @GetMapping("/deleteById/{id}")
    public ResponseEntity<Data<Integer>> deleteById(@PathVariable("id") Long id){
        String message="成功";
        Integer result=articleService.deleteById(id);
        return ResponseUtils.res(result,message);
    }
    @ApiOperation("分页查询楼盘信息")
    @GetMapping("selectAllByPage")
    public ResponseEntity<Data<PageInfo<ArticleDTO>>> selectAllByPage(
            @RequestParam(required = true, name = "pageNo") @ApiParam(value = "分页查询中的参数pageNo",example = "1") int pageNo,
            @RequestParam(required = true, name = "pageSize") @ApiParam(value = "分页查询中的参数pageSize",example = "10") int pageSize
    ){
        PageInfo<ArticleDTO> buildingDTOPageInfo=null;
        String message="成功";
        try {
            buildingDTOPageInfo=articleService.selectAllByPage(pageNo, pageSize);
        }catch (Exception e){
            message = "失败";
        }
        return ResponseUtils.res(buildingDTOPageInfo, message);
    }
    /**
    *@Description  根据id查询单条信息
    *@Param [id]
    *@Return org.springframework.http.ResponseEntity<com.czhand.zsmq.infra.utils.web.dto.Data<com.czhand.zsmq.api.dto.ArticleDTO>>
    *@Author wyw
    *@Date 2019/4/17
    *@Time 15:28
    */
    @ApiOperation("查询单条信息")
    @GetMapping("/{id}")
    public ResponseEntity<Data<ArticleDTO>> queryOne(@PathVariable("id") Long id){
        if(ArgsUtils.checkArgsNull(id)){
            throw  new CommonException("参数为空");
        }
        String message="查询成功";
        ArticleDTO    buildingDTO=articleService.selectOne(id);
        return ResponseUtils.res(buildingDTO,message);
    }
    /**
    *@Description
    *@Param [id, isdel]
    *@Return org.springframework.http.ResponseEntity<com.czhand.zsmq.infra.utils.web.dto.Data<java.lang.Integer>>
    *@Author wyw
    *@Date 2019/4/17
    *@Time 23:05
    */
    @ApiOperation("启用或者停止")
    @GetMapping("/stopOrStart/{id}/{isdel}")
    public ResponseEntity<Data<Integer>> stopOrStart(@PathVariable("id") Long id,@PathVariable("isdel") Integer isdel){
        Integer result=articleService.stopOrStart(id,isdel);
        String message="成功";
        return ResponseUtils.res(result,message);
    }
}
