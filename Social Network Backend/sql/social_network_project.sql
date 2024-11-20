CREATE DATABASE  IF NOT EXISTS `social_network_project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `social_network_project`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: social_network_project
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `account_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `create_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone_number` (`phone_number`),
  KEY `account_ibfk_1` (`user_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,101,'aaaaa@gmail.com',NULL,'$2b$10$JB50DepV2SBykdQE826RaupgX.KG5fDKMhlxRXi4dbFLDFJql.VCW','2024-11-16 00:39:35');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follower`
--

DROP TABLE IF EXISTS `follower`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follower` (
  `follower_user_id` int NOT NULL,
  `following_user_id` int NOT NULL,
  PRIMARY KEY (`follower_user_id`,`following_user_id`),
  KEY `following_user_id` (`following_user_id`),
  CONSTRAINT `follower_ibfk_1` FOREIGN KEY (`follower_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `follower_ibfk_2` FOREIGN KEY (`following_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follower`
--

LOCK TABLES `follower` WRITE;
/*!40000 ALTER TABLE `follower` DISABLE KEYS */;
INSERT INTO `follower` VALUES (5,1),(6,1),(101,1),(101,2),(5,12),(2,101);
/*!40000 ALTER TABLE `follower` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hashtags`
--

DROP TABLE IF EXISTS `hashtags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hashtags` (
  `hashtag_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`hashtag_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hashtags`
--

LOCK TABLES `hashtags` WRITE;
/*!40000 ALTER TABLE `hashtags` DISABLE KEYS */;
/*!40000 ALTER TABLE `hashtags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `content` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `visibility` enum('public','private','friends') DEFAULT 'public',
  `likes` int DEFAULT '0',
  `comments` int DEFAULT '0',
  `shares` int DEFAULT '0',
  PRIMARY KEY (`post_id`),
  KEY `posts_ibfk_1` (`user_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=209 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,54,'Open fractures involving skull or face with other bones with subarachnoid, subdural, and extradural hemorrhage, with prolonged [more than 24 hours] loss of consciousness and return to pre-existing conscious level','2024-11-12 23:00:00','private',0,0,0),(2,41,'Observation for suspected neurological conditions','2024-11-12 23:00:00','private',0,0,0),(3,60,'Transverse or oblique presentation, delivered, with or without mention of antepartum condition','2024-11-12 23:00:00','public',0,0,0),(4,53,'Postphlebetic syndrome with other complication','2024-11-12 23:00:00','private',0,0,0),(5,27,'Open fractures involving skull or face with other bones, with other and unspecified intracranial hemorrhage, with brief [less than one hour] loss of consciousness','2024-11-12 23:00:00','private',0,0,0),(6,80,'Elevated sedimentation rate','2024-11-12 23:00:00','private',0,0,0),(7,63,'Other benign neoplasm of connective and other soft tissue of other specified sites','2024-11-12 23:00:00','private',0,0,0),(8,24,'Outcome of delivery, other multiple birth, all liveborn','2024-11-12 23:00:00','public',0,0,0),(9,85,'Other malaria','2024-11-12 23:00:00','public',0,0,0),(10,11,'Coronary atherosclerosis due to calcified coronary lesion','2024-11-12 23:00:00','public',0,0,0),(11,100,'Other motor vehicle nontraffic accident while boarding and alighting injuring rider of animal; occupant of animal-drawn vehicle','2024-11-12 23:00:00','private',0,0,0),(12,24,'Syringomyelia and syringobulbia','2024-11-12 23:00:00','public',0,0,0),(13,96,'Neoplasm of uncertain behavior of plasma cells','2024-11-12 23:00:00','private',0,0,0),(14,11,'Crowding of teeth','2024-11-12 23:00:00','private',0,0,0),(15,33,'Other specified schistosomiasis','2024-11-12 23:00:00','private',0,0,0),(16,88,'Acute myocardial infarction of inferoposterior wall, initial episode of care','2024-11-12 23:00:00','public',0,0,0),(17,51,'Other motor vehicle traffic accident involving collision on the highway injuring driver of motor vehicle other than motorcycle','2024-11-12 23:00:00','public',0,0,0),(18,100,'Accident caused by air gun','2024-11-12 23:00:00','private',0,0,0),(19,17,'Galactorrhea associated with childbirth, unspecified as to episode of care or not applicable','2024-11-12 23:00:00','private',0,0,0),(20,87,'Open fracture of metacarpal bone(s), site unspecified','2024-11-12 23:00:00','public',0,0,0),(21,34,'Need for desensitization to allergens','2024-11-12 23:00:00','private',0,0,0),(22,58,'Osteoarthrosis, localized, primary, ankle and foot','2024-11-12 23:00:00','public',0,0,0),(23,74,'Other specified complications of pregnancy, delivered, with or without mention of antepartum condition','2024-11-12 23:00:00','private',0,0,0),(24,15,'Basophilia','2024-11-12 23:00:00','private',0,0,0),(25,92,'Unspecified abnormality of labor, antepartum condition or complication','2024-11-12 23:00:00','private',0,0,0),(26,96,'Hallucinogen dependence, in remission','2024-11-12 23:00:00','public',0,0,0),(27,83,'Stricture of artery','2024-11-12 23:00:00','public',0,0,0),(28,27,'Talipes calcaneovalgus','2024-11-12 23:00:00','private',0,0,0),(29,48,'Acute lymphoid leukemia, in relapse','2024-11-12 23:00:00','private',0,0,0),(30,38,'Myogenic ptosis','2024-11-12 23:00:00','public',0,0,0),(31,99,'Candidiasis of mouth','2024-11-12 23:00:00','private',0,0,0),(32,29,'Benign neoplasm of esophagus','2024-11-12 23:00:00','public',0,0,0),(33,1,'Relapsing fever, tick-borne','2024-11-12 23:00:00','public',0,0,0),(34,32,'Carcinoma in situ of lip, oral cavity, and pharynx','2024-11-12 23:00:00','public',0,0,0),(35,75,'Avalanche, landslide, or mudslide','2024-11-12 23:00:00','private',0,0,0),(36,59,'Open fractures involving skull or face with other bones, without mention of intracranial injury, unspecified state of consciousness','2024-11-12 23:00:00','private',0,0,0),(37,16,'Thoracic root lesions, not elsewhere classified','2024-11-12 23:00:00','public',0,0,0),(38,51,'Closed fracture of pubis','2024-11-12 23:00:00','private',0,0,0),(39,97,'Bullous keratopathy','2024-11-12 23:00:00','private',0,0,0),(40,99,'Chronic factitious illness with physical symptoms','2024-11-12 23:00:00','public',0,0,0),(41,57,'Tuberculous pneumonia [any form], bacteriological or histological examination not done','2024-11-12 23:00:00','public',0,0,0),(42,11,'Family history of psychiatric condition','2024-11-12 23:00:00','private',0,0,0),(43,39,'Bipolar I disorder, most recent episode (or current) manic, severe, without mention of psychotic behavior','2024-11-12 23:00:00','public',0,0,0),(44,50,'Flushing','2024-11-12 23:00:00','public',0,0,0),(45,48,'Assault by hunting rifle','2024-11-12 23:00:00','private',0,0,0),(46,12,'Late effects of injury purposely inflicted by other person','2024-11-12 23:00:00','private',0,0,0),(47,24,'Aspergillosis','2024-11-12 23:00:00','public',0,0,0),(48,79,'Acute myocardial infarction of other lateral wall, subsequent episode of care','2024-11-12 23:00:00','public',0,0,0),(49,13,'Subarachnoid hemorrhage following injury without mention of open intracranial wound, with no loss of consciousness','2024-11-12 23:00:00','public',0,0,0),(50,22,'Screening for malignant neoplasms of cervix','2024-11-12 23:00:00','public',0,0,0),(51,95,'Abrasion or friction burn of hip, thigh, leg, and ankle, without mention of infection','2024-11-12 23:00:00','private',0,0,0),(52,52,'Other and unspecified superficial injury of trunk, infected','2024-11-12 23:00:00','public',0,0,0),(53,16,'Unspecified derangement of joint, other specified sites','2024-11-12 23:00:00','public',0,0,0),(54,16,'Rectal prolapse','2024-11-12 23:00:00','private',0,0,0),(55,99,'Accidental poisoning by shellfish','2024-11-12 23:00:00','private',0,0,0),(56,92,'Alkalizing agents causing adverse effects in therapeutic use','2024-11-12 23:00:00','private',0,0,0),(57,15,'Alkaline chemical burn of cornea and conjunctival sac','2024-11-12 23:00:00','public',0,0,0),(58,68,'Malignant neoplasm of prepuce','2024-11-12 23:00:00','private',0,0,0),(59,98,'Sprain of tibiofibular (ligament), distal of ankle','2024-11-12 23:00:00','public',0,0,0),(60,51,'Obesity complicating pregnancy, childbirth, or the puerperium, antepartum condition or complication','2024-11-12 23:00:00','public',0,0,0),(61,97,'Episodic cluster headache','2024-11-12 23:00:00','private',0,0,0),(62,72,'Vitamin A deficiency with night blindness','2024-11-12 23:00:00','public',0,0,0),(63,77,'Complete edentulism, class III','2024-11-12 23:00:00','private',0,0,0),(64,88,'Contracture of palmar fascia','2024-11-12 23:00:00','public',0,0,0),(65,70,'Unspecified infection of the breast and nipple associated with childbirth, antepartum condition or complication','2024-11-12 23:00:00','private',0,0,0),(66,77,'Closed fracture of sacrum and coccyx without mention of spinal cord injury','2024-11-12 23:00:00','public',0,0,0),(67,96,'Benign neoplasm of lip','2024-11-12 23:00:00','private',0,0,0),(68,88,'Pauciarticular juvenile rheumatoid arthritis','2024-11-12 23:00:00','private',0,0,0),(69,61,'Vascular disorders of skin','2024-11-12 23:00:00','public',0,0,0),(70,80,'Infected hydrocele','2024-11-12 23:00:00','public',0,0,0),(71,78,'Other viral conjunctivitis','2024-11-12 23:00:00','private',0,0,0),(72,78,'Thoracic spondylosis without myelopathy','2024-11-12 23:00:00','private',0,0,0),(73,7,'Neoplasm of uncertain behavior of other and unspecified parts of nervous system','2024-11-12 23:00:00','private',0,0,0),(74,83,'Occlusion and stenosis of multiple and bilateral precerebral arteries without mention of cerebral infarction','2024-11-12 23:00:00','public',0,0,0),(75,44,'Unspecified abortion, complicated by renal failure, complete','2024-11-12 23:00:00','private',0,0,0),(76,70,'Sciatica','2024-11-12 23:00:00','public',0,0,0),(77,14,'C5-C7 level with complete lesion of spinal cord','2024-11-12 23:00:00','private',0,0,0),(78,39,'Other viral diseases in the mother, delivered, with or without mention of antepartum condition','2024-11-12 23:00:00','private',0,0,0),(79,30,'Burn [any degree] involving 90 percent or more of body surface with third degree burn, 40-49%','2024-11-12 23:00:00','private',0,0,0),(80,82,'Central pain syndrome','2024-11-12 23:00:00','public',0,0,0),(81,81,'Activities involving floor mopping and cleaning','2024-11-12 23:00:00','private',0,0,0),(82,69,'High head at term, delivered, with or without mention of antepartum condition','2024-11-12 23:00:00','private',0,0,0),(83,55,'Other congenital or acquired abnormality of cervix, delivered, with or without mention of antepartum condition','2024-11-12 23:00:00','private',0,0,0),(84,84,'Poisoning by antitussives','2024-11-12 23:00:00','private',0,0,0),(85,99,'Other dislocation of knee, open','2024-11-12 23:00:00','private',0,0,0),(86,91,'Symptomatic states associated with artificial menopause','2024-11-12 23:00:00','public',0,0,0),(87,63,'Open wound of mouth, unspecified site, without mention of complication','2024-11-12 23:00:00','private',0,0,0),(88,61,'Other specified counseling','2024-11-12 23:00:00','public',0,0,0),(89,75,'Activity involving exercise machines primarily for cardiorespiratory conditioning','2024-11-12 23:00:00','public',0,0,0),(90,6,'Open wound of shoulder region, complicated','2024-11-12 23:00:00','private',0,0,0),(91,32,'Hodgkin\'s granuloma, intrathoracic lymph nodes','2024-11-12 23:00:00','public',0,0,0),(92,11,'Subarachnoid hemorrhage following injury with open intracranial wound, with brief [less than one hour] loss of consciousness','2024-11-12 23:00:00','public',0,0,0),(93,42,'Leukemic reticuloendotheliosis, intrapelvic lymph nodes','2024-11-12 23:00:00','public',0,0,0),(94,10,'Other closed skull fracture with cerebral laceration and contusion, with no loss of consciousness','2024-11-12 23:00:00','public',0,0,0),(95,79,'Other and unspecified disorder of breast associated with childbirth, delivered, with mention of postpartum complication','2024-11-12 23:00:00','private',0,0,0),(96,78,'Infantile hemiplegia','2024-11-12 23:00:00','private',0,0,0),(97,80,'Other placental conditions, affecting management of mother, unspecified as to episode of care or not applicable','2024-11-12 23:00:00','private',0,0,0),(98,36,'Neonatal thyrotoxicosis','2024-11-12 23:00:00','public',0,0,0),(99,20,'Motor vehicle traffic accident involving collision with train injuring rider of animal; occupant of animal-drawn vehicle','2024-11-12 23:00:00','public',0,0,0),(100,67,'Elderly multigravida, unspecified as to episode of care or not applicable','2024-11-12 23:00:00','public',0,0,0),(101,62,'Closed fracture of sacrum and coccyx without mention of spinal cord injury','2024-11-12 23:00:00','private',0,0,0),(102,85,'Mechanical failure of instrument or apparatus during infusion and transfusion','2024-11-12 23:00:00','private',0,0,0),(103,71,'Arthropod-borne disease, unspecified','2024-11-12 23:00:00','public',0,0,0),(104,79,'Superficial foreign body (splinter) of foot and toe(s), without major open wound and without mention of infection','2024-11-12 23:00:00','public',0,0,0),(105,38,'Graft-versus-host disease, unspecified','2024-11-12 23:00:00','private',0,0,0),(106,4,'Family history of other ear disorders','2024-11-12 23:00:00','private',0,0,0),(107,53,'Late effect of burn of eye, face, head, and neck','2024-11-12 23:00:00','private',0,0,0),(108,53,'Unspecified infective arthritis, pelvic region and thigh','2024-11-12 23:00:00','private',0,0,0),(109,64,'Pneumonia due to other specified organism','2024-11-12 23:00:00','private',0,0,0),(110,52,'Dermatophytosis of hand','2024-11-12 23:00:00','private',0,0,0),(111,40,'Unspecified contusion of eye','2024-11-12 23:00:00','public',0,0,0),(112,10,'Suicide and self-inflicted poisoning by other and unspecified solid and liquid substances','2024-11-12 23:00:00','private',0,0,0),(113,88,'Other open skull fracture with cerebral laceration and contusion, with concussion, unspecified','2024-11-12 23:00:00','private',0,0,0),(114,51,'Gambling and betting','2024-11-12 23:00:00','private',0,0,0),(115,81,'Pressure ulcer, other site','2024-11-12 23:00:00','private',0,0,0),(116,31,'Histrionic personality disorder, unspecified','2024-11-12 23:00:00','public',0,0,0),(117,88,'Neonatal jaundice associated with preterm delivery','2024-11-12 23:00:00','public',0,0,0),(118,75,'Closed fracture of base of skull with cerebral laceration and contusion, with moderate [1-24 hours] loss of consciousness','2024-11-12 23:00:00','private',0,0,0),(119,36,'Cerebellar or brain stem contusion without mention of open intracranial wound, with prolonged [more than 24 hours] loss of consciousness without return to pre-existing conscious level','2024-11-12 23:00:00','public',0,0,0),(120,91,'Poisoning by selective serotonin and norepinephrine reuptake inhibitors','2024-11-12 23:00:00','private',0,0,0),(121,13,'Atrophy of vulva','2024-11-12 23:00:00','private',0,0,0),(122,41,'Prolonged depressive reaction','2024-11-12 23:00:00','public',0,0,0),(123,59,'Ventral, unspecified, hernia without mention of obstruction or gangrene','2024-11-12 23:00:00','public',0,0,0),(124,58,'Erythema [first degree] of forehead and cheek','2024-11-12 23:00:00','private',0,0,0),(125,31,'Alternating esotropia with A pattern','2024-11-12 23:00:00','public',0,0,0),(126,29,'Poisoning by opiate antagonists','2024-11-12 23:00:00','private',0,0,0),(127,21,'Other middle ear adhesions and combinations','2024-11-12 23:00:00','public',0,0,0),(128,56,'Vitamin A deficiency with xerophthalmic scars of cornea','2024-11-12 23:00:00','public',0,0,0),(129,57,'Gastroschisis','2024-11-12 23:00:00','private',0,0,0),(130,67,'Absence or hypoplasia of umbilical artery','2024-11-12 23:00:00','private',0,0,0),(131,79,'Acute myocardial infarction of inferolateral wall, initial episode of care','2024-11-12 23:00:00','public',0,0,0),(132,56,'Osteopoikilosis','2024-11-12 23:00:00','private',0,0,0),(133,71,'Major anomalies of jaw size, mandibular hyperplasia','2024-11-12 23:00:00','private',0,0,0),(134,68,'Superficial foreign body (splinter) of face, neck, and scalp except eye, without major open wound, infected','2024-11-12 23:00:00','public',0,0,0),(135,53,'Unspecified vomiting of pregnancy, unspecified as to episode of care or not applicable','2024-11-12 23:00:00','public',0,0,0),(136,14,'Illegally induced abortion, with other specified complications, incomplete','2024-11-12 23:00:00','private',0,0,0),(137,21,'Lobomycosis','2024-11-12 23:00:00','private',0,0,0),(138,14,'Conjunctival diphtheria','2024-11-12 23:00:00','private',0,0,0),(139,84,'Hodgkin\'s disease, lymphocytic-histiocytic predominance, intrathoracic lymph nodes','2024-11-12 23:00:00','public',0,0,0),(140,91,'Closed fracture of shaft of ulna (alone)','2024-11-12 23:00:00','private',0,0,0),(141,8,'Caisson disease','2024-11-12 23:00:00','private',0,0,0),(142,30,'Hip and thigh injury','2024-11-12 23:00:00','public',0,0,0),(143,77,'Unspecified infectious and parasitic diseases','2024-11-12 23:00:00','public',0,0,0),(144,31,'Malignant carcinoid tumor of unknown primary site','2024-11-12 23:00:00','public',0,0,0),(145,35,'Nonspecific abnormal findings in stool contents','2024-11-12 23:00:00','private',0,0,0),(146,17,'Personal history of unspecified circulatory disease','2024-11-12 23:00:00','public',0,0,0),(147,87,'Crushing injury of foot','2024-11-12 23:00:00','private',0,0,0),(148,48,'Focal choroiditis and chorioretinitis of other posterior pole','2024-11-12 23:00:00','public',0,0,0),(149,7,'Other speech disturbance','2024-11-12 23:00:00','private',0,0,0),(150,32,'Reactive confusion','2024-11-12 23:00:00','private',0,0,0),(151,1,'Poisoning by agricultural and horticultural chemical and pharmaceutical preparations other than plant foods and fertilizers, undetermined whether accidentally or purposely inflicted','2024-11-12 23:00:00','private',0,0,0),(152,31,'Acute myocardial infarction of unspecified site, subsequent episode of care','2024-11-12 23:00:00','private',0,0,0),(153,24,'Accident due to changes in air pressure from unspecified cause','2024-11-12 23:00:00','private',0,0,0),(154,13,'Giant cell tumor of tendon sheath','2024-11-12 23:00:00','private',0,0,0),(155,9,'Alcoholic polyneuropathy','2024-11-12 23:00:00','private',0,0,0),(156,93,'Other specified infectious and parasitic diseases of mother, delivered, with or without mention of antepartum condition','2024-11-12 23:00:00','private',0,0,0),(157,48,'Tuberculosis of intrathoracic lymph nodes, tubercle bacilli not found by bacteriological or histological examination, but tuberculosis confirmed by other methods [inoculation of animals]','2024-11-12 23:00:00','public',0,0,0),(158,29,'Necrobacillosis','2024-11-12 23:00:00','private',0,0,0),(159,24,'Renal dialysis status','2024-11-12 23:00:00','private',0,0,0),(160,45,'Septic arterial embolism','2024-11-12 23:00:00','private',0,0,0),(161,32,'Erythema [first degree] of thigh [any part]','2024-11-12 23:00:00','public',0,0,0),(162,96,'History of emotional abuse','2024-11-12 23:00:00','private',0,0,0),(163,35,'Sickle-cell disease, unspecified','2024-11-12 23:00:00','private',0,0,0),(164,85,'Spontaneous bacterial peritonitis','2024-11-12 23:00:00','public',0,0,0),(165,67,'Blisters, epidermal loss [second degree] of thigh [any part]','2024-11-12 23:00:00','private',0,0,0),(166,25,'Postphlebetic syndrome with ulcer and inflammation','2024-11-12 23:00:00','private',0,0,0),(167,83,'Keloid scar','2024-11-12 23:00:00','public',0,0,0),(168,7,'Major anomalies of jaw size, microgenia','2024-11-12 23:00:00','private',0,0,0),(169,20,'Other multiple birth (three or more), mates all liveborn, born in hospital, delivered by cesarean section','2024-11-12 23:00:00','public',0,0,0),(170,25,'Peritonsillar abscess','2024-11-12 23:00:00','private',0,0,0),(171,58,'Food poisoning due to Vibrio vulnificus','2024-11-12 23:00:00','private',0,0,0),(172,31,'Cicatricial ectropion','2024-11-12 23:00:00','public',0,0,0),(173,17,'Angular blepharoconjunctivitis','2024-11-12 23:00:00','private',0,0,0),(174,79,'Calculus of bile duct with other cholecystitis, with obstruction','2024-11-12 23:00:00','public',0,0,0),(175,52,'Nonspecific abnormal response to nerve stimulation, unspecified','2024-11-12 23:00:00','private',0,0,0),(176,73,'Universal ulcerative (chronic) colitis','2024-11-12 23:00:00','private',0,0,0),(177,95,'Other specified ancylostoma','2024-11-12 23:00:00','private',0,0,0),(178,64,'Malignant neoplasm of trigone of urinary bladder','2024-11-12 23:00:00','private',0,0,0),(179,47,'Infection and inflammatory reaction due to cardiac device, implant, and graft','2024-11-12 23:00:00','public',0,0,0),(180,56,'Effusion of joint, shoulder region','2024-11-12 23:00:00','private',0,0,0),(181,57,'Coronary atherosclerosis due to lipid rich plaque','2024-11-12 23:00:00','private',0,0,0),(182,76,'Accidental poisoning by agents primarily affecting blood constituents','2024-11-12 23:00:00','private',0,0,0),(183,19,'Personal history of vaginal dysplasia','2024-11-12 23:00:00','private',0,0,0),(184,57,'Hemangioma of intra-abdominal structures','2024-11-12 23:00:00','private',0,0,0),(185,32,'Poisoning by insulins and antidiabetic agents','2024-11-12 23:00:00','public',0,0,0),(186,98,'Open fracture of mandible, multiple sites','2024-11-12 23:00:00','private',0,0,0),(187,19,'Body Mass Index 40.0-44.9, adult','2024-11-12 23:00:00','public',0,0,0),(188,37,'Mycosis fungoides, spleen','2024-11-12 23:00:00','private',0,0,0),(189,5,'Retinopathy of prematurity, stage 5','2024-11-12 23:00:00','private',0,0,0),(190,45,'Delayed or excessive hemorrhage following abortion or ectopic and molar pregnancies','2024-11-12 23:00:00','private',0,0,0),(191,2,'Mycosis fungoides, spleen','2024-11-12 23:00:00','private',0,0,0),(192,92,'Blisters, epidermal loss [second degree] of chin','2024-11-12 23:00:00','public',0,0,0),(193,20,'Assault by cutting and piercing instrument','2024-11-12 23:00:00','private',0,0,0),(194,47,'Cachexia','2024-11-12 23:00:00','private',0,0,0),(195,73,'Influenza due to identified novel influenza A virus with other manifestations','2024-11-12 23:00:00','private',0,0,0),(196,2,'Screening for alcoholism','2024-11-12 23:00:00','public',0,0,0),(197,65,'Other and unspecified manifestations of thiamine deficiency','2024-11-12 23:00:00','private',0,0,0),(198,55,'Fetal malnutrition without mention of \"light-for-dates\", 1,250-1,499 grams','2024-11-12 23:00:00','private',0,0,0),(199,55,'Viral hepatitis A with hepatic coma','2024-11-13 23:00:00','public',0,0,0),(200,55,'Hypertrophy of salivary gland','2024-11-13 23:00:00','private',0,0,0),(201,1,'Endometriosis of other specified sites','2024-11-15 09:00:00','public',0,0,0),(202,41,'post di prova public','2024-11-17 18:31:52','public',0,0,0),(203,2,'Prova solo friends','2024-11-17 18:35:38','private',0,0,0),(204,2,'prova post private','2024-11-20 01:03:41','private',0,0,0),(205,5,'2123j prova public 2','2024-11-20 01:06:38','public',0,0,0),(206,2,'prova post pubblico ma account privato','2024-11-20 12:50:04','public',0,0,0),(207,101,'prova post privat ma stesso account','2024-11-20 12:50:29','private',0,0,0),(208,100,'post privato e acount privato','2024-11-20 12:52:47','private',0,0,0);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts_comments`
--

DROP TABLE IF EXISTS `posts_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts_comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `post_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `content` text,
  PRIMARY KEY (`comment_id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `posts_comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `posts_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts_comments`
--

LOCK TABLES `posts_comments` WRITE;
/*!40000 ALTER TABLE `posts_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `posts_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts_hashtags`
--

DROP TABLE IF EXISTS `posts_hashtags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts_hashtags` (
  `post_id` int NOT NULL,
  `hashtag_id` int NOT NULL,
  PRIMARY KEY (`post_id`,`hashtag_id`),
  KEY `hashtag_id` (`hashtag_id`),
  CONSTRAINT `posts_hashtags_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `posts_hashtags_ibfk_2` FOREIGN KEY (`hashtag_id`) REFERENCES `hashtags` (`hashtag_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts_hashtags`
--

LOCK TABLES `posts_hashtags` WRITE;
/*!40000 ALTER TABLE `posts_hashtags` DISABLE KEYS */;
/*!40000 ALTER TABLE `posts_hashtags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts_images`
--

DROP TABLE IF EXISTS `posts_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts_images` (
  `post_id` int NOT NULL,
  `url` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`,`url`),
  CONSTRAINT `posts_images_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts_images`
--

LOCK TABLES `posts_images` WRITE;
/*!40000 ALTER TABLE `posts_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `posts_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts_likes`
--

DROP TABLE IF EXISTS `posts_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts_likes` (
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `posts_likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `posts_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts_likes`
--

LOCK TABLES `posts_likes` WRITE;
/*!40000 ALTER TABLE `posts_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `posts_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts_shares`
--

DROP TABLE IF EXISTS `posts_shares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts_shares` (
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `posts_shares_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `posts_shares_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts_shares`
--

LOCK TABLES `posts_shares` WRITE;
/*!40000 ALTER TABLE `posts_shares` DISABLE KEYS */;
/*!40000 ALTER TABLE `posts_shares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `bio` text,
  `birth_date` date DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `banner_picture` varchar(255) DEFAULT NULL,
  `visibility` enum('public','private') DEFAULT 'public',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'vpetrasek0','Vasilis Petrasek','Insertion of Limb Lengthening External Fixation Device into Right Humeral Shaft, Percutaneous Approach','1972-09-24',NULL,NULL,'public'),(2,'bfrowd1','Briney Frowd','Therapeutic Exercise Treatment of Neurological System - Head and Neck using Assistive, Adaptive, Supportive or Protective Equipment','2005-08-27',NULL,NULL,'private'),(3,'islater2','Ibby Slater','Extirpation of Matter from Right Middle Lung Lobe, Via Natural or Artificial Opening','2006-08-23',NULL,NULL,'private'),(4,'mjemison3','Marcela Jemison','Extirpation of Matter from Left Zygomatic Bone, Open Approach','1999-12-25',NULL,NULL,'public'),(5,'dlearoyd4','Dulsea Learoyd','Chiropractic, Anatomical Regions, Manipulation','1982-08-22',NULL,NULL,'private'),(6,'ssandiford5','Stevena Sandiford','Beam Radiation of Duodenum using Photons 1 - 10 MeV','2006-10-31',NULL,NULL,'private'),(7,'dchaize6','Diarmid Chaize','Extirpation of Matter from Ileocecal Valve, Percutaneous Approach','1986-08-25',NULL,NULL,'public'),(8,'spursey7','Sindee Pursey','Dilation of Right Internal Mammary Artery, Bifurcation, Open Approach','1957-04-20',NULL,NULL,'private'),(9,'bherrieven8','Barbey Herrieven','Drainage of Left Shoulder Region, Percutaneous Approach, Diagnostic','2001-09-20',NULL,NULL,'private'),(10,'jsaipy9','Jane Saipy','Extirpation of Matter from Subdural Space, Open Approach','1958-12-07',NULL,NULL,'private'),(11,'aklyna','Alfons Klyn','Excision of Left Wrist Bursa and Ligament, Open Approach, Diagnostic','1973-04-30',NULL,NULL,'private'),(12,'voventonb','Vonni Oventon','Destruction of Right Foot Bursa and Ligament, Percutaneous Approach','2016-12-14',NULL,NULL,'private'),(13,'cmanuelyc','Corri Manuely','Restriction of Bladder with Intraluminal Device, Via Natural or Artificial Opening Endoscopic','2022-11-26',NULL,NULL,'private'),(14,'rclemmensend','Rolfe Clemmensen','Insertion of Intraluminal Device into Left Peroneal Artery, Percutaneous Approach','2012-07-18',NULL,NULL,'private'),(15,'weklesse','Wittie Ekless','Occlusion of Esophagogastric Junction with Extraluminal Device, Percutaneous Approach','1960-07-21',NULL,NULL,'private'),(16,'jnehlsenf','Jonathon Nehlsen','High Dose Rate (HDR) Brachytherapy of Nose using Iridium 192 (Ir-192)','1970-11-30',NULL,NULL,'private'),(17,'nfearng','Nessi Fearn','Magnetic Resonance Imaging (MRI) of Lower Extremity Tendons using Other Contrast, Unenhanced and Enhanced','1994-01-11',NULL,NULL,'private'),(18,'sfarfolomeevh','Siward Farfolomeev','Revision of Nonautologous Tissue Substitute in Upper Artery, Percutaneous Approach','2022-11-06',NULL,NULL,'public'),(19,'obeckerlegi','Odessa Beckerleg','Bypass Coronary Artery, Two Arteries from Coronary Vein with Intraluminal Device, Percutaneous Approach','1982-07-26',NULL,NULL,'private'),(20,'vblanningj','Vanda Blanning','Replacement of Uvula with Synthetic Substitute, Open Approach','2014-08-27',NULL,NULL,'public'),(21,'yferrolik','Yorgos Ferroli','Revision of Internal Fixation Device in Right Toe Phalangeal Joint, External Approach','1973-08-27',NULL,NULL,'private'),(22,'wgreaserl','Willi Greaser','Destruction of Left Thyroid Gland Lobe, Percutaneous Endoscopic Approach','1998-01-07',NULL,NULL,'public'),(23,'nthorndycraftm','Nelson Thorndycraft','Dilation of Left Temporal Artery with Three Intraluminal Devices, Open Approach','1995-05-21',NULL,NULL,'private'),(24,'wmelmethn','Winnifred Melmeth','Dilation of Right Foot Artery, Bifurcation, Percutaneous Approach','1981-04-05',NULL,NULL,'private'),(25,'naulsfordo','Nedda Aulsford','Bypass Esophagus to Jejunum with Autologous Tissue Substitute, Via Natural or Artificial Opening Endoscopic','2020-07-14',NULL,NULL,'private'),(26,'fbrewersp','Ferguson Brewers','Bypass Left Axillary Vein to Upper Vein with Nonautologous Tissue Substitute, Percutaneous Endoscopic Approach','1974-10-30',NULL,NULL,'private'),(27,'gyellowleesq','Gypsy Yellowlees','Bypass Coronary Artery, Four or More Arteries from Right Internal Mammary with Autologous Arterial Tissue, Open Approach','2013-07-10',NULL,NULL,'private'),(28,'dpynerr','Donavon Pyner','Transplantation of Heart, Allogeneic, Open Approach','1963-12-13',NULL,NULL,'private'),(29,'lbrownsmiths','Leora Brownsmith','Removal of Internal Fixation Device from Right Metacarpocarpal Joint, Percutaneous Endoscopic Approach','1985-04-07',NULL,NULL,'public'),(30,'mmillbankt','Melina Millbank','Supplement Left Vertebral Artery with Nonautologous Tissue Substitute, Percutaneous Approach','1974-10-24',NULL,NULL,'public'),(31,'afeatherstoneu','Aubry Featherstone','Removal of Other Device on Left Foot','1978-08-16',NULL,NULL,'public'),(32,'ttilbyv','Trip Tilby','Dilation of Lower Artery with Two Intraluminal Devices, Percutaneous Endoscopic Approach','1966-01-31',NULL,NULL,'public'),(33,'epabelikw','Else Pabelik','Alteration of Right Lower Arm Subcutaneous Tissue and Fascia, Open Approach','1976-10-03',NULL,NULL,'public'),(34,'mpashex','Mara Pashe','Drainage of Thalamus with Drainage Device, Percutaneous Endoscopic Approach','2007-07-20',NULL,NULL,'public'),(35,'gsymondsy','Giralda Symonds','Dilation of Left Femoral Artery with Two Intraluminal Devices, Open Approach','1966-11-16',NULL,NULL,'private'),(36,'acrosettiz','Ardisj Crosetti','Reposition Left Thumb Phalanx with External Fixation Device, Open Approach','2004-01-12',NULL,NULL,'private'),(37,'aketteringham10','Alecia Ketteringham','Extraction of Left Vocal Cord, Via Natural or Artificial Opening','2009-05-17',NULL,NULL,'public'),(38,'scollopy11','Sibella Collopy','Replacement of Left Femoral Shaft with Nonautologous Tissue Substitute, Percutaneous Endoscopic Approach','1974-01-04',NULL,NULL,'private'),(39,'zcroyser12','Zebulon Croyser','Drainage of Right Kidney, Percutaneous Endoscopic Approach','1976-06-22',NULL,NULL,'private'),(40,'eabrahamoff13','Else Abrahamoff','Nuclear Medicine, Anatomical Regions, Nonimaging Nuclear Medicine Probe','2012-08-26',NULL,NULL,'private'),(41,'lpodmore14','Lewiss Podmore','Excision of Left Trunk Tendon, Percutaneous Endoscopic Approach, Diagnostic','2011-09-04',NULL,NULL,'private'),(42,'kdabels15','Katina Dabels','Insertion of Pedicle-Based Spinal Stabilization Device into Occipital-cervical Joint, Open Approach','1976-05-10',NULL,NULL,'private'),(43,'rmousby16','Rafaelia Mousby','Dilation of Coronary Artery, Three Arteries, Bifurcation, Percutaneous Endoscopic Approach','1960-04-08',NULL,NULL,'private'),(44,'adi17','Arther Di Angelo','Release Trachea, Percutaneous Endoscopic Approach','1963-08-31',NULL,NULL,'public'),(45,'garrundale18','Giorgi Arrundale','Supplement Stomach with Autologous Tissue Substitute, Percutaneous Endoscopic Approach','1980-08-08',NULL,NULL,'private'),(46,'tatterbury19','Thor Atterbury','Excision of Cervical Nerve, Open Approach','2002-04-01',NULL,NULL,'private'),(47,'ncoch1a','Neddy Coch','Extirpation of Matter from Left Kidney, Open Approach','2013-09-09',NULL,NULL,'private'),(48,'xwhyteman1b','Xavier Whyteman','Introduction of Anti-inflammatory into Bones, Percutaneous Approach','1977-12-08',NULL,NULL,'private'),(49,'barnoud1c','Barclay Arnoud','Revision of Drainage Device in Left Breast, Percutaneous Approach','2000-10-15',NULL,NULL,'public'),(50,'kteaser1d','Krispin Teaser','Fluoroscopy of Left Pelvic (Iliac) Veins, Guidance','1974-10-11',NULL,NULL,'private'),(51,'bbouller1e','Bronson Bouller','Bypass Cecum to Cecum with Nonautologous Tissue Substitute, Via Natural or Artificial Opening Endoscopic','2004-07-27',NULL,NULL,'public'),(52,'sfuidge1f','Stacee Fuidge','Dilation of Left Internal Carotid Artery, Bifurcation, with Three Drug-eluting Intraluminal Devices, Percutaneous Approach','1991-12-28',NULL,NULL,'private'),(53,'wharberer1g','Wilmette Harberer','Revision of Synthetic Substitute in Left Auditory Ossicle, Via Natural or Artificial Opening Endoscopic','1959-02-15',NULL,NULL,'private'),(54,'rhargreves1h','Roanne Hargreves','Supplement Right Basilic Vein with Autologous Tissue Substitute, Open Approach','1999-06-02',NULL,NULL,'private'),(55,'talpine1i','Thorstein Alpine','Revision of Internal Fixation Device in Right Shoulder Joint, Percutaneous Endoscopic Approach','2010-01-19',NULL,NULL,'public'),(56,'zmongin1j','Zahara Mongin','Drainage of Right Choroid with Drainage Device, Open Approach','1965-06-02',NULL,NULL,'private'),(57,'bdjordjevic1k','Biddy Djordjevic','Alteration of Female Perineum with Synthetic Substitute, Open Approach','2021-05-02',NULL,NULL,'private'),(58,'kboyat1l','Kylen Boyat','Excision of Chest Subcutaneous Tissue and Fascia, Percutaneous Approach, Diagnostic','1962-07-11',NULL,NULL,'private'),(59,'tsibylla1m','Tory Sibylla','Measurement of Biliary Pressure, Via Natural or Artificial Opening Endoscopic','1991-06-09',NULL,NULL,'public'),(60,'oswindon1n','Orin Swindon','Supplement Left Lower Leg Tendon with Nonautologous Tissue Substitute, Open Approach','2019-05-30',NULL,NULL,'private'),(61,'rmuttock1o','Rudy Muttock','Bypass Left Internal Iliac Artery to Right External Iliac Artery with Nonautologous Tissue Substitute, Open Approach','2002-03-20',NULL,NULL,'private'),(62,'aprantl1p','Anna Prantl','Dilation of Left Brachial Artery, Bifurcation, with Four or More Drug-eluting Intraluminal Devices, Open Approach','2016-07-28',NULL,NULL,'public'),(63,'egribble1q','Emlynn Gribble','Supplement Nasal Septum with Synthetic Substitute, Percutaneous Approach','1974-10-19',NULL,NULL,'public'),(64,'cpickton1r','Cyb Pickton','Drainage of Ileum, Open Approach, Diagnostic','2016-10-10',NULL,NULL,'private'),(65,'ibefroy1s','Isacco Befroy','Reattachment of Left Large Intestine, Percutaneous Endoscopic Approach','1962-10-06',NULL,NULL,'public'),(66,'hbrach1t','Haroun Brach','Bypass Cecum to Cutaneous with Autologous Tissue Substitute, Open Approach','1978-03-12',NULL,NULL,'private'),(67,'lnozzolii1u','Leonelle Nozzolii','Release Left Abdomen Bursa and Ligament, Percutaneous Endoscopic Approach','2023-09-20',NULL,NULL,'private'),(68,'bhadfield1v','Barrie Hadfield','Supplement Head Muscle with Nonautologous Tissue Substitute, Open Approach','1958-10-10',NULL,NULL,'private'),(69,'ale1w','Alyce Le Lievre','Resection of Epiglottis, Open Approach','1996-03-22',NULL,NULL,'public'),(70,'bgreder1x','Bernie Greder','Insertion of Internal Fixation Device into Left Tibia, Percutaneous Approach','2014-01-13',NULL,NULL,'private'),(71,'jferraraccio1y','Jewelle Ferraraccio','Planar Nuclear Medicine Imaging of Gallbladder using Other Radionuclide','1999-05-29',NULL,NULL,'private'),(72,'bcastagne1z','Bertram Castagne','Drainage of Left Lower Extremity, Open Approach, Diagnostic','2007-11-16',NULL,NULL,'private'),(73,'tmoralis20','Theodoric Moralis','Drainage of Left Ethmoid Bone, Percutaneous Endoscopic Approach','1996-12-10',NULL,NULL,'private'),(74,'brodmell21','Berenice Rodmell','Destruction of Left Parotid Gland, Percutaneous Approach','1966-10-29',NULL,NULL,'private'),(75,'mgaitone22','Marie Gaitone','Drainage of Toe Nail, External Approach, Diagnostic','2004-10-30',NULL,NULL,'private'),(76,'tcoldridge23','Tiler Coldridge','Bypass Bilateral Vas Deferens to Right Epididymis, Open Approach','2013-06-04',NULL,NULL,'public'),(77,'jwogden24','Janek Wogden','Replacement of Buccal Mucosa with Synthetic Substitute, Open Approach','2015-03-01',NULL,NULL,'private'),(78,'jvesco25','Jonell Vesco','Revision of Autologous Tissue Substitute in Lower Tendon, Open Approach','2012-05-17',NULL,NULL,'public'),(79,'bhutcheon26','Berty Hutcheon','Removal of Nonautologous Tissue Substitute from Right Metatarsal-Tarsal Joint, Percutaneous Endoscopic Approach','1965-03-18',NULL,NULL,'public'),(80,'mabendroth27','Maire Abendroth','Supplement Thorax Lymphatic with Autologous Tissue Substitute, Open Approach','1989-11-26',NULL,NULL,'private'),(81,'bshreve28','Brock Shreve','Bypass Right Internal Iliac Artery to Right Femoral Artery with Autologous Arterial Tissue, Percutaneous Endoscopic Approach','1993-06-05',NULL,NULL,'public'),(82,'ede29','Elwood de Castelain','Dilation of Coronary Artery, Four or More Arteries with Two Drug-eluting Intraluminal Devices, Percutaneous Approach','1958-10-19',NULL,NULL,'private'),(83,'cianson2a','Callida I\'anson','Dilation of Coronary Artery, One Artery with Two Drug-eluting Intraluminal Devices, Percutaneous Endoscopic Approach','1978-03-23',NULL,NULL,'public'),(84,'cgoldstraw2b','Cazzie Goldstraw','Excision of Right Wrist Joint, Percutaneous Approach, Diagnostic','1958-12-27',NULL,NULL,'private'),(85,'dbedells2c','Dollie Bedells','Excision of Right Hand Vein, Open Approach, Diagnostic','1991-10-03',NULL,NULL,'public'),(86,'jturfrey2d','Jenda Turfrey','Revision of Drainage Device in Lower Tendon, Open Approach','1954-12-18',NULL,NULL,'private'),(87,'jmonini2e','Jake Monini','Repair Trachea, Open Approach','1952-03-29',NULL,NULL,'public'),(88,'mtongue2f','Meridel Tongue','Replacement of Hepatic Vein with Autologous Tissue Substitute, Open Approach','1955-07-26',NULL,NULL,'private'),(89,'dfarndale2g','Dido Farndale','Supplement Right Axillary Artery with Synthetic Substitute, Percutaneous Approach','1979-12-23',NULL,NULL,'public'),(90,'mcolgan2h','Mac Colgan','Replacement of Pericardium with Nonautologous Tissue Substitute, Percutaneous Endoscopic Approach','1989-03-09',NULL,NULL,'private'),(91,'gommanney2i','Gav Ommanney','Occlusion of Right Kidney Pelvis with Intraluminal Device, Via Natural or Artificial Opening','1984-04-26',NULL,NULL,'private'),(92,'ctebbet2j','Crin Tebbet','Revision of Synthetic Substitute in Mediastinum, External Approach','2020-03-03',NULL,NULL,'public'),(93,'gnairns2k','Gregorius Nairns','Insertion of Ring External Fixation Device into Right Fibula, Percutaneous Approach','1991-10-03',NULL,NULL,'private'),(94,'ctompion2l','Cathrin Tompion','Therapeutic Exercise Treatment of Musculoskeletal System - Lower Back / Lower Extremity using Physical Agents','1980-10-22',NULL,NULL,'public'),(95,'jbatiste2m','Jere Batiste','Fusion of Cervical Vertebral Joint, Posterior Approach, Anterior Column, Percutaneous Approach','1954-10-19',NULL,NULL,'private'),(96,'kexell2n','Kippy Exell','Insertion of Radioactive Element into Respiratory Tract, Open Approach','1993-03-31',NULL,NULL,'private'),(97,'eblackborough2o','Ethel Blackborough','Revision of Monitoring Device in Tracheobronchial Tree, Via Natural or Artificial Opening','1961-09-27',NULL,NULL,'private'),(98,'tmungane2p','Thomasin Mungane','Occlusion of Left External Iliac Artery with Extraluminal Device, Percutaneous Approach','1984-02-13',NULL,NULL,'public'),(99,'cfazackerley2q','Carolee Fazackerley','Replacement of Left Parietal Bone with Nonautologous Tissue Substitute, Open Approach','1997-05-22',NULL,NULL,'private'),(100,'lsparwell2r','Lorenza Sparwell','Drainage of Tonsils, Open Approach, Diagnostic','1989-05-08',NULL,NULL,'private'),(101,'aaaaa','aaaaaaaaaa',NULL,'1212-12-12',NULL,NULL,'public');
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

-- Dump completed on 2024-11-20 22:23:48
