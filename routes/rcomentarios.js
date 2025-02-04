module.exports = function(app, swig, gestorBD) {

    app.post("/comentarios/:cancion_id", function (req, res) {
        let comentario = {
            autor : req.session.usuario,
            texto : req.body.texto,
            cancion_id : gestorBD.mongo.ObjectID(req.params.cancion_id)
        }

        gestorBD.insertarComentario(comentario, function(id) {
            if (id == null) {
                res.send(swig.renderFile('views/error.html',
                    {
                        error : "Error al insertar comentario"
                    }));
            } else {
                res.send("Agregado comentario con id " + id);
            }
        });
    });

}