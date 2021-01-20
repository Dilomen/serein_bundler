/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50725
 Source Host           : localhost:3306
 Source Schema         : db_bundler

 Target Server Type    : MySQL
 Target Server Version : 50725
 File Encoding         : 65001

 Date: 15/01/2021 11:51:56
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for bundler_info
-- ----------------------------
DROP TABLE IF EXISTS `bundler_info`;
CREATE TABLE `bundler_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `solo_id` varchar(100) NOT NULL,
  `repository_name` varchar(30) DEFAULT NULL COMMENT '所属项目',
  `branch` varchar(255) NOT NULL COMMENT '分支名',
  `build_status` int(2) NOT NULL DEFAULT '0' COMMENT '  BUILD_WAIT: 1, // 打包等待\n  BUILD_START: 2, // 开始打包\n  BUILD_SUCCESS: 3, // 打包成功\n  SEND_WAIT: 4, // 等待发送\n  SEND_START: 5, // 开始发送\n  SEND_SUCCESS: 6, // 发送成功\n  BUILD_CANCEL: 7, // 打包取消\n  BUILD_FAIL: -1, // 打包失败\n  SEND_FAIL: -2 // 发送失败',
  `send_status` int(2) DEFAULT NULL COMMENT '  BUILD_WAIT: 1, // 打包等待\n  BUILD_START: 2, // 开始打包\n  BUILD_SUCCESS: 3, // 打包成功\n  SEND_WAIT: 4, // 等待发送\n  SEND_START: 5, // 开始发送\n  SEND_SUCCESS: 6, // 发送成功\n  BUILD_CANCEL: 7, // 打包取消\n  BUILD_FAIL: -1, // 打包失败\n  SEND_FAIL: -2 // 发送失败',
  `pusher` varchar(50) NOT NULL COMMENT '提交人员',
  `commit_message` varchar(255) NOT NULL COMMENT 'git提交commit信息',
  `consume_time` int(11) DEFAULT '0' COMMENT '打包消耗时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `target_path` varchar(200) DEFAULT NULL COMMENT '目标路径',
  PRIMARY KEY (`id`,`solo_id`) USING BTREE,
  KEY `solo_id` (`solo_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1074 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for commit_record
-- ----------------------------
DROP TABLE IF EXISTS `commit_record`;
CREATE TABLE `commit_record` (
  `solo_id` varchar(100) NOT NULL,
  `clone_url` varchar(100) DEFAULT NULL,
  `commit_id` varchar(100) DEFAULT NULL,
  `commit_person` varchar(40) DEFAULT NULL,
  `commit_person_email` varchar(255) DEFAULT NULL,
  `commit_time` datetime DEFAULT NULL,
  `commit_message` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`solo_id`),
  CONSTRAINT `aaa` FOREIGN KEY (`solo_id`) REFERENCES `bundler_info` (`solo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for project_map
-- ----------------------------
DROP TABLE IF EXISTS `project_map`;
CREATE TABLE `project_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `repository_name` varchar(50) NOT NULL COMMENT '代码仓库名称',
  `project_name` varchar(50) NOT NULL COMMENT '项目名称',
  `deploy_path` varchar(255) NOT NULL COMMENT '部署地址',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) NOT NULL COMMENT '用户名',
  `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
  `enabled` int(1) NOT NULL DEFAULT '1' COMMENT '0关闭1开启',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `identity` int(11) NOT NULL DEFAULT '0' COMMENT '0管理员，1普通用户',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
