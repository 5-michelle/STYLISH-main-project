# ************************************************************
# Sequel Ace SQL dump
# 版本號： 20029
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# 主機: localhost (MySQL 8.0.25)
# 數據庫: stylish_test
# 生成時間: 2022-02-23 07:10:05 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# 轉儲表 campaign
# ------------------------------------------------------------

DROP TABLE IF EXISTS `campaign`;

CREATE TABLE `campaign` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `picture` varchar(255) NOT NULL,
  `story` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product` (`product_id`),
  CONSTRAINT `campaign_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `campaign` WRITE;
/*!40000 ALTER TABLE `campaign` DISABLE KEYS */;

INSERT INTO `campaign` (`id`, `product_id`, `picture`, `story`)
VALUES
	(1,1,'keyvisual.jpg','測試1'),
	(2,2,'keyvisual.jpg','測試2'),
	(3,3,'keyvisual.jpg','測試3');

/*!40000 ALTER TABLE `campaign` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 color
# ------------------------------------------------------------

DROP TABLE IF EXISTS `color`;

CREATE TABLE `color` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `color` WRITE;
/*!40000 ALTER TABLE `color` DISABLE KEYS */;

INSERT INTO `color` (`id`, `code`, `name`)
VALUES
	(1,'FFFFFF','白色'),
	(2,'DDFFBB','亮綠');

/*!40000 ALTER TABLE `color` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 hot
# ------------------------------------------------------------

DROP TABLE IF EXISTS `hot`;

CREATE TABLE `hot` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `hot` WRITE;
/*!40000 ALTER TABLE `hot` DISABLE KEYS */;

INSERT INTO `hot` (`id`, `title`)
VALUES
	(1,'hot1'),
	(2,'hot2'),
	(3,'new hots');

/*!40000 ALTER TABLE `hot` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 hot_product
# ------------------------------------------------------------

DROP TABLE IF EXISTS `hot_product`;

CREATE TABLE `hot_product` (
  `hot_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`hot_id`,`product_id`),
  KEY `product` (`product_id`),
  CONSTRAINT `hot_product_ibfk_1` FOREIGN KEY (`hot_id`) REFERENCES `hot` (`id`),
  CONSTRAINT `hot_product_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `hot_product` WRITE;
/*!40000 ALTER TABLE `hot_product` DISABLE KEYS */;

INSERT INTO `hot_product` (`hot_id`, `product_id`)
VALUES
	(1,1),
	(2,1),
	(3,1),
	(1,2),
	(3,2),
	(1,3),
	(3,3),
	(2,4);

/*!40000 ALTER TABLE `hot_product` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 order_table
# ------------------------------------------------------------

DROP TABLE IF EXISTS `order_table`;

CREATE TABLE `order_table` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `number` varchar(255) NOT NULL,
  `time` bigint unsigned NOT NULL,
  `status` tinyint NOT NULL,
  `details` json NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `total` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `order_table_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `order_table` WRITE;
/*!40000 ALTER TABLE `order_table` DISABLE KEYS */;

INSERT INTO `order_table` (`id`, `number`, `time`, `status`, `details`, `user_id`, `total`)
VALUES
	(1,'12354223106',1645579822310,-1,'{\"list\": [{\"id\": 1, \"qty\": 1, \"name\": \"前開衩扭結洋裝\", \"size\": \"S\", \"color\": {\"code\": \"FFFFFF\", \"name\": \"白色\"}, \"price\": 1000, \"stock\": 2, \"main_image\": \"https://test/1/main.jpg\"}], \"total\": 1060, \"freight\": 60, \"payment\": \"credit_card\", \"shipping\": \"delivery\", \"subtotal\": 1000, \"recipient\": {\"name\": \"test\", \"time\": \"anytime\", \"email\": \"test@gmail.com\", \"phone\": \"0912345678\", \"address\": \"testaddress\"}}',1,1060),
	(2,'12354223216',1645579822321,0,'{\"list\": [{\"id\": 1, \"qty\": 1, \"name\": \"前開衩扭結洋裝\", \"size\": \"S\", \"color\": {\"code\": \"FFFFFF\", \"name\": \"白色\"}, \"price\": 1000, \"stock\": 2, \"main_image\": \"https://test/1/main.jpg\"}], \"total\": 1060, \"freight\": 60, \"payment\": \"credit_card\", \"shipping\": \"delivery\", \"subtotal\": 1000, \"recipient\": {\"name\": \"test\", \"time\": \"anytime\", \"email\": \"test@gmail.com\", \"phone\": \"0912345678\", \"address\": \"testaddress\"}}',1,1060);

/*!40000 ALTER TABLE `order_table` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 payment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `payment`;

CREATE TABLE `payment` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `details` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order_table` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;

INSERT INTO `payment` (`id`, `order_id`, `details`)
VALUES
	(1,2,'{\"msg\": \"Success\", \"amount\": 8056, \"status\": 0, \"acquirer\": \"TW_CTBC\", \"currency\": \"TWD\", \"auth_code\": \"132481\", \"card_info\": {\"type\": 1, \"level\": \"\", \"issuer\": \"\", \"bank_id\": \"\", \"country\": \"UNITED KINGDOM\", \"funding\": 0, \"bin_code\": \"424242\", \"last_four\": \"4242\", \"country_code\": \"GB\", \"issuer_zh_tw\": \"\"}, \"merchant_id\": \"AppWorksSchool_CTBC\", \"order_number\": \"\", \"rec_trade_id\": \"D20200210eKvZyv\", \"bank_result_msg\": \"\", \"card_identifier\": \"dee921560b074be7a860a6b44a80c21b\", \"bank_result_code\": \"\", \"bank_transaction_id\": \"TP20200210eKvZyv\", \"bank_transaction_time\": {\"end_time_millis\": \"1581325720251\", \"start_time_millis\": \"1581325720251\"}, \"transaction_time_millis\": 1581325720207}');

/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 product
# ------------------------------------------------------------

DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(127) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` int unsigned NOT NULL,
  `texture` varchar(127) NOT NULL,
  `wash` varchar(127) NOT NULL,
  `place` varchar(127) NOT NULL,
  `note` varchar(127) NOT NULL,
  `story` text NOT NULL,
  `main_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category` (`category`),
  KEY `title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;

INSERT INTO `product` (`id`, `category`, `title`, `description`, `price`, `texture`, `wash`, `place`, `note`, `story`, `main_image`)
VALUES
	(1,'men','product1','Product 1',100,'pt1','pw1','pp1','pn1','ps1','main.jpg'),
	(2,'women','product2','Product 2',200,'pt2','pw2','pp2','pn2','ps2','main.jpg'),
	(3,'men','product3','Product 3',300,'pt3','pw3','pp3','pn3','ps3','main.jpg'),
	(4,'accessories','product4','Product 4',400,'pt4','pw4','pp4','pn4','ps4','main.jpg'),
	(5,'accessories','product5','Product 5',500,'pt5','pw5','pp5','pn5','ps5','main.jpg'),
	(6,'accessories','product6','Product 6',600,'pt6','pw6','pp6','pn6','ps6','main.jpg'),
	(7,'women','product7','Product 7',700,'pt7','pw7','pp7','pn7','ps7','main.jpg'),
	(8,'men','product8','Product 8',800,'pt8','pw8','pp8','pn8','ps8xwxw','main.jpg'),
	(9,'men','product9','Product 9',900,'pt9','pw9','pp9','pn9','ps9xwxw','main.jpg'),
	(10,'men','test searchkey product10','Product 10',1000,'pt10','pw10','pp10','pn10','ps10xwxw','main.jpg'),
	(11,'men','test searchkey product11','Product 11',1100,'pt11','pw11','pp11','pn11','ps11xwxw','main.jpg'),
	(12,'men','test searchkey product12','Product 12',1200,'pt12','pw12','pp12','pn12','ps12xwxw','main.jpg'),
	(13,'men','test searchkey product13','Product 13',1300,'pt13','pw13','pp13','pn13','ps13xwxw','main.jpg'),
	(14,'men','test searchkey product14','Product 14',1400,'pt14','pw14','pp14','pn14','ps14xwxw','main.jpg');

/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 product_images
# ------------------------------------------------------------

DROP TABLE IF EXISTS `product_images`;

CREATE TABLE `product_images` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `image` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Product` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_images_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `Product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;

INSERT INTO `product_images` (`id`, `product_id`, `image`)
VALUES
	(1,1,'0.jpg'),
	(2,1,'1.jpg'),
	(3,1,'0.jpg'),
	(4,1,'1.jpg'),
	(5,2,'0.jpg'),
	(6,2,'1.jpg'),
	(7,2,'0.jpg'),
	(8,2,'1.jpg'),
	(9,3,'0.jpg'),
	(10,3,'1.jpg'),
	(11,3,'0.jpg'),
	(12,3,'1.jpg'),
	(13,4,'0.jpg'),
	(14,4,'1.jpg'),
	(15,4,'0.jpg'),
	(16,4,'1.jpg'),
	(17,5,'0.jpg'),
	(18,5,'1.jpg'),
	(19,5,'0.jpg'),
	(20,5,'1.jpg'),
	(21,6,'0.jpg'),
	(22,6,'1.jpg'),
	(23,6,'0.jpg'),
	(24,6,'1.jpg'),
	(25,7,'0.jpg'),
	(26,7,'1.jpg'),
	(27,7,'0.jpg'),
	(28,7,'1.jpg'),
	(29,8,'0.jpg'),
	(30,8,'1.jpg'),
	(31,8,'0.jpg'),
	(32,8,'1.jpg'),
	(33,9,'0.jpg'),
	(34,9,'1.jpg'),
	(35,9,'0.jpg'),
	(36,9,'1.jpg'),
	(37,10,'0.jpg'),
	(38,10,'1.jpg'),
	(39,10,'0.jpg'),
	(40,10,'1.jpg'),
	(41,11,'0.jpg'),
	(42,11,'1.jpg'),
	(43,11,'0.jpg'),
	(44,11,'1.jpg'),
	(45,12,'0.jpg'),
	(46,12,'1.jpg'),
	(47,12,'0.jpg'),
	(48,12,'1.jpg'),
	(49,13,'0.jpg'),
	(50,13,'1.jpg'),
	(51,13,'0.jpg'),
	(52,13,'1.jpg'),
	(53,14,'0.jpg'),
	(54,14,'1.jpg'),
	(55,14,'0.jpg'),
	(56,14,'1.jpg');

/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;

INSERT INTO `role` (`id`, `name`)
VALUES
	(1,'admin'),
	(2,'user');

/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_id` int unsigned DEFAULT NULL,
  `provider` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(127) NOT NULL,
  `picture` varchar(500) DEFAULT NULL,
  `access_token` varchar(1000) NOT NULL DEFAULT '',
  `access_expired` bigint unsigned NOT NULL,
  `login_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user` (`provider`,`email`,`password`),
  KEY `access_token` (`access_token`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`id`, `role_id`, `provider`, `email`, `password`, `name`, `picture`, `access_token`, `access_expired`, `login_at`)
VALUES
	(1,1,'native','test1@gmail.com','$2b$10$ZXZNpDN443i421dLZ2Ubz.ECANa9s6SQ5KLfhowk8kAOtHh.Zzmqm','test1',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm92aWRlciI6Im5hdGl2ZSIsIm5hbWUiOiJ0ZXN0MSIsImVtYWlsIjoidGVzdDFAZ21haWwuY29tIiwicGljdHVyZSI6bnVsbCwiaWF0IjoxNjQ1NTc5ODIyfQ.eeii6PlJ1g-_iKNMHyf_4GxMvPCTdchMgcpxWpWxxeE',2592000,'2022-02-23 09:30:23'),
	(2,2,'facebook','test2@gmail.com',NULL,'test2','https://graph.facebook.com/1/picture?type=large','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm92aWRlciI6ImZhY2Vib29rIiwibmFtZSI6InRlc3QyIiwiZW1haWwiOiJ0ZXN0MkBnbWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vMjIyMi9waWN0dXJlP3R5cGU9bGFyZ2UiLCJpYXQiOjE2NDU1Nzk4MjJ9.VzJb-oU0PmMxdHNQ3XV8PpTWqJ6sZKzkZ5V5bAAUric',2592000,'2022-02-23 09:30:23'),
	(3,2,'native','test3@gmail.com','$2b$10$NO3TrH5uC00p61yI3LKXz.HxeKPmphFa.YRQmaVgk4NsgEOLcweSq','test3',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm92aWRlciI6Im5hdGl2ZSIsIm5hbWUiOiJ0ZXN0MyIsImVtYWlsIjoidGVzdDNAZ21haWwuY29tIiwicGljdHVyZSI6bnVsbCwiaWF0IjoxNjQ1NTc5ODIyfQ.uOISjg8C2ecsCjOkbv0Guvy4xjFw6jiFjBT9DGLWLTs',2592000,'2022-02-23 09:30:22'),
	(4,2,'native','arthur@gmail.com','$2b$10$mM53Tq0Xp8mAFD3zusmnkuwBltRs5qIafLiimUbRmE./z6US8M8vq','arthur',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm92aWRlciI6Im5hdGl2ZSIsIm5hbWUiOiJhcnRodXIiLCJlbWFpbCI6ImFydGh1ckBnbWFpbC5jb20iLCJwaWN0dXJlIjpudWxsLCJpYXQiOjE2NDU1Nzk4MjJ9.9ISAeAnBfWikpXyo57dEuyr2PIr-lmQ599aYv7EcsEg',2592000,'2022-02-23 09:30:22'),
	(5,2,'facebook','fakefbuser@gmail.com',NULL,'fake fb user','https://graph.facebook.com/1111/picture?type=large','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm92aWRlciI6ImZhY2Vib29rIiwibmFtZSI6ImZha2UgZmIgdXNlciIsImVtYWlsIjoiZmFrZWZidXNlckBnbWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vMTExMS9waWN0dXJlP3R5cGU9bGFyZ2UiLCJpYXQiOjE2NDU1Nzk4MjJ9.XF7W3MhOrrpIdFWIwh15_hZw1uQRF_TIEPpX__DEwbs',2592000,'2022-02-23 09:30:23');

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;


# 轉儲表 variant
# ------------------------------------------------------------

DROP TABLE IF EXISTS `variant`;

CREATE TABLE `variant` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `color_id` int unsigned DEFAULT NULL,
  `size` varchar(15) NOT NULL,
  `stock` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product` (`product_id`),
  CONSTRAINT `variant_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

LOCK TABLES `variant` WRITE;
/*!40000 ALTER TABLE `variant` DISABLE KEYS */;

INSERT INTO `variant` (`id`, `product_id`, `color_id`, `size`, `stock`)
VALUES
	(1,1,1,'S',2),
	(2,1,1,'M',5),
	(3,1,2,'S',2),
	(4,2,1,'S',2),
	(5,2,2,'L',2);

/*!40000 ALTER TABLE `variant` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
