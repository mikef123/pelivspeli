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

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';
var ip = '0.0.0.0'

app.listen(puerto, ip,function () {
  console.log( "Escuchando en el puerto " + puerto );
});

