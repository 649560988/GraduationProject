package com.czhand.zsmq.infra.utils;


import com.czhand.zsmq.domain.SysMenu;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 *
 * @author zld
 */
public class MenuTreeUtil {
    private MenuTreeUtil() {
    }


    public static List<SysMenu> formatMenu(List<SysMenu> entryList) {
        List<SysMenu> displayMenus = new ArrayList<>();
        for (SysMenu menu : entryList) {
            if ((menu.getParentId() == null || menu.getParentId() == 0)) {
                menu.setChildren(processMenu(menu.getId(), entryList));
                displayMenus.add(menu);
            }
        }
        if (!displayMenus.isEmpty()) {
            return sortMenu(displayMenus);
        }
        return displayMenus;
    }

    private static List<SysMenu> processMenu(Long id, List<SysMenu> menus) {
        List<SysMenu> subMenus = null;
        for (SysMenu menu : menus) {
            if (menu.getParentId().equals(id)) {
                if (subMenus == null) {
                    subMenus = new ArrayList<>();
                }
                menu.setChildren(processMenu(menu.getId(), menus));
                subMenus.add(menu);
            }
        }
        if (subMenus != null) {
            return sortMenu(subMenus);
        }
        return subMenus;
    }
    private static List<SysMenu> sortMenu(List<SysMenu> entryList) {
        Collections.sort(entryList, (SysMenu m1, SysMenu m2) -> {//1前者大
            if (m1.getSort() == null) {
                return -1;
            }
            if (m2.getSort() == null || m1.getSort() > m2.getSort()) {
                return 1;
            }
            if (m1.getSort().equals(m2.getSort())) {
                return 0;
            }
            return -1;
        });
        return entryList;
    }
}
