-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: newera
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `about`
--

DROP TABLE IF EXISTS `about`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about` (
  `id` int NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about`
--

LOCK TABLES `about` WRITE;
/*!40000 ALTER TABLE `about` DISABLE KEYS */;
INSERT INTO `about` VALUES (1,'Совершенно новый и уникальный квест в Вологде с возможностью прохождения в Жанре Хоррор и в Жанре Приключения\n\nМножество игровых локаций \n\nПогружение в атмосферу с минус первой и до последней минуты\n                        \nВозвращение назад в будущее\n                        \nСюжет - драма, достойная Оскара\n                        \nЗахватывающая игра актера\n\nАльтернативные сценарии прохождения\n\n**Наша цель** - дать посетителям возможность прикоснуться к эмоциям, которые потрясают настолько, что не дадут шанса молчать о пережитом, а заставят говорить и оветовать всем своим близким наш продукт.\n\n**Мы гарантируем:**\n\nБолее 120 квадратных метров игровой площади\n\n90 минут искрометного перфоманса и настоящего экшена\n                        \nНовый уровень адреналина и страха, а так же выбор своего уровня прохождения\n                        \nМассу интересных фишек, которые есть только у нас \n\nУникальные загадки\n                        \nХватит читать. Пора звонить и бронировать свое приключение! \n\nУдиви себя и своих близких!\n                        ');
/*!40000 ALTER TABLE `about` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `birthday_description`
--

DROP TABLE IF EXISTS `birthday_description`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `birthday_description` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `birthday_description`
--

LOCK TABLES `birthday_description` WRITE;
/*!40000 ALTER TABLE `birthday_description` DISABLE KEYS */;
INSERT INTO `birthday_description` VALUES (1,'Участники до 12 лет включительно проходят квест в сопровождении одного взрослого(старше 18 лет) или дополнительного сопровождающего. \n\n**Квест на выбор:** 1. «Дитя апокалипсиса» 14+ 2. «Блогеры: загадки старого дома» 8+ 3. «Кома» 14+ 4 «Сон» 9+\n\n**Шоу программа на выбор:\\***\n\n\\- Шоу мыльные пузыри\n\n\\- Шоу профессора Чудакова (химия-физика)\n\n\\- Фокусник\n\n**В КОМНАТУ ОТДЫХА входит:**\n\n\\- Удобное пространство для застолья на 15 сидячих мест\n\n\\- Сега\n\n\\- Игра мафия*\n\n\\- Горячая и холодная питьевая вода\n\n\\- Чай\n\n\\- Салфетки\n\n\\- Столовые приборы, одноразовая посуда\n\n\\- Микроволновка\n\n**Действует ежедневно.\\***\n\nЕсть возможность принести свои угощения, фрукты или заказать пиццу для празднования в комнате отдыха.\n\nЛюбая музыка на ваш выбор.\n\nСкидки, указанные в группе, не распространяются на пакет \"Для больших компаний\"');
/*!40000 ALTER TABLE `birthday_description` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `birthday_offers`
--

DROP TABLE IF EXISTS `birthday_offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `birthday_offers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `best` tinyint(1) DEFAULT '0',
  `attributes` json NOT NULL,
  `link` text NOT NULL,
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `birthday_offers`
--

LOCK TABLES `birthday_offers` WRITE;
/*!40000 ALTER TABLE `birthday_offers` DISABLE KEYS */;
INSERT INTO `birthday_offers` VALUES (1,'Минимум','6500 руб. за 5 чел. + 800 руб. за каждого доп. участника',0,'[\"1 квест\", \"Поздравление аниматором + торт в подарок\", \"1 час в комнате отдыха\", \"5-10 участников\", \"Пространство для застолья на 15 сидячих мест\", \"Денди и Сега\", \"Настольные игры\", \"Горячая и холодная питьевая вода\", \"Чай\", \"Столовые приборы\", \"Одноразовая посуда\", \"Микроволновка\"]','https://vk.com/market/product/quotden-rozhdenia-minimumquot-213324777-8053944',123),(2,'Стандарт','8000 руб. за 5 чел. + 800 руб. за каждого доп. участника',1,'[\"Поздравление аниматором + торт в подарок\", \"Проведение игр-конкурсов аниматором - 40 минут\", \"Подарок для всех участников\", \"1 квест\", \"1 час в комнате отдыха\", \"15-30 участников\", \"Пространство для застолья на 15 сидячих мест\", \"Денди и Сега\", \"Настольные игры\", \"Горячая и холодная питьевая вода\", \"Чай\", \"Столовые приборы\", \"Одноразовая посуда\", \"Микроволновка\"]','https://vk.com/market/product/quotden-rozhdenia-standartquot-213324777-8053957',0),(3,'Премиум','12000 руб. за 5 чел. + 800 руб. за каждого доп. участника',0,'[\"Поздравление аниматором + торт в подарок\", \"Проведение игр-конкурсов аниматором - 40 минут\", \"Подарок для всех участников\", \"Проведение Шоу программы - 30 минут\", \"1 квест\", \"1 час в комнате отдыха\", \"15-30 участников\", \"Пространство для застолья на 15 сидячих мест\", \"Денди и Сега\", \"Настольные игры\", \"Горячая и холодная питьевая вода\", \"Чай\", \"Столовые приборы\", \"Одноразовая посуда\", \"Микроволновка\"]','https://vk.com/market/product/quotden-rozhdenia-premiumquot-213324777-8053962',0);
/*!40000 ALTER TABLE `birthday_offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificates`
--

DROP TABLE IF EXISTS `certificates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` text NOT NULL,
  `image_paths` json NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificates`
--

LOCK TABLES `certificates` WRITE;
/*!40000 ALTER TABLE `certificates` DISABLE KEYS */;
INSERT INTO `certificates` VALUES (1,'**1.** Сертификат дает право на прохождение одного квеста на выбор : “Дитя апокалипсиса” (14+) , “Блогеры: загадки старого дома” (8+), \"Сон\" (9+) и \"Кома\" (14+).\n\n**2.** Участники до 13 лет проходят квест в сопровождении родителей или дополнительного аниматора (аниматор оплачивается отдельно)\n\n**3.** Если количество участников больше, чем указано в сертификате, доплата 800 рублей/участник\n\n**4.** Необходимо предварительно забронировать время игры в группе [vk.com/newera35](vk.com/newera35) или по телефону\n\n**5.** Сертификат действителен на одну игру\n\n**6.** Срок действия сертификата 6 месяцев\n\n**7.** Скидки, указанные в группе, не распространяются на игры по сертификату\n\n**8.** Адрес квеста \"Блогеры: загадки старого дома\" и \"Дитя Апокалипсиса\" : ул. Зосимовская, д. 7, 3 этаж, офис 301 Адрес квеста \"Сон\" и \"Кома\" : ул. Герцена, д. 105 б','[\"/img/cert/1750281539895-14nwxv2.jpg\", \"/img/cert/1750281530548-4zhi5nd.jpg\"]');
/*!40000 ALTER TABLE `certificates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `info_type` varchar(50) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `contacts_chk_1` CHECK ((`info_type` in (_utf8mb4'address',_utf8mb4'phone',_utf8mb4'working_hours')))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,'address','г. Вологда, ул. Герцена 105Б'),(2,'address','г. Вологда, ул. Зосимовская 7'),(4,'phone','+7 (909) 598-40-80'),(5,'working_hours','ПН - ВС 10:00 - 00:00');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq`
--

DROP TABLE IF EXISTS `faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faq` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faq`
--

LOCK TABLES `faq` WRITE;
/*!40000 ALTER TABLE `faq` DISABLE KEYS */;
INSERT INTO `faq` VALUES (7,'Сложность квестов','Мы сделаем с вами то, о чем попросите. ?\n\nТеперь вы сами выбираете режим общения с актёром в квестах \"Новой эры\".\n\n? ЛАЙТ (Квест \"Блогеры\" и \"Сон\"). Стандартная версия игры без\nфизического контакта. \nПодойдет для новичков и участников до 14 лет.\n\n? МЕДИУМ (Квест \"Дитя Апокалипсиса\" и \"Кома\"). Тактильные\nощущения присутствуют, но они минимальны и безболезненны.\nАктёр может дотронуться, резко схватить, утащить, слегка\nфизически напугать.\n\n? ХАРД (Квест \"Дитя Апокалипсиса\" и \"Кома\"). Грубый физический контакт, который приводит к болевым ощущениям.\nАктер удерживает игроков, использует болевые приёмы и устрашающие предметы. 18+ и не меньше. ☠\n                       \nОпределитесь заранее, к какому уровню взаимодействия с актёром вы готовы.\n\n?И помните: герои еще умеют говорить. А слова иногда страшнее действий.\n\nБронируйте здесь [https://vk.com/im?media=&sel=-213324777\n](https://vk.com/im?media=&sel=-213324777\n)\nЛибо по телефону [+7 (909) 598-40-80](tel:89095984080)'),(8,'Возраст игроков','Участники до 12 лет включительно проходят квест в сопровождении\n                        одного взрослого (старше 18 лет) или дополнительного\n                        сопровождающего.');
/*!40000 ALTER TABLE `faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_description`
--

DROP TABLE IF EXISTS `group_description`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_description` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_description`
--

LOCK TABLES `group_description` WRITE;
/*!40000 ALTER TABLE `group_description` DISABLE KEYS */;
INSERT INTO `group_description` VALUES (1,'Участники до 12 лет включительно проходят квест в сопровождении одного взрослого(старше 18 лет) или дополнительного сопровождающего.\n\n**Квест на выбор:** 1. «Кома» 14+ 2. «Сон» 9+\n\nВ данной программе участники делятся на 2 группы поровну, первая проходит квест, вторая в этот момент проходит в комнату отдыха и играет в мафию с нашим ведущим. После прохождения квеста группы меняются местами.\n\n**В КОМНАТУ ОТДЫХА входит:**\n\n\\- Удобное пространство для застолья на 15 сидячих мест\n\n\\- Сега\n\n\\- Игра мафия*\n\n\\- Горячая и холодная питьевая вода\n\n\\- Чай\n\n\\- Салфетки\n\n\\- Столовые приборы, одноразовая посуда\n\n\\- Микроволновка\n\n**Действует ежедневно.**\n\nЕсть возможность принести свои угощения, фрукты или заказать пиццу для празднования в комнате отдыха.\n\nЛюбая музыка на ваш выбор.\n\nСкидки, указанные в группе, не распространяются на пакет \"Для больших компаний\"');
/*!40000 ALTER TABLE `group_description` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_offers`
--

DROP TABLE IF EXISTS `group_offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_offers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `best` tinyint(1) DEFAULT '0',
  `attributes` json NOT NULL,
  `link` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_offers`
--

LOCK TABLES `group_offers` WRITE;
/*!40000 ALTER TABLE `group_offers` DISABLE KEYS */;
INSERT INTO `group_offers` VALUES (1,'Стандарт','900 руб./Чел',0,'[\"1 квест\", \"1 час в комнате отдыха\", \"15-30 участников\", \"Пространство для застолья на 15 сидячих мест\", \"Денди и Сега\", \"Горячая и холодная питьевая вода\", \"Чай\", \"Столовые приборы\", \"Одноразовая посуда\", \"Микроволновка\"]','https://vk.com/market/product/shkolny-klass-dlya-bolshoy-kompanii-213324777-9728291'),(2,'С Мафией','1000 руб./Чел',0,'[\"1 квест\", \"1 час в комнате отдыха\", \"проведение Мафии ведущим\", \"15-30 участников\", \"Пространство для застолья на 15 сидячих мест\", \"Денди и Сега\", \"Горячая и холодная питьевая вода\", \"Чай\", \"Столовые приборы\", \"Одноразовая посуда\", \"Микроволновка\"]','https://vk.com/market/product/shkolny-klass-dlya-bolshoy-kompanii-213324777-9728291');
/*!40000 ALTER TABLE `group_offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quests`
--

DROP TABLE IF EXISTS `quests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `link` varchar(512) DEFAULT NULL,
  `img` json DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `people` varchar(50) DEFAULT NULL,
  `age` varchar(50) DEFAULT NULL,
  `difficulty` varchar(50) DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `small_description` text,
  `category` varchar(50) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quests`
--

LOCK TABLES `quests` WRITE;
/*!40000 ALTER TABLE `quests` DISABLE KEYS */;
INSERT INTO `quests` VALUES (1,'koma','https://vk.com/market/product/khorror-kvest-quotkomaquot-213324777-9536720','[\"/img/quests/1749900912525-1n0hwhj.jpg\", \"/img/quests/1749900915529-0t3fk7s.jpg\", \"/img/quests/1749900920160-tjsfqs7.jpg\", \"/img/quests/1749900924331-2y79e2b.jpg\", \"/img/quests/1749900928364-grmgh12.jpg\"]','Кома','Вы попадаете в катастрофу, которая отворачивает вас от реальности и отправляет в новое пространство, где все ваши страхи будут вылезать один за другим.\n\nИгра смерти только начинается, ведь кто знает, кого вам придется там повстречать?\n\nРазнообразные ловушки только укрепят вашу жажду отыскать выход из этого кошмарного плена и обрести свободу. Не все, что вы увидите, будет являться истиной.\n\nНе все, что вы услышите, поможет вам. Не дайте себя обмануть, ведь вы попали в кому...','2-15','14+ 18+','MEDIUM | HARD','60-90 минут','Герцена, 105Б','Кол-во игроков 2-15 | Возраст 14+, 18+ | Режим \"Медиум\" - 5 персонажей | Режим \" Хард\" - 5 персонажей','horror','/video/quests/1749907540428-cdvqzzn.mp4'),(3,'son','https://vk.com/market/product/kvest-quotsonquot-213324777-9536702','[\"/img/quests/1749901339561-vwd1mtd.jpg\", \"/img/quests/1749901329475-oe9ipw5.jpg\", \"/img/quests/1749901333654-hjj1a2x.jpg\"]','Сон ','Ваша команда попадает в сон маленькой девочки Кэтти. Сейчас она находится в состоянии комы, а ее сознание спрятано в самом темном уголке разума. Медицина здесь бессильна.\n\nВернуть Кэтти к жизни можно, только преодолев все страхи и найдя ее саму.\n\nБудьте осторожны, у вас есть всего 60 минут, чтобы спасти девочку и выбраться самим. В противном случае вы забудете, что такое действительность, и навсегда останетесь блуждающими во сне...','2-15','9+','LITE','60-90 минут','Герцена, 105Б','Кол-во игроков 2-15 | Возраст 9+ | Режим \"Лайт\" - с участием 3-ёх персонажей','adventures',NULL),(4,'ditya-apokalipsisa','https://vk.com/market/product/khorror-kvest-quotditya-apokalipsisaquot-213324777-9542661','[\"/img/quests/1749901378901-43ku0ta.jpg\", \"/img/quests/1749901383391-dl7k7st.jpg\", \"/img/quests/1749901386604-dbawfrn.jpg\", \"/img/quests/1749901394856-yo06784.jpg\"]','Дитя апокалипсиса','Вы – компания, у которой авантюризм в крови. Даже в детстве вас предупреждали не совать нос куда попало, и вот в газете вы наткнулись на дом, где зверски были убиты люди. Вместо того чтобы искать убийцу, люди обвинили во всем маленькую девочку и сняли с нее кожу заживо!\n\nДумаете, вы поверите, что маленькая девочка могла убить всех? Думаете, вас это остановит и вы туда не сунетесь? \n\nВашей задачей будет решить загадку семьи Падсен, а также выбраться живыми из дома...','2-12','14+ 18+','MEDIUM | HARD','60-90 минут','Зосимовская, 7','Кол-во игроков 2-12 | Возраст 14+, 18+ | Режим \"Медиум\" - 1 персонаж | Режим \"Хард\" - 1 персонаж','horror','/video/quests/1750284011033-r62oudv.mp4'),(5,'blogery-zagadki-starogo-doma','https://vk.com/market/product/kvest-quotblogery-zagadki-starogo-domaquot-213324777-9542688','[\"/img/quests/1749901433314-ijoce8l.jpg\", \"/img/quests/1749901438818-ma5fb5w.jpg\", \"/img/quests/1749901444956-uijbpsu.jpg\", \"/img/quests/1749901461359-qd3tzay.jpg\", \"/img/quests/1749901451171-crzr094.jpg\"]','Блогеры: Загадки старого дома','Вы – самые бесстрашные блогеры нашей страны, но пока кроме ваших друзей никто на вас не подписан. Ваша задача – найти, заснять крутой сюжет и стать популярным. А где его найти, если не в доме с призраком?\n\nПо слухам, в одном из таких домов живет девочка-призрак. Теперь все зависит от вас. Сможете ли вы ее спасти и исполнить свою мечту?\n\nВы готовы сделать вызов самим себе?','2-12','8+','LITE','60-90 минут','Зосимовская, 7','Кол-во игроков 2-12 | Возраст 8+ | Режим \"Лайт\" - с участием 1-ого персонажа','adventures',NULL);
/*!40000 ALTER TABLE `quests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (2,'Мы ходили с командой на квест «Кома»?? Квест очень крутой! Много возможностей для фантазии и воображения? Было и страшно, и весело:)Обязательно посетим остальные квесты кампании «Новая Эра»! Ребята, вы крутые ?  '),(3,'Проводили там День рождения дочек. Все очень понравилось. Особенно хочется отметить игру актеров. Они настолько вживаются в роль, но в то же время не переигрывают. Дети в восторге! Эмоции зашкаливают, остались только положительные впечатления. Обязательно посетим и другие квесты этой организации'),(4,'Мы были на квесте \"Кома\". Детям (12-13 лет) очень понравилось. Все были на положительных эмоциях, было страшно и одновременно очень весело. Обязательно сходим ещё на другую тематику. Спасибо огромное ведущим за положительные эмоции!'),(6,'Очень круто приходить в Новую Эру. Ходила уже третий раз и каждый раз очень круто и интересно. Актеры очень хорошо вливаются в квест и выполняют свою работу прекрасно, каждый раз с друзьями очень пугаемся ? Очень круто что есть много заданий и над каждым нужно подумать Все советую, все квесты по своему интересны '),(62,'Очень крутое место все понравилось актриса играла очень хорошо правила игры объяснили хорошо все было шикарно особенно на квесте блогеры загадки дом призраков всем советую сходить на какой-то либо квест');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `social_links`
--

DROP TABLE IF EXISTS `social_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `social_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `network_type` varchar(50) NOT NULL,
  `url` text NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `social_links_chk_1` CHECK ((`network_type` in (_utf8mb4'vk',_utf8mb4'youtube',_utf8mb4'tiktok',_utf8mb4'instagram',_utf8mb4'telegram')))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social_links`
--

LOCK TABLES `social_links` WRITE;
/*!40000 ALTER TABLE `social_links` DISABLE KEYS */;
INSERT INTO `social_links` VALUES (1,'vk','https://vk.com/newera35'),(2,'tiktok','https://www.tiktok.com/@neweravologda?_t=8qkcbz4Nk0d&_r=1'),(3,'instagram','https://www.instagram.com/new_era_vologda/');
/*!40000 ALTER TABLE `social_links` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-19 12:05:55
