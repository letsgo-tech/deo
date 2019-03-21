/*
Navicat MariaDB Data Transfer

Source Server         : localhost_3306
Source Server Version : 100313
Source Host           : localhost:3306
Source Database       : deo

Target Server Type    : MariaDB
Target Server Version : 100313
File Encoding         : 65001

Date: 2019-03-21 19:28:00
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `id` int(2) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) CHARACTER SET latin1 NOT NULL,
  `password` varchar(64) CHARACTER SET latin1 NOT NULL,
  `created` datetime(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO `user_info` VALUES ('1', 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', '2019-03-21 11:56:22.0');
INSERT INTO `user_info` VALUES ('2', 'test1', '84779f58b8b960ef64ee6c383bb16c7acaceec2a752398ca8af6a0b9b98e7a9b', '2019-03-21 12:03:26.0');
