/*
 controller de Logística v1.0
 2016 Nilton Cruz
 */

"use strict";

app

    // CONTROLLER DE SAÍDAS - LOGÍSTICA
    .controller("saidaCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "saidas";
        $scope.tmpAtivos = [];
        $scope.itens = angular.copy(atual);
        $scope.desc = [];


        //DatePicker
        $scope.picker = {abreDt: false};

        $scope.abrePicker = function(){
            $scope.picker.abreDt = true;
        };


        // Pega Ativos com base nas datas de contrato
        $scope.pegaAtivos = function(item){

            $scope.tmpAtivos = [];

            var dtAtual = $scope.zeraHora(item.data);

            for(var i = 0; i < $scope.todos.ativos.length; i++){

                var idx = $scope.todos.ativos[i].contrato;

                var t = $scope.todos.contrato.map(function(e){ return e._id; }).indexOf(idx);

                if(t != -1){

                    var m = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf($scope.todos.contrato[t].tipo);

                    if(m != -1 && $scope.itemTipo.tipo[m].id === 'cac'){

                        var dtCtIni = $scope.zeraHora($scope.todos.contrato[t].dataini),
                            dtCtFim = $scope.zeraHora($scope.todos.contrato[t].datafim);

                        if(dtAtual >= dtCtIni && dtAtual <= dtCtFim){

                            if($scope.todos.ativos[i].formaMedicao){

                                if($scope.todos.ativos[i].formaMedicao.forma === 'T'){
                                    $scope.tmpAtivos.push($scope.todos.ativos[i]);
                                }

                            }

                        }

                    }

                }

            }

        };


        // Pega Campos de Lançamento
        $scope.info = function(item){

            var t = $scope.tmpAtivos.map(function(e){ return e.id; }).indexOf(item.ativo);

            if(t != -1){

                $scope.desc.descricao = $scope.tmpAtivos[t].descricao + " - " + $scope.tmpAtivos[t].placa;
                item.categ = $scope.tmpAtivos[t].tipo;

                var p = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf(item.categ);

                if(p != -1){
                    $scope.desc.ctg = $scope.itemTipo.tipo[p].nome;
                }

                var c = $scope.todos.contrato.map(function(e){ return e._id;}).indexOf($scope.tmpAtivos[t].contrato);

                if (c != -1){

                    var m = $scope.todos.mdcontrato.map(function(e){ return e._id;}).indexOf($scope.todos.contrato[c].modelo);

                    if( m != -1){

                        var f = $scope.itemTipo.forma.map(function(e){ return e.id;}).indexOf($scope.todos.mdcontrato[m].forma);

                        if(f != -1){
                            item.inputs = $scope.itemTipo.forma[f].link;
                            item.forma = $scope.itemTipo.forma[f].id;
                        }
                    }
                }

            }

        };


        // Inicializa
        function inicializa(item){
            $scope.campo = angular.copy(item);
            $scope.campo.data = new Date($scope.campo.data);
            $scope.campo.hora = new Date($scope.campo.hora);
            $scope.pegaAtivos($scope.campo);
            $scope.info($scope.campo);
        }

        if($scope.itens.length > 0){
            inicializa($scope.itens[0]);
        } else {
            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.data = new Date();
            $scope.campo.hora = new Date();
            $scope.pegaAtivos($scope.campo);
        }


        // Campos que podem ser Fixados
        $scope.fixados = [];
        $scope.fixados.data = false;
        $scope.fixados.produto = false;

        // Fixa / Desafixa Campos
        $scope.fixar = function(cmp){

            $scope.fixados[cmp] = !$scope.fixados[cmp];

        };


        // Limpa campos
        $scope.zera = function () {

            var tmp = angular.copy($scope.campo);

            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.data = new Date();
            $scope.campo.hora = new Date();

            // Retorna itens fixados
            var lst = Object.keys($scope.fixados);

            for(var i = 0; i < lst.length; i++){

                var t = lst[i];
                if($scope.fixados[t]){
                    $scope.campo[t] = tmp[t];
                }
            }

        };


        // Fecha Modal
        $scope.cancel = function () {
            $uibModalInstance.close();
        };


        // Salva item
        $scope.salvar = function (b) {

            $scope.verifica.loading = true;

            delete $scope.campo.chk;
            delete $scope.campo.dataBr;
            delete $scope.campo.horaStr;
            delete $scope.campo.prodStr;

            $scope.campo.chegou = false;

            $scope.registraLanc($scope.campo);

            $scope.campo.$save({db: dbs}, function (data) {

                inicia[dbs]().then(function(){

                    if (b == 'f') {
                        $scope.cancel();
                    } else if (b == 'e'){
                        $scope.itens.splice(0, 1);
                        inicializa($scope.itens[0]);
                    } else {
                        $scope.zera();
                    }

                });

                $scope.verifica.loading = false;

            }, function () {
                $scope.verifica.loading = false;
                alert("Erro no Banco de Dados");
            });

        };

    })


    // CONTROLLER DE AJUSTES - LOGÍSTICA
    .controller("ajusteCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "ajustes";
        $scope.itens = angular.copy(atual);


        // Inicializa
        function inicializa(item){
            $scope.campo = angular.copy(item);
        }

        // Limpa campos
        $scope.zera = function () {

            $scope.campo = angular.copy(new dtBase({db: dbs}));

            var dt = $scope.zeraHora();

            $scope.campo.mes = dt.getMonth();
            $scope.campo.ano = dt.getFullYear();

        };

        if($scope.itens.length > 0){
            inicializa($scope.itens[0]);
        } else {
            $scope.zera();

        }


        // Fecha Modal
        $scope.cancel = function () {
            $uibModalInstance.close();
        };


        // Salva item
        $scope.salvar = function (b) {

            $scope.campo.data = new Date($scope.campo.ano, $scope.campo.mes, 1);

            if ($scope.naoRepeteData($scope.todos[dbs], $scope.campo, 'data')) {

                $scope.verifica.loading = true;

                delete $scope.campo.chk;

                $scope.registraLanc($scope.campo);

                $scope.campo.$save({db: dbs}, function (data) {

                    inicia[dbs]().then(function () {

                        if (b == 'f') {
                            $scope.cancel();
                        } else if (b == 'e') {
                            $scope.itens.splice(0, 1);
                            inicializa($scope.itens[0]);
                        } else {
                            $scope.zera();
                        }

                    });

                    $scope.verifica.loading = false;

                }, function () {
                    $scope.verifica.loading = false;
                    alert("Erro no Banco de Dados");
                });
            }
        };

    });