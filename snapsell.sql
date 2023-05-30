CREATE DATABASE  IF NOT EXISTS `snapsell` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `snapsell`;
-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: snapsell
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ban_ip`
--

DROP TABLE IF EXISTS `ban_ip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ban_ip` (
  `ip_address` varchar(39) NOT NULL,
  `tries` int NOT NULL,
  `time_banned` bigint DEFAULT NULL,
  PRIMARY KEY (`ip_address`),
  UNIQUE KEY `ip_address_UNIQUE` (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ban_ip`
--

LOCK TABLES `ban_ip` WRITE;
/*!40000 ALTER TABLE `ban_ip` DISABLE KEYS */;
INSERT INTO `ban_ip` VALUES ('::1',0,0),('::ffff:127.0.0.1',3,0);
/*!40000 ALTER TABLE `ban_ip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(130) NOT NULL,
  `fk_product_id` int NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_link_to_product_idx` (`fk_product_id`),
  CONSTRAINT `fk_link_to_product` FOREIGN KEY (`fk_product_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (36,'50-1581241713214.jpg',106,'2020-02-09 09:48:33'),(37,'Supreme-20th-Anniversary-Box-Logo-Tee-White-1581241779499.jpg',107,'2020-02-09 09:49:39'),(38,'yeezy-boost-350-v2-antlia-lundmark-synth-release-date-price-01-1581241820941.jpg',108,'2020-02-09 09:50:20'),(42,'air-jordan-1-dior-release-info-4-1581248498871.jpg',116,'2020-02-09 11:41:38'),(43,'supreme-san-francisco-box-logo-tee-black-1581248766336.jfif',117,'2020-02-09 11:46:06'),(44,'off-white-marianna-1581248830797.jfif',118,'2020-02-09 11:47:10'),(45,'BAPE-x-MCM-Camo-Zip-Hoodie-Brown-1581248898688.jpg',119,'2020-02-09 11:48:18'),(46,'jordan-1-high-\'85-1581251792615.jpg',120,'2020-02-09 12:36:32'),(47,'Air-Jordan-1-Retro-Low-Travis-Scott-Product-1581251985871.jpg',121,'2020-02-09 12:39:45'),(48,'OffWhiteXAirMax90-1581252083619.jfif',122,'2020-02-09 12:41:23'),(49,'vlad-1581252129491.png',123,'2020-02-09 12:42:09'),(50,'vlads+-1581252198429.png',124,'2020-02-09 12:43:18'),(51,'crewneckashgrey-1581253492700.jfif',125,'2020-02-09 13:04:52'),(52,'redbadanasupreme-1581253625505.jpg',126,'2020-02-09 13:07:05'),(53,'blackbadanasupreme-1581253650812.jfif',127,'2020-02-09 13:07:30'),(55,'GitHub-1609999590009.appref-ms',129,'2021-01-07 06:06:30'),(56,'snapsell-1610007683525.sql',130,'2021-01-07 08:21:23'),(57,'Screenshot 2022-12-02 103228-1673483651833.png',131,'2023-01-12 00:34:11'),(59,'frame (1)-1675540564346.png',136,'2023-02-04 19:56:04'),(61,'nric_front-1675541813221.jpg',141,'2023-02-04 20:16:53');
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_liker_id` int NOT NULL,
  `fk_listing_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_link_to_users_idx` (`fk_liker_id`),
  KEY `fk_link_to_listing_idx` (`fk_listing_id`),
  CONSTRAINT `fk_link_to_listing` FOREIGN KEY (`fk_listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_link_to_users` FOREIGN KEY (`fk_liker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (11,9,21,'2020-02-05 16:04:42'),(16,11,20,'2020-02-05 16:31:10'),(17,12,20,'2020-02-05 16:31:15'),(18,13,20,'2020-02-05 16:31:18'),(20,9,22,'2020-02-06 03:40:07'),(39,11,116,'2020-02-09 13:08:40'),(41,9,127,'2020-02-09 13:21:31'),(42,11,107,'2020-02-09 13:22:08'),(43,11,117,'2020-02-09 13:22:56'),(44,9,120,'2020-02-09 15:20:53'),(45,9,121,'2020-02-09 15:21:19');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listings`
--

DROP TABLE IF EXISTS `listings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `category` varchar(70) NOT NULL,
  `description` varchar(120) NOT NULL,
  `price` float NOT NULL,
  `fk_poster_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_to_link_to_users_idx` (`fk_poster_id`),
  CONSTRAINT `fk_to_link_to_users` FOREIGN KEY (`fk_poster_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listings`
--

LOCK TABLES `listings` WRITE;
/*!40000 ALTER TABLE `listings` DISABLE KEYS */;
INSERT INTO `listings` VALUES (20,'AF1 Paranoise UK8','Shoes','G-Dragon AF1 Paranoise from NIKE SG BNDS UK8',580,10,'2020-01-29 06:40:06'),(21,'Off White Nike Air Max 90 Black','Shoes','Off White Nike Air Max 90 Black BNDS from Nike EU',880,10,'2020-01-29 06:41:10'),(22,'Abercrombie & Fitch','Clothing','A&F Hoodie',118,13,'2020-01-29 16:26:55'),(23,'Abercrombie & Fitch shirt','Clothing','A&F Tiger shirt',50,13,'2020-01-29 16:27:14'),(106,'Cookies','Food','Cookies for sale',4,9,'2020-02-09 09:48:33'),(107,'Supreme 20th Anniversary Box Logo T-Shirt','Clothing','Supreme 20th Anniversary Box Logo T-Shirt<br>Quite Rare<br>BNDS',610,9,'2020-02-09 09:49:39'),(108,'Yeezy Boost','Shoes','Yeezy boost lundamarks BNDS<br>Size: UK9',450,9,'2020-02-09 09:50:20'),(116,'Air Jordan 1 Dior','Shoes','Pre-Order ',3500,9,'2020-02-09 11:41:38'),(117,'Supreme San Francisco Box Logo','Clothing','Supreme San Francisco Box Logo<br>BNDS<br>Size M',610,9,'2020-02-09 11:46:06'),(118,'Off White Marianna Hoodie','Clothing','Off White Marianna Hoodie<br>BNDS<br>Size L',880,9,'2020-02-09 11:47:10'),(119,'BAPE X MCM Hoodie','Clothing','BAPE X MCM Hoodie<br>BNDS<br>Size S',720,9,'2020-02-09 11:48:18'),(120,'Air Jordan 1 \'85','Shoes','Air Jordan 1 \'85<br>BNDS<br>Size: US 9',0,10,'2020-02-09 12:36:32'),(121,'Travis Scott Air Jordan 1 Low','Shoes','Travis Scott Air Jordan 1 Low<br>BNDS<br>UK 11',750,10,'2020-02-09 12:39:45'),(122,'Off White Air Max 90 Black','Shoes','Off White Air Max 90 Black<br>BNDS<br>SIZE: us 10',900,10,'2020-02-09 12:41:23'),(123,'League of Legends Garena Shells','Games','Selling 10k GS for $140',140,10,'2020-02-09 12:42:09'),(124,'League of Legends Boost','Games','League of Legends boost<br>$15 for promos $8 per division',0,10,'2020-02-09 12:43:18'),(125,'Supreme Grey BOGO Crewneck','Clothing','Supreme Grey BOGO Crewneck<br>BNDS SIZE S',900,11,'2020-02-09 13:04:52'),(126,'urmom','Clothing','Supreme Red Badana BOGO<br>SIZE M',820,11,'2020-02-09 13:07:05'),(127,'Supreme Black Badana BOGO','Clothing','Supreme Black Badana BOGO<br>Size A',820,11,'2020-02-09 13:07:30'),(129,'aa','shoes','aaa',10,9,'2021-01-07 06:06:29'),(130,'abc','sql','abc',10,9,'2021-01-07 08:21:23'),(131,'AJ1s','Shoes','no lol',2000,11,'2023-01-12 00:34:11'),(136,'idk','asd','asd',1231240,11,'2023-02-04 19:56:04'),(141,'qwe','qwe','qwe',12343,11,'2023-02-04 20:16:53');
/*!40000 ALTER TABLE `listings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `offer` float NOT NULL,
  `fk_listing_id` int NOT NULL,
  `fk_offeror_id` int NOT NULL,
  `status` varchar(45) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_to_link_to_listings_idx` (`fk_listing_id`),
  KEY `fk_to_link_to_users_idx` (`fk_offeror_id`),
  CONSTRAINT `fk_to_link_to_listing2` FOREIGN KEY (`fk_listing_id`) REFERENCES `listings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_to_link_to_users2` FOREIGN KEY (`fk_offeror_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
INSERT INTO `offers` VALUES (28,550,20,13,'accepted','2020-02-03 15:25:33'),(31,40,23,9,'accepted','2020-02-04 17:32:28'),(32,530,20,9,'accepted','2020-02-04 17:42:00'),(33,3450,116,11,'accepted','2020-02-09 13:08:44'),(34,500,117,11,'accepted','2020-02-09 13:09:05'),(35,790,127,9,'accepted','2020-02-09 13:21:35'),(36,600,107,11,'accepted','2020-02-09 13:22:10'),(37,540,117,11,'accepted','2020-02-09 13:22:53'),(38,1000,120,9,'accepted','2020-02-09 15:19:57'),(39,1300,120,9,'accepted','2020-02-09 15:20:45'),(40,1400,120,9,'accepted','2020-02-09 15:20:51'),(41,120,126,9,'accepted','2021-01-07 08:22:19'),(42,123132000,125,12,'accepted','2023-01-10 02:59:08'),(43,0,131,10,'pending','2023-02-04 20:56:34'),(44,1,131,10,'pending','2023-02-04 20:56:38'),(45,2,131,10,'pending','2023-02-04 20:56:42');
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(60) NOT NULL,
  `firstname` varchar(45) DEFAULT NULL,
  `lastname` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `profile_pic_url` varchar(255) DEFAULT NULL,
  `role` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (9,'Zisaac','isaaac67@gmail.com','$2b$10$wsRvUXauw1HY5RgyLMRc3er3uECuizMrhOojfoXDdlbUxRbYa5WWC','Isaac','L','2020-01-27 16:56:39',NULL,'member'),(10,'Xios','xios@gmail.com','$2b$10$rgN0gosn/G0iXBEuT/vY8eo8UamCgh5SiV9qW5AX8lchKPoESubkC','Kevyn','Ow','2020-01-29 06:28:57',NULL,'member'),(11,'lengzai1234','yb@gmail.com','$2b$10$z5ZcbWkfqfiu0Mic29x8iOVCxJFZy4GWlm61vhxSP7xc0qmUkyRkS','Yao Bin ','Ganina','2020-01-29 06:33:29',NULL,'member'),(12,'ADRLA','jeff@gmail.com','$2b$10$8VXyfS91axlBzvFOiR9h7uJT.eLSSViXFhni3J8WFIPZm1Xb/7BoS','Jeffrey','Hong','2020-01-29 06:33:49',NULL,'member'),(13,'gwyneth67','gwyneth@gmail.com','$2b$10$XwxJRNxz6avv6gkx9EcRYeN0/DaJoQjAnb7M6fmCwlGwsTc.KhmF2','Gwyneth','Lim','2020-01-29 06:34:28',NULL,'member'),(14,'liverpoolfan','liverpoolfan@gmail.com','$2b$10$ShcWnZ71MEouxxnYIVS8p.0SKcT0yt7tiSO6kMLx9HKYeeUSbGdRO','liver','pool','2023-02-04 05:51:14',NULL,'member'),(15,'John Tan','d@mail.com','$2b$10$O6a.ryqPzAOVKaYImBWXYOGEFAJPQFxHrBLdW.Rikj933QFAeOldG','sdasd','asd','2023-02-04 19:38:44','','member');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-06  3:04:12
