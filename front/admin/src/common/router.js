import React, { createElement } from 'react'
import { Spin } from 'antd'
import pathToRegexp from 'path-to-regexp'
import Loadable from 'react-loadable'
import { getMenuData } from './menu'

let routerDataCache

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1)
  })

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default);
    }
  })

  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app)
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache
      })
    }
  }
  // () => import('module')
  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app)
      }
      return component().then(raw => {
        const Component = raw.default || raw
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache
          })
      })
    },
    loading: () => {
      return <Spin size='large' className='global-spin' />
    }
  })
}

function getFlatMenuData (menus) {
  let keys = {}
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item }
      keys = { ...keys, ...getFlatMenuData(item.children) }
    } else {
      keys[item.path] = { ...item }
    }
  })
  return keys
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login', 'menu'], () => import('../layouts/BasicLayout'))
    },
    // yang add
    '/setting/menus': {
      component: dynamicWrapper(app, [], () => import('../routes/HsMenuManagement/HsMenuManagement'))
    },
    // weimeng add
    '/home': {
      component: dynamicWrapper(app, [], () => import('../routes/Dashboard/Myhome'))
    },
    '/base-info-defend/external-consultant-resume/:resumeId': {
      component: dynamicWrapper(app, ['list', 'user'], () => import('../routes/ExternalConsultant/ResumeAdmin.js'))
    },
    '/base-info-defend/external-consultant': {
      component: dynamicWrapper(app, ['list', 'user'], () => import('../routes/ExternalConsultant/index.js'))
    },
    '/base-info-defend/external-consultant-create': {
      component: dynamicWrapper(app, ['list', 'user'], () => import('../routes/ExternalConsultant/ResumeCreate.js'))
    },
    // weimeng add
    '/base-info-defend/company': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/CompanyBaseInfo/CompanyBaseInfoList'))
    },
    // zhuganghui add
    '/base-info-defend/project': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/ProjectBaseInfo/ProjectBaseInfoList'))
    },
    // weimeng add
    '/base-info-defend/customerDetail/:id/:enterState': {
      component: dynamicWrapper(app, [], () => import('../routes/CompanyBaseInfo/CompanyDetailInfo'))
    },
    // zhuganghui add
    '/base-info-defend/projectUpdate/:id': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/ProjectBaseInfo/ProjectInfoUpdate'))
    },
    // weimeng add approval
    '/external-demand/application': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/ExternalDemandApplication/ExternalDemandApplication'))
    },
    // weimeng add approval
    '/external-demand/applicationDetail/:enterState/:id/:objectId': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/ExternalDemandApplication/ExternalDemandApplicationDetailInfo'))
    },
    // zhuganghui add
    '/external-demand/approval': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/OutsourcingDemandApproval/OutsourcingDemandInfoList'))
    },
    // zhuganghui add
    '/external-demand/outsourcingApproval/:id/:stat': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/OutsourcingDemandApproval/OutsourcingDemandApproval'))
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success'))
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error'))
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403'))
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404'))
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500'))
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      )
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout'))
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login'))
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register'))
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult'))
    },
    '/auth': {
      component: dynamicWrapper(app, [], () => import('../routes/User/Auth'))
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
    '/enterprises': {
      component: dynamicWrapper(app, [], () => import('../routes/User/Auth'))
    },
    // dynamic-field-source
    '/setting/data-dictionary': {
      component: dynamicWrapper(app, ['dynamicFieldSource', 'dynamicFieldSourceSub'], () => import('../routes/DynamicFieldSource/DynamicFieldSource'))
    },

    // add by  knight
    '/setting/process-customization': {
      component: dynamicWrapper(app, [], () => import('../routes/Process/ApproverSet'))
    },

    '/setting/process-template-customization': {
      component: dynamicWrapper(app, ['process', 'user'], () => import('../routes/Process/ProcessTemplet'))
    },
    '/setting/process-template-aad': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/Process/ProcessMake'))
    },
    '/setting/process-template-update/:id/:companyId': {
      component: dynamicWrapper(app, ['process'], () => import('../routes/Process/ProcessUpdate'))
    },
    // added by qiuwei
    '/setting/bulk-upload': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/BulkUpload/BulkUpload'))
    },
    // added by xqm 超级管理员
    '/setting/user-manage': {
      component: dynamicWrapper(app, [], () => import('../routes/UserManagement/ManagementTab'))
    },
    // added by xqm
    '/setting/user-manage-update/:userId/:oId/:flag': {
      component: dynamicWrapper(app, [], () => import('../routes/UserManagement/UpdateUserInfo'))
    },
    // added by qiuwei ,module: menu-manage
    '/setting/menu-manage-add-by-pid/:parentId': {
      component: dynamicWrapper(app, [], () => import('../routes/MenuManage/MenuAddForm'))
    },
    '/setting/menu-manage-add': {
      component: dynamicWrapper(app, [], () => import('../routes/MenuManage/MenuAddForm'))
    },
    '/setting/menu-manage-edit/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/MenuManage/MenuEditForm'))
    },
    '/setting/menu-manage': {
      component: dynamicWrapper(app, [], () => import('../routes/MenuManage/MenuManageList'))
    },

    // added by qiuwei ,module: role-manage
    '/setting/role-manage-add-by-pid/:parentId': {
      component: dynamicWrapper(app, [], () => import('../routes/RoleManage/RoleAddForm'))
    },
    '/setting/role-manage-add/:id': {
      component: dynamicWrapper(app, [], () => import('../routes/RoleManage/RoleAddForm'))
    },
    // '/setting/role-manage-edit/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/RoleManage/RoleEditForm'))
    // },
    '/setting/roles': {
      component: dynamicWrapper(app, [], () => import('../routes/RoleManage/RoleManageList'))
    },
    // zhuganghui add
    '/setting/tenantpermission': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/TenantPermission/TenantPermissionList'))
    },
    // zhuganghui add
    '/setting/tenantpermissionupdate/:id': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/TenantPermission/TenantPermissionUpdate'))
    },
    // zhuganghui add
    '/setting/deptmanage': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/DeptManage/DeptManage'))
    },
    // zhuganghui add
    '/setting/suppliercontroller': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/SupplierMaintenance/SupplierMaintenanceList'))
    },
    // zhuganghui add
    '/setting/supplierupdate/:id': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/SupplierMaintenance/SupplierMaintenanceDetail'))
    },
    '/setting/tenantmanage': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/TenantManage/TenantManageList'))
    },
    '/setting/tenantmanage-updateoradd/:id/:flag': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/TenantManage/TenantAddUpdate'))
    },
    /**
     * 租户管理员
     */
    '/setting/usermanage': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/UserManagementTenant/ManagementTab'))
    },
    '/setting/usermanageupdate/:userId/:oId/:flag': {
      component: dynamicWrapper(app, [], () => import('../routes/UserManagementTenant/UpdateUserInfo'))
    },
    '/project/performance': {
      exact: false,
      component: dynamicWrapper(app, ['user'], () => import('../routes/Performance'))
    },
    '/person/information': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/Profile/Information'))
    },
    // // weimeng add
    // '/user/login': {
    //   component: dynamicWrapper(app, ['ocmslogin'], () => import('../routes/Login/Login')),
    // },

    /**
     * 外包人员管理
     */
    '/project/personmanage': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/PersonManagement/ManagementTab'))
    },
    '/project/personmanageupdate/:userId/:oId/:flag': {
      component: dynamicWrapper(app, [], () => import('../routes/PersonManagement/UpdateUserInfo'))
    },

    // added by qw
    '/setting/intl-manage/add': {
      component: dynamicWrapper(app, ['intl'], () => import('../routes/IntlManage/IntlManageAdd'))
    },
    '/setting/intl-manage/edit': {
      component: dynamicWrapper(app, ['intl'], () => import('../routes/IntlManage/IntlManageEdit'))
    },
    '/setting/intl-manage/': {
      component: dynamicWrapper(app, ['intl'], () => import('../routes/IntlManage/IntlManageList'))
    },
    '/setting/companyInfo': {
      component: dynamicWrapper(app, ['intl'], () => import('../routes/CompanyInfo/CompanyInfo'))
    },

    // added by weimeng
    '/setting/passwordpolicy': {
      component: dynamicWrapper(app, ['passwordPolicy'], () => import('../routes/PasswordPolicy/PasswordPolicy.js'))
    },
    // oyk add
    '/setting/tanchen': {
      component: dynamicWrapper(app, [], () => import('../routes/FromList/index.js'))
    },

    /**
     * 项目维护
     * add by xiafei
     */
    '/project/maintenance': {
      component: dynamicWrapper(app, [], () => import('../routes/ProjectMaintenance/ProjectMaintenance'))
    },
    '/project/maintenanceUpdate/:opr': {
      component: dynamicWrapper(app, [], () => import('../routes/ProjectMaintenance/ProjectMaintenanceUpdate'))
    },
    '/project/editStaff/:id': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/ProjectMaintenance/StaffEdit'))
    },

    /**
     * 休假申请
     * added by xqm
     */
    '/tsmanage/leaverequest': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/LeaveApplication/LeaveApplicationTab'))
    },
    '/tsmanage/leaveApplicationEdit/:id/:flag': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/LeaveApplication/LeaveApplicationDetails'))
    },

    /**
     * 休假审批
     * added by xqm
     */
    '/tsmanage/leaveapproval': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/LeaveApplicationReview/LeaveApplicationReviewList'))
    },
    '/tsmanage/leaveApplicationReviewEdit/:taskId/:taskName/:procInstId': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/LeaveApplicationReview/LeaveApplicationReviewEdit'))
    },

    /**
     * 加班申请
     * added by xqm
     */
    '/tsmanage/otapplication': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/OvertimeApplication/OvertimeApplicationTab'))
    },
    '/tsmanage/otApplicationEdit/:id/:flag': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/OvertimeApplication/OvertimeApplicationEdit'))
    },

    /**
     * 加班审批
     * added by xqm
     */
    '/tsmanage/otapproval': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/OvertimeApproval/OvertimeApprovalTab'))
    },
    '/tsmanage/otapprovalEdit/:id': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/OvertimeApproval/OvertimeApprovalEdit'))
    },

    /**
     * ts申请
     * added by xqm
     */
    '/tsmanage/tsapplication': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/TSApplication/TSApplicationTab'))
    },

    /**
     * ts审批
     * added by xqm
     */
    '/tsmanage/tsapproval': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/TSApproval/TSApprovalTab'))
    },

    /**
     * 孟企用户管理
     */
    '/setting/users': {
      component: dynamicWrapper(app,[],() => import ('../routes/UserManage/UserManageTab'))
    },
    '/setting/user-update/:flag/:id': {
      component: dynamicWrapper(app,[],() => import ('../routes/UserManage/UserUpdate'))
    },

    // wy
    '/messages': {
      component: dynamicWrapper(app,[],() => import ('../routes/Messages/Messages'))
    },
    '/messagesDetail/:id': {
      component: dynamicWrapper(app,[],() => import ('../routes/Messages/MessagesDetail'))
    },
    '/setting/parameters': {
      component: dynamicWrapper(app,[],() => import ('../routes/Parameters/Parameters'))
    },
    '/setting/parametersDetail/:id': {
      component: dynamicWrapper(app,[],() => import ('../routes/Parameters/ParametersDetail'))
    },
    /**
     * 个人信息管理
     */
    '/setting/personal-update': {
      component: dynamicWrapper(app,['user'],() => import ('../routes/PersonalInfo/PersonalInfo'))
    },


    '/tsmanage/tsapprovalEdit': {
      component: dynamicWrapper(app, ['user'], () => import('../routes/TSApproval/TSApprovalEdit'))
    }

  }
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData())

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {}
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path)
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`))
    let menuItem = {}
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey]
    }
    let router = routerConfig[path]
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb
    }
    routerData[path] = router
  })
  return routerData
}
