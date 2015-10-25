# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 192.168.96.160 (MySQL 5.5.44-0ubuntu0.14.04.1)
# Database: projectblockdb
# Generation Time: 2015-10-25 17:39:26 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table _communicationTypes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_communicationTypes`;

CREATE TABLE `_communicationTypes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `guid` varchar(100) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `shortTitle` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table account_org_relation
# ------------------------------------------------------------

DROP TABLE IF EXISTS `account_org_relation`;

CREATE TABLE `account_org_relation` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `guid` varchar(100) DEFAULT '',
  `account_guid` varchar(100) DEFAULT NULL,
  `org_guid` varchar(100) DEFAULT NULL,
  `dateCreated` datetime DEFAULT NULL,
  `org_level` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table accounts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `accounts`;

CREATE TABLE `accounts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `guid` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `dateCreated` datetime DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table api_accounts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `api_accounts`;

CREATE TABLE `api_accounts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `guid` varchar(100) DEFAULT NULL,
  `siteTitle` varchar(255) DEFAULT NULL,
  `siteUrl` varchar(255) DEFAULT '',
  `contactEmail` varchar(100) DEFAULT NULL,
  `address1` varchar(255) DEFAULT NULL,
  `address2` varchar(100) DEFAULT NULL,
  `city` varchar(200) DEFAULT NULL,
  `state` varchar(200) DEFAULT NULL,
  `postalCode` varchar(50) DEFAULT NULL,
  `status` tinyint(4) DEFAULT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `comments` longtext,
  `remoteAddress` varchar(25) DEFAULT NULL,
  `emailVerified` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='This table holds information on contacts that register for an API key. These api keys will be used to track and limit external communication into this application.';



# Dump of table contactCommRelation
# ------------------------------------------------------------

DROP TABLE IF EXISTS `contactCommRelation`;

CREATE TABLE `contactCommRelation` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `guid` varchar(100) DEFAULT NULL,
  `org_guid` varchar(100) DEFAULT NULL,
  `contact_guid` varchar(100) DEFAULT NULL,
  `commType_guid` varchar(100) DEFAULT NULL,
  `commValue` varchar(255) DEFAULT NULL,
  `isDefault` tinyint(1) DEFAULT NULL,
  `comment` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table contacts
# ------------------------------------------------------------

DROP TABLE IF EXISTS `contacts`;

CREATE TABLE `contacts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `guid` varchar(100) DEFAULT NULL,
  `org_guid` varchar(100) DEFAULT NULL,
  `location_guId` varchar(100) DEFAULT NULL,
  `language_guid` varchar(100) DEFAULT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `comments` longtext,
  `dateCreated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table locations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `locations`;

CREATE TABLE `locations` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `guid` varchar(100) DEFAULT NULL,
  `org_guid` varchar(100) DEFAULT NULL,
  `contact_guId` varchar(100) DEFAULT NULL,
  `address1` varchar(200) DEFAULT NULL,
  `address2` varchar(200) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `comment` longtext,
  `dateCreated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table org_registration_meta
# ------------------------------------------------------------

DROP TABLE IF EXISTS `org_registration_meta`;

CREATE TABLE `org_registration_meta` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `guid` varchar(100) DEFAULT NULL,
  `org_guid` varchar(100) DEFAULT NULL,
  `ipaddress` varchar(20) DEFAULT NULL,
  `url` longtext,
  `comments` longtext,
  `emailAddress` varchar(100) DEFAULT NULL,
  `api_guid` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table org_supported_languages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `org_supported_languages`;

CREATE TABLE `org_supported_languages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `guid` varchar(100) DEFAULT NULL,
  `org_guid` varchar(100) DEFAULT NULL,
  `language_guid` varchar(100) DEFAULT NULL,
  `isDefault` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table organizations
# ------------------------------------------------------------

DROP TABLE IF EXISTS `organizations`;

CREATE TABLE `organizations` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `guid` varchar(100) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `shortTitle` varchar(100) DEFAULT NULL,
  `location_guid` varchar(100) DEFAULT NULL,
  `comments` longtext,
  `dateCreated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table sessions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sessions`;

CREATE TABLE `sessions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `guid` varchar(100) DEFAULT NULL,
  `account_guid` varchar(100) DEFAULT NULL,
  `org_guid` varchar(100) DEFAULT NULL,
  `sessionId` varchar(65) DEFAULT NULL,
  `dateCreated` varchar(100) DEFAULT NULL,
  `ipaddress` varchar(20) DEFAULT NULL,
  `sessionType` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
