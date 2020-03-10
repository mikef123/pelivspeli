USE competencias;

DROP TABLE IF EXISTS `competencia`;

CREATE TABLE `competencia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
);
