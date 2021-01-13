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

 Date: 11/01/2021 19:36:44
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
) ENGINE=InnoDB AUTO_INCREMENT=993 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of bundler_info
-- ----------------------------
BEGIN;
INSERT INTO `bundler_info` VALUES (919, '0941c909-bf69-495d-bf72-c05e1a8f95a3', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 32918, '2021-01-04 16:48:07', NULL);
INSERT INTO `bundler_info` VALUES (920, '4107ae86-1e64-4ed2-a3e8-d48f4237a5ec', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 34207, '2021-01-04 16:48:07', NULL);
INSERT INTO `bundler_info` VALUES (921, 'cc0016e1-3777-4d08-9ec8-9ae2a481ab88', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 38136, '2021-01-04 16:48:08', NULL);
INSERT INTO `bundler_info` VALUES (922, 'd8d0fd57-e68b-429e-a251-29afe4023e72', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 38490, '2021-01-04 16:49:12', NULL);
INSERT INTO `bundler_info` VALUES (923, '0c7592a2-a0fa-46cc-8d7c-4ca328dc83ab', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 34399, '2021-01-04 17:18:43', NULL);
INSERT INTO `bundler_info` VALUES (924, '851d343c-e79a-4055-9d93-0473eac62b3a', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 34422, '2021-01-04 17:18:45', NULL);
INSERT INTO `bundler_info` VALUES (925, 'b023ea8d-3227-4bf2-bf8c-caa8f30bda01', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 68382, '2021-01-04 17:18:50', NULL);
INSERT INTO `bundler_info` VALUES (927, 'fd3f323b-3cb5-4bd2-bd82-9c1c6450dee5', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 37283, '2021-01-04 17:18:51', NULL);
INSERT INTO `bundler_info` VALUES (928, '9fa7b271-27db-4f79-aa66-20718752b4e6', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 337415, '2021-01-04 17:20:00', NULL);
INSERT INTO `bundler_info` VALUES (929, '53d66d2c-b6b4-4819-9960-8dad7dc02581', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 55327, '2021-01-04 17:20:00', NULL);
INSERT INTO `bundler_info` VALUES (930, '6842fc3c-6c89-4d5c-bc24-7a4d654707c5', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 34053, '2021-01-04 17:20:01', NULL);
INSERT INTO `bundler_info` VALUES (931, 'be0e1576-6fe5-4b27-8fe7-77b5fafbf837', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 30208, '2021-01-04 17:20:02', NULL);
INSERT INTO `bundler_info` VALUES (932, '8eff7d13-fef1-4196-8c9f-02eec9b1d49e', 'bundler', 'feature/zjf', -1, 6, 'Dilomen', 'replace', 289893, '2021-01-04 17:20:03', NULL);
INSERT INTO `bundler_info` VALUES (933, 'd415bb4f-dd5d-48a2-a40a-12eb49477559', 'bundler', 'feature/zjf', -1, 6, 'Dilomen', 'replace', 47725, '2021-01-04 17:20:04', NULL);
INSERT INTO `bundler_info` VALUES (934, '3e95244f-230e-45a4-ba1f-8c8f60d6b122', 'bundler', 'feature/zjf', -1, 6, 'Dilomen', 'replace', 21845, '2021-01-04 17:20:04', NULL);
INSERT INTO `bundler_info` VALUES (935, 'dbe88d98-0dd6-49ac-b013-cf8b8237410f', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 34011, '2021-01-04 17:47:58', NULL);
INSERT INTO `bundler_info` VALUES (936, '47f402b6-6d31-4b04-90ea-3b7431861911', 'bundler', 'master', 7, 7, 'Dilomen', 'init', 0, '2021-01-04 17:47:59', NULL);
INSERT INTO `bundler_info` VALUES (937, '74a5b421-827a-43ba-93e5-d6cfc7fb0ccb', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 35202, '2021-01-04 17:48:00', NULL);
INSERT INTO `bundler_info` VALUES (938, '78533941-da87-4cea-a74d-0b603e2c1a92', 'bundler', 'dev', 7, 7, 'Dilomen', 'init dev', 0, '2021-01-04 17:48:01', NULL);
INSERT INTO `bundler_info` VALUES (939, '352425a4-675d-45a4-bf34-c2abfbe47de6', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 36808, '2021-01-04 17:48:02', NULL);
INSERT INTO `bundler_info` VALUES (940, '74b2e096-1e07-45d5-a409-48a2925fbd7e', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 35486, '2021-01-04 17:48:03', NULL);
INSERT INTO `bundler_info` VALUES (941, '3edd8c82-953f-4fef-88ee-508e5c99125e', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 32810, '2021-01-04 18:36:24', NULL);
INSERT INTO `bundler_info` VALUES (942, '19460965-6815-4652-b8c0-db11c540a587', 'bundler', 'dev', 7, 7, 'Dilomen', 'init dev', 0, '2021-01-04 18:38:06', NULL);
INSERT INTO `bundler_info` VALUES (943, '3c5eeb29-02a5-4d41-ac4a-a3a240231beb', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 41811, '2021-01-04 18:38:57', NULL);
INSERT INTO `bundler_info` VALUES (944, 'e595b010-d20a-4a44-807c-5fa1dddba47f', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 33317, '2021-01-04 19:02:39', NULL);
INSERT INTO `bundler_info` VALUES (945, '34194ac1-d496-46ef-80f0-cdf5f01af474', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 45266, '2021-01-04 19:32:49', NULL);
INSERT INTO `bundler_info` VALUES (946, 'a269feeb-fdaa-45aa-8d00-0a4d2cd237e2', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 66384, '2021-01-04 19:32:49', NULL);
INSERT INTO `bundler_info` VALUES (947, 'eebcf248-4e9c-49ac-8c4f-6eaccccdbc19', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 46655, '2021-01-04 19:32:50', NULL);
INSERT INTO `bundler_info` VALUES (948, 'ca325fbf-4a61-4643-ac64-69f4e5a9109f', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 46441, '2021-01-04 19:32:52', NULL);
INSERT INTO `bundler_info` VALUES (949, 'fb9089d2-7103-4e42-b443-432b87eede7b', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 71756, '2021-01-04 19:32:52', NULL);
INSERT INTO `bundler_info` VALUES (950, '64ae1c64-3b26-4ea7-b6ec-61bde4175c03', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 47494, '2021-01-04 19:32:53', NULL);
INSERT INTO `bundler_info` VALUES (951, 'c3216f63-1fa0-4192-9ef5-8d137abeec7e', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 42373, '2021-01-04 19:32:54', NULL);
INSERT INTO `bundler_info` VALUES (952, '596429b4-e7bf-4d2b-95ed-5ee19df5ea3f', 'bundler', 'feature/zjf', -1, 6, 'Dilomen', 'replace', 13308, '2021-01-04 19:32:55', NULL);
INSERT INTO `bundler_info` VALUES (953, '3935e615-b333-470e-8257-d01683cb00db', 'bundler', 'feature/zjf', -1, 6, 'Dilomen', 'replace', 14407, '2021-01-04 19:32:56', NULL);
INSERT INTO `bundler_info` VALUES (954, '15fa4b10-94de-4790-93fa-4553557823b6', 'bundler', 'feature/zjf', 7, 7, 'Dilomen', 'replace', 0, '2021-01-04 19:37:35', NULL);
INSERT INTO `bundler_info` VALUES (955, 'e26ac987-ec04-437d-b3a2-3d4d92fb6d39', 'bundler', 'feature/zjf', 3, 6, 'Dilomen', 'replace', 28670, '2021-01-04 19:37:36', NULL);
INSERT INTO `bundler_info` VALUES (956, '0300463f-6e2a-4d6b-8219-9fcd75b7faf3', 'bundler', 'feature/zjf', -1, 6, 'Dilomen', 'replace', 12085, '2021-01-04 19:37:36', NULL);
INSERT INTO `bundler_info` VALUES (957, 'd901677b-dfd1-4466-86b7-9ad491930260', 'bundler', 'feature/zjf', -1, 6, 'Dilomen', 'replace', 12016, '2021-01-04 19:37:37', NULL);
INSERT INTO `bundler_info` VALUES (958, '1d61b2aa-663c-423e-9281-6ed73038b62c', 'bundler', 'feature/zjf', -1, 6, 'Dilomen', 'replace', 12842, '2021-01-04 19:37:38', NULL);
INSERT INTO `bundler_info` VALUES (959, '6bd4f750-f380-4793-8966-d52f7e47e431', 'bundler', 'feature/zjf', -1, 6, 'Dilomen', 'replace', 13217, '2021-01-04 19:39:14', NULL);
INSERT INTO `bundler_info` VALUES (960, 'ac724b7f-01ac-4d06-9071-dbfee057a43a', 'bundler', 'feature/zjf', 7, 7, 'Dilomen', 'replace', 0, '2021-01-04 19:39:15', NULL);
INSERT INTO `bundler_info` VALUES (961, '44048d79-984a-4c9f-9115-ceeac2b0febf', 'bundler', 'feature/zjf', 7, 7, 'Dilomen', 'replace', 0, '2021-01-04 19:39:16', NULL);
INSERT INTO `bundler_info` VALUES (962, '232dd3c9-b535-4fb3-8fb0-7557bf06440a', 'bundler', 'feature/zjf', 7, 7, 'Dilomen', 'replace', 0, '2021-01-04 19:39:16', NULL);
INSERT INTO `bundler_info` VALUES (963, 'c4b40c51-e04a-4137-9f85-5a2d91f152a0', 'bundler', 'feature/zjf', 7, 7, 'Dilomen', 'replace', 0, '2021-01-04 19:39:17', NULL);
INSERT INTO `bundler_info` VALUES (964, 'cd330545-9d40-4e5c-822d-67d8f4d32207', 'bundler', 'feature/zjf', 7, 7, 'Dilomen', 'replace', 0, '2021-01-04 19:39:17', NULL);
INSERT INTO `bundler_info` VALUES (965, 'e69a8523-ec9d-4680-b960-58f6cbd0a863', 'bundler', 'feature/zjf', 7, 7, 'Dilomen', 'replace', 0, '2021-01-04 19:39:18', NULL);
INSERT INTO `bundler_info` VALUES (966, '5f1d2f8c-2300-4f66-9fd6-54e2b92eed9c', 'bundler', 'feature/zjf', 7, 7, 'Dilomen', 'replace', 0, '2021-01-04 20:19:29', NULL);
INSERT INTO `bundler_info` VALUES (967, '877f45e6-65b2-407a-a44f-949d41604e4a', 'bundler', 'feature/zjf', -1, 6, 'Dilomen', 'replace', 23797, '2021-01-04 20:19:30', NULL);
INSERT INTO `bundler_info` VALUES (968, 'eb3afeb6-8082-45ca-ab2f-2b3833b59e07', 'bundler', 'feature/zjf', -1, 6, 'Dilomen', 'replace', 24799, '2021-01-04 20:19:31', NULL);
INSERT INTO `bundler_info` VALUES (969, '728495f3-f323-4fec-a9dd-1afcc1aa1cd8', 'bundler', 'feature/zjf', -1, 6, 'Dilomen', 'replace', 38074, '2021-01-04 20:19:32', NULL);
INSERT INTO `bundler_info` VALUES (970, '28bc60b9-2243-4587-8585-572b416c3efc', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 37094, '2021-01-04 20:19:37', NULL);
INSERT INTO `bundler_info` VALUES (971, '13138bf3-ddc9-4e9b-9663-39805a43ae33', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 38579, '2021-01-04 20:19:38', NULL);
INSERT INTO `bundler_info` VALUES (972, '601a6431-0350-43c2-8873-a720cec3017a', 'bundler', 'master', 7, 7, 'Dilomen', 'init', 0, '2021-01-04 20:19:38', NULL);
INSERT INTO `bundler_info` VALUES (973, 'd75e5b56-e763-4f40-92e1-a16a9d51b8b3', 'bundler', 'master', 7, 7, 'Dilomen', 'init', 0, '2021-01-04 20:19:39', NULL);
INSERT INTO `bundler_info` VALUES (974, 'd513fd8d-5933-4907-b041-691007bf8b2c', 'bundler', 'master', 7, 7, 'Dilomen', 'init', 0, '2021-01-04 20:19:39', NULL);
INSERT INTO `bundler_info` VALUES (975, '453434b0-f0bb-4828-93fe-10cca679ce25', 'bundler', 'master', 7, 7, 'Dilomen', 'init', 0, '2021-01-04 20:19:41', NULL);
INSERT INTO `bundler_info` VALUES (976, 'bc5cb6a8-f982-492d-8a0c-db6fd0d4bf65', 'bundler', 'master', 7, 7, 'Dilomen', 'init', 0, '2021-01-04 20:19:41', NULL);
INSERT INTO `bundler_info` VALUES (977, '38295e6a-7532-4c72-a52a-0d24dfb7d85f', 'bundler', 'dev', 7, 7, 'Dilomen', 'init dev', 0, '2021-01-05 12:22:45', NULL);
INSERT INTO `bundler_info` VALUES (978, '4d71dd6e-077d-480d-a07f-fe381481a20b', 'bundler', 'dev', 7, 7, 'Dilomen', 'init dev', 0, '2021-01-05 12:22:45', NULL);
INSERT INTO `bundler_info` VALUES (979, 'e229117b-3b42-46a0-908e-4237e7f38691', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 93603, '2021-01-05 12:23:14', NULL);
INSERT INTO `bundler_info` VALUES (980, '66906283-0aee-4e5b-99d2-f9804633eda7', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 34847, '2021-01-05 12:23:15', NULL);
INSERT INTO `bundler_info` VALUES (981, '0de70e30-3079-4a3f-8b0c-e0afb60e8153', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 32546, '2021-01-05 13:53:44', NULL);
INSERT INTO `bundler_info` VALUES (982, '6252b55d-1d5d-4d7a-b3cd-3d108559cf8c', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 31517, '2021-01-05 13:53:45', NULL);
INSERT INTO `bundler_info` VALUES (983, '93f2ae22-3441-4114-9645-3924ff07507e', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 32365, '2021-01-05 13:53:46', NULL);
INSERT INTO `bundler_info` VALUES (984, '8aff7025-2781-40fa-a6af-0c85710cdb2d', 'bundler', 'dev', 7, 7, 'Dilomen', 'init dev', 0, '2021-01-05 13:53:46', NULL);
INSERT INTO `bundler_info` VALUES (985, 'af65d37f-480b-4503-b50a-6d8b65f53bab', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 33858, '2021-01-05 13:53:47', NULL);
INSERT INTO `bundler_info` VALUES (986, '30c0acfd-371f-4878-97fc-d3d6e3b36c87', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 57377, '2021-01-09 13:41:35', NULL);
INSERT INTO `bundler_info` VALUES (987, '99400299-274d-4a11-8142-1ce57d9a6dde', 'bundler', 'dev', 7, 7, 'Dilomen', 'init dev', 0, '2021-01-09 13:42:11', NULL);
INSERT INTO `bundler_info` VALUES (988, 'ad5f25df-6fa0-402e-b429-623fd1b68a94', 'bundler', 'dev', 3, 6, 'Dilomen', 'init dev', 61589, '2021-01-09 13:42:11', NULL);
INSERT INTO `bundler_info` VALUES (989, 'e34c21a1-a225-4227-bc94-0e94be904564', 'bundler', 'master', 3, 6, 'Dilomen', 'init', 70135, '2021-01-09 13:42:14', NULL);
INSERT INTO `bundler_info` VALUES (990, '184bc4bf-d5c9-478d-b0e2-9b809499d2e6', 'bundler', 'master', 7, 7, 'Dilomen', 'init', 0, '2021-01-09 13:42:14', NULL);
INSERT INTO `bundler_info` VALUES (991, '51eff254-8c69-4ca1-9a58-c698de27363b', 'bundler', 'feature/zjf', -1, 6, 'Dilomen', 'replace', 44105, '2021-01-09 13:42:16', NULL);
INSERT INTO `bundler_info` VALUES (992, '8b7b9d43-9933-40be-9ee0-7979ed228b20', 'bundler', 'feature/zjf', -1, 6, 'Dilomen', 'replace', 40707, '2021-01-09 13:42:17', NULL);
COMMIT;

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
-- Records of commit_record
-- ----------------------------
BEGIN;
INSERT INTO `commit_record` VALUES ('0300463f-6e2a-4d6b-8219-9fcd75b7faf3', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('0941c909-bf69-495d-bf72-c05e1a8f95a3', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('0c7592a2-a0fa-46cc-8d7c-4ca328dc83ab', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('0de70e30-3079-4a3f-8b0c-e0afb60e8153', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('13138bf3-ddc9-4e9b-9663-39805a43ae33', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('15fa4b10-94de-4790-93fa-4553557823b6', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('184bc4bf-d5c9-478d-b0e2-9b809499d2e6', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('19460965-6815-4652-b8c0-db11c540a587', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('1d61b2aa-663c-423e-9281-6ed73038b62c', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('232dd3c9-b535-4fb3-8fb0-7557bf06440a', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('28bc60b9-2243-4587-8585-572b416c3efc', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('30c0acfd-371f-4878-97fc-d3d6e3b36c87', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('34194ac1-d496-46ef-80f0-cdf5f01af474', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('352425a4-675d-45a4-bf34-c2abfbe47de6', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('38295e6a-7532-4c72-a52a-0d24dfb7d85f', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('3935e615-b333-470e-8257-d01683cb00db', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('3c5eeb29-02a5-4d41-ac4a-a3a240231beb', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('3e95244f-230e-45a4-ba1f-8c8f60d6b122', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('3edd8c82-953f-4fef-88ee-508e5c99125e', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('4107ae86-1e64-4ed2-a3e8-d48f4237a5ec', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('44048d79-984a-4c9f-9115-ceeac2b0febf', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('453434b0-f0bb-4828-93fe-10cca679ce25', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('47f402b6-6d31-4b04-90ea-3b7431861911', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('4d71dd6e-077d-480d-a07f-fe381481a20b', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('51eff254-8c69-4ca1-9a58-c698de27363b', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('53d66d2c-b6b4-4819-9960-8dad7dc02581', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('596429b4-e7bf-4d2b-95ed-5ee19df5ea3f', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('5f1d2f8c-2300-4f66-9fd6-54e2b92eed9c', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('601a6431-0350-43c2-8873-a720cec3017a', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('6252b55d-1d5d-4d7a-b3cd-3d108559cf8c', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('64ae1c64-3b26-4ea7-b6ec-61bde4175c03', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('66906283-0aee-4e5b-99d2-f9804633eda7', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('6842fc3c-6c89-4d5c-bc24-7a4d654707c5', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('6bd4f750-f380-4793-8966-d52f7e47e431', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('728495f3-f323-4fec-a9dd-1afcc1aa1cd8', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('74a5b421-827a-43ba-93e5-d6cfc7fb0ccb', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('74b2e096-1e07-45d5-a409-48a2925fbd7e', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('78533941-da87-4cea-a74d-0b603e2c1a92', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('851d343c-e79a-4055-9d93-0473eac62b3a', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('877f45e6-65b2-407a-a44f-949d41604e4a', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('8aff7025-2781-40fa-a6af-0c85710cdb2d', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('8b7b9d43-9933-40be-9ee0-7979ed228b20', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('8eff7d13-fef1-4196-8c9f-02eec9b1d49e', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('93f2ae22-3441-4114-9645-3924ff07507e', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('99400299-274d-4a11-8142-1ce57d9a6dde', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('9fa7b271-27db-4f79-aa66-20718752b4e6', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('a269feeb-fdaa-45aa-8d00-0a4d2cd237e2', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('ac724b7f-01ac-4d06-9071-dbfee057a43a', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('ad5f25df-6fa0-402e-b429-623fd1b68a94', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('af65d37f-480b-4503-b50a-6d8b65f53bab', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('b023ea8d-3227-4bf2-bf8c-caa8f30bda01', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('bc5cb6a8-f982-492d-8a0c-db6fd0d4bf65', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('be0e1576-6fe5-4b27-8fe7-77b5fafbf837', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('c3216f63-1fa0-4192-9ef5-8d137abeec7e', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('c4b40c51-e04a-4137-9f85-5a2d91f152a0', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('ca325fbf-4a61-4643-ac64-69f4e5a9109f', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('cc0016e1-3777-4d08-9ec8-9ae2a481ab88', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('cd330545-9d40-4e5c-822d-67d8f4d32207', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('d415bb4f-dd5d-48a2-a40a-12eb49477559', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('d513fd8d-5933-4907-b041-691007bf8b2c', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('d75e5b56-e763-4f40-92e1-a16a9d51b8b3', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('d8d0fd57-e68b-429e-a251-29afe4023e72', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('d901677b-dfd1-4466-86b7-9ad491930260', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('dbe88d98-0dd6-49ac-b013-cf8b8237410f', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('e229117b-3b42-46a0-908e-4237e7f38691', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('e26ac987-ec04-437d-b3a2-3d4d92fb6d39', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('e34c21a1-a225-4227-bc94-0e94be904564', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('e595b010-d20a-4a44-807c-5fa1dddba47f', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('e69a8523-ec9d-4680-b960-58f6cbd0a863', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('eb3afeb6-8082-45ca-ab2f-2b3833b59e07', 'https://github.com/Dilomen/bundler.git', '6784671f233177ed1acdd790f93d87b82896afc3', 'Dilomen', 'dilomen@outlook.com', '2020-12-29 20:17:53', 'replace');
INSERT INTO `commit_record` VALUES ('eebcf248-4e9c-49ac-8c4f-6eaccccdbc19', 'https://github.com/Dilomen/bundler.git', '3f681ff111841ae61bce1dad607d7ccfbdda7dec', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:24:21', 'init dev');
INSERT INTO `commit_record` VALUES ('fb9089d2-7103-4e42-b443-432b87eede7b', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
INSERT INTO `commit_record` VALUES ('fd3f323b-3cb5-4bd2-bd82-9c1c6450dee5', 'https://github.com/Dilomen/bundler.git', '36bcc1726d513e8ac2e7ed65e33cb31f62b9ded8', 'Dilomen', 'dilomen@outlook.com', '2020-12-31 07:23:08', 'init');
COMMIT;

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
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL COMMENT '用户名',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `identity` int(11) NOT NULL DEFAULT '0' COMMENT '0管理员，1普通用户',
  `create_time` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES (1, 'admin', 'e10adc3949ba59abbe56e057f20f883e', 0, '2020-09-08 22:49:10');
INSERT INTO `user` VALUES (2, 'test', 'e10adc3949ba59abbe56e057f20f883e', 1, '2020-09-30 11:48:41');
INSERT INTO `user` VALUES (3, 'guest', '123456', 1, '2020-10-13 11:38:31');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
