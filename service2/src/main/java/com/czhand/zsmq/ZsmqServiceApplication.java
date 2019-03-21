package com.czhand.zsmq;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication
@EnableSwagger2
@MapperScan(basePackages = "com.czhand.zsmq.infra.mapper")
public class ZsmqServiceApplication {
    public static void main(String[] args){
        SpringApplication.run(ZsmqServiceApplication.class, args);
    }
}

