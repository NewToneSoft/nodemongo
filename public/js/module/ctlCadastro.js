/*
 controller de Cadastros v1.0
 2016 Nilton Cruz
 */

"use strict";

app

    // CONTROLLER DE CADASTRO DE ATIVIDADES
    .controller("atividadeCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "atividade";

        $scope.itens = angular.copy(atual);


        // Inicializa
        $scope.campo = ($scope.itens.length > 0) ? angular.copy($scope.itens[0]) : angular.copy(new dtBase({db: dbs}));


        // Campos que podem ser Fixados
        $scope.fixados = [];
        $scope.fixados.statusFull = false;

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

            if ($scope.naoRepete($scope.todos[dbs], $scope.campo, 'nome')) {

                $scope.verifica.loading = true;

                delete $scope.campo.chk;

                var t = $scope.todos.status.map(function(e){ return e.nome; }).indexOf($scope.campo.statusFull);

                if(t != -1){
                    $scope.campo.status = $scope.todos.status[t]._id;
                    delete $scope.campo.statusFull;
                }

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


    // CONTROLLER DE CADASTRO DE FORNECEDORES
    .controller("fornCtl", function ($scope, $http, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "forn";

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


    // CONTROLLER DE CADASTRO DE FUNCIONÁRIOS
    .controller("funcionarioCtl", function ($scope, $http, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "funcionario";

        $scope.itens = angular.copy(atual);

        $scope.roda = false;


        // Limpa campos
        $scope.zera = function () {
            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.carteira = [];
        };


        // Inicializa
        if($scope.itens.length > 0){
            $scope.campo = angular.copy($scope.itens[0]);
            angular.forEach($scope.campo.carteira, function(vl, i){
                vl.data = new Date(vl.data);
            });
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

                var t = $scope.todos.cargos.map(function(e){ return e.nome; }).indexOf($scope.campo.cargoStr);

                if(t != -1){
                    $scope.campo.cargo = $scope.todos.cargos[t]._id;
                }

                delete $scope.campo.chk;
                delete $scope.campo.cargoStr;

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


        // Adicionar novo Item à Carteira
        $scope.novoItem = function(){

            var sit = ($scope.campo.carteira.length === 0) ? "E" : undefined;

            var min = ($scope.campo.carteira.length > 0) ?
                new Date($scope.campo.carteira[$scope.campo.carteira.length - 1].data) : undefined;

            $scope.campo.carteira.push({situacao: sit, data: new Date(), abre: false, min: min});

        };


        // Remove Item da Carteira
        $scope.remItem = function(idx){
            $scope.campo.carteira.splice(idx, 1);
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


    // CONTROLLER DE CADASTRO DE CONTRATOS
    .controller("contratoCtl", function ($scope, $http, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "contrato", tmpLista = angular.copy($scope.todos.ativos);

        $scope.esconde = false;
        $scope.maisOp = false;
        $scope.temEquip = false;
        $scope.detail = [];
        $scope.detail.mostra = false;
        $scope.temProduto = false;
        $scope.temCapacidade = false;
        $scope.tmpProdutos = [];
        $scope.tmpAtivos = [];

        $scope.itens = angular.copy(atual);


        // Date Pickers
        $scope.picker = {abreIni: false, abreFim: false};

        $scope.abrePicker = function(b){
            if(b){ $scope.picker.abreIni = true; } else { $scope.picker.abreFim = true; }
        };

        $scope.abrePickerItem = function(idx){

            if(idx.tipo === 'A' && !idx.data){
                idx.data = new Date();
            }

            idx.aberto = true;
        };

        // Lista de Períodos
        $scope.periodos = [
            {nome: "Dia", tempo: 1},
            {nome: "Mês", tempo: 30},
            {nome: "Ano", tempo: 365}
        ];

        // Pega Tempo de Contrato
        $scope.pegaDt = function(item){

            if(item){ $scope.campo.periodo = item; }

            if($scope.campo.duracao){
                var dt = new Date($scope.campo.dataini);
                dt.setDate( dt.getDate() + ($scope.campo.duracao * $scope.campo.periodo.tempo) );
                $scope.campo.datafim = dt;
            }

            if($scope.temProduto && !$scope.campo._id){
                angular.forEach($scope.campo.ativos, function(vl){
                    vl.data = new Date($scope.campo.dataini);
                });
            }
        };


        // Pega Detalhes do Modelo de Contrato
        $scope.pegaModelo = function(item){

            $scope.detail.mostra =  false;

            var m = $scope.todos.mdcontrato.map(function(e){ return e._id; }).indexOf(item.modelo);

            if(m != -1){

                $scope.detail.periodo = $scope.todos.mdcontrato[m].periodoFull;

                $scope.detail.pagamento = ($scope.todos.mdcontrato[m].forma === 'T') ?
                    $scope.todos.mdcontrato[m].formaFull :
                    $scope.todos.mdcontrato[m].periodoFull;

                $scope.detail.forma = $scope.todos.mdcontrato[m].formaFull;

                $scope.detail.mostra =  true;

            }

            // Define se tem Equipamento / Produto
            var t = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf(item.tipo);

            if(t != -1){
                $scope.temEquip = ($scope.itemTipo.tipo[t].categ === "equip");
                $scope.temCapacidade = $scope.itemTipo.tipo[t].capacidade;
                $scope.temProduto = $scope.itemTipo.tipo[t].temProduto;

                if($scope.temProduto){

                    angular.forEach($scope.todos.produto, function(vl){

                        if(vl.categ === $scope.itemTipo.tipo[t].categ){
                            this.push(vl);
                        }

                    }, $scope.tmpProdutos);

                }
            }

        };


        // Pega Ativos Já Cadastrados
        $scope.pegaAtivos = function(item){

            if(!$scope.temProduto && item._id && $scope.tmpAtivos.length === 0){

                angular.forEach(item.ativos, function(vl){

                    if(vl.item === 'N'){
                        this.push(vl);
                    }

                }, $scope.tmpAtivos);

            }

        };


        // Pega Info de Ativo Já Cadastrado
        $scope.pegaInfo = function(item){

            var t = $scope.tmpAtivos.map(function(e){ return e.id;}).indexOf(item.ativo);

            if(t != -1){

                item.descricao = $scope.tmpAtivos[t].descricao;

                if($scope.tmpAtivos[t].categ){
                    item.categ = $scope.tmpAtivos[t].categ;
                }

            }

        };


        // Inicaliza
        function inicializa(item){
            $scope.tmpProdutos = [];
            $scope.tmpAtivos = [];
            $scope.campo = angular.copy(item);
            $scope.campo.dataini = new Date($scope.campo.dataini);
            $scope.campo.datafim = new Date($scope.campo.datafim);
            $scope.pegaModelo($scope.campo);
            $scope.maisOp = ($scope.campo.motorista || $scope.campo.combus || $scope.campo.mobil || $scope.campo.desmobil
            || $scope.campo.custos || $scope.campo.obs);

            angular.forEach($scope.campo.ativos, function(vl){

                if($scope.temProduto || vl.item == 'A') {
                    vl.data = new Date(vl.data);
                }

                if(vl.item == 'A'){

                    if($scope.tmpAtivos.length === 0){
                        $scope.pegaAtivos($scope.campo);
                    }

                    $scope.pegaInfo(vl);

                }

            });

        }

        if($scope.itens.length > 0){
            inicializa($scope.itens[0]);
        }else{
            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.dataini = new Date();
            $scope.campo.periodo = $scope.periodos[1];
            $scope.campo.ativos = [];
        }


        // Limpa campos
        $scope.zera = function () {
            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.dataini = new Date();
            $scope.campo.periodo = $scope.periodos[1];
            $scope.campo.ativos = [];
            tmpLista = angular.copy($scope.todos.ativos);
            $scope.detail.mostra = false;
        };


        // Fecha Modal
        $scope.cancel = function () {
            $uibModalInstance.close();
        };


        // Salva item
        $scope.salvar = function (b) {

            if ($scope.naoRepete($scope.todos[dbs], $scope.campo, 'nome')) {

                var passa = true;

                if(!$scope.temProduto){

                    for (var i = 0; i < $scope.campo.ativos.length; i++) {

                        var conta = 0;

                        angular.forEach($scope.campo.ativos, function(val, idx){

                            if(val.nome.toUpperCase() === $scope.campo.ativos[i].nome.toUpperCase()){
                                conta++;
                            }

                        });

                        if(conta > 1){
                            alert("Dois lançamentos com o mesmo código no contrato: " + $scope.campo.ativos[i].nome.toUpperCase());
                            passa = false;
                            break;
                        }


                        if(!$scope.campo._id){
                            passa = $scope.naoRepete($scope.todos.ativos, $scope.campo.ativos[i], 'nome');
                        }else{

                            angular.forEach($scope.todos.ativos, function(vl, idx){

                                if(vl.nome){
                                    if(vl.nome.toUpperCase() === $scope.campo.ativos[i].nome.toUpperCase()){
                                        passa = $scope.campo._id === vl.contrato;
                                    }
                                }

                            });

                            if(!passa){
                                alert("Lançamento repetido: " + $scope.campo.ativos[i].nome.toUpperCase());
                                break;
                            }

                        }


                        if(passa){

                            var m = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf($scope.campo.tipo);

                            if(m != -1){
                                $scope.campo.ativos[i].abastece = $scope.itemTipo.tipo[m].abastece;
                                $scope.campo.ativos[i].mede = $scope.itemTipo.tipo[m].mede;
                            }

                            $scope.campo.ativos[i].tipo = $scope.campo.tipo;

                            if(!$scope.campo.ativos[i].id){
                                $scope.campo.ativos[i].id = $scope.campo.ativos[i].nome;
                            }

                        }else{
                            break;
                        }

                    }

                }

                if(passa){

                    $scope.verifica.loading = true;

                    var f = $scope.todos.forn.map(function(e){ return e.nome; }).indexOf($scope.campo.fornFull);

                    if(f != -1){
                        $scope.campo.forn = $scope.todos.forn[f]._id;
                        delete $scope.campo.fornFull;
                    }

                    delete $scope.campo.chk;
                    delete $scope.campo.tipoFull;
                    delete $scope.campo.fornFull;
                    delete $scope.campo.listAtivos;
                    delete $scope.campo.vencido;

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
            }

        };


        // Adicionar novo Item ao Contrato
        $scope.novoItem = function(){

            if(!$scope.temProduto) {

                var n = $scope.campo.ativos.length;

                if (n > 0) {

                    var p = tmpLista.map(function (e) {
                        return (e.nome) ? e.nome.toUpperCase() : null;
                    }).indexOf($scope.campo.ativos[n - 1].nome.toUpperCase());

                    if (p === -1) {
                        tmpLista.push($scope.campo.ativos[n - 1]);
                    }

                }

                var item = {};
                item.item = 'N';
                item.nome = "";

                $scope.campo.ativos.push(item);

                if ($scope.campo.tipo) {
                    $scope.geraCod($scope.campo);
                }

            }else{

                var dt = (!$scope.campo._id) ? new Date($scope.campo.dataini) : new Date();
                $scope.campo.ativos.push({ data: dt });

            }

        };


        // Remove Item do Contrato
        $scope.remItem = function(idx){

            if(!$scope.temProduto){

                if($scope.campo.ativos[idx].nome){
                    var p = tmpLista.map(function(e){ return e.nome.toUpperCase() })
                        .indexOf($scope.campo.ativos[idx].nome.toUpperCase());
                }

                if(p != -1){
                    tmpLista.splice(p, 1);
                }

            }

            $scope.campo.ativos.splice(idx, 1);
        };


        // Gera Código do Item do Contrato
        $scope.geraCod = function(main, item){

            if($scope.campo.ativos.length > 0){

                var ini, fim = '', conta = 0, tmpM, tmpC;

                if(item){

                    var c = $scope.todos.tipomaq.map(function(e){ return e._id; }).indexOf(item.categ);

                    if(c != -1){

                        tmpC = $scope.todos.tipomaq[c].nome;

                        if(tmpC.indexOf(' ') >= 0){
                            var temp = tmpC.slice(0, 2);
                            temp = temp + tmpC.slice(tmpC.indexOf(' ') + 1, tmpC.indexOf(' ') + 2);
                            ini = $scope.removeAcentos(temp);
                        }else{
                            ini = $scope.removeAcentos(tmpC.slice(0, 3));
                        }
                    }

                }else{

                    var t = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf(main.tipo);

                    if(t != -1) {

                        tmpM = $scope.itemTipo.tipo[t].nome;

                        // Cria Inicio do código do Equipamento
                        if (tmpM.indexOf(' ') >= 0) {
                            var tmp = tmpM.slice(0, 2);
                            tmp = tmp + tmpM.slice(tmpM.indexOf(' ') + 1, tmpM.indexOf(' ') + 2);
                            ini = $scope.removeAcentos(tmp);
                        } else {
                            ini = $scope.removeAcentos(tmpM.slice(0, 3));
                        }
                    }

                }

                // Conta quantas itens do mesmo tipo já estão cadastrados
                for(var i = 0; i < tmpLista.length; i++){

                    if(item){

                        if(tmpLista[i].categ === item.categ){
                            conta++;
                        }

                    }else{

                        if(tmpLista[i].tipo === main.tipo){
                            conta++;
                        }

                    }
                }

                var n = conta + 1;

                if(n < 100){
                    fim += "0";
                }

                if(n < 10){
                    fim += "0";
                }

                fim += n;

                if(item){
                    item.nome = ini + "-" + fim;
                }else{
                    $scope.campo.ativos[$scope.campo.ativos.length - 1].nome = ini + "-" + fim;
                }

            }

        };

    })


    // CONTROLLER DE CADASTRO DE PRODUTOS
    .controller("produtoCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "produto";

        $scope.itens = angular.copy(atual);


        // Inicializa
        $scope.campo = ($scope.itens.length > 0) ? angular.copy($scope.itens[0]) : angular.copy(new dtBase({db: dbs}));


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
                            $scope.campo = angular.copy(new dtBase({db: dbs}));
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


    // CONTROLLER DE CADASTRO DE EQUIPES
    .controller("equipeCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "equipe";
        $scope.itens = angular.copy(atual);
        $scope.tmpPessoas = [];
        $scope.atualTmp = [];
        $scope.selTudo = false;


        //DatePicker
        $scope.picker = {abreDt: false};

        $scope.abrePicker = function(){
            $scope.picker.abreDt = true;
        };

        $scope.abrePickerItem = function(idx){
            idx.aberto = true;
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
                        item.pessoas[c].chk = true;

                        $scope.tmpPessoas.push(angular.copy(item.pessoas[c]));

                    }else{
                        $scope.tmpPessoas.push(vl);
                    }

                });

            }else{
                $scope.tmpPessoas = angular.copy(tmp);
            }

            // VERIFICA PESSOAS QUE JÁ ESTÃO EM ALGUMA EQUIPE
            angular.forEach($scope.todos[dbs], function(vl, idx){

                if(!item._id || item.id != vl._id){

                    angular.forEach(vl.pessoas, function(iVl, iIdx){

                        var p = $scope.tmpPessoas.map(function(e){ return e._id; }).indexOf((iVl.funcionario));

                        if(p != -1){

                            $scope.tmpPessoas[p].equipeStr = vl.nome;
                            $scope.tmpPessoas[p].block = true;

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

            if ($scope.naoRepete($scope.todos[dbs], $scope.campo, 'nome')) {

                $scope.verifica.loading = true;

                $scope.campo.pessoas = [];

                angular.forEach($scope.tmpPessoas, function(vl, idx){
                    if(!vl.block && vl.chk){
                        $scope.campo.pessoas.push({
                            funcionario: vl._id
                        });
                    }
                });

                delete $scope.campo.chk;
                delete $scope.campo.qtd;

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
                    this.push(value);
                }
            }, tmp);

            $scope.atualTmp = (b) ? angular.copy(tmp) : [];
            $scope.selTudo = ($scope.atualTmp.length === $scope.tmpPessoas.length) && ($scope.tmpPessoas.length > 0);

        };

    })


    // CONTROLLER DE CADASTRO DE TURNOS
    .controller("turnoCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "turno";

        $scope.itens = angular.copy(atual);


        // Inicializa
        $scope.campo = ($scope.itens.length > 0) ? angular.copy($scope.itens[0]) : angular.copy(new dtBase({db: dbs}));


        // Fecha Modal
        $scope.cancel = function () {
            $uibModalInstance.close();
        };


        // Cálculo de Horas
        $scope.calcula = function(){

            if($scope.campo.horaini && $scope.campo.horafim){

                var hours = (Math.abs($scope.campo.horafim - $scope.campo.horaini) / 36e5).toFixed(2);
                $scope.campo.htotal = parseFloat(hours);

            }

        };


        // Salva item
        $scope.salvar = function (b) {

            if ($scope.naoRepete($scope.todos[dbs], $scope.campo, 'nome')) {

                $scope.verifica.loading = true;

                delete $scope.campo.chk;
                delete $scope.campo.hiniStr;
                delete $scope.campo.hfimStr;

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

            }

        };

    });