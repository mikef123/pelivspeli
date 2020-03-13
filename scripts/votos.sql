USE competencias;

DROP TABLE IF EXISTS `voto`;

CREATE TABLE `voto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `competencia_id` int(11) DEFAULT NULL,
  `pelicula_id` int(11) unsigned DEFAULT NULL,
  `votos` int(11) DEFAULT NULL,
  FOREIGN KEY (competencia_id) REFERENCES competencia(id),
  FOREIGN KEY (pelicula_id) REFERENCES pelicula(id),
  PRIMARY KEY (`id`)
);
