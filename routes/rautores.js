module.exports = function(app, swig) {
    app.get('/autores/agregar', function(req, res) {
        let roles = [ {
            "value" : "cantante",
            "text" : "Cantante"
        }, {
            "value" : "bateria",
            "text" : "Batería"
        }, {
            "value" : "guitarrista",
            "text" : "Guitarrista"
        }, {
            "value" : "bajista",
            "text" : "Bajista"
        }, {
            "value" : "teclista",
            "text" : "Teclista"
        }];

        let respuesta = swig.renderFile('views/autores-agregar.html', {
            roles : roles
        });
        res.send(respuesta);
    });

    app.post("/autores/agregar", function(req, res) {
        let respuesta = "Autor agregado<br>";

        respuesta += typeof(req.body.nombre) == "undefined" || req.body.nombre == null ? "Nombre no definido" : "Nombre: " + req.body.nombre;
        respuesta += "<br>";
        respuesta += typeof(req.body.grupo) == "undefined" || req.body.grupo == null  ? "Grupo no definido" : "Grupo: " + req.body.grupo;
        respuesta += "<br>";
        respuesta += typeof(req.body.rol) == "undefined" || req.body.rol == null ? "Rol no definido" : "Rol: " + req.body.rol;

        res.send(respuesta);
    });

    app.get("/autores", function(req, res) {
        let autores = [ {
            "nombre" : "Autor1",
            "grupo" : "Grupo1",
            "rol" : "Cantante"
        }, {
            "nombre" : "Autor2",
            "grupo" : "Grupo2",
            "rol" : "Batería"
        }, {
            "nombre" : "Autor3",
            "grupo" : "Grupo3",
            "rol" : "Bajista"
        } ];

        let respuesta = swig.renderFile('views/autores.html', {
            autores : autores
        });

        res.send(respuesta);
    });

    app.get("/autores/*", function(req, res) {
        res.redirect("/autores");
    });
};