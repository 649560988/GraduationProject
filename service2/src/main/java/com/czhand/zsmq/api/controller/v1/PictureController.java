package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.PictureDTO;
import com.czhand.zsmq.app.service.PictureServices;
import com.czhand.zsmq.domain.Picture;
import com.czhand.zsmq.infra.exception.CommonException;
import com.czhand.zsmq.infra.mapper.PictureMapper;
import com.czhand.zsmq.infra.utils.ArgsUtils;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * @autor wyw
 * @data 2019/3/7 9:16
 */
@Api("图片信息")
@RestController
@RequestMapping("v1/wyw/picture")
public class PictureController {
    @Autowired
    PictureServices pictureServices;
    /**
     * 插入图片
     * */
    @ApiOperation("插入图片")
    @PostMapping("/insertPictures/{type}")
    public ResponseEntity<Data<PictureDTO>> insertPictures(@RequestBody MultipartFile file,
                                                           @PathVariable("type") Integer type
                                                          ) throws IOException {

        String newFileName;
        if (file == null) {
           throw new CommonException("插入出错");
        }
        if(ArgsUtils.checkArgsNull(type)){
            throw  new CommonException("参数为空");
        }
            String originFileName = file.getOriginalFilename();
            if (originFileName == null && " ".contentEquals(originFileName)){
                throw new CommonException("插入出错");
            }
        String extrName = originFileName.substring(originFileName.lastIndexOf("."));
        newFileName = UUID.randomUUID().toString() + extrName;
        String baseDir = "E:\\GraduationProject\\progress2\\img\\";
        File dirFile = new File(baseDir);
        if (!dirFile.exists()) {
            dirFile.mkdirs();
        }
        file.transferTo(new File(baseDir + newFileName));
        PictureDTO pictureDTO=pictureServices.insertPicture(newFileName,type);
        String message = "添加成功";
        return ResponseUtils.res(pictureDTO,message);
        }

}
