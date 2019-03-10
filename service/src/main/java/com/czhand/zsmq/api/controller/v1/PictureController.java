package com.czhand.zsmq.api.controller.v1;

import com.czhand.zsmq.api.dto.PictureDTO;
import com.czhand.zsmq.app.service.PictureServices;
import com.czhand.zsmq.domain.Picture;
import com.czhand.zsmq.infra.mapper.PictureMapper;
import com.czhand.zsmq.infra.utils.web.ResponseUtils;
import com.czhand.zsmq.infra.utils.web.dto.Data;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
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
    @PostMapping("/insertPictures")
    public ResponseEntity<Data<List<PictureDTO>>> insertPictures(@RequestBody MultipartFile file) throws IOException {
//        if(files != null&& files.length > 0){
//            for (int i=0;i<files.length;i++){
//                MultipartFile file=files[i];
                if(file !=null) {
                    String originFileName = file.getOriginalFilename();
                    if (originFileName != null && !" ".contentEquals(originFileName)) {
                        String extrName = originFileName.substring(originFileName.lastIndexOf("."));
                        String newFileName = UUID.randomUUID().toString() + extrName;
                        String baseDir = "E:\\GraduationProject\\progress2\\img\\";
                        File dirFile = new File(baseDir);
                        if (!dirFile.exists()) {
                            dirFile.mkdirs();
                        }
                        file.transferTo(new File(baseDir + newFileName));
                    }
                }
//                }
//            }
//        }

//        List<PictureDTO> pictures=pictureServices.insertPictures(srcs);
        String message="添加成功";
//        return ResponseUtils.res(pictures,message);
        return  null;
    }
//    @ApiOperation("插入图片")
//    @PostMapping("/createPictures")
//    public ResponseEntity<Data<List<PictureDTO>>> createPictures(@RequestBody List<MultipartFile> file){
////        List<PictureDTO> pictures=pictureServices.insertPictures();
//        System.out.print(file);
//        String message="添加成功";
////        return ResponseUtils.res(pictures,message);
//        return  null;
//    }

}
