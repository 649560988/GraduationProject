package com.czhand.zsmq.app.service;

import com.czhand.zsmq.api.dto.BuildingDTO;

/**
 * @autor wyw
 * @data 2019/2/28 9:54
 */

public interface BuildingServices {
    /**
     * 查询单条信息
     */
    BuildingDTO queryOne(Long id);
}
