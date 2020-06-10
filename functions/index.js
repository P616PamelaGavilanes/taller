const functions = require('firebase-functions');
const admin = require("firebase-admin");
const express= require('express');
const app=express();



var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://taller-3c080.firebaseio.com"
});

const database =admin.database();

//========VARIABLES GLOBALES=========//
const dbCelular="celulares";

//========METODOS INTERNOS ========///
function createCelular(celular){
  database.ref(dbCelular).push(celular);
}

function retrieveCelular(id){
  return database.ref(dbCelular).child(id).once('value');
}

function updateCelular(id, celular){
  database.ref(dbCelular).child(id).set(celular);
}

function deleteCelular(id){
  database.ref(dbCelular).child(id).remove();
}

function listCelulares(){
  return database.ref(dbCelular).once('value');
}

//========FUNCIONES URL============///
//crear celular
app.post('/api/celulares', function (req, res) {
  let varMarca = req.body['marca'];
  let varModelo = req.body['modelo'];
  let varAlmacenamiento = req.body['almacenamiento'];
  let varMemoria = req.body['memoria'];
  var celular = {
    marca :varMarca,
    modelo: varModelo,
    almacenamiento:varAlmacenamiento,
    memoria:varMemoria
};
  createCelular(celular);
  return res.status(201).json({ message: "Registro de celular creado con exito   :)" });
});
//consultar datos del celular 
app.get('/api/celulares/:id', function(req, res){
    let varId = req.params.id;
    retrieveCelular(varId).then(result => {
        return res.status(200).json(result); 
      }
    ).catch(err => console.log(err));
  });
//Actualizar datos
app.put('/api/celulares/:id', function (req, res) {
  let varId=req.params.id;
  let varMarca = req.body['marca'];
  let varModelo = req.body['modelo'];
  let varAlmacenamiento = req.body['almacenamiento'];
  let varMemoria = req.body['memoria'];
  var celular = {
    marca :varMarca,
    modelo: varModelo,
    almacenamiento:varAlmacenamiento,
    memoria:varMemoria
    };
    updateCelular(varId, celular);
    return res.status(200).json({ message: "Registro Actualizado   :)" });
  });
  //eliminar registro
  app.delete('/api/celulares/:id',function(req, res){
    let varId = req.params.id;
    deleteCelular(varId);
    return res.status(200).json({ message: "Registro Borrado.   -_-" });
  });
  //listar todos los registros de celular
  app.get('/api/celulares', function(req, res){
    listCelulares().then(result => {
        return res.status(200).json(result); 
      }
    ).catch(err => console.log(err));
  });
// Funcion HOLA
app.get('/api/',function(req,res){///Hola Mundo 
  res.send("hola")
})
exports.app=functions.https.onRequest(app);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
 //exports.helloWorld = functions.https.onRequest((request, response) => {
  //response.send("Hello from Firebase!");
 //});
