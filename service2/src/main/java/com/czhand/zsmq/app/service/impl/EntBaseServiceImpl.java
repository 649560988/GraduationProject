//package com.czhand.zsmq.app.service.impl;
//
//import com.czhand.zsmq.api.dto.ent.EntBaseDTO;
//import com.czhand.zsmq.app.service.EntBaseService;
//import com.czhand.zsmq.domain.EntBase;
//import com.czhand.zsmq.domain.core.CurrentUser;
//import com.czhand.zsmq.infra.exception.CommonException;
//import com.czhand.zsmq.infra.mapper.EntBaseMapper;
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
//import java.util.List;
//
///**
// * @author:LVCHENBIN
// * @Date: 2019/1/22 16:38
// */
//@Service
//public class EntBaseServiceImpl implements EntBaseService {
//
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
//     * 创建企业
//     *
//     * @param entBase
//     * @return
//     */
//    @Transactional(rollbackFor = Exception.class)
//    @Override
//    public EntBaseDTO createEnterprise(EntBaseDTO entBase) throws CommonException {
//
//        entBase.setIsDel(0);
//        entBase.setVersion(1L);
//        entBase.setCreationBy(getUserId());
//        entBase.setCreationDate(new Date());
//        entBase.setUpdateBy(getUserId());
//        entBase.setUpdateDate(new Date());
//
//        //当插入企业已存在时（组织机构代码）
//        int uniqueResult = entBaseMapper.queryExist(ConvertHelper.convert(entBase, EntBase.class));
//        if (uniqueResult != 0) {
//            //查询出该企业
//            EntBase entBase2 = entBaseMapper.queryOne(entBase.getOrganizationalCode());
//            EntBaseDTO entBaseOld = ConvertHelper.convert(entBase2, EntBaseDTO.class);
//            //若该企业已删除，用新信息更新
//            int isDel = entBaseOld.getIsDel();
//            if (isDel == 1) {
//                return updateEnterprise(entBase);
//            }
//            throw new CommonException("当前插入企业已存在！");
//        }
//
//        int result = entBaseMapper.insert(ConvertHelper.convert(entBase, EntBase.class));
//        String organizationalCode = entBase.getOrganizationalCode();
//        if (result != 1) {
//            throw new CommonException("插入数据失败！");
//        }
//        return ConvertHelper.convert(entBaseMapper.queryOne(organizationalCode), EntBaseDTO.class);
//    }
//
//    /**
//     * 更新企业
//     *
//     * @param entBase
//     * @return
//     */
//    @Transactional(rollbackFor = Exception.class)
//    @Override
//    public EntBaseDTO updateEnterprise(EntBaseDTO entBase) throws CommonException {
//
//        //根据组织机构代码，获取旧数据的id+版本
//        EntBaseDTO entBase2 = ConvertHelper.convert(
//                entBaseMapper.queryOne(entBase.getOrganizationalCode()), EntBaseDTO.class);
//        long versionOld = entBase2.getVersion();
//        long idOld = entBase2.getId();
//
//        entBase.setId(idOld);
//        entBase.setVersion(versionOld + 1);
//        entBase.setCreationBy(entBase2.getCreationBy());
//        entBase.setCreationDate(entBase2.getCreationDate());
//        entBase.setUpdateBy(getUserId());
//        entBase.setUpdateDate(new Date());
//
//        int result = entBaseMapper.updateByPrimaryKeySelective(ConvertHelper.convert(entBase, EntBase.class));
//        Long Id = entBase.getId();
//        if (result != 1) {
//            throw new CommonException("更新数据失败！");
//        }
//        return ConvertHelper.convert(entBaseMapper.selectByPrimaryKey(Id), EntBaseDTO.class);
//    }
//
//    /**
//     * 删除企业
//     *
//     * @param organizationalCode
//     * @return
//     */
//    @Transactional(rollbackFor = Exception.class)
//    @Override
//    public EntBaseDTO deleteEnterprise(String organizationalCode) throws CommonException {
//
//        //根据组织机构代码，获取旧数据的id+版本
//        EntBaseDTO entBase2 = ConvertHelper.convert(
//                entBaseMapper.queryOne(organizationalCode), EntBaseDTO.class);
//        long versionOld = entBase2.getVersion();
//
//        //设置需删除(更新)的DTO
//        entBase2.setIsDel(1);
//        entBase2.setVersion(versionOld + 1);
//        entBase2.setUpdateBy(getUserId());
//        entBase2.setUpdateDate(new Date());
//
//        int result = entBaseMapper.updateByPrimaryKeySelective(ConvertHelper.convert(entBase2, EntBase.class));
//        Long Id = entBase2.getId();
//
//        if (result != 1) {
//            throw new CommonException("删除数据失败！");
//        }
//
//        return ConvertHelper.convert(entBaseMapper.selectByPrimaryKey(Id), EntBaseDTO.class);
//    }
//
//
//    /**
//     * 查询单个企业
//     *
//     * @param organizationalCode
//     * @return
//     */
//    @Transactional(rollbackFor = Exception.class)
//    @Override
//    public EntBaseDTO queryOneEnterprise(String organizationalCode) throws CommonException {
//
//        return ConvertHelper.convert(entBaseMapper.queryOne(organizationalCode), EntBaseDTO.class);
//    }
//
//    /**
//     * 查询所有企业
//     */
//    @Override
//    public PageInfo<EntBaseDTO> queryAllEnterprise(int pageNo, int pageSize) {
//        PageHelper.startPage(pageNo, pageSize);
//        Page<EntBase> entBaseList = (Page) entBaseMapper.queryAll();
//        Page<EntBaseDTO> page = ConvertPageHelper.convertPage(entBaseList, EntBaseDTO.class);
//        PageInfo<EntBaseDTO> pageInfo = new PageInfo<>(page);
//        return pageInfo;
//    }
//
//    /**
//     * 查询企业，by模糊匹配企业名称
//     */
//    @Override
//    public PageInfo<EntBaseDTO> queryAllByEntName(String entName, int pageNo, int pageSize) {
//        PageHelper.startPage(pageNo, pageSize);
//        Page<EntBase> entBaseList = (Page) entBaseMapper.queryAllByEntName(entName);
//        Page<EntBaseDTO> page = ConvertPageHelper.convertPage(entBaseList, EntBaseDTO.class);
//        PageInfo<EntBaseDTO> pageInfo = new PageInfo<>(page);
//        return pageInfo;
//    }
//
//    /**
//     * 查询企业是否重复
//     *
//     * @param entBase
//     * @return
//     */
//    @Transactional(rollbackFor = Exception.class)
//    @Override
//    public boolean queryExistEnterprise(EntBaseDTO entBase) throws CommonException {
//
//        int uniqueResult = entBaseMapper.queryExist(ConvertHelper.convert(entBase, EntBase.class));
//        boolean result = true;
//        if (uniqueResult == 0) {
//            result = false;
//        }
//        return result;
//    }
//
//    /**
//     * 查询企业ID
//     *
//     * @param organizationalCode
//     * @return
//     */
//    @Transactional(rollbackFor = Exception.class)
//    @Override
//    public long queryEntId(String organizationalCode) throws CommonException {
//
//        long entId = entBaseMapper.queryEntId(organizationalCode);
//
//        return entId;
//    }
//
//}
