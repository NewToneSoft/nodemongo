/*
 controller de Pessoal v1.0
 2016 Nilton Cruz
 */

"use strict";

app

    // CONTROLLER DE PONTO
    .controller("pontoCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "pessoal";
        $scope.itens = angular.copy(atual);
        $scope.tmpPessoas = [];
        $scope.atualTmp = [];
        $scope.selTudo = false;
        $scope.filtroTmp = [];
        $scope.filtroTmp.motivo = "";


        //DatePicker
        $scope.picker = {abreDt: false};

        $scope.abrePicker = function(){
            $scope.picker.abreDt = true;
        };

        $scope.abrePickerItem = function(idx){
            idx.aberto = true;
        };


        // Pega Campos Necessários com base no Motivo
        $scope.pegaMotivo = function(item){

            if(item.motivo){

                var t = $scope.tipoPessoal.map(function(e){ return e.id; }).indexOf(item.motivo);

                if(t != -1){
                    item.temJust = $scope.tipoPessoal[t].justifica;
                    item.temData = $scope.tipoPessoal[t].periodo;
                }

            }

        };


        // Pega Listagem de Funcionários
        $scope.pegaPessoal = function(item){

            var tmp = [];
            $scope.tmpPessoas = [];

            var dtAtual = $scope.zeraHora(item.data);

            for(var i = 0; i < $scope.todos.funcionario.length; i++){

                var dtCtIni, dtCtFim;

                angular.forEach($scope.todos.funcionario[i].carteira, function(vl, idx){

                    if(vl.situacao == 'E'){
                        dtCtIni = $scope.zeraHora(vl.data);
                    }

                    if(vl.situacao == 'D'){
                        dtCtFim = $scope.zeraHora(vl.data);
                    }

                });

                if(dtCtFim){

                    if(dtAtual >= dtCtIni && dtAtual <= dtCtFim){
                        tmp.push($scope.todos.funcionario[i]);
                    }

                }else{

                    if(dtAtual >= dtCtIni){
                        tmp.push($scope.todos.funcionario[i]);
                    }

                }

            }

            if(item._id){

                angular.forEach(tmp, function(vl, idx){

                    var c = item.pessoas.map(function(e){ return e.funcionario; }).indexOf(vl._id);

                    if(c != -1){

                        item.pessoas[c]._id = vl._id;
                        item.pessoas[c].nome = vl.nome;
                        item.pessoas[c].cargoStr = vl.cargoStr;
                        item.pessoas[c].aberto = false;
                        $scope.pegaMotivo(item.pessoas[c]);

                        if(item.pessoas[c].datafim){
                            item.pessoas[c].datafim = new Date(item.pessoas[c].datafim);
                        }

                        $scope.tmpPessoas.push(angular.copy(item.pessoas[c]));

                    }else{
                        vl.aberto = false;
                        vl.motivo = "PS";
                        vl.temJust = false;
                        vl.temData = false;
                        $scope.tmpPessoas.push(vl);
                    }

                });

            }else{
                $scope.tmpPessoas = angular.copy(tmp);

                angular.forEach($scope.tmpPessoas, function(vl, idx){

                    vl.aberto = false;
                    vl.motivo = "PS";
                    vl.temJust = false;
                    vl.temData = false;

                });
            }

            // VERIFICA PESSOAS QUE JÁ ESTÃO EM ALGUM "MOTIVO COM PERÍODO"
            angular.forEach($scope.todos[dbs], function(vl, idx){

                var dt = $scope.zeraHora(vl.data);

                if(dtAtual > dt && dt.toLocaleDateString() != dtAtual.toLocaleDateString()){

                    angular.forEach(vl.pessoas, function(iVl, iIdx){

                        var t = $scope.tipoPessoal.map(function(e){ return e.id; }).indexOf(iVl.motivo);

                        if(t != -1 && $scope.tipoPessoal[t].periodo){

                            var df = $scope.zeraHora(iVl.datafim);

                            if(dtAtual < df && df.toLocaleDateString() != dtAtual.toLocaleDateString()){

                                var p = $scope.tmpPessoas.map(function(e){ return e._id; }).indexOf((iVl.funcionario));

                                if(p != -1){

                                    $scope.tmpPessoas[p].motivo = iVl.motivo;
                                    $scope.pegaMotivo($scope.tmpPessoas[p]);
                                    $scope.tmpPessoas[p].justifica = iVl.justifica;
                                    $scope.tmpPessoas[p].datafim = new Date(iVl.datafim);
                                    $scope.tmpPessoas[p].block = true;


                                }

                            }

                        }

                    });

                }

            });

        };


        // Limpa campos
        $scope.zera = function () {

            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.data = new Date();
            $scope.pegaPessoal($scope.campo);

        };


        // Inicializa
        function inicializa(item){
            $scope.campo = angular.copy(item);
            $scope.campo.data = new Date($scope.campo.data);
            $scope.pegaPessoal($scope.campo);
        }

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

            if ($scope.naoRepeteData($scope.todos[dbs], $scope.campo, 'data')) {

                $scope.verifica.loading = true;

                $scope.campo.pessoas = [];

                angular.forEach($scope.tmpPessoas, function(vl, idx){
                    if(!vl.block){
                        $scope.campo.pessoas.push({
                            funcionario: vl._id,
                            motivo: vl.motivo,
                            justifica: vl.justifica,
                            datafim: vl.datafim
                        });
                    }
                });

                delete $scope.campo.chk;
                delete $scope.campo.dataBr;
                delete $scope.campo.presencaTot;
                delete $scope.campo.faltaTot;
                delete $scope.campo.outrosTot;

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


        // (Des)Seleciona um item
        $scope.addItem = function (item) {

            if(!item.block){
                if(item.chk){
                    $scope.atualTmp.push(angular.copy(item));
                    if($scope.filtroTmp.motivo){
                        item.motivo = $scope.filtroTmp.motivo;
                        $scope.pegaMotivo(item.motivo);
                    }
                }else{
                    var i = $scope.atualTmp.indexOf(item);
                    $scope.atualTmp.splice(i, 1);
                }
            }
            $scope.selTudo = ($scope.atualTmp.length === $scope.tmpPessoas.length) && ($scope.tmpPessoas.length > 0);

        };


        // (Des)Seleciona todos os lançamentos
        $scope.addTudo = function(b){

            var tmp = [];

            angular.forEach($scope.tmpPessoas, function(value, key){
                if(!value.block){
                    value.chk = b;
                    if(b && $scope.filtroTmp.motivo){
                        value.motivo = $scope.filtroTmp.motivo;
                        $scope.pegaMotivo(value.motivo);
                    }
                    this.push(value);
                }
            }, tmp);

            $scope.atualTmp = (b) ? angular.copy(tmp) : [];
            $scope.selTudo = ($scope.atualTmp.length === $scope.tmpPessoas.length) && ($scope.tmpPessoas.length > 0);

        };

        // Filtros
        $scope.filtraMotivo = function(item){

            if(item.motivo){
                angular.forEach($scope.tmpPessoas, function(value, key){
                    if(value.chk){
                        value.motivo = item.motivo;
                        $scope.pegaMotivo(value);
                    }
                });
            }

        };

    })


    // CONTROLLER DE ALIMENTAÇÃO
    .controller("alimentaCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "alimenta";
        $scope.itens = angular.copy(atual);
        $scope.tmpForn = [];
        $scope.desc = [];

        //DatePicker
        $scope.picker = {abreDt: false};

        $scope.abrePicker = function(){
            $scope.picker.abreDt = true;
        };


        // Limpa campos
        $scope.zera = function () {
            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.data = new Date();
            $scope.campo.produtos = [];
            $scope.pegaRef($scope.campo);
        };


        // Pega Fornecedores de Alimentação
        $scope.pegaRef = function(item){

            $scope.tmpForn = [];

            var dtAtual = $scope.zeraHora(item.data);

            angular.forEach($scope.todos.contrato, function(val){

                if(val.tipo === 'ref'){

                    var dtCtIni = $scope.zeraHora(val.dataini),
                        dtCtFim = $scope.zeraHora(val.datafim);

                    if(dtAtual >= dtCtIni && dtAtual <= dtCtFim){
                        this.push(val);
                    }

                }

            }, $scope.tmpForn);

        };


        // Pega Informações
        $scope.info = function(item){

            var t = $scope.tmpForn.map(function(e){ return e._id; }).indexOf(item.forn);

            if(t != -1){

                var f = $scope.todos.forn.map(function(e){ return e._id; }).indexOf($scope.tmpForn[t].forn);

                if(f != -1){
                    $scope.desc.descricao = $scope.todos.forn[f].nome;
                }

                if(!$scope.campo._id){

                    var dtAtual = $scope.zeraHora(item.data);

                    // Pega Produtos Baseados na Data
                    angular.forEach($scope.tmpForn[t].ativos, function(vl){

                        var tst = this.map(function(e){ return e._id;}).indexOf(vl.produto);

                        if(tst != -1){

                            var dat = $scope.zeraHora(vl.data);

                            if( dtAtual >= dat && dat > $scope.zeraHora(this[tst].data)){
                                this[tst].valor = vl.valor;
                                this[tst].data = vl.data;
                            }

                        }else{

                            var p = $scope.todos.produto.map(function(e){ return e._id; }).indexOf(vl.produto);

                            if(p != -1 && dtAtual >= $scope.zeraHora(vl.data)){
                                this.push({
                                    _id: vl.produto,
                                    nome: $scope.todos.produto[p].nome,
                                    valor: vl.valor,
                                    data: vl.data
                                })
                            }

                        }

                    }, item.produtos);

                }
            }

        };


        // Inicializa
        function inicializa(item){
            $scope.campo = angular.copy(item);
            $scope.campo.data = new Date($scope.campo.data);
            $scope.pegaRef($scope.campo);
            $scope.info($scope.campo);
        }

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

            if ($scope.naoRepeteData($scope.todos[dbs], $scope.campo, 'data')) {

                $scope.verifica.loading = true;

                delete $scope.campo.chk;
                delete $scope.campo.dataBr;

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