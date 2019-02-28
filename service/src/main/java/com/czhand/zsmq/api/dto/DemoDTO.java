package com.czhand.zsmq.api.dto;


import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel("演示DTO")
public class DemoDTO {

    @ApiModelProperty(value = "演示DTO的id",example = "123")
    private Long id;

    @ApiModelProperty(value = "演示DTO的name",example = "admin")
    private String name;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
