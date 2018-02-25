/*
 Controller Base v1.0
 2016 Nilton Cruz
 */


"use strict";

app
    // CONTROLLER DASHBOARD
    .controller('inicioCtl', function($scope, inicia){

        $scope.ativa('dash');

        // Inicializa cadastros base

        /* INICIALIZA CONFIGURAÇÕES GERAIS */
        // CLIENTES
        inicia.clientes()

            // USUÁRIOS
            .then(function(){
                return inicia.usuarios();
            })

            // CUSTOS
            .then(function(){
                return inicia.custos();
            })

            // CARGOS
            .then(function(){
                return inicia.cargos();
            })

            // STATUS
            .then(function(){
                return inicia.status();
            })

            // TIPOS DE MÁQUINAS
            .then(function(){
                return inicia.tipomaq();
            })

            // MODELOS DE CONTRATO
            .then(function(){
                return inicia.mdcontrato();
            })


            /* INICIALIZA CADASTROS */
            // FORNECEDOR
            .then(function(){
                return inicia.forn();
            })

            // FUNCIONÁRIO
            .then(function(){
                return inicia.funcionario();
            })

            // ATIVIDADE
            .then(function(){
                return inicia.atividade();
            })

            // EQUIPE
            .then(function(){
                return inicia.equipe();
            })

            // TURNO
            .then(function(){
                return inicia.turno();
            })

            // PRODUTO
            .then(function(){
                return inicia.produto();
            })

            // CONTRATOS
            .then(function(){
                return inicia.contrato();
            })

            /* INICIALIZA LOCAÇÃO */
            // CONTROLES
            .then(function(){
                return inicia.control();
            })


            /* INICIALIZA LOGÍSTICA */
            // SAÍDAS
            .then(function(){
                return inicia.saidas();
            })

            // CHEGADAS
            .then(function(){
                return inicia.chegadas();
            })

            // AJUSTES
            .then(function(){
                return inicia.ajustes();
            })

            /* INICIALIZA PRODUÇÃO */
            // PRODUÇÃO
            .then(function(){
                return inicia.producao();
            })

            // LABORATÓRIO
            .then(function(){
                return inicia.labor();
            })


            /*  INICIALIZA PESSOAL */
            // PONTO
            .then(function(){
                return inicia.pessoal();
            })

            // ALIMENTAÇÃO
            .then(function(){
                return inicia.alimenta();
            })


            /* MEDIÇÕES EMITIDAS */
            .then(function(){
                return inicia.medicoes();
            })


            // Libera sistema para utilização
            .then(function(){
                $scope.verifica.tudoOk = true;
                $scope.verifica.loading = false;
            });


        // Função de mudança de idioma
        var lPT = {
            flag: {pt: "Português", us: "Inglês"}
        };

        var lUS = {
            flag: {pt: "Portuguese", us: "English"}
        };


        $scope.changeLang = function(lg){

            $scope.verifica.loading = true;

            var id = lg.slice(0, 2);

            if(id === "pt"){
                $scope.lang = angular.copy(lPT);
            }else{
                $scope.lang = angular.copy(lUS);
            }

            $scope.lang.actual = id;
            $scope.$broadcast("mudaIdioma");

        };


        // Define idioma baseado no navegador
        $scope.changeLang(navigator.language);

    })


    // CONTROLLER CONFIGURAÇÕES GERAIS - BASE
    .controller("cfgCtl", function($scope, inicia, $uibModal){

        $scope.ativa('cfg');
        $scope.cfgAtual = [];
        $scope.lista = [];
        $scope.atual = [];
        var atualTmp = [];
        $scope.selAll = false;
        $scope.pesquisa = [];
        $scope.pesquisa.texto = '';


        // Limpa Pesquisa
        $scope.limpaInput = function(){
            $scope.pesquisa.texto = '';
        };


        // Define Tipo de Configuração
        $scope.defineCfg = function(item){
            $scope.verifica.loading = true;
            $scope.cfgAtual = angular.copy(item);
            $scope.lista = angular.copy($scope.todos[$scope.cfgAtual.dbase]);
            $scope.verifica.loading = false;
        };


        // Remarca Lançamentos
        function remarca(){

            angular.forEach($scope.lista, function(value, key){

                var t = $scope.atual.map(function(e){ return e._id; }).indexOf( value._id );

                if(t != -1){ $scope.lista[key].chk = true; }

            });

        }


        // Novo/Edita Lançamento Único
        $scope.novo = function(item){

            if(item){
                atualTmp.push(item);
            }

            var md = $uibModal.open({
                templateUrl: $scope.cfgAtual.modal,
                controller: $scope.cfgAtual.ctl,
                size: $scope.cfgAtual.size,
                resolve: {
                    atual: function () {
                        return atualTmp;
                    }
                }
            });

            md.result.then(function(){
                $scope.lista = angular.copy($scope.todos[$scope.cfgAtual.dbase]);
                if($scope.atual.length > 0) { remarca(); }
                atualTmp = [];
            });

        };


        // Edita Vários Lançamentos
        $scope.editar = function(){

            var md = $uibModal.open({
                templateUrl: $scope.cfgAtual.modal,
                controller: $scope.cfgAtual.ctl,
                size: $scope.cfgAtual.size,
                resolve: {
                    atual: function () {
                        return $scope.atual;
                    }
                }
            });

            md.result.then(function(){
                $scope.lista = angular.copy($scope.todos[$scope.cfgAtual.dbase]);
                remarca();
            });

        };


        // Apaga Lançamento(s)
        $scope.apagar = function() {

            if(confirm("Confirma a Exclusão dos Itens Selecionados?") === true){

                for(var i = 0; i < $scope.atual.length; i++){
                    var idx = $scope.atual[i];

                    idx.$remove({db: $scope.cfgAtual.dbase, id: idx._id}, function(){}, function(){
                        alert("Não foi possível apagar o item selecionado");
                    });
                }

                inicia[$scope.cfgAtual.dbase]().then(function(){
                    $scope.lista = angular.copy($scope.todos[$scope.cfgAtual.dbase]);
                    $scope.atual = [];
                    $scope.selAll = false;
                });

            }
        };


        // (Des)Seleciona um item
        $scope.addLista = function (item) {

            if(item.chk){
                $scope.atual.push(angular.copy(item));
            }else{
                var i = $scope.atual.indexOf(item);
                $scope.atual.splice(i, 1);
            }
            $scope.selAll = ($scope.atual.length === $scope.lista.length) && ($scope.lista.length > 0);

        };


        // (Des)Seleciona todos os lançamentos
        $scope.addAll = function(b){

            angular.forEach($scope.lista, function(value, key){
                $scope.lista[key].chk = b;
            });

            $scope.atual = (b) ? angular.copy($scope.lista) : [];
            $scope.selAll = ($scope.atual.length === $scope.lista.length) && ($scope.lista.length > 0);

        };

    })


    // CONTROLLER CADASTROS - BASE
    .controller("cadCtl", function($scope, $location, inicia, $uibModal){

        $scope.ativa('cad');
        $scope.cadAtual = [];
        $scope.lista = [];
        $scope.atual = [];
        var atualTmp = [];
        $scope.selAll = false;
        $scope.pesquisa = [];
        $scope.pesquisa.geral = '';


        // Limpa Pesquisa
        $scope.limpaInput = function(item){
            $scope.pesquisa[item] = '';
        };

        // Filtragem
        $scope.fazFiltro = function(item){

            if(item.campo != 'geral'){
                item.geral = "";

                var t = $scope.cadAtual.campos.map(function(e){ return e.id; }).indexOf(item.campo);

                if(t != -1){

                    item.tipo = $scope.cadAtual.campos[t].tipo;

                    if(item.tipo === 'selecao'){

                        item.texto = '';

                        item.listagem = [];

                        angular.forEach($scope.lista, function(val){

                            var p = item.listagem.map(function(e){ return e.nome; }).indexOf(val[item.campo]);

                            if(p == -1){
                                this.push({nome: val[item.campo]});
                            }

                        }, item.listagem);

                    }else{
                        item.selecao = undefined;
                    }

                }

            }else{
                item.texto = '';
                item.selecao = undefined;
            }

        };


        // Define Tipo de Cadastro
        function defineCad(){

            $scope.verifica.loading = true;

            var t = $scope.menu.cadastro.map(function(e){ return e.link; }).indexOf($location.path());

            if(t != -1){
                $scope.cadAtual = angular.copy($scope.menu.cadastro[t]);
                $scope.lista = angular.copy($scope.todos[$scope.cadAtual.dbase]);
                $scope.ativaItem($scope.menu.cadastro, $scope.cadAtual.nome);
                $scope.pesquisa.campo = "geral";
                $scope.verifica.loading = false;
            }

        }

        defineCad();


        // Remarca Lançamentos
        function remarca(){

            angular.forEach($scope.lista, function(value, key){

                var t = $scope.atual.map(function(e){ return e._id; }).indexOf( value._id );

                if(t != -1){ $scope.lista[key].chk = true; }

            });

        }


        // Novo/Edita Lançamento Único
        $scope.novo = function(item){

            if(item){
                atualTmp.push(item);
            }

            var md = $uibModal.open({
                templateUrl: $scope.cadAtual.modal,
                controller: $scope.cadAtual.ctl,
                size: $scope.cadAtual.size,
                resolve: {
                    atual: function () {
                        return atualTmp;
                    }
                }
            });

            md.result.then(function(){
                $scope.lista = angular.copy($scope.todos[$scope.cadAtual.dbase]);
                if($scope.atual.length > 0) { remarca(); }
                atualTmp = [];
            });

        };


        // Edita Vários Lançamentos
        $scope.editar = function(){

            var md = $uibModal.open({
                templateUrl: $scope.cadAtual.modal,
                controller: $scope.cadAtual.ctl,
                size: $scope.cadAtual.size,
                resolve: {
                    atual: function () {
                        return $scope.atual;
                    }
                }
            });

            md.result.then(function(){
                $scope.lista = angular.copy($scope.todos[$scope.cadAtual.dbase]);
                remarca();
            });

        };


        // Apaga Lançamento(s)
        $scope.apagar = function() {

            if(confirm("Confirma a Exclusão dos Itens Selecionados?") === true){

                for(var i = 0; i < $scope.atual.length; i++){
                    var idx = $scope.atual[i];

                    idx.$remove({db: $scope.cadAtual.dbase, id: idx._id}, function(){}, function(){
                        alert("Não foi possível apagar o item selecionado");
                    });
                }

                inicia[$scope.cadAtual.dbase]().then(function(){
                    $scope.lista = angular.copy($scope.todos[$scope.cadAtual.dbase]);
                    $scope.atual = [];
                    $scope.selAll = false;
                });

            }
        };


        // (Des)Seleciona um item
        $scope.addLista = function (item) {

            if(item.chk){
                $scope.atual.push(angular.copy(item));
            }else{
                var i = $scope.atual.indexOf(item);
                $scope.atual.splice(i, 1);
            }
            $scope.selAll = ($scope.atual.length === $scope.lista.length) && ($scope.lista.length > 0);

        };


        // (Des)Seleciona todos os lançamentos
        $scope.addAll = function(b){

            angular.forEach($scope.lista, function(value, key){
                $scope.lista[key].chk = b;
            });

            $scope.atual = (b) ? angular.copy($scope.lista) : [];
            $scope.selAll = ($scope.atual.length === $scope.lista.length) && ($scope.lista.length > 0);

        };

    })


    // CONTROLLER PESSOAL - BASE
    .controller("pesCtl", function($scope, $location, inicia, $uibModal){

        $scope.ativa('pes');
        $scope.pesAtual = [];
        $scope.lista = [];
        $scope.atual = [];
        var atualTmp = [];
        $scope.selAll = false;


        // Define Tipo de Controle
        function definePes(){

            $scope.verifica.loading = true;

            var t = $scope.menu.pessoal.map(function(e){ return e.link; }).indexOf($location.path());

            if(t != -1){
                $scope.pesAtual = angular.copy($scope.menu.pessoal[t]);

                $scope.ativaItem($scope.menu.pessoal, $scope.pesAtual.nome);

                $scope.pegaLista();
                $scope.verifica.loading = false;
            }

        }

        // Remarca Lançamentos
        function remarca(){

            angular.forEach($scope.lista, function(value, key){

                var t = $scope.atual.map(function(e){ return e._id; }).indexOf( value._id );

                if(t != -1){ $scope.lista[key].chk = true; }

            });

        }


        // Novo/Edita Lançamento Único
        $scope.novo = function(item){

            if(item){
                atualTmp.push(item);
            }


            var md = $uibModal.open({
                templateUrl: $scope.pesAtual.modal,
                controller: $scope.pesAtual.ctl,
                size: $scope.pesAtual.size,
                resolve: {
                    atual: function () {
                        return atualTmp;
                    }
                }
            });

            md.result.then(function(){
                $scope.pegaLista();
                if($scope.atual.length > 0) { remarca(); }
                atualTmp = [];
            });

        };


        // Edita Vários Lançamentos
        $scope.editar = function(){

            var md = $uibModal.open({
                templateUrl: $scope.pesAtual.modal,
                controller: $scope.pesAtual.ctl,
                size: $scope.pesAtual.size,
                resolve: {
                    atual: function () {
                        return $scope.atual;
                    }
                }
            });

            md.result.then(function(){
                $scope.pegaLista();
                remarca();
            });

        };


        // Apaga Lançamento(s)
        $scope.apagar = function() {

            if(confirm("Confirma a Exclusão dos Itens Selecionados?") === true){

                for(var i = 0; i < $scope.atual.length; i++){
                    var idx = $scope.atual[i];

                    idx.$remove({db: $scope.pesAtual.dbase, id: idx._id}, function(){}, function(){
                        alert("Não foi possível apagar o item selecionado");
                    });
                }

                inicia.pessoal().then(function(){
                    $scope.pegaLista();
                });

            }
        };


        // Pega Listagem
        $scope.pegaLista = function(){

            $scope.lista = [];
            $scope.atual = [];

            var tmpLista = angular.copy($scope.todos[$scope.pesAtual.dbase]);

            if($scope.pesAtual.id === 'ponto'){

                for(var i = 0; i < tmpLista.length; i++){

                    var contaP = 0, contaF = 0, contaO = 0;

                    angular.forEach(tmpLista[i].pessoas, function(vl, idx){

                        switch (vl.motivo){
                            case "PS":
                                contaP++;
                                break;
                            case "FL":
                                contaF++;
                                break;
                            default :
                                contaO++;
                                break;
                        }

                    });

                    tmpLista[i].presencaTot = contaP;
                    tmpLista[i].faltaTot = contaF;
                    tmpLista[i].outrosTot = contaO;

                    $scope.lista.push(tmpLista[i]);

                }

            }else{

                $scope.lista = tmpLista;

            }

            $scope.selAll = ($scope.atual.length === $scope.lista.length) && ($scope.lista.length > 0);

        };


        // (Des)Seleciona um item
        $scope.addLista = function (item) {

            if(item.chk){
                $scope.atual.push(angular.copy(item));
            }else{
                var i = $scope.atual.indexOf(item);
                $scope.atual.splice(i, 1);
            }
            $scope.selAll = ($scope.atual.length === $scope.lista.length) && ($scope.lista.length > 0);

        };


        // (Des)Seleciona todos os lançamentos
        $scope.addAll = function(b){

            angular.forEach($scope.lista, function(value, key){
                $scope.lista[key].chk = b;
            });

            $scope.atual = (b) ? angular.copy($scope.lista) : [];
            $scope.selAll = ($scope.atual.length === $scope.lista.length) && ($scope.lista.length > 0);

        };

        definePes();

    })


    // CONTROLLER PRODUÇÃO - BASE
    .controller("mainProdCtl", function($scope, $location, inicia, $uibModal){

        $scope.ativa('prd');
        $scope.prdAtual = [];
        $scope.lista = [];
        $scope.atual = [];
        var atualTmp = [];
        $scope.selAll = false;
        $scope.pesquisa = [];
        $scope.pesquisa.geral = '';


        // Limpa Pesquisa
        $scope.limpaInput = function(item){
            $scope.pesquisa[item] = '';
        };

        // Filtragem
        $scope.fazFiltro = function(item){

            if(item.campo != 'geral'){
                item.geral = "";

                var t = $scope.prdAtual.campos.map(function(e){ return e.id; }).indexOf(item.campo);

                if(t != -1) {

                    item.tipo = $scope.prdAtual.campos[t].tipo;

                    if (item.tipo === 'selecao') {

                        item.texto = '';
                        item.data = undefined;

                        item.listagem = [];

                        if($scope.prdAtual.campos[t].itens){

                            item.listagem = $scope.cadAtual.campos[t].itens;

                        }else{

                            angular.forEach($scope.lista, function (val) {

                                var p = item.listagem.map(function (e) {
                                    return e.nome;
                                }).indexOf(val[item.campo]);

                                if (p == -1) {
                                    this.push({id: val[item.campo], nome: val[item.campo]});
                                }

                            }, item.listagem);

                        }

                    }else if(item.tipo === 'data'){
                        item.data = new Date();
                        item.texto = '';
                        item.selecao = undefined;
                    }else{
                        item.selecao = undefined;
                        item.data = undefined
                    }

                }

            }else{
                item.texto = '';
                item.selecao = undefined;
                item.data = undefined;
            }

        };


        //DatePicker
        $scope.picker = {abre: false};

        $scope.abrePicker = function(){
            $scope.picker.abre = true;
        };


        // Define Tipo de Controle
        function definePrd(){

            $scope.verifica.loading = true;

            var t = $scope.menu.producao.map(function(e){ return e.link; }).indexOf($location.path());

            if(t != -1){
                $scope.prdAtual = angular.copy($scope.menu.producao[t]);
                $scope.ativaItem($scope.menu.producao, $scope.prdAtual.nome);
                $scope.pegaLista();
                $scope.pesquisa.campo = "geral";
                $scope.verifica.loading = false;
            }

        }


        // Remarca Lançamentos
        function remarca(){

            angular.forEach($scope.lista, function(value, key){

                var t = $scope.atual.map(function(e){ return e._id; }).indexOf( value._id );

                if(t != -1){ $scope.lista[key].chk = true; }

            });

        }


        // Pega Ativos com base nas datas de contrato
        $scope.pegaLista = function(){

            $scope.lista = ($scope.prdAtual.id === 'prod') ? angular.copy($scope.todos.producao) : angular.copy($scope.todos.labor);

        };


        // Novo/Edita Lançamento Único
        $scope.novo = function(item){

            if(item){
                atualTmp.push(item);
            }

            var md = $uibModal.open({
                templateUrl: $scope.prdAtual.modal,
                controller: $scope.prdAtual.ctl,
                size: 'lg',
                resolve: {
                    atual: function () {
                        return atualTmp;
                    }
                }
            });

            md.result.then(function(){
                $scope.pegaLista();
                if($scope.atual.length > 0) { remarca(); }
                atualTmp = [];
            });

        };


        // Edita Vários Lançamentos
        $scope.editar = function(){

            var md = $uibModal.open({
                templateUrl: $scope.prdAtual.modal,
                controller: $scope.prdAtual.ctl,
                size: 'lg',
                resolve: {
                    atual: function () {
                        return $scope.atual;
                    }
                }
            });

            md.result.then(function(){
                $scope.pegaLista();
                remarca();
            });

        };


        // Apaga Lançamento(s)
        $scope.apagar = function() {

            if(confirm("Confirma a Exclusão dos Itens Selecionados?") === true){

                for(var i = 0; i < $scope.atual.length; i++){
                    var idx = $scope.atual[i];

                    idx.$remove({db: $scope.prdAtual.dbase, id: idx._id}, function(){}, function(){
                        alert("Não foi possível apagar o item selecionado");
                    });
                }

                inicia[$scope.prdAtual.dbase].then(function(){
                    $scope.pegaLista();
                    $scope.atual = [];
                    $scope.selAll = false;
                });

            }
        };


        // (Des)Seleciona um item
        $scope.addLista = function (item) {

            if(item.chk){
                $scope.atual.push(angular.copy(item));
            }else{
                var i = $scope.atual.indexOf(item);
                $scope.atual.splice(i, 1);
            }
            $scope.selAll = ($scope.atual.length === $scope.lista.length) && ($scope.lista.length > 0);

        };


        // (Des)Seleciona todos os lançamentos
        $scope.addAll = function(b){

            angular.forEach($scope.lista, function(value, key){
                $scope.lista[key].chk = b;
            });

            $scope.atual = (b) ? angular.copy($scope.lista) : [];
            $scope.selAll = ($scope.atual.length === $scope.lista.length) && ($scope.lista.length > 0);

        };

        definePrd();

    })


    // CONTROLLER LOGÍSTICA - BASE (E ENTRADAS)
    .controller("logCtl", function($scope, $location, inicia, $uibModal, dtBase){

        $scope.ativa('log');
        $scope.logAtual = [];
        $scope.lista = [];
        $scope.listaAtivos = [];
        $scope.atual = [];
        var atualTmp = [];
        $scope.selAll = false;
        $scope.pesquisa = [];
        $scope.pesquisa.geral = '';
        $scope.pesquisa.data = new Date();
        $scope.pesquisa.dataChega = new Date();

        // Limpa Pesquisa
        $scope.limpaInput = function(item){
            $scope.pesquisa[item] = '';
        };

        // Filtragem
        $scope.fazFiltro = function(item){

            if(item.campo != 'geral'){
                item.geral = "";

                var t = $scope.logAtual.campos.map(function(e){ return e.id; }).indexOf(item.campo);

                if(t != -1) {

                    item.tipo = $scope.logAtual.campos[t].tipo;

                    if (item.tipo === 'selecao') {

                        item.texto = '';
                        item.data = undefined;

                        item.listagem = [];

                        if($scope.logAtual.campos[t].itens){

                            item.listagem = $scope.cadAtual.campos[t].itens;

                        }else{

                            angular.forEach($scope.lista, function (val) {

                                var p = item.listagem.map(function (e) {
                                    return e.nome;
                                }).indexOf(val[item.campo]);

                                if (p == -1) {
                                    this.push({id: val[item.campo], nome: val[item.campo]});
                                }

                            }, item.listagem);

                        }

                    }else if(item.tipo === 'data'){
                        item.data = new Date();
                        item.texto = '';
                        item.selecao = undefined;
                    }else{
                        item.selecao = undefined;
                        item.data = undefined
                    }

                }

            }else{
                item.texto = '';
                item.selecao = undefined;
                item.data = undefined;
            }

        };


        //DatePicker
        $scope.picker = {abre: false, abreChega: false};

        $scope.abrePicker = function(b){
            if(b){
                $scope.picker.abreChega = true;
            }else{
                $scope.picker.abre = true;
            }
        };

        $scope.abrePickerItem = function(idx){
            idx.aberto = true;
        };


        // Define Tipo de Controle
        function defineLog(){

            $scope.verifica.loading = true;

            var t = $scope.menu.logistica.map(function(e){ return e.link; }).indexOf($location.path());

            if(t != -1){
                $scope.logAtual = angular.copy($scope.menu.logistica[t]);
                $scope.ativaItem($scope.menu.logistica, $scope.logAtual.nome);
                $scope.pegaLista();
                $scope.pesquisa.campo = "geral";
                $scope.verifica.loading = false;
            }

        }


        // Remarca Lançamentos
        function remarca(){

            angular.forEach($scope.lista, function(value, key){

                var t = $scope.atual.map(function(e){ return e._id; }).indexOf( value._id );

                if(t != -1){ $scope.lista[key].chk = true; }

            });

        }


        // Pega Ativos com base nas datas de contrato
        $scope.pegaLista = function() {

            $scope.lista = [];

            if ($scope.logAtual.id === 'saida') {

                $scope.lista = angular.copy($scope.todos.saidas);

            } else if($scope.logAtual.id === 'ajuste'){

                $scope.lista = angular.copy($scope.todos.ajustes);

            }else{

                if($scope.logAtual.id === "transporte"){

                    angular.forEach($scope.todos.saidas, function(vl, idx){

                        if(!vl.chegou){

                            var item = angular.copy(vl);
                            item.block = false;
                            item.aberto = false;

                            this.push(item);
                        }

                    }, $scope.lista);

                }else{

                    angular.forEach($scope.todos.saidas, function(vl, idx){

                        if(vl.chegou){

                            var item = angular.copy(vl);

                            var t = $scope.todos.chegadas.map(function(e){ return e.pai; }).indexOf(vl._id);

                            if(t != -1){

                                item.block = true;
                                item.aberto = false;
                                item.chega = new Date($scope.todos.chegadas[t].data);
                                item.chegaBr = $scope.todos.chegadas[t].chegaBr;
                                item.balanca = $scope.todos.chegadas[t].peso;
                                item.filho = $scope.todos.chegadas[t]._id;

                                this.push(item);
                            }

                        }

                    }, $scope.lista);

                }


            }

        };


        // Novo/Edita Lançamento Único
        $scope.novo = function(item){

            if(item){
                atualTmp.push(item);
            }

            var md = $uibModal.open({
                templateUrl: $scope.logAtual.modal,
                controller: $scope.logAtual.ctl,
                size: $scope.logAtual.size,
                resolve: {
                    atual: function () {
                        return atualTmp;
                    }
                }
            });

            md.result.then(function(){
                $scope.pegaLista();
                if($scope.atual.length > 0) { remarca(); }
                atualTmp = [];
            });

        };


        // Edita Vários Lançamentos
        $scope.editar = function(){

            var md = $uibModal.open({
                templateUrl: $scope.logAtual.modal,
                controller: $scope.logAtual.ctl,
                size: ($scope.logAtual.id === 'saida') ? 'lg' : '',
                resolve: {
                    atual: function () {
                        return $scope.atual;
                    },
                    info: undefined
                }
            });

            md.result.then(function(){
                $scope.pegaLista();
                remarca();
            });

        };


        // Apaga Lançamento(s)
        $scope.apagar = function() {

            if(confirm("Confirma a Exclusão dos Itens Selecionados?") === true){

                for(var i = 0; i < $scope.atual.length; i++){
                    var idx = $scope.atual[i];

                    idx.$remove({db: $scope.logAtual.dbase, id: idx._id}, function(){}, function(){
                        alert("Não foi possível apagar o item selecionado");
                    });
                }

                inicia[$scope.logAtual.dbase]().then(function(){
                    $scope.pegaLista();
                    $scope.atual = [];
                    $scope.selAll = false;
                });

            }
        };


        // (Des)Seleciona um item
        $scope.addLista = function (item) {

            if($scope.logAtual.id === "chegada" || !item.chegou){
                if(item.chk){
                    $scope.atual.push(angular.copy(item));

                }else{
                    var i = $scope.atual.indexOf(item);
                    $scope.atual.splice(i, 1);
                }
                $scope.selAll = ($scope.atual.length === $scope.lista.length) && ($scope.lista.length > 0);
            }

        };


        // (Des)Seleciona todos os lançamentos
        $scope.addAll = function(b){

            var tmp = [];

            angular.forEach($scope.lista, function(vl, key){

                if($scope.logAtual.id === "chegada" || !vl.chegou){
                    vl.chk = b;
                    this.push(vl);
                }
            }, tmp);

            $scope.atual = (b) ? angular.copy(tmp) : [];
            $scope.selAll = ($scope.atual.length === $scope.lista.length) && ($scope.lista.length > 0);

        };


        /* FUNÇÕES DE CHEGADA */

        // Salvar Itens Individuais
        $scope.salvaItem = function(it){

            var item = angular.copy(it);

            if(item.chega){

                var dbs = 'chegadas';

                var campo = angular.copy(new dtBase({db: dbs}));

                if(item.filho){
                    campo._id = item.filho;
                }

                campo.pai = item._id;
                campo.data = item.chega;
                campo.peso = item.balanca;

                $scope.registraLanc(campo);

                campo.$save({db: dbs}, function (data) {

                    inicia[dbs]().then(function(){

                        item.chegou = true;

                        delete item.chega;
                        delete item.chegaBr;
                        delete item.balanca;
                        delete item.filho;
                        delete item.inputs;
                        delete item.dataBr;
                        delete item.dataOrigem;
                        delete item.horaStr;
                        delete item.prodStr;
                        delete item.block;
                        delete item.aberto;
                        delete item.chk;

                        var dbs2 = 'saidas';

                        $scope.registraLanc(item);

                        item.$save({db: dbs2}, function (data) {

                            inicia[dbs2]().then(function(){

                                $scope.pegaLista();

                            });


                        }, function () {
                            alert("Erro no Banco de Dados");
                        });

                    });

                }, function () {
                    alert("Erro no Banco de Dados");
                });

            }

        };


        // Salvar Chegada(s)
        $scope.salvaChega = function() {

            if($scope.pesquisa.dataChega){

                var dtChega = $scope.zeraHora($scope.pesquisa.dataChega);
                var passa = true;

                angular.forEach($scope.atual, function (vl, idx) {

                    if (passa) {
                        if (dtChega < $scope.zeraHora(vl.dataOrigem)) {
                            passa = false;
                        }
                    }

                });

                if (passa) {

                    // Salva as chegadas
                    for (var i = 0; i < $scope.atual.length; i++) {

                        var item = $scope.atual[i];


                        var dbs = 'chegadas';

                        var campo = angular.copy(new dtBase({db: dbs}));

                        campo.pai = item._id;
                        campo.data = dtChega;

                        $scope.registraLanc(campo);

                        campo.$save({db: dbs}, function () {
                        }, function () {
                            alert("Erro no Banco de Dados");
                        });


                    }

                    inicia.chegadas().then(function () {

                        // Atualiza as saídas
                        for (var j = 0; j < $scope.atual.length; j++) {

                            var itx = $scope.atual[j];

                            itx.chegou = true;

                            delete itx.chega;
                            delete itx.chegaBr;
                            delete itx.balanca;
                            delete itx.filho;
                            delete itx.inputs;
                            delete itx.dataBr;
                            delete itx.dataOrigem;
                            delete itx.horaStr;
                            delete itx.prodStr;
                            delete itx.block;
                            delete itx.aberto;
                            delete itx.chk;

                            $scope.registraLanc(itx);

                            itx.$save({db: 'saidas'}, function () {
                            }, function () {
                                alert("Erro no Banco de Dados");
                            });

                        }

                        inicia.saidas().then(function () {
                            $scope.atual = [];
                            $scope.pegaLista();
                        });

                    });

                } else {
                    alert("Existem lançamentos com data de saída menor que a de chegada. Favor verificar");
                }

            }


        };


        // Cancelar Chegada(s)
        $scope.cancelChega = function() {

            if(confirm("Confirma o Cancelamento dos Itens Selecionados?") === true){

                // Apaga as chegadas
                for(var i = 0; i < $scope.atual.length; i++){

                    var t = $scope.todos.chegadas.map(function(e){ return e._id; }).indexOf($scope.atual[i].filho);

                    if(t != -1){

                        var idx = angular.copy($scope.todos.chegadas[t]);

                        idx.$remove({db: $scope.logAtual.dbase, id: idx._id}, function(){}, function(){
                            alert("Não foi possível apagar o item selecionado");
                        });

                    }

                }

                inicia[$scope.logAtual.dbase]().then(function(){

                    // Atualiza as saídas
                    for(var j = 0; j < $scope.atual.length; j++){

                        var itx = $scope.atual[j];

                        itx.chegou = false;

                        delete itx.chega;
                        delete itx.chegaBr;
                        delete itx.balanca;
                        delete itx.filho;
                        delete itx.inputs;
                        delete itx.dataBr;
                        delete itx.dataOrigem;
                        delete itx.horaStr;
                        delete itx.prodStr;
                        delete itx.block;
                        delete itx.aberto;
                        delete itx.chk;

                        $scope.registraLanc(itx);

                        itx.$save({db: 'saidas'}, function () {}, function () {
                            alert("Erro no Banco de Dados");
                        });

                    }

                    inicia.saidas().then(function(){
                        $scope.atual = [];
                        $scope.pegaLista();
                    });

                });

            }
        };

        /* FINAL - FUNÇÕES DE CHEGADA */

        defineLog();

    })


    // CONTROLLER CONTROLES - BASE
    .controller("ctlCtl", function($scope, $location, inicia, $uibModal){

        $scope.ativa('ctl');
        $scope.ctlAtual = [];
        $scope.listaAtivos = [];
        $scope.lista = [];
        $scope.atual = [];
        var atualTmp = [];
        var infoTmp = [];
        $scope.selAll = false;
        $scope.pesquisa = [];
        $scope.pesquisa.geral = '';


        // Limpa Pesquisa
        $scope.limpaInput = function(item){
            $scope.pesquisa[item] = '';
        };

        // Filtragem
        $scope.fazFiltro = function(item){

            if(item.campo != 'geral'){
                item.geral = "";

                var t = $scope.ctlAtual.campos.map(function(e){ return e.id; }).indexOf(item.campo);

                if(t != -1) {

                    item.tipo = $scope.ctlAtual.campos[t].tipo;

                    if (item.tipo === 'selecao') {

                        item.texto = '';
                        item.data = undefined;

                        item.listagem = [];

                        if($scope.ctlAtual.campos[t].itens){

                            item.listagem = $scope.ctlAtual.campos[t].itens;

                        }else{

                            angular.forEach($scope.lista, function (val) {

                                if(val[item.campo]){

                                    if(val.categ != 'pst'){

                                        var p = item.listagem.map(function (e) {
                                            return e.nome;
                                        }).indexOf(val[item.campo]);

                                        if (p == -1) {
                                            this.push({id: val[item.campo], nome: val[item.campo]});
                                        }

                                    }else{

                                        var p2 = item.listagem.map(function (e) {
                                            return e.id;
                                        }).indexOf(val[item.campo]);

                                        if(p2 == -1){
                                            this.push({id: val[item.campo], nome: val.ativoStr});
                                        }
                                    }

                                }

                            }, item.listagem);

                        }

                    }else if(item.tipo === 'data'){
                        item.data = new Date();
                        item.texto = '';
                        item.selecao = undefined;
                    }else{
                        item.selecao = undefined;
                        item.data = undefined
                    }

                }

            }else{
                item.texto = '';
                item.selecao = undefined;
                item.data = undefined;
            }

        };


        //DatePicker
        $scope.picker = {abre: false};

        $scope.abrePicker = function(){
            $scope.picker.abre = true;
        };


        // Define Tipo de Controle
        function defineCtl(){

            $scope.verifica.loading = true;

            var t = $scope.menu.controles.map(function(e){ return e.link; }).indexOf($location.path());

            if(t != -1){
                $scope.ctlAtual = angular.copy($scope.menu.controles[t]);
                $scope.ativaItem($scope.menu.controles, $scope.ctlAtual.nome);
                $scope.pegaLista();
                $scope.pesquisa.campo = "geral";
                $scope.verifica.loading = false;
            }

        }


        // Remarca Lançamentos
        function remarca(){

            angular.forEach($scope.lista, function(value, key){

                var t = $scope.atual.map(function(e){ return e._id; }).indexOf( value._id );

                if(t != -1){ $scope.lista[key].chk = true; }

            });

        }


        // Novo/Edita Lançamento Único
        $scope.novo = function(item){

            if(item){
                atualTmp.push(item);
            }

            var md = $uibModal.open({
                templateUrl: $scope.ctlAtual.modal,
                controller: $scope.ctlAtual.ctl,
                size: 'lg',
                resolve: {
                    atual: function () {
                        return atualTmp;
                    }
                }
            });

            md.result.then(function(){
                $scope.pegaLista();
                if($scope.atual.length > 0) { remarca(); }
                atualTmp = [];
            });

        };


        // Edita Vários Lançamentos
        $scope.editar = function(){

            var md = $uibModal.open({
                templateUrl: $scope.ctlAtual.modal,
                controller: $scope.ctlAtual.ctl,
                size: 'lg',
                resolve: {
                    atual: function () {
                        return $scope.atual;
                    },
                    info: undefined
                }
            });

            md.result.then(function(){
                $scope.pegaLista();
                remarca();
            });

        };


        // Apaga Lançamento(s)
        $scope.apagar = function() {

            if(confirm("Confirma a Exclusão dos Itens Selecionados?") === true){

                for(var i = 0; i < $scope.atual.length; i++){
                    var idx = $scope.atual[i];

                    idx.$remove({db: "control", id: idx._id}, function(){}, function(){
                        alert("Não foi possível apagar o item selecionado");
                    });
                }

                inicia.control().then(function(){
                    $scope.pegaLista();
                    $scope.atual = [];
                    $scope.selAll = false;
                });

            }
        };


        // (Des)Seleciona um item
        $scope.addLista = function (item) {

            if(item.chk){
                $scope.atual.push(angular.copy(item));
            }else{
                var i = $scope.atual.indexOf(item);
                $scope.atual.splice(i, 1);
            }
            $scope.selAll = ($scope.atual.length === $scope.lista.length) && ($scope.lista.length > 0);

        };


        // (Des)Seleciona todos os lançamentos
        $scope.addAll = function(b){

            angular.forEach($scope.lista, function(value, key){
                $scope.lista[key].chk = b;
            });

            $scope.atual = (b) ? angular.copy($scope.lista) : [];
            $scope.selAll = ($scope.atual.length === $scope.lista.length) && ($scope.lista.length > 0);

        };


        // Pega Ativos com base nas datas de contrato
        $scope.pegaLista = function(){

            $scope.lista = [];

            angular.forEach($scope.todos.listControle, function(val){

                if(val.ctl === $scope.ctlAtual.id){

                    this.push(angular.copy(val));

                }

            }, $scope.lista);

        };


        defineCtl();

    });
