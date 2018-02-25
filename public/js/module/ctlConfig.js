/*
 controller de Configurações Gerais v1.0
 2016 Nilton Cruz
 */

"use strict";

app

    // CONTROLLER DE CADASTRO DE CLIENTES
    .controller("clienteCtl", function ($scope, $http, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "clientes";

        $scope.itens = angular.copy(atual);

        $scope.roda = false;


        // Limpa campos
        $scope.zera = function () {
            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.pessoa = 'J';
        };


        // Inicializa
        if($scope.itens.length > 0){
            $scope.campo = angular.copy($scope.itens[0]);
        }else{
            $scope.zera();
        }


        // Fecha Modal
        $scope.cancel = function () {
            $uibModalInstance.close();
        };


        // Salva item
        $scope.salvar = function (b) {

            if ($scope.naoRepete($scope.todos[dbs], $scope.campo, 'nome')) {

                $scope.verifica.loading = true;

                delete $scope.campo.chk;

                $scope.registraLanc($scope.campo);

                $scope.campo.$save({db: dbs}, function (data) {

                    inicia[dbs]().then(function(){

                        if (b == 'f') {
                            $scope.cancel();
                        } else if (b == 'e'){
                            $scope.itens.splice(0, 1);
                            $scope.campo = angular.copy($scope.itens[0]);
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


        //Busca CEP
        $scope.pegaCep = function(item){

            if(item != undefined && item.length === 8){
                $scope.roda = true;

                $http.get(" http://viacep.com.br/ws/"+item+"/json").success(function(data){

                    if(data.erro){
                        $scope.campo.endereco = '';
                        $scope.campo.bairro = '';
                        $scope.campo.estado = '';
                        alert("CEP Não Encontrado");
                    }else{
                        $scope.campo.endereco = data.logradouro;

                        $scope.campo.bairro = data.bairro;

                        var pE = $scope.estados.map(function(e){ return e.sigla; }).indexOf(data.uf);

                        if(pE != -1){
                            $scope.campo.estado = $scope.estados[pE].nome;
                            $scope.cidades = $scope.estados[pE].cidades;

                            var pC = $scope.cidades.map(function(e){ return e; }).indexOf(data.localidade);

                            if(pC != -1){
                                $scope.campo.cidade = $scope.cidades[pC];
                            }

                        }
                    }

                    $scope.roda = false;
                })

            }
        };


        // Define lista de cidades
        $scope.cids = function(item){

            var ps = $scope.estados.map(function(e){ return e.nome; }).indexOf(item);

            if(ps != -1){
                $scope.cidades = $scope.estados[ps].cidades;
            }

        };


        // Pega lista de estados
        dtBase.query({db: 'estados'}, function(data){
            $scope.estados = data;
        });

    })


    // CONTROLLER DE CADASTRO DE USUÁRIOS
    .controller("usuarioCtl", function ($scope, dtBase, inicia, $uibModalInstance, $base64, atual) {

        var dbs = "usuarios";

        $scope.itens = angular.copy(atual);


        // Inicializa
        function inicializa(item){
            $scope.campo = angular.copy(item);
            $scope.campo.senha = $base64.decode($scope.campo.senha);
        }

        if($scope.itens.length > 0){
            inicializa($scope.itens[0]);
        }else{
            $scope.campo = angular.copy(new dtBase({db: dbs}));
        }


        // Limpa campos
        $scope.zera = function () {
            $scope.campo = angular.copy(new dtBase({db: dbs}));
        };


        // Fecha Modal
        $scope.cancel = function () {
            $uibModalInstance.close();
        };


        // Salva item
        $scope.salvar = function (b) {

            if ($scope.naoRepete($scope.todos[dbs], $scope.campo, 'nome')) {

                $scope.verifica.loading = true;

                $scope.campo.senha = $base64.encode($scope.campo.senha);

                if(!$scope.campo._id){
                    $scope.campo.id = $scope.todos[dbs].length + 1;
                }

                if($scope.campo.admin){
                    delete $scope.campo.dash;
                }

                if($scope.campo.dash){
                    delete $scope.campo.admin;
                }

                delete $scope.campo.chk;

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

            }

        };

    })


    // CONTROLLER DE ALTERAÇÃO DE SENHA
    .controller("senhaCtl", function ($scope, dtBase, inicia, $uibModalInstance, $base64) {

        var dbs = "usuarios";

        $scope.maisOp = false;

        $scope.campo = angular.copy(new dtBase({db: dbs}));

        var u = $scope.todos[dbs].map(function(e){ return e._id; }).indexOf($scope.usuario._id);

        if(u != -1){
            $scope.campo = angular.copy($scope.todos[dbs][u]);
            $scope.campo.velha = $base64.decode($scope.campo.senha);
        }else{
            $uibModalInstance.close();
        }


        // Fecha Modal
        $scope.cancel = function () {
            $uibModalInstance.close();
        };


        // Salva item
        $scope.salvar = function () {

            if ($scope.naoRepete($scope.todos[dbs], $scope.campo, 'nome')) {

                $scope.verifica.loading = true;

                if($scope.maisOp){
                    $scope.campo.senha = $base64.encode($scope.campo.nova);
                }else{
                    $scope.campo.senha = $base64.encode($scope.campo.velha);
                }

                delete $scope.campo.velha;
                delete $scope.campo.atual;
                delete $scope.campo.nova;
                delete $scope.campo.novaRep;
                delete $scope.campo.chk;

                $scope.campo.$save({db: dbs}, function (data) {

                    inicia[dbs]().then(function(){

                        $scope.usuario.nome = $scope.todos[dbs][u].nome;
                        $scope.cancel();

                    });

                    $scope.verifica.loading = false;

                }, function () {
                    $scope.verifica.loading = false;
                    alert("Erro no Banco de Dados");
                });

            }

        };

    })


    // CONTROLLER DE CADASTRO DE CENTROS DE CUSTO
    .controller("custosCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "custos";

        $scope.itens = angular.copy(atual);

        $scope.campo = ($scope.itens.length > 0) ? angular.copy($scope.itens[0]) : angular.copy(new dtBase({db: dbs}));


        // Limpa campos
        $scope.zera = function () {
            $scope.campo = angular.copy(new dtBase({db: dbs}));
        };


        // Fecha Modal
        $scope.cancel = function () {
            $uibModalInstance.close();
        };


        // Salva item
        $scope.salvar = function (b) {

            if ($scope.naoRepete($scope.todos[dbs], $scope.campo, 'nome')) {

                $scope.verifica.loading = true;

                delete $scope.campo.chk;

                $scope.registraLanc($scope.campo);

                $scope.campo.$save({db: dbs}, function (data) {

                    inicia[dbs]().then(function(){

                        if (b == 'f') {
                            $scope.cancel();
                        } else if (b == 'e'){
                            $scope.itens.splice(0, 1);
                            $scope.campo = angular.copy($scope.itens[0]);
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

    })


    // CONTROLLER DE CADASTRO DE CARGOS
    .controller("cargosCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "cargos";

        $scope.itens = angular.copy(atual);

        $scope.campo = ($scope.itens.length > 0) ? angular.copy($scope.itens[0]) : angular.copy(new dtBase({db: dbs}));


        // Limpa campos
        $scope.zera = function () {
            $scope.campo = angular.copy(new dtBase({db: dbs}));
        };


        // Fecha Modal
        $scope.cancel = function () {
            $uibModalInstance.close();
        };


        // Salva item
        $scope.salvar = function (b) {

            if ($scope.naoRepete($scope.todos[dbs], $scope.campo, 'nome')) {

                $scope.verifica.loading = true;

                delete $scope.campo.chk;

                $scope.registraLanc($scope.campo);

                $scope.campo.$save({db: dbs}, function (data) {

                    inicia[dbs]().then(function(){

                        if (b == 'f') {
                            $scope.cancel();
                        } else if (b == 'e'){
                            $scope.itens.splice(0, 1);
                            $scope.campo = angular.copy($scope.itens[0]);
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

    })


    // CONTROLLER DE CADASTRO DE STATUS
    .controller("statusCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "status";

        $scope.itens = angular.copy(atual);

        $scope.campo = ($scope.itens.length > 0) ? angular.copy($scope.itens[0]) : angular.copy(new dtBase({db: dbs}));


        // Limpa campos
        $scope.zera = function () {
            $scope.campo = angular.copy(new dtBase({db: dbs}));
        };


        // Fecha Modal
        $scope.cancel = function () {
            $uibModalInstance.close();
        };


        // Salva item
        $scope.salvar = function (b) {

            if( $scope.naoRepete($scope.todos[dbs], $scope.campo, 'nome') ) {

                $scope.verifica.loading = true;

                delete $scope.campo.chk;

                $scope.registraLanc($scope.campo);

                $scope.campo.$save({db: dbs}, function (data) {

                    inicia[dbs]().then(function(){

                        if (b == 'f') {
                            $scope.cancel();
                        } else if (b == 'e'){
                            $scope.itens.splice(0, 1);
                            $scope.campo = angular.copy($scope.itens[0]);
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

    })


    // CONTROLLER DE CADASTRO DE TIPOS DE MÁQUINA
    .controller("tipomaqCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "tipomaq";

        $scope.itens = angular.copy(atual);

        $scope.campo = ($scope.itens.length > 0) ? angular.copy($scope.itens[0]) : angular.copy(new dtBase({db: dbs}));


        // Limpa campos
        $scope.zera = function () {
            $scope.campo = angular.copy(new dtBase({db: dbs}));
        };


        // Fecha Modal
        $scope.cancel = function () {
            $uibModalInstance.close();
        };


        // Salva item
        $scope.salvar = function (b) {

            if( $scope.naoRepete($scope.todos[dbs], $scope.campo, 'nome') ) {

                $scope.verifica.loading = true;

                delete $scope.campo.chk;

                $scope.registraLanc($scope.campo);

                $scope.campo.$save({db: dbs}, function (data) {

                    inicia[dbs]().then(function(){

                        if (b == 'f') {
                            $scope.cancel();
                        } else if (b == 'e'){
                            $scope.itens.splice(0, 1);
                            $scope.campo = angular.copy($scope.itens[0]);
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

    })


    // CONTROLLER DE CADASTRO DE TIPOS DE CONTRATO
    .controller("mdcontratoCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "mdcontrato";

        $scope.itens = angular.copy(atual);

        $scope.campo = ($scope.itens.length > 0) ? angular.copy($scope.itens[0]) : angular.copy(new dtBase({db: dbs}));

        $scope.formaMed = false;

        // Campos que podem ser Fixados
        $scope.fixados = [];
        $scope.fixados.tipo = false;
        $scope.fixados.periodo = false;
        $scope.fixados.forma = false;

        // Fixa / Desafixa Campos
        $scope.fixar = function(cmp){

            $scope.fixados[cmp] = !$scope.fixados[cmp];

        };


        // Limpa campos
        $scope.zera = function () {

            var tmp = angular.copy($scope.campo);

            $scope.campo = angular.copy(new dtBase({db: dbs}));

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

            if( $scope.naoRepete($scope.todos[dbs], $scope.campo, 'nome') ) {

                $scope.verifica.loading = true;

                delete $scope.campo.chk;
                delete $scope.campo.tipoFull;
                delete $scope.campo.periodoFull;
                delete $scope.campo.formaFull;

                $scope.registraLanc($scope.campo);

                $scope.campo.$save({db: dbs}, function (data) {

                    inicia[dbs]().then(function(){

                        if (b == 'f') {
                            $scope.cancel();
                        } else if (b == 'e'){
                            $scope.itens.splice(0, 1);
                            $scope.campo = angular.copy($scope.itens[0]);
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


        // Tem forma de medição?
        $scope.med = function(item){

            var f = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf(item);

            if(f != -1){
                $scope.formaMed = $scope.itemTipo.tipo[f].formaMed;
            }

        };

        if($scope.campo.tipo){
            $scope.med($scope.campo.tipo);
        }

    });
