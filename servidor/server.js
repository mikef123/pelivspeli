//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var peliculaControlador = require('./controladores/competenciasController');
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.get('/competencias',peliculaControlador.competencia);
app.get('/competencias/:id/peliculas',peliculaControlador.pelisAVotar);
app.post('/competencias/:idCompetencia/voto',peliculaControlador.voto);
app.delete('/competencias/:idCompetencia/votos',peliculaControlador.reiniciarVotos);
app.get('/competencias/:id/resultados',peliculaControlador.resultadosCompetencia);
app.post('/competencias',peliculaControlador.nuevaCompetencia);
app.get('/competencias/:id',peliculaControlador.obtenerCompetencia);
app.get('/generos',peliculaControlador.obtenerGeneros);
app.get('/directores',peliculaControlador.obtenerDirectores);
app.get('/actores',peliculaControlador.obtenerActores);
app.delete('/competencias/:idCompetencia',peliculaControlador.eliminarCompetencia);
app.put('/competencias/:idCompetencia',peliculaControlador.actualizarCompetencia);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';
var ip = '0.0.0.0'

app.listen(puerto, ip,function () {
  console.log( "Escuchando en el puerto " + puerto );
});

