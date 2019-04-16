//package com.czhand.zsmq.app.service.impl;
//
//import com.czhand.zsmq.api.dto.ent.EntBaseDTO;
//import com.czhand.zsmq.api.dto.ent.EntListDTO;
//import com.czhand.zsmq.app.service.EntListService;
//import com.czhand.zsmq.domain.EntList;
//import com.czhand.zsmq.domain.core.CurrentUser;
//import com.czhand.zsmq.infra.exception.CommonException;
//import com.czhand.zsmq.infra.mapper.EntBaseMapper;
//import com.czhand.zsmq.infra.mapper.EntListMapper;
//import com.czhand.zsmq.infra.utils.convertor.ConvertHelper;
//import com.czhand.zsmq.infra.utils.convertor.ConvertPageHelper;
//import com.czhand.zsmq.infra.utils.security.CurrentUserUtils;
//import com.github.pagehelper.Page;
//import com.github.pagehelper.PageHelper;
//import com.github.pagehelper.PageInfo;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.Date;
//
///**
// * @author:LVCHENBIN
// * @Date: 2019/1/23 12:38
// */
//@Service
//public class EntListServiceImpl implements EntListService {
//
//    @Autowired
//    private EntListMapper entListMapper;
//
//    @Autowired
//    private EntBaseMapper entBaseMapper;
//
//    public Long getUserId() {
//        CurrentUser currentUser = CurrentUserUtils.get();
//        Long userId = currentUser.getId();
//        return userId;
//    }
//
//    /**
//     * 根据entList新增上市企业
//     *
//     * @param
//     * @return
//     */
//    @Transactional(rollbackFor = Exception.class)
//    @Override
//    public EntListDTO create(EntListDTO entListDTO) throws CommonException {
//
//        //检验是否已存在该上市企业,默认存在
//        int exist = 1;
//        String selectMessage = "该上市企业已存在！";
//        EntList entListPre = entListMapper.selectByEntId(entListDTO.getEntId());
//        if (entListPre == null) {
//            exist = 0;
//            selectMessage = "未查询到该上市企业";
//        }
//        if (exist == 1) {   //已存在该上市企业
//            throw new CommonException(selectMessage);
//        }
//
//        entListDTO.setVersion(1L);
//        entListDTO.setCreationBy(getUserId());
//        entListDTO.setCreationDate(new Date());
//        entListDTO.setUpdateBy(getUserId());
//        entListDTO.setUpdateDate(new Date());
//
//        EntList entList = ConvertHelper.convert(entListDTO, EntList.class);
//        int result = entListMapper.insert(entList);
//        if (result != 1) {
//            throw new CommonException("插入数据失败！");
//        }
//        return ConvertHelper.convert(entListMapper.selectByEntId(entList.getEntId()), EntListDTO.class);
//    }
//
//    /**
//     * 根据entList更新上市企业
//     *
//     * @param
//     * @return
//     */
//    @Transactional(rollbackFor = Exception.class)
//    @Override
//    public EntListDTO update(EntListDTO entListDTO) throws CommonException {
//
//        //检验是否已存在该上市企业,默认不存在
//        int exist = 0;
//        String selectMessage = "不存在该上市企业！";
//        EntList entListPre = entListMapper.selectByEntId(entListDTO.getEntId());
//        if (entListPre != null) {
//            exist = 1;
//            selectMessage = "查询到该上市企业";
//        }
//        if (exist == 0) {   //不存在该上市企业
//            throw new CommonException(selectMessage);
//        }
//
//        entListDTO.setId(entListPre.getId());
//        entListDTO.setVersion(entListPre.getVersion() + 1);
//        entListDTO.setCreationBy(entListPre.getCreationBy());
//        entListDTO.setCreationDate(entListPre.getCreationDate());
//        entListDTO.setUpdateBy(getUserId());
//        entListDTO.setUpdateDate(new Date());
//
//        EntList entList = ConvertHelper.convert(entListDTO, EntList.class);
//        int result = entListMapper.updateByPrimaryKey(entList);
//        if (result != 1) {
//            throw new CommonException("更新数据失败！");
//        }
//        return ConvertHelper.convert(entListMapper.selectByEntId(entList.getEntId()), EntListDTO.class);
//    }
//
//    /**
//     * 删除上市企业
//     *
//     * @param organizationalCode
//     * @return null
//     */
//    @Transactional(rollbackFor = Exception.class)
//    @Override
//    public EntListDTO delete(String organizationalCode) throws CommonException {
//        //查询该企业的基本信息
//        EntBaseDTO entBaseDTO = ConvertHelper.convert(entBaseMapper.queryOne(organizationalCode), EntBaseDTO.class);
//        //如果基本信息表中不存在该企业
//        if (entBaseDTO.getId() == null) {
//            throw new CommonException("当前删除上市企业在基本信息表中不存在！");
//        }
//        //得到该企业的ent_id，并构造实体
//        long entId = entBaseDTO.getId();
//        EntListDTO entListDTO = new EntListDTO();
//        entListDTO.setEntId(entId);
//        //硬删除该上市企业
//        int result = entListMapper.delete(ConvertHelper.convert(entListDTO, EntList.class));
//        if (result != 1) {
//            throw new CommonException("删除数据失败！");
//        }
//        return null;
//    }
//
//    /**
//     * 查询单个上市企业
//     *
//     * @param
//     * @return
//     */
//    @Transactional(rollbackFor = Exception.class)
//    @Override
//    public EntListDTO queryByOrg(String organizationalCode) throws CommonException {
//        //根据组织机构代码查出企业ID
//        long entId;
//        try {
//            entId = entBaseMapper.queryEntId(organizationalCode);
//        } catch (Exception e) {
//            throw new CommonException("该组织机构代码无对应企业");
//        }
//        //根据企业ID查出该上市企业
//        EntList entList = entListMapper.selectByEntId(entId);
//        if (entList == null) {
//            throw new CommonException("该entId无对应上市企业");
//        }
//        return ConvertHelper.convert(entList, EntListDTO.class);
//    }
//
//    /**
//     * 查询所有上市企业
//     *
//     * @param pageNo，pageSize
//     * @return pageInfo
//     */
//    @Transactional(rollbackFor = Exception.class)
//    @Override
//    public PageInfo<EntListDTO> queryAll(int pageNo, int pageSize) throws CommonException {
//        PageHelper.startPage(pageNo, pageSize);
//        Page<EntList> entListList = (Page) entListMapper.selectAll();
//        Page<EntListDTO> page = ConvertPageHelper.convertPage(entListList, EntListDTO.class);
//        PageInfo<EntListDTO> pageInfo = new PageInfo<>(page);
//        return pageInfo;
//    }
//
//
//}
