package com.czhand.zsmq.infra.utils.convertor;

import com.github.pagehelper.Page;

import java.util.ArrayList;
import java.util.List;


public class ConvertPageHelper {

    private ConvertPageHelper() {
    }

    /**
     * page的转换
     *
     * @param pageSource 要转换的page对象
     * @param destin     要转换的目标类型的Class
     * @param <T>        要转换的目标类型
     * @return 转换的后page对象
     */
    public static <T> Page<T> convertPage(final Page pageSource, final Class<T> destin) {
        Page<T> pageBack = new Page<>();
        pageBack.setPageNum(pageSource.getPageNum());
        pageBack.setTotal(pageSource.getTotal());
        pageBack.setPages(pageSource.getPages());
        pageBack.setPageSize(pageSource.getPageSize());

        if (pageSource.isEmpty()) {
            return pageBack;
        }

        Class<?> source = pageSource.get(0).getClass();
//        if (source.getTypeName().contains(ConvertHelper.SPRING_PROXY_CLASS)) {
//            source = source.getSuperclass();
//        }
//        final ConvertHelper.DestinClassData destinClassData = ConvertHelper.getDestinClassData(source, destin);
        List<T> list = new ArrayList<>(pageSource.size());
        for (Object object : pageSource) {
            T t = ConvertHelper.invokeConvertByBeanUtils(object, destin);
            list.add(t);
        }
        pageBack.addAll(list);


        return pageBack;
    }


}
