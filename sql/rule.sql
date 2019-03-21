/*
Navicat MariaDB Data Transfer

Source Server         : localhost_3306
Source Server Version : 100313
Source Host           : localhost:3306
Source Database       : deo

Target Server Type    : MariaDB
Target Server Version : 100313
File Encoding         : 65001

Date: 2019-03-21 19:27:50
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for rule
-- ----------------------------
DROP TABLE IF EXISTS `rule`;
CREATE TABLE `rule` (
  `id` varchar(16) CHARACTER SET latin1 NOT NULL,
  `project_id` varchar(16) CHARACTER SET latin1 NOT NULL,
  `path` varchar(128) CHARACTER SET latin1 NOT NULL,
  `meta` tinytext CHARACTER SET latin1 DEFAULT NULL,
  `selector` varchar(32) CHARACTER SET latin1 DEFAULT NULL,
  `millisecond` mediumint(8) DEFAULT NULL,
  `fn` varchar(255) CHARACTER SET latin1 DEFAULT '',
  `noscript` tinyint(1) NOT NULL,
  `reload` tinyint(1) NOT NULL,
  `created` datetime(1) NOT NULL,
  `updated` datetime(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of rule
-- ----------------------------
INSERT INTO `rule` VALUES ('2EwGKinDi', 'NAkoqJgzo', '/case/mass/:articalid', '<meta name=\"keywords\" content=\"KUIPMAKE\">', '.case-content', '0', '', '1', '1', '2019-02-19 11:28:58.0', '2019-03-21 03:26:30.0');
INSERT INTO `rule` VALUES ('NTlMufUtn', 'MWpx7FiS5', '/sadfsa/afsfdafdafdas', '<meta name=\"keywords\" content=\"KUIPMAKE\">', '.aasdfadfsafdsaf', '0', '', '0', '0', '2019-02-18 02:28:27.0', '2019-02-18 02:28:27.0');
