// Módulos
let express = require('express');
let app = express();

// Variables
app.set('port', 8081);

app.get('/usuarios', function(req, res) {
    console.log("Depurar aquí");
    res.send('ver usuarios');
});

app.get('/canciones', function(req, res) {
    res.send('ver canciones');
});

// lanzar el servidor
app.listen(8081, function() {
    console.log("Servidor activo");
})