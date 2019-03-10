--
-- table `users` 用户表
--
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id`                      integer     NOT NULL AUTO_INCREMENT COMMENT 'id(自增)', 
    `login_id`                varchar(20) NOT NULL                COMMENT '登录ID', 
    `password`                varchar(50) NOT NULL                COMMENT '密码', 
    `name`                    varchar(60) NOT NULL                COMMENT '用户姓名', 
    `email`                   varchar(60) NOT NULL                COMMENT '电子邮件地址', 
    `phone`                   varchar(20) DEFAULT ''              COMMENT '电话', 
    `admin`                   tinyint(1)  NOT NULL DEFAULT '0'    COMMENT '管理员标志：0:user   1:admin', 
    `closed`                  tinyint(1)  NOT NULL DEFAULT '0'    COMMENT '状态:0： 正常  1： close', 
    `language`                varchar(5)  DEFAULT 'zh-CN'         COMMENT '语言  ja-JP/zh-CN/en', 
    `salt`                    varchar(20) NOT NULL                COMMENT '加密连接随机数', 
    `must_change_password`    tinyint(1)  NOT NULL DEFAULT '0'    COMMENT '强制变更密码：0:否/1:是', 
    `last_login_time`         timestamp                           COMMENT '最后登录时间', 
    `remarks`                 varchar(255)  DEFAULT NULL          COMMENT '备注',
    `create_time`             timestamp     NOT NULL              COMMENT '建立时间', 
    `update_time`             timestamp     NOT NULL              COMMENT '更新时间', 
    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `users` VALUES ('1', 'admin', '09361a1cbd92f932b80fc2ca231df2a2', 'admin', 'admin@czuft.com.cn', '13012341111', '1', '0', 'zh-CN', 'f04fb8f739e392c8a9bc', '0', null, null, '2018-10-22 17:15:42', '2018-10-22 17:15:42');

--
-- table `groups` 部门（项目组）表
--
DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
    `id`                      int(11)       NOT NULL AUTO_INCREMENT     COMMENT 'id(自增)',
    `name`                    varchar(60)   NOT NULL DEFAULT ''         COMMENT '部门名',
    `parent_id`               int(11)       DEFAULT NULL                COMMENT '上级部门名',
    `closed`                  tinyint(1)    NOT NULL DEFAULT '0'        COMMENT '状态：0:active 1:closed',
    `remarks`                 varchar(255)  DEFAULT NULL                COMMENT '备注/描述', 
    `create_time`             timestamp     NOT NULL                    COMMENT '建立时间', 
    `update_time`             timestamp     NOT NULL                    COMMENT '更新时间', 
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- Table structure for table `group_users`
--
DROP TABLE IF EXISTS `group_users`;
CREATE TABLE `group_users` (
    `id`              int(11)         NOT NULL AUTO_INCREMENT     COMMENT 'id(自增)',
    `group_id`        int(11)         NOT NULL                    COMMENT '部门ID',
    `user_id`         int(11)         NOT NULL                    COMMENT '用户ID',
    `remarks`         varchar(255)    DEFAULT NULL                COMMENT '备注',
    `create_time`     timestamp       NOT NULL                    COMMENT '建立时间',
    `update_time`     timestamp       NOT NULL                    COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


-- ----------------------------
-- Table times
-- ----------------------------
DROP TABLE IF EXISTS `times`;
CREATE TABLE `times` (
    `id`                        int(11) NOT NULL AUTO_INCREMENT,
    `time`                      varchar(20) NOT NULL                COMMENT '日期',
    `project_id`                int(11) NOT NULL                    COMMENT '项目编号',
    `task_id`                   int(11) NOT NULL                    COMMENT '任务编号',
    `user_id`                   int(11) NOT NULL                    COMMENT '用户ID',
    `used_time`                 int(11) NOT NULL                    COMMENT '用时（分钟）',
    `remarks`                   varchar(255) DEFAULT NULL           COMMENT '备注',
    `create_time`               timestamp NOT NULL                  COMMENT '建立时间',
    `update_time`               timestamp NOT NULL                  COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- table project_type
--
DROP TABLE IF EXISTS `project_type`;
CREATE TABLE `project_type` (
    `id`                      int(11)     NOT NULL AUTO_INCREMENT,
    `name`                    varchar(255) DEFAULT NULL           COMMENT '项目种类名称',
    `status`                  int(1)      NOT NULL                COMMENT '状态0：正常 1：关闭',
    `remarks`                 varchar(255) DEFAULT NULL           COMMENT '备注',
    `create_time`             timestamp   NOT NULL                COMMENT '建立时间',
    `update_time`             timestamp   NOT NULL                COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- table task_type
--
DROP TABLE IF EXISTS `task_type`;
CREATE TABLE `task_type` (
    `id`                       int(11) NOT NULL AUTO_INCREMENT,
    `name`                     varchar(255) NOT NULL                COMMENT '任务名称',
    `status`                   int(1) NOT NULL                      COMMENT '状态0：正常 1：关闭',
    `remarks`                  varchar(255) DEFAULT NULL            COMMENT '备注',
    `create_time`              timestamp NOT NULL                   COMMENT '建立时间',
    `update_time`              timestamp NOT NULL                   COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- table project_task_type
--
DROP TABLE IF EXISTS `project_task_type`;
CREATE TABLE `project_task_type` (
    `id`                       int(11) NOT NULL AUTO_INCREMENT,
    `project_type_id`          int(11) NOT NULL                     COMMENT '任务名称',
    `task_type_id`             int(11) NOT NULL                     COMMENT '状态0：正常 1：关闭',
    `remarks`                  varchar(255) DEFAULT NULL            COMMENT '备注',
    `create_time`              timestamp NOT NULL                   COMMENT '建立时间',
    `update_time`              timestamp NOT NULL                   COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- table projects
--
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects`  (
    `id`                        int(11)         NOT NULL AUTO_INCREMENT,
    `name`                      varchar(20)     NOT NULL        COMMENT '项目名称',
    `project_type_id`           int(11)         NOT NULL        COMMENT '项目种类',
    `estimate_start_time`       timestamp       NOT NULL        COMMENT '预计开始时间',
    `estimate_time`             int(11)         NOT NULL        COMMENT '预计工时',
    `real_start_time`           timestamp       NOT NULL        COMMENT '实际开始时间',
    `status`                    int(1)          NOT NULL        COMMENT '状态：0：开发中 1：结束 2：预算中 3：暂停',
    `remarks`                   varchar(255)    DEFAULT NULL        COMMENT '备注'，
    `create_time`               timestamp       NOT NULL        COMMENT '建立时间',
    `update_time`               timestamp       NOT NULL        COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


--
-- table jobs
--
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
    `id`                    integer             NOT NULL        AUTO_INCREMENT,
    `project_id`            integer             NOT NULL        COMMENT '项目编号',
    `sort_name`             varchar(255)        NOT NULL        COMMENT '工作分类',
    `name`                  varchar(255)        NOT NULL        COMMENT '名称',
    `remarks`                   varchar(255)    NOT NULL        COMMENT '备注',
    `create_time`               timestamp       NOT NULL        COMMENT '建立时间',
    `update_time`               timestamp       NOT NULL        COMMENT '更新时间',
    PRIMARY KEY ( `id` )
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

--
-- tasks
--
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
    `id`                      integer            NOT NULL AUTO_INCREMENT,
    `job_id`                  int(11)            NOT NULL        COMMENT '工作ID',
    `task_type_id`            int(11)            NOT NULL        COMMENT '分类ID',
    `user_id`                 int(11)            NOT NULL        COMMENT '担当者ID',
    `estimate_start_time`     timestamp          DEFAULT NULL    COMMENT '预计开始日期',
    `estimate_end_time`       timestamp          DEFAULT NULL    COMMENT '预计完成日期',
    `real_start_time`         timestamp          DEFAULT NULL    COMMENT '实际开始日期',
    `real_end_time`           timestamp          DEFAULT NULL    COMMENT '实际完成日期',
    `remarks`                 varchar(255)       NOT NULL        COMMENT '备注',
    `create_time`             timestamp          NOT NULL        COMMENT '建立时间',
    `update_time`             timestamp          NOT NULL        COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



