var con = require('../lib/conexionbd');

function competencia(req, res) {
    var sql = "select * from competencia"
    con.query(sql, function (error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta de las competencias");
        }
        var response = resultado

        res.send(JSON.stringify(response));
    });
}

function pelisAVotar(req, res) {
    const params = req.params;
    var sql = "select * from competencia where id=" + parseInt(params.id);
    con.query(sql, function (error, competencia, fields) {
        if (error || competencia.length < 1) {
            console.log("Hubo un error en la consulta", error ? error.message : "No existe competencia");
            return res.status(404).send("Hubo un error en la consulta de las competencias");
        }
        else {
            if (competencia[0].genero_id) {
                var sql = `select pelicula.id as id, pelicula.poster, pelicula.titulo from pelicula where genero_id=${competencia[0].genero_id} 
                    order by rand() limit 2;`
                if (competencia[0].director_id) {
                    var sql = `select pelicula.id as id, pelicula.poster, pelicula.titulo from pelicula inner join director_pelicula on 
                        pelicula.id=director_pelicula.pelicula_id where pelicula.genero_id = ${competencia[0].genero_id} and 
                        director_pelicula.director_id = ${competencia[0].director_id} limit 2;`
                    if (competencia[0].actor_id) {
                        var sql = `select pelicula.id as id, pelicula.poster, pelicula.titulo from pelicula inner join director_pelicula on
                        pelicula.id=director_pelicula.pelicula_id inner join actor_pelicula on 
                        pelicula.id=actor_pelicula.pelicula_id where pelicula.genero_id = ${competencia[0].genero_id} and 
                        director_pelicula.director_id = ${competencia[0].director_id} and actor_pelicula.actor_id=${competencia[0].actor_id} limit 2;`
                    }
                }
                if (competencia[0].actor_id) {
                    var sql = `select pelicula.id as id, pelicula.poster, pelicula.titulo from pelicula inner join actor_pelicula on 
                    pelicula.id=actor_pelicula.pelicula_id where pelicula.genero_id = ${competencia[0].genero_id} and 
                    actor_pelicula.actor_id=${competencia[0].actor_id} limit 2;`
                }
            }
            else if (competencia[0].director_id) {
                var sql = `select pelicula.id as id, pelicula.poster, pelicula.titulo from pelicula inner join director_pelicula on 
                    pelicula.id=director_pelicula.pelicula_id where
                    director_pelicula.director_id = ${competencia[0].director_id} limit 2;`
                if (competencia[0].actor_id) {
                    var sql = `select pelicula.id as id, pelicula.poster, pelicula.titulo from pelicula inner join director_pelicula on 
                        pelicula.id=director_pelicula.pelicula_id inner join actor_pelicula on 
                        pelicula.id=actor_pelicula.pelicula_id where
                        director_pelicula.director_id = ${competencia[0].director_id} and 
                        actor_pelicula.actor_id=${competencia[0].actor_id} limit 2;`
                }
            }
            else if (competencia[0].actor_id) {
                var sql = `select pelicula.id as id, pelicula.poster, pelicula.titulo from pelicula inner join actor_pelicula on 
                pelicula.id=actor_pelicula.pelicula_id where
                    actor_pelicula.actor_id=${competencia[0].actor_id} limit 2;`
            }
            else {
                var sql = "select pelicula.id as id, pelicula.poster, pelicula.titulo from pelicula order by rand() limit 2;"
            }
            con.query(sql, function (error, resultado, fields) {
                if (error || resultado.length <= 1) {
                    console.log(error ? error.message : "No se encontraron peliculas");
                    return res.status(error ? 404 : 422).send(error ? "Hubo un error en la consulta de las competencias" : "No se encontraron peliculas");
                }
                var response = {
                    'competencia': competencia[0].nombre,
                    'peliculas': resultado
                };

                res.send(JSON.stringify(response));
            });
        }
    });
}

function voto(req, res) {
    var pelicula = req.body.idPelicula;
    var idCompetencia = req.params.idCompetencia;
    var votos = 0;
    var sql = `select votos as votos from voto where competencia_id=${idCompetencia} and pelicula_id= ${pelicula}`
    con.query(sql, function (error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta de votos", error.message);
            return res.status(404).send("Hubo un error en la consulta de las competencias");
        }
        if (resultado.length < 1) {
            con.query('INSERT INTO voto (competencia_id, pelicula_id, votos) values (?,?,?)', [idCompetencia, pelicula, votos + 1], function (error, resultado, fields) {
                if (error) {
                    console.log("Hubo un error en la inserción de datos", error.message);
                    return res.status(404).send("Hubo un error en la consulta de las competencias");
                }
                var response = resultado

                res.send(JSON.stringify(response));
            });
        }
        else {
            votos = resultado[0].votos;
            votos += 1;
            con.query('UPDATE voto SET votos=? where competencia_id=? and pelicula_id=?', [votos, idCompetencia, pelicula], function (error, resultado, fields) {
                if (error) {
                    console.log("Hubo un error en la actualización de datos", error.message);
                    return res.status(404).send("Hubo un error en la consulta de las competencias");
                }
                var response = resultado

                res.send(JSON.stringify(response));
            });
        }
    });
}

function resultadosCompetencia(req, res) {
    var competencia = req.params.id;
    var sql = `select pelicula.titulo, pelicula.poster, voto.pelicula_id, voto.votos, competencia.nombre  from pelicula inner join voto on pelicula.id=voto.pelicula_id inner join competencia on voto.competencia_id=competencia.id where voto.competencia_id=${competencia}  order by voto.votos desc limit 3`
    con.query(sql, function (error, resultado, fields) {
        if (error || resultado.length < 1) {
            console.log(error ? error.message : "no hay datos disponibles");
            return res.status(404).send("Hubo un error en la consulta de las competencias");
        }
        var response = {
            'competencia': resultado[0].nombre,
            'resultados': resultado
        };
        res.send(JSON.stringify(response));
    });
}

function nuevaCompetencia(req, res) {
    var nombrecompetencia = req.body.nombre;
    var genero = parseInt(req.body.genero);
    var director = parseInt(req.body.director);
    var actor = parseInt(req.body.actor);
    var sql = `select pelicula.id as id, pelicula.poster, pelicula.titulo from pelicula inner join director_pelicula on
    pelicula.id=director_pelicula.pelicula_id inner join actor_pelicula on 
    pelicula.id=actor_pelicula.pelicula_id where pelicula.genero_id = ${genero} and 
    director_pelicula.director_id = ${director} and actor_pelicula.actor_id=${actor} limit 2;`

    con.query(sql, function (error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta de las peliculas para esa competencia");
        }
        if (error || resultado.length < 2) {
            console.log("no hay peliculas disponibles");
            return res.status(422).send("No hay peliculas disponibles para la nueva competencia con los atributos seleccionados");
        }
        else {
            var sql = `select * from competencia where nombre = '${nombrecompetencia}'`
            sql += genero != 0 ? ` and genero_id = ${genero}` : ''
            sql += director != 0 ? ` and director_id = ${director}` : ''
            sql += actor != 0 ? ` and actor_id = ${actor}` : ''
            con.query(sql, function (error, resultado, fields) {
                if (error) {
                    console.log("Hubo un error en la consulta de las competencias");
                    return res.status(404).send("Hubo un error en la consulta de las competencias");
                }
                if (resultado.length > 0) {
                    console.log("La competencia ya existe");
                    return res.status(422).send("La competencia ya existe");
                }
                else {
                    genero = genero != 0 ? genero : null;
                    director = director != 0 ? director : null;
                    actor = actor != 0 ? actor : null;
                    con.query('INSERT INTO competencia (nombre, genero_id,director_id,actor_id) values (?,?,?,?)', [nombrecompetencia, genero, director, actor], function (error, resultado, fields) {
                        if (error) {
                            console.log("Hubo un error en la inserción de la nueva consulta", error.message);
                            return res.status(404).send("Hubo un error en la consulta de las competencias");
                        }
                        var response = resultado
                        res.send(JSON.stringify(response));
                    });
                }
            });
        }
    });
}

function reiniciarVotos(req, res) {
    var competencia = req.params.idCompetencia
    con.query('DELETE from voto where competencia_id=?', [competencia], function (error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en el reinicion de la competencia", error.message);
            return res.status(422).send("Hubo un error en el reinicio de la competencia");
        }
        var response = resultado

        res.send(JSON.stringify(response));
    });
}

function obtenerCompetencia(req, res) {
    const params = req.params;

    var sql = "select * from competencia where id=" + parseInt(params.id);
    con.query(sql, function (error, competencia, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error ? error.message : "No existe competencia");
            return res.status(404).send("Hubo un error en la consulta de las competencias");
        }
        if (competencia[0].genero_id) {
            var sql = `select genero.nombre as genero from competencia inner join genero on competencia.genero_id =genero.id where genero.id=${competencia[0].genero_id} 
                and competencia.id= ${competencia[0].id};`
            if (competencia[0].director_id) {
                var sql = `select genero.nombre as genero, director.nombre as director from competencia inner join genero on competencia.genero_id =genero.id inner join director on
                competencia.director_id =director.id where genero.id=${competencia[0].genero_id} and director.id=${competencia[0].director_id} 
                and competencia.id= ${competencia[0].id};`
                if (competencia[0].actor_id) {
                    var sql = `select genero.nombre as genero, director.nombre as director, actor.nombre as actor from competencia inner join genero on competencia.genero_id =genero.id inner join director on
                    competencia.director_id =director.id inner join actor on competencia.actor_id =actor.id 
                    where genero.id=${competencia[0].genero_id} and director.id=${competencia[0].director_id} 
                    and actor.id=${competencia[0].actor_id} and competencia.id= ${competencia[0].id};`
                }
            }
            else if (competencia[0].actor_id) {
                var sql = `select genero.nombre as genero, actor.nombre as actor from competencia inner join genero on competencia.genero_id =genero.id inner join actor on
                    competencia.actor_id = actor.id where genero.id=${competencia[0].genero_id} and 
                    actor.id = ${ competencia[0].actor_id} and competencia.id= ${competencia[0].id};`
            }
        }
        else if (competencia[0].director_id) {
            var sql = `select  director.nombre as director from competencia inner join director on
            competencia.director_id = director.id where director.id = ${ competencia[0].director_id} and
            competencia.id= ${competencia[0].id};`
            if (competencia[0].actor_id) {
                var sql = `select  director.nombre as director,  actor.nombre as actor from competencia inner join director on
                    competencia.director_id =director.id inner join actor on competencia.actor_id =actor.id 
                    where director.id=${competencia[0].director_id} 
                    and actor.id=${competencia[0].actor_id} and competencia.id= ${competencia[0].id};`
            }
        }
        else if (competencia[0].actor_id) {
            var sql = `select  actor.nombre as actor from competencia inner join actor on
            competencia.actor_id = actor.id where actor.id = ${ competencia[0].actor_id} and
            competencia.id= ${competencia[0].id};`
        }
        else {
            var sql = "select * from competencia where id=" + parseInt(params.id);
        }
        con.query(sql, function (error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error ? error.message : "No existe competencia");
                return res.status(404).send("Hubo un error en la consulta de las competencias");
            }
            var response = {
                nombre: competencia[0].nombre,
                genero_nombre: resultado[0].genero ? resultado[0].genero : '',
                director_nombre: resultado[0].director ? resultado[0].director : '',
                actor_nombre: resultado[0].actor ? resultado[0].actor : ''
            }

            res.send(JSON.stringify(response));
        });
    });
}

function obtenerGeneros(req, res) {
    const params = req.params;
    var sql = "select * from genero";
    con.query(sql, function (error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error ? error.message : "No existe competencia");
            return res.status(404).send("Hubo un error en la consulta de las competencias");
        }
        var response = resultado

        res.send(JSON.stringify(response));
    });
}

function obtenerDirectores(req, res) {
    const params = req.params;
    var sql = "select * from director";
    con.query(sql, function (error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error ? error.message : "No existe competencia");
            return res.status(404).send("Hubo un error en la consulta de las competencias");
        }
        var response = resultado

        res.send(JSON.stringify(response));
    });
}

function obtenerActores(req, res) {
    const params = req.params;
    var sql = "select * from actor";
    con.query(sql, function (error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error ? error.message : "No existe competencia");
            return res.status(404).send("Hubo un error en la consulta de las competencias");
        }
        var response = resultado

        res.send(JSON.stringify(response));
    });
}

function eliminarCompetencia(req, res) {
    var competencia = req.params.idCompetencia
    con.query('DELETE from voto where competencia_id=?', [competencia], function (error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la eliminacion de la competencia en la tabla de voto", error.message);
            return res.status(422).send("Hubo un error en la eliminacion de la competencia en la tabla de voto");
        }
        con.query('DELETE from competencia where id=?', [competencia], function (error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la eliminacion de la competencia en la tabla de competencia", error.message);
                return res.status(422).send("Hubo un error en la eliminacion de la competencia en la tabla de competencia");
            }
            var response = resultado

            res.send(JSON.stringify(response));
        });
    });
}

function actualizarCompetencia(req, res) {
    var competencia = req.params.idCompetencia
    var nombre = req.body.nombre
    con.query('UPDATE competencia SET nombre=? where id=?', [nombre, competencia], function (error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la actualización de datos", error.message);
            return res.status(404).send("Hubo un error en la consulta de las competencias");
        }
        var response = resultado

        res.send(JSON.stringify(response));
    });
}

module.exports = {
    competencia: competencia,
    pelisAVotar: pelisAVotar,
    voto: voto,
    resultadosCompetencia: resultadosCompetencia,
    nuevaCompetencia: nuevaCompetencia,
    reiniciarVotos: reiniciarVotos,
    obtenerCompetencia: obtenerCompetencia,
    obtenerGeneros: obtenerGeneros,
    obtenerDirectores: obtenerDirectores,
    obtenerActores: obtenerActores,
    eliminarCompetencia: eliminarCompetencia,
    actualizarCompetencia: actualizarCompetencia
};