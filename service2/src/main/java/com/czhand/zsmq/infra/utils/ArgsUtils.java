package com.czhand.zsmq.infra.utils;

/**
 *
 * @author WANGJING
 */
public class ArgsUtils {
    /**
     * 检查传入对象是否有为空的对象，任意一个对象为空则返回 true
     * @param args
     * @return
     */
    public static boolean checkArgsNull(Object... args) {
        for (Object arg : args) {
            if (arg == null) {
                return true;
            }
            if(arg instanceof String){
                if("".equals(arg)){
                    return true;
                }
            }
        }
        return false;
    }
}
