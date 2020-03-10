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

module.exports = {
  competencia: competencia
};