import { isUrl } from '../utils/utils'
import styles from './index.less'

const menuData = [
  // {
  //   name: 'dashboard',
  //   icon: 'dashboard',
  //   path: 'dashboard',
  //   children: [
  //     {
  //       name: '分析页',
  //       path: 'analysis',
  //     },
  //     {
  //       name: '监控页',
  //       path: 'monitor',
  //     },
  //     {
  //       name: '工作台',
  //       path: 'workplace',
  //       // hideInBreadcrumb: true,
  //       // hideInMenu: true,
  //     },
  //   ],
  // },
  // {
  //   name: '表单页',
  //   icon: 'form',
  //   path: 'form',
  //   children: [
  //     {
  //       name: '基础表单',
  //       path: 'basic-form',
  //     },
  //     {
  //       name: '分步表单',
  //       path: 'step-form',
  //     },
  //     {
  //       name: '高级表单',
  //       authority: 'admin',
  //       path: 'advanced-form',
  //     },
  //   ],
  // },
  // {
  //   name: '列表页',
  //   icon: 'table',
  //   path: 'list',
  //   children: [
  //     {
  //       name: '查询表格',
  //       path: 'table-list',
  //     },
  //     {
  //       name: '标准列表',
  //       path: 'basic-list',
  //     },
  //     {
  //       name: '卡片列表',
  //       path: 'card-list',
  //     },
  //     {
  //       name: '搜索列表',
  //       path: 'search',
  //       children: [
  //         {
  //           name: '搜索列表（文章）',
  //           path: 'articles',
  //         },
  //         {
  //           name: '搜索列表（项目）',
  //           path: 'projects',
  //         },
  //         {
  //           name: '搜索列表（应用）',
  //           path: 'applications',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: '详情页',
  //   icon: 'profile',
  //   path: 'profile',
  //   children: [
  //     {
  //       name: '基础详情页',
  //       path: 'basic',
  //     },
  //     {
  //       name: '高级详情页',
  //       path: 'advanced',
  //       authority: 'admin',
  //     },
  //   ],
  // },
  // {
  //   name: '结果页',
  //   icon: 'check-circle-o',
  //   path: 'result',
  //   children: [
  //     {
  //       name: '成功',
  //       path: 'success',
  //     },
  //     {
  //       name: '失败',
  //       path: 'fail',
  //     },
  //   ],
  // },
  // {
  //   name: '异常页',
  //   icon: 'warning',
  //   path: 'exception',
  //   children: [
  //     {
  //       name: '403',
  //       path: '403',
  //     },
  //     {
  //       name: '404',
  //       path: '404',
  //     },
  //     {
  //       name: '500',
  //       path: '500',
  //     },
  //     {
  //       name: '触发异常',
  //       path: 'trigger',
  //       hideInMenu: true,
  //     },
  //   ],
  // },
  {
    name: '首页',
    icon: <i className={`${styles.iconfont} sider-menu-item-img`}>&#xe608;</i>,
    path: 'dashboard'
  },
  {
    name: '基础信息维护',
    icon: <i className={`${styles.iconfont} sider-menu-item-img`}>&#xe611;</i>,
    path: 'base-info-defend',
    children: [
      {
        name: '外协顾问信息',
        path: 'external-consultant'
      },
      {
        name: '公司基础信息',
        path: 'company'
      },
      {
        name: '项目基础信息',
        path: 'project'
      }
    ]
  },
  {
    name: '外协需求',
    icon: <i className={`${styles.iconfont} sider-menu-item-img`}>&#xe695;</i>,
    path: 'external-demand',
    children: [
      {
        name: '外协需求申请',
        path: 'application'
      },
      {
        name: '外协需求审批',
        path: 'approval'
      }
    ]
  },
  {
    name: '系统设置',
    icon: <i className={`${styles.iconfont} sider-menu-item-img`}>&#xe602;</i>,
    path: 'setting',
    children: [
      {
        name: '数据字典设置',
        path: 'data-dictionary'
      },
      {
        name: '流程模板定制',
        path: 'process-template-customization'
      },
      {
        name: '流程定制',
        path: 'process-customization'
      },
      {
        name: '批量上传',
        path: 'bulk-upload'
      },
      {
        name: '用户管理',
        path: 'user-manage'
      },
      {
        name: '菜单配置',
        path: 'menu-manage'
      }
    ]
  },
  // {
  //   name: '属性管理',
  //   icon: 'warning',
  //   path: 'attribute',
  //   children: [
  //     {
  //       name: '动态字段数据源',
  //       path: 'dynamic-field-source',
  //     },
  //   ],
  // },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login'
      },
      {
        name: '注册',
        path: 'register'
      },
      {
        name: '注册结果',
        path: 'register-result'
      }
    ]
  }
]

export {
  styles
}

export function formatter (data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item
    if (!isUrl(path)) {
      path = parentPath + item.path
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority
    }
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority)
    }
    return result
  })
}

export const getMenuData = () => formatter(menuData)
