/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80021
 Source Host           : localhost:3306
 Source Schema         : db_bundler

 Target Server Type    : MySQL
 Target Server Version : 80021
 File Encoding         : 65001

 Date: 22/10/2020 18:40:22
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for bundler_info
-- ----------------------------
DROP TABLE IF EXISTS `bundler_info`;
CREATE TABLE `bundler_info`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `solo_id` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `branch_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '分支名',
  `status` int(0) NOT NULL DEFAULT 0 COMMENT '  BUILD_WAIT: 1, // 打包等待\n  BUILD_START: 2, // 开始打包\n  BUILD_SUCCESS: 3, // 打包成功\n  SEND_WAIT: 4, // 等待发送\n  SEND_START: 5, // 开始发送\n  SEND_SUCCESS: 6, // 发送成功\n  BUILD_CANCEL: 7, // 打包取消\n  BUILD_FAIL: -1, // 打包失败\n  SEND_FAIL: -2 // 发送失败',
  `status_show` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '打包进度展示 [打包状态， 发送状态]',
  `belong_project` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '所属项目',
  `commit_id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '提交id',
  `commit_person` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '提交人员',
  `commit_msg` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'git提交commit信息',
  `commit_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '提交时间',
  `consume` int(0) NULL DEFAULT NULL COMMENT '打包消耗时间',
  `create_time` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `target_path` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '目标路径',
  `commit_person_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '提交人员真实姓名',
  PRIMARY KEY (`id`, `solo_id`) USING BTREE,
  INDEX `solo_id`(`solo_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 982 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of bundler_info
-- ----------------------------

-- ----------------------------
-- Table structure for project_map
-- ----------------------------
DROP TABLE IF EXISTS `project_map`;
CREATE TABLE `project_map`  (
  `belong_project` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '项目标识',
  `belong_project_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '所属项目',
  PRIMARY KEY (`belong_project`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of project_map
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `userid` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码',
  `identity` int(0) NOT NULL DEFAULT 0 COMMENT '0管理员，1普通用户',
  `create_time` datetime(0) NOT NULL,
  PRIMARY KEY (`userid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', 0, '2020-09-08 22:49:10');
INSERT INTO `user` VALUES (2, 'test', 'e10adc3949ba59abbe56e057f20f883e', 1, '2020-09-30 11:48:41');
INSERT INTO `user` VALUES (3, 'guest', '123456', 1, '2020-10-13 11:38:31');

SET FOREIGN_KEY_CHECKS = 1;
