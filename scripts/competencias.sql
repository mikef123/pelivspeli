USE competencias;

DROP TABLE IF EXISTS `competencia`;

CREATE TABLE `competencia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `genero_id` int(11) unsigned DEFAULT NULL,
  `director_id` int(11) unsigned DEFAULT NULL,
  `actor_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `competencia_genero` (`genero_id`),
  CONSTRAINT `competencia_genero` FOREIGN KEY (`genero_id`) REFERENCES `genero` (`id`),
  KEY `competencia_director` (`director_id`),
  CONSTRAINT `competencia_director` FOREIGN KEY (`director_id`) REFERENCES `director` (`id`),
  KEY `competencia_actor` (`actor_id`),
  CONSTRAINT `competencia_actor` FOREIGN KEY (`actor_id`) REFERENCES `actor` (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=latin1;
