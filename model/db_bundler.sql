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

 Date: 01/01/2021 22:57:30
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
  `build_status` int(2) NOT NULL DEFAULT '0' COMMENT '  BUILD_WAIT: 1, // 打包等待\n  BUILD_START: 2, // 开始打包\n  BUILD_SUCCESS: 3, // 打包成功\n BUILD_CANCEL: 7, // 打包取消\n  BUILD_FAIL: -1, // 打包失败\n',
  `send_status` int(2) DEFAULT NULL COMMENT 'SEND_WAIT: 4, // 等待发送\n  SEND_START: 5, // 开始发送\n  SEND_SUCCESS: 6, // 发送成功\n  BUILD_CANCEL: 7, // 打包取消\n   SEND_FAIL: -2 // 发送失败',
  `pusher` varchar(50) NOT NULL COMMENT '提交人员',
  `commit_message` varchar(255) NOT NULL COMMENT 'git提交commit信息',
  `consume_time` int(11) DEFAULT '0' COMMENT '打包消耗时间',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `target_path` varchar(200) DEFAULT NULL COMMENT '目标路径',
  PRIMARY KEY (`id`,`solo_id`) USING BTREE,
  KEY `solo_id` (`solo_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=396 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

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
  `belong_project` varchar(50) NOT NULL COMMENT '项目标识',
  `belong_project_name` varchar(50) NOT NULL COMMENT '所属项目',
  PRIMARY KEY (`belong_project`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL COMMENT '用户名',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `identity` int(11) NOT NULL DEFAULT '0' COMMENT '0管理员，1普通用户',
  `create_time` datetime NOT NULL,
  PRIMARY KEY (`userid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
