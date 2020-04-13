module.exports = function(app, gestorBD) {
    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.get("/api/cancion/:id", function(req, res) {
        var criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones[0]) );
            }
        });
    });

    app.delete("/api/cancion/:id", function(req, res) {
        // Comprobar usuario
        var token = req.headers['token'] || req.body.token || req.query.token;
        let user;
        if (token != null) {
            // verificar el token
            app.get('jwt').verify(token, 'secreto', function(err, infoToken) {
                user = infoToken.usuario;
            });
        }
        let valido;
        gestorBD.obtenerCanciones({ "_id" : gestorBD.mongo.ObjectID(req.params.id), "autor": user }, function(canciones) {
            valido = check(canciones.length > 0, "Usted no puede eliminar esta canción", res);
        })
        if(!valido)
            return;

        var criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.eliminarCancion(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.post("/api/cancion", function(req, res) {
        var cancion = {
            nombre : req.body.nombre,
            genero : req.body.genero,
            precio : req.body.precio,
        }
        // ¿Validar nombre, genero, precio?

        if(!check(cancion.nombre != null && cancion.nombre.length > 0, "Debe especificarse un nombre", res))
            return;
        if(!check(req.body.nombre.length >= 5, "El nombre debe tener una longitud mayor de 5.", res))
            return;

        if(!check(req.body.genero != null && cancion.genero.length > 0, "Debe especificarse un género", res))
            return;

        if(!check(req.body.precio != null, "Debe especificarse un precio", res))
            return;
        if(!check(req.body.precio > 0, "El precio debe ser positivo.", res))
            return;

        gestorBD.insertarCancion(cancion, function(id){
            if (id == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(201);
                res.json({
                    mensaje : "canción insertada",
                    _id : id
                })
            }
        });

    });

    app.put("/api/cancion/:id", function(req, res) {

        // Comprobar usuario
        var token = req.headers['token'] || req.body.token || req.query.token;
        let user;
        if (token != null) {
            // verificar el token
            app.get('jwt').verify(token, 'secreto', function(err, infoToken) {
                user = infoToken.usuario;
            });
        }
        let valido;
        gestorBD.obtenerCanciones({ "_id" : gestorBD.mongo.ObjectID(req.params.id), "autor": user }, function(canciones) {
            valido = check(canciones.length > 0, "Usted no puede modificar esta canción", res);
        })
        if(!valido)
            return;

        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)};

        let cancion = {}; // Solo los atributos a modificar
        // Validaciones
        if ( req.body.nombre != null && cancion.nombre.length > 0) {
            cancion.nombre = req.body.nombre;
            if(!check(req.body.nombre.length >= 5, "El nombre debe tener una longitud mayor de 5.", res))
                return;
        }
        if ( req.body.genero != null && cancion.genero.length > 0)
            cancion.genero = req.body.genero;

        if ( req.body.precio != null) {
            cancion.precio = req.body.precio;
            if(!check(req.body.precio > 0, "El precio debe ser positivo.", res))
                return;
        }

        gestorBD.modificarCancion(criterio, cancion, function(result) {
            if (result == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.json({
                    mensaje : "canción modificada",
                    _id : req.params.id
                })
            }
        });
    });

    app.post("/api/autenticar/", function(req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        let criterio = {
            email: req.body.email,
            password: seguro
        }

        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if(usuarios == null || usuarios.length == 0) {
                req.status(401);
                res.json({
                    autenticado: false
                });
            } else {
                var token = app.get('jwt').sign(
                    {usuario: criterio.email , tiempo: Date.now()/1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado : true,
                    token : token
                });
            }
        });
    });

    function check(validation, errorMessage, res) {
        if (!validation) {
            res.status(500);
            res.json({
                error: errorMessage
            });
            return false;
        }
        return true;
    }
}