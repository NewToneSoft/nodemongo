/*
 módulo de Banco de Dados - servidor v1.0
 2016 Nilton Cruz
 */

'use strict';

var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

    // COLEÇÕES
    var colecao = [];
    colecao.clientes = db.collection('clientes');
    colecao.usuarios = db.collection('usuarios');
    colecao.estados = db.collection('estados');
    colecao.custos = db.collection('custos');
    colecao.cargos = db.collection('cargos');
    colecao.status = db.collection('status');
    colecao.atividade = db.collection('atividade');
    colecao.funcionario = db.collection('funcionario');
    colecao.equipe = db.collection('equipe');
    colecao.turno = db.collection('turno');
    colecao.produto = db.collection('produto');
    colecao.forn = db.collection('fornecedor');
    colecao.tipomaq = db.collection('tipomaq');
    colecao.mdcontrato = db.collection('mdcontrato');
    colecao.contrato = db.collection('contrato');
    colecao.producao = db.collection('producao');
    colecao.labor = db.collection('labor');
    colecao.control = db.collection('control');
    colecao.saidas = db.collection('saidas');
    colecao.chegadas = db.collection('chegadas');
    colecao.ajustes = db.collection('ajustes');
    colecao.pessoal = db.collection('pessoal');
    colecao.alimenta = db.collection('alimenta');
    colecao.medicoes = db.collection('medicoes');


    // LISTAR ITENS
    app.get('/api/:db', function (req, res) {

        var cat = colecao[req.params.db];

        var tst = (req.params.db != 'clientes' && req.params.db != 'usuarios' && req.params.db != 'estados') ? {'cliente': req.user.empresa} : {};

        cat.find(tst, function(err, result) {
            if (err) { res.send(err); }
            if (result) { res.send(result); }
        });

    });


    // SALVAR / ATUALIZAR ITENS
    app.post('/api/:db', function(req, res){

        var cat = colecao[req.params.db];

        var final = JSON.parse(JSON.stringify(req.body));
        delete final.db;

        if(req.params.db != 'clientes' && req.params.db != 'usuarios' && req.user.empresa){
            final.cliente = req.user.empresa;
        }

        if(!req.body._id){

            cat.insert( final, function(err, result){

                if(err){res.send(err);}
                if(result){
                    res.end();
                }
            });

        }else{

            delete final._id;

            cat.update({_id: new ObjectID(req.body._id) }, final, function(err, result){

                if(err){res.send(err);}
                if(result){
                    res.end();
                }
            });

        }

    });


    // APAGAR ITEM
    app.delete('/api/:db/:id', function(req, res){

        var cat = colecao[req.params.db];

        cat.remove({_id: new ObjectID(req.params.id) }, function(err, result){
            if(err){res.send(err);}

            if(result){
                res.end();
            }
        });

    });

};