  package com.czhand.zsmq.api.controller.v1;//package com.czhand.zsmq.api.controller.v1;

  import com.czhand.zsmq.api.dto.HouseStyleDto;
  import com.czhand.zsmq.app.service.HouseStyleService;
  import com.czhand.zsmq.infra.utils.web.ResponseUtils;
  import com.czhand.zsmq.infra.utils.web.dto.Data;
  import io.swagger.annotations.Api;
  import io.swagger.annotations.ApiOperation;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.http.ResponseEntity;
  import org.springframework.web.bind.annotation.*;


  import java.util.List;

  /**
   * @autor wyw
   * @data 2019/3/21 12:22
   */
  @Api("房屋类型")
  @RestController
  @RequestMapping("/v1/wyw/house-style")
  public class HouseStyleController {
      @Autowired
      private HouseStyleService houseStyleService;

      /**
       *查询所有房屋类型信息
       * */
      @ApiOperation("查询所有类型信息")
      @GetMapping("/selectAll")
      public ResponseEntity<Data<List<HouseStyleDto>>> queryAllHouseStyle(){
          String message="查询成功";
          List<HouseStyleDto> list=houseStyleService.queryAllHouseStyle();
          return ResponseUtils.res(list,message);
      }
      /**
       *添加房屋类型信息
       * */
      @ApiOperation("添加房屋类型信息")
      @PostMapping("/createHouseStyle")
      public ResponseEntity<Data<HouseStyleDto>> createHouseStyle(@RequestBody HouseStyleDto houseStyleDto) {
          String message = "添加成功";
          houseStyleDto = houseStyleService.createHouseStyle(houseStyleDto);
          return ResponseUtils.res(houseStyleDto, message);
      }
  }
