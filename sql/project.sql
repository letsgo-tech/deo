/*
Navicat MariaDB Data Transfer

Source Server         : localhost_3306
Source Server Version : 100313
Source Host           : localhost:3306
Source Database       : deo

Target Server Type    : MariaDB
Target Server Version : 100313
File Encoding         : 65001

Date: 2019-03-21 19:27:15
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` varchar(16) CHARACTER SET latin1 NOT NULL,
  `project_name` varchar(32) CHARACTER SET latin1 NOT NULL,
  `project_key` varchar(36) CHARACTER SET latin1 NOT NULL,
  `created` datetime(1) NOT NULL,
  `updated` datetime(1) NOT NULL,
  `base_url` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of project
-- ----------------------------
INSERT INTO `project` VALUES ('NAkoqJgzo', 'test3', '4af93b20-4ba7-11e9-b651-b504aafee8f8', '2019-02-18 03:45:20.0', '2019-03-21 03:20:31.0', 'https://www.kuipmake.com');
INSERT INTO `project` VALUES ('wo0S455Mq', 'test1', '5d0eebd0-3350-11e9-a35d-59b676d93d58', '2019-02-17 08:02:58.0', '2019-02-18 03:39:46.0', '');
