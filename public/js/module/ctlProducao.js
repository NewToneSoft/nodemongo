/*
 controller de Produção v1.0
 2016 Nilton Cruz
 */

"use strict";

app

    // CONTROLLER DE PRODUÇÕES
    .controller("prodCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "producao";
        $scope.itens = angular.copy(atual);
        $scope.desc = [];


        //DatePicker
        $scope.picker = {abreDt: false};

        $scope.abrePicker = function(){
            $scope.picker.abreDt = true;
        };


        // Pega Campos de Lançamento
        $scope.info = function(item){

            var t = $scope.todos.turno.map(function(e){ return e._id; }).indexOf(item.turno);

            if(t != -1){

                var hi = new Date($scope.todos.turno[t].horaini),
                    hf = new Date($scope.todos.turno[t].horafim);

                $scope.desc.descricao = hi.toLocaleTimeString().substr(0, 5) + " à " + hf.toLocaleTimeString().substr(0, 5);
            }


        };


        // Inicializa
        function inicializa(item){
            $scope.campo = angular.copy(item);
            $scope.campo.data = new Date($scope.campo.data);
            $scope.info($scope.campo);
        }

        if($scope.itens.length > 0){
            inicializa($scope.itens[0]);
        } else {
            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.data = new Date();
        }


        // Campos que podem ser Fixados
        $scope.fixados = [];
        $scope.fixados.data = false;

        // Fixa / Desafixa Campos
        $scope.fixar = function(cmp){

            $scope.fixados[cmp] = !$scope.fixados[cmp];

        };


        // Fecha Modal
        $scope.cancel = function () {
            $uibModalInstance.close();
        };


        // Limpa campos
        $scope.zera = function () {

            var tmp = angular.copy($scope.campo);

            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.data = new Date();

            // Retorna itens fixados
            var lst = Object.keys($scope.fixados);

            for(var i = 0; i < lst.length; i++){

                var t = lst[i];
                if($scope.fixados[t]){
                    $scope.campo[t] = tmp[t];
                }
            }

        };


        // Salva item
        $scope.salvar = function (b) {

            $scope.verifica.loading = true;

            delete $scope.campo.chk;
            delete $scope.campo.dataBr;
            delete $scope.campo.turnoStr;

            $scope.registraLanc($scope.campo);

            $scope.campo.$save({db: dbs}, function (data) {

                inicia[dbs]().then(function(){

                    if (b == 'f') {
                        $scope.cancel();
                    } else if (b == 'e'){
                        $scope.itens.splice(0, 1);
                        $scope.campo = angular.copy($scope.itens[0]);
                    } else {
                        $scope.campo = angular.copy(new dtBase({db: dbs}));
                    }

                });

                $scope.verifica.loading = false;

            }, function () {
                $scope.verifica.loading = false;
                alert("Erro no Banco de Dados");
            });

        };

    })


    // CONTROLLER DE LABORATÓRIO
    .controller("laborCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "labor";
        $scope.itens = angular.copy(atual);
        $scope.desc = [];


        //DatePicker
        $scope.picker = {abreDt: false};

        $scope.abrePicker = function(){
            $scope.picker.abreDt = true;
        };


        // Inicializa
        function inicializa(item){
            $scope.campo = angular.copy(item);
            $scope.campo.data = new Date($scope.campo.data);
            $scope.campo.hora = new Date($scope.campo.hora);
        }

        if($scope.itens.length > 0){
            inicializa($scope.itens[0]);
        } else {
            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.data = new Date();
            $scope.campo.hora = new Date();
        }


        // Campos que podem ser Fixados
        $scope.fixados = [];
        $scope.fixados.data = false;
        $scope.fixados.produto = false;

        // Fixa / Desafixa Campos
        $scope.fixar = function(cmp){

            $scope.fixados[cmp] = !$scope.fixados[cmp];

        };


        // Fecha Modal
        $scope.cancel = function () {
            $uibModalInstance.close();
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


        // Salva item
        $scope.salvar = function (b) {

            $scope.verifica.loading = true;

            delete $scope.campo.chk;
            delete $scope.campo.dataBr;
            delete $scope.campo.horaStr;
            delete $scope.campo.prodStr;

            $scope.registraLanc($scope.campo);

            $scope.campo.$save({db: dbs}, function (data) {

                inicia[dbs]().then(function(){

                    if (b == 'f') {
                        $scope.cancel();
                    } else if (b == 'e'){
                        $scope.itens.splice(0, 1);
                        $scope.campo = angular.copy($scope.itens[0]);
                    } else {
                        $scope.campo = angular.copy(new dtBase({db: dbs}));
                    }

                });

                $scope.verifica.loading = false;


            }, function () {
                $scope.verifica.loading = false;
                alert("Erro no Banco de Dados");
            });

        };

    });