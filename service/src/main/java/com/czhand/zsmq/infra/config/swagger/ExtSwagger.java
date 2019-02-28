package com.czhand.zsmq.infra.config.swagger;

import com.fasterxml.classmate.TypeResolver;
import com.google.common.collect.Ordering;
import com.google.common.collect.Sets;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import springfox.documentation.builders.ApiDescriptionBuilder;
import springfox.documentation.builders.OperationBuilder;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiDescription;
import springfox.documentation.service.Operation;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.ApiListingScannerPlugin;
import springfox.documentation.spi.service.contexts.DocumentationContext;
import springfox.documentation.spring.web.readers.operation.CachingOperationNameGenerator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@Component
public class ExtSwagger implements ApiListingScannerPlugin {
    @Override
    public List<ApiDescription> apply(DocumentationContext documentationContext) {


        return Arrays.asList(new ApiDescriptionBuilder(new Ordering<Operation>() {
            @Override
            public int compare(Operation operation, Operation t1) {
                return operation.getPosition() - t1.getPosition();
            }
        })
                .description("token相关接口")
                .groupName("token-test")
                .hidden(false)
                .path("/oauth/token")
                .operations(Arrays.asList(
                        new OperationBuilder(new CachingOperationNameGenerator())
                                .method(HttpMethod.POST)//http请求类型
                                .produces(Sets.newHashSet(MediaType.APPLICATION_JSON_VALUE))
                                .summary("获取token")
                                .notes("获取token")//方法描述
                                .tags(Sets.newHashSet("token"))
                                .parameters(
                                        Arrays.asList(
                                                new ParameterBuilder()
                                                        .description("oauth2鉴权方式，这里默认使用password")//参数描述
                                                        .type(new TypeResolver().resolve(String.class))//参数数据类型
                                                        .name("grant_type")//参数名称
                                                        .defaultValue("password")//参数默认值
                                                        .parameterType("query")//参数类型
                                                        .parameterAccess("access")
                                                        .required(true)//是否必填
                                                        .modelRef(new ModelRef("string")) //参数数据类型
                                                        .build(),
                                                new ParameterBuilder()
                                                        .description("用户名")
                                                        .type(new TypeResolver().resolve(String.class))
                                                        .name("username")
                                                        .parameterType("query")
                                                        .parameterAccess("access")
                                                        .required(true)
                                                        .modelRef(new ModelRef("string")) //<5>
                                                        .build(),
                                                new ParameterBuilder()
                                                        .description("密码")
                                                        .type(new TypeResolver().resolve(String.class))
                                                        .name("password")
                                                        .parameterType("query")
                                                        .parameterAccess("access")
                                                        .required(true)
                                                        .modelRef(new ModelRef("string")) //<5>
                                                        .build(),
                                                new ParameterBuilder()
                                                        .description("客户端编号")
                                                        .type(new TypeResolver().resolve(String.class))
                                                        .name("client_id")
                                                        .parameterType("query")
                                                        .parameterAccess("access")
                                                        .required(true)
                                                        .modelRef(new ModelRef("string")) //<5>
                                                        .defaultValue("client")
                                                        .build(),
                                                new ParameterBuilder()
                                                        .description("客户端密钥")
                                                        .type(new TypeResolver().resolve(String.class))
                                                        .name("client_secret")
                                                        .parameterType("query")
                                                        .parameterAccess("access")
                                                        .required(true)
                                                        .modelRef(new ModelRef("string")) //<5>
                                                        .defaultValue("secret")
                                                        .build(),
                                                new ParameterBuilder()
                                                        .description("返回数据格式类型，如果需要返回标准格式 该参数加入随意字符串即可")
                                                        .type(new TypeResolver().resolve(String.class))
                                                        .name("type")
                                                        .parameterType("query")
                                                        .parameterAccess("access")
                                                        .required(false)
                                                        .modelRef(new ModelRef("string")) //<5>
                                                        .build()
                                        ))
                                .build()
                ))
                .build());

    }

    @Override
    public boolean supports(DocumentationType documentationType) {
        return DocumentationType.SWAGGER_2.equals(documentationType);
    }
}
