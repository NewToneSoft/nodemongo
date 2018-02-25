/*
 módulo Principal v1.0
 2016 Nilton Cruz
 */

"use strict";

var app = angular.module("wapp", [
    'modProducao', 'modLogistica', 'modContrato', 'modConfig', 'modCadastro', 'modMedicao', 'modPessoal', 'modDash',
    'ngResource', 'ngRoute', 'ngAnimate',
    'ui.bootstrap', 'angular-carousel', 'ui.mask', 'ui.indeterminate', 'angular-table', 'tc.chartjs',
    'ngDragDrop', 'base64'
])

    .run(['$rootScope', '$http', '$window', '$uibModal', function($rootScope, $http, $window, $uibModal){

        // Verificações
        $rootScope.verifica = [];
        $rootScope.verifica.tudoOk = false;
        $rootScope.verifica.loading = true;

        // LogIn
        $http.get('/userData').success(function(data) {

            if(data.user){

                $rootScope.usuario = data.user;

            }else{
                $window.location.replace('/login');
            }

        });


        // Classe Active (navbar)
        $rootScope.ativo = {
            dash: true,
            prd: false,
            openPrd: false,
            log: false,
            openLog: false,
            ctl: false,
            openCtl: false,
            med: false,
            openMed: false,
            pes: false,
            openPes: false,
            cad: false,
            openCad: false,
            cfg: false,
            user: false
        };

        // Ativa item (navbar)
        $rootScope.ativa = function(tipo){

            angular.forEach($rootScope.ativo, function(value, key){
                $rootScope.ativo[key] = (key === tipo);
            });

        };


        // Lançamentos
        $rootScope.todos = [];


        // Função de verificar item repetido - Campo NOME
        $rootScope.naoRepete = function(grupo, item, campo){

            var passa = true;

            var p = grupo.map(function(e){ return (typeof e === 'string') ? e[campo].toUpperCase() : e; }).indexOf(item[campo].toUpperCase());

            if(p != -1 && item._id){

                var f = grupo.map(function(e){ return e._id; }).indexOf(item._id);

                if(f != -1){

                    if(grupo[f][campo].toUpperCase() != item[campo].toUpperCase()) {

                        for(var i = 0; i < grupo.length; i++){

                            if(i != f){

                                if(grupo[i][campo].toUpperCase() === item[campo].toUpperCase()){
                                    passa = false;
                                    break;
                                }

                            }

                        }

                    }
                }

            }else{
                passa = (p === -1);
            }

            if(!passa){
                alert("Lançamento repetido: " + grupo[p][campo].toUpperCase());
            }

            return passa;

        };

        // Função de verificar item repetido - Campo DATA
        $rootScope.naoRepeteData = function(grupo, item, data){

            var passa = true;

            var p = grupo.map(function(e){ return new Date(e[data]).toLocaleDateString(); })
                .indexOf( new Date(item[data]).toLocaleDateString());

            if(p != -1 && item._id){

                var f = grupo.map(function(e){ return e._id; }).indexOf(item._id);

                if(f != -1){

                    if(new Date(grupo[f][data]).toLocaleDateString() != new Date(item[data]).toLocaleDateString()) {

                        for(var i = 0; i < grupo.length; i++){

                            if(i != f){

                                if(new Date(grupo[i][data]).toLocaleDateString() === new Date(item[data]).toLocaleDateString()){
                                    passa = false;
                                    break;
                                }

                            }

                        }

                    }
                }

            }else{
                passa = (p === -1);
            }

            if(!passa){
                alert("Já existe um lançamento na data de " + new Date(grupo[p][data]).toLocaleDateString());
            }

            return passa;

        };


        // Função para remover acentos
        $rootScope.removeAcentos = function(strAccent) {
            var strAccents = strAccent.split('');
            var strAccentsOut = [];
            var strAccentsLen = strAccents.length;
            var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
            var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
            for (var y = 0; y < strAccentsLen; y++) {
                if (accents.indexOf(strAccents[y]) != -1) {
                    strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
                } else
                    strAccentsOut[y] = strAccents[y];
            }
            strAccentsOut = strAccentsOut.join('');
            return strAccentsOut;
        };


        // Funções de Data
        // Configurações de DatePicker
        $rootScope.dateOptions = {
            showWeeks: false
        };

        function geraAnos(){
            var hoje = new Date();
            var anos = [];
            /*anos.push({value: "x", ano: "-"});*/

            for(var i = 2016; i <= hoje.getFullYear(); i++){
                anos.push({value: i, ano: i});
            }
            return anos;
        }

        $rootScope.pegaAno = geraAnos();

        $rootScope.pegaMes = [
            /*{value: "x", mes: "-", nome: "Todos"},*/
            {value: 0, mes: "Jan", month: "Jan", nome: "Janeiro"},
            {value: 1, mes: "Fev", month: "Feb", nome: "Fevereiro"},
            {value: 2, mes: "Mar", month: "Mar", nome: "Março"},
            {value: 3, mes: "Abr", month: "Apr", nome: "Abril"},
            {value: 4, mes: "Mai", month: "May", nome: "Maio"},
            {value: 5, mes: "Jun", month: "Jun", nome: "Junho"},
            {value: 6, mes: "Jul", month: "Jul", nome: "Julho"},
            {value: 7, mes: "Ago", month: "Aug", nome: "Agosto"},
            {value: 8, mes: "Set", month: "Sep", nome: "Setembro"},
            {value: 9, mes: "Out", month: "Oct", nome: "Outubro"},
            {value: 10, mes: "Nov", month: "Nov", nome: "Novembro"},
            {value: 11, mes: "Dez", month: "Dec", nome: "Dezembro"}
        ];

        // Zera Hora
        $rootScope.zeraHora = function(dt){
            var tmp = (dt) ? new Date(dt) : new Date();
            tmp.setHours(0);
            tmp.setMinutes(0);
            tmp.setSeconds(0);
            tmp.setMilliseconds(0);

            return tmp;
        };

        // Alterar Dados do Usuário
        $rootScope.alteraInfo = function(){
            $uibModal.open({
                templateUrl: "partial/config/senha.html",
                controller: 'senhaCtl',
                size: 'sm'
            });
        };


        // Salva Infos de Craição/Edição
        $rootScope.registraLanc = function(item){

            if(!item._id){
                item.criaUser = $rootScope.usuario._id;
                item.criaData = new Date();
            }else{
                item.editaUser = $rootScope.usuario._id;
                item.editaData = new Date();
            }

        };


        // LogOut
        $rootScope.logOut = function(){
            if($window.confirm("Sair do WebApp?")){
                $window.location.replace('/logout');
            }
        };

    }])


    // HTML dinâmico
    .directive('dinamico', function ($compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function (scope, ele, attrs) {
                scope.$watch(attrs.dinamico, function(html) {
                    ele.html(html);
                    $compile(ele.contents())(scope);
                });
            }
        };
    })

    // Resizable
    .directive('resizable', function () {
        return {
            restrict: 'A',
            scope: {
                callback: '&onResize'
            },
            link: function postLink(scope, elem, attrs) {

                if(attrs.resizable == 'true'){
                    elem.resizable({containment: ".areaDrop", minHeight: elem.height(), minWidth: elem.width()});
                    elem.on('resizestop', function (evt, ui) {
                        if (scope.callback) { scope.callback({el: ui}); }
                    });
                }
            }
        };
    })

    // Executa ao final de NG-REPEAT
    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished', {idx: attr.onFinishRender});
                    });
                }
            }
        }
    })


    // Acesso ao Banco de Dados
    .factory('dtBase', function($resource){
        return $resource('/api/:db/:id/:item2/',{},{});
    })

    /* FILTROS */

    // Filtrar por Todos os Campos
    .filter('porTodos', function($rootScope) {
        return function (items, search) {

            if(search) {

                var busca = $rootScope.removeAcentos(search.toLowerCase());
                var result = [];

                angular.forEach(items, function (value, key) {

                    var tst = '';

                    angular.forEach(value, function (v, k) {

                        if(k != "$$hashKey" && k != "_id"){

                            if(typeof v === 'string' || isFinite(v)) {
                                tst += v + ";";
                            }
                        }
                    });

                    tst = $rootScope.removeAcentos(tst.toLowerCase());

                    if(tst.indexOf(busca) != -1){
                        result.push(value);
                    }

                });

                return result;
            } else {
                return items;
            }
        }
    })

    // Filtrar por Campo Específico
    .filter('porCampo', function($rootScope) {
        return function (items, search) {

            if(search.campo != 'geral' && search.tipo) {

                var busca;

                if(search.tipo == 'texto'){
                    if(search.texto){
                        busca = $rootScope.removeAcentos(search.texto.toLowerCase());
                    }

                }else if(search.tipo == 'data'){
                    busca = new Date(search.data).toLocaleDateString();
                }else{
                    if(search.selecao){
                        busca = $rootScope.removeAcentos(search.selecao.toLowerCase());
                    }

                }

                var result = [];

                angular.forEach(items, function (value, key) {

                    var tst = '';

                    angular.forEach(value, function (v, k) {

                        if(k == search.campo){

                            if(typeof v === 'string' || isFinite(v)) {
                                tst += v + ";";
                            }
                        }
                    });

                    tst = $rootScope.removeAcentos(tst.toLowerCase());

                    if(tst.indexOf(busca) != -1){
                        result.push(value);
                    }

                });

                return result;
            } else {
                return items;
            }
        }
    })

    // Converte CNPF/CPF
    .filter('cnpj', function () {
        return function (input) {

            if(input){

                var str = input + '';
                str = str.replace(/\D/g, '');

                if(input.length === 14){
                    str = str.replace(/^(\d{2})(\d)/, '$1.$2');
                    str = str.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                    str = str.replace(/\.(\d{3})(\d)/, '.$1/$2');
                    str = str.replace(/(\d{4})(\d)/, '$1-$2');
                }else{
                    str = str.replace(/(\d{3})(\d)/, '$1.$2');
                    str = str.replace(/(\d{3})(\d)/, '$1.$2');
                    str = str.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                }

                return str;
            }
        };
    })

    // Converte CEP
    .filter('cep', function () {
        return function (input) {

            if(input){
                var str = input + '';
                str = str.replace(/\D/g, '');
                str = str.replace(/^(\d{2})(\d{3})(\d)/, '$1.$2-$3');
                return str;
            }

        };
    })

    // Converte Telefone
    .filter('tel', function () {
        return function (input) {

            if(input){
                var str = input + '';
                str = str.replace(/\D/g, '');
                if (str.length === 11) {
                    str = str.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else {
                    str = str.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                }
                return str;
            }
        };
    })

    /* FINAL - FILTROS */


    // Configura Rotas
    .config(function($routeProvider, $locationProvider){

        $routeProvider.when('/', {templateUrl: 'partial/dash.html', controller: 'inicioCtl'})

            // Configurações
            .when('/config', {templateUrl: 'partial/config/cfgmain.html', controller: 'cfgCtl'})

            // Produção
            .when('/prod', {templateUrl: 'partial/producao/prodmain.html', controller: 'mainProdCtl'})
            .when('/labor', {templateUrl: 'partial/producao/prodmain.html', controller: 'mainProdCtl'})

            // Logística
            .when('/saida', {templateUrl: 'partial/logistica/logmain.html', controller: 'logCtl'})
            .when('/transporte', {templateUrl: 'partial/logistica/logmain.html', controller: 'logCtl'})
            .when('/chegada', {templateUrl: 'partial/logistica/logmain.html', controller: 'logCtl'})
            .when('/ajuste', {templateUrl: 'partial/logistica/logmain.html', controller: 'logCtl'})

            // Controles de Locação
            .when('/equip', {templateUrl: 'partial/controles/ctlmain.html', controller: 'ctlCtl'})
            .when('/abast', {templateUrl: 'partial/controles/ctlmain.html', controller: 'ctlCtl'})
            .when('/debcred', {templateUrl: 'partial/controles/ctlmain.html', controller: 'ctlCtl'})

            // Medições
            .when('/med', {templateUrl: 'partial/medicoes/medmain.html', controller: 'medCtl'})

            // Pessoal
            .when('/ponto', {templateUrl: 'partial/pessoal/pesmain.html', controller: 'pesCtl'})
            .when('/alimenta', {templateUrl: 'partial/pessoal/pesmain.html', controller: 'pesCtl'})

            // Cadastros
            .when('/turno', {templateUrl: 'partial/cadastros/cadmain.html', controller: 'cadCtl'})
            .when('/equipe', {templateUrl: 'partial/cadastros/cadmain.html', controller: 'cadCtl'})
            .when('/produto', {templateUrl: 'partial/cadastros/cadmain.html', controller: 'cadCtl'})
            .when('/atividade', {templateUrl: 'partial/cadastros/cadmain.html', controller: 'cadCtl'})
            .when('/forn',   {templateUrl: 'partial/cadastros/cadmain.html', controller: 'cadCtl'})
            .when('/contrato',   {templateUrl: 'partial/cadastros/cadmain.html', controller: 'cadCtl'})
            .when('/funcionario',   {templateUrl: 'partial/cadastros/cadmain.html', controller: 'cadCtl'})

            // Fechamentos
            .when('/fecha', {templateUrl: 'partial/fecha/fechamento.html', controller: 'fechaCtl'})

            // Retorna pro Login
            .otherwise({redirectTo:'/login'});

        $locationProvider.html5Mode(true);

    })


    // Listas dos Bancos de Dados
    .service('inicia', function($q, $rootScope, dtBase){

        /* CONFIGURAÇÕES */
        this.clientes = function(){

            var deferred = $q.defer();

            dtBase.query({db: "clientes"}, function (data) {
                $rootScope.todos.clientes = data;
                deferred.resolve();
            });

            return deferred.promise;

        };

        this.usuarios = function(){

            var deferred = $q.defer();

            dtBase.query({db: "usuarios"}, function (data) {
                $rootScope.todos.usuarios = data;
                deferred.resolve();
            });

            return deferred.promise;

        };

        this.custos = function(){

            var deferred = $q.defer();

            dtBase.query({db: "custos"}, function (data) {
                $rootScope.todos.custos = data;
                deferred.resolve();
            });

            return deferred.promise;

        };

        this.cargos = function(){

            var deferred = $q.defer();

            dtBase.query({db: "cargos"}, function (data) {
                $rootScope.todos.cargos = data;
                deferred.resolve();
            });

            return deferred.promise;

        };

        this.status = function(){

            var deferred = $q.defer();

            dtBase.query({db: "status"}, function (data) {
                $rootScope.todos.status = data;
                deferred.resolve();
            });

            return deferred.promise;

        };

        this.tipomaq = function(){

            var deferred = $q.defer();

            dtBase.query({db: "tipomaq"}, function (data) {
                $rootScope.todos.tipomaq = data;
                deferred.resolve();
            });

            return deferred.promise;

        };

        this.mdcontrato = function(){

            var deferred = $q.defer();

            dtBase.query({db: "mdcontrato"}, function (data) {
                $rootScope.todos.mdcontrato = data;

                angular.forEach($rootScope.todos.mdcontrato, function(v, k){

                    var forma;

                    var t = $rootScope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf($rootScope.todos.mdcontrato[k].tipo);

                    if(t != -1){
                        $rootScope.todos.mdcontrato[k].tipoFull = $rootScope.itemTipo.tipo[t].nome;

                        forma = $rootScope.itemTipo.tipo[t].formaMed;
                    }

                    var p = $rootScope.itemTipo.periodo.map(function(e){ return e.id; }).indexOf($rootScope.todos.mdcontrato[k].periodo);

                    if(p != -1){
                        $rootScope.todos.mdcontrato[k].periodoFull = $rootScope.itemTipo.periodo[p].nome;
                    }

                    if(forma){

                        var f = $rootScope.itemTipo.forma.map(function(e){ return e.id; }).indexOf($rootScope.todos.mdcontrato[k].forma);

                        if(f != -1){
                            $rootScope.todos.mdcontrato[k].formaFull = $rootScope.itemTipo.forma[f].nome;
                        }

                    }else{
                        $rootScope.todos.mdcontrato[k].formaFull = "-";
                    }

                });

                deferred.resolve();
            });

            return deferred.promise;

        };


        /* CADASTROS */
        this.atividade = function(){

            var deferred = $q.defer();

            dtBase.query({db: "atividade"}, function (data) {
                $rootScope.todos.atividade = data;

                angular.forEach($rootScope.todos.atividade, function(vl, k){

                    var t = $rootScope.todos.status.map(function(e){ return e._id; }).indexOf($rootScope.todos.atividade[k].status);

                    if(t != -1){
                        $rootScope.todos.atividade[k].statusFull = $rootScope.todos.status[t].nome;
                    }

                });

                deferred.resolve();
            });

            return deferred.promise;

        };

        this.produto = function(){

            var deferred = $q.defer();

            dtBase.query({db: "produto"}, function (data) {
                $rootScope.todos.produto = data;

                angular.forEach($rootScope.todos.produto, function(val){

                    var p = $rootScope.itemTipo.categoria.map(function(e){ return e.id; }).indexOf(val.categ);

                    if(p != -1){
                        val.categStr = $rootScope.itemTipo.categoria[p].nome;
                    }

                });

                deferred.resolve();
            });

            return deferred.promise;

        };

        this.turno = function(){

            var deferred = $q.defer();

            dtBase.query({db: "turno"}, function (data) {
                $rootScope.todos.turno = data;

                for(var i = 0; i < $rootScope.todos.turno.length; i++){

                    var hi = new Date($rootScope.todos.turno[i].horaini),
                        hf = new Date($rootScope.todos.turno[i].horafim);

                    $rootScope.todos.turno[i].hiniStr = hi.toLocaleTimeString().substr(0, 5);
                    $rootScope.todos.turno[i].hfimStr = hf.toLocaleTimeString().substr(0, 5);

                }

                deferred.resolve();
            });

            return deferred.promise;

        };

        this.equipe = function(){

            var deferred = $q.defer();

            dtBase.query({db: "equipe"}, function (data) {
                $rootScope.todos.equipe = data;

                angular.forEach($rootScope.todos.equipe, function(v){
                    v.qtd = v.pessoas.length;
                });

                deferred.resolve();
            });

            return deferred.promise;

        };

        this.forn = function(){

            var deferred = $q.defer();

            dtBase.query({db: "forn"}, function (data) {
                $rootScope.todos.forn = data;
                deferred.resolve();
            });

            return deferred.promise;

        };

        this.funcionario = function(){

            var deferred = $q.defer();

            dtBase.query({db: "funcionario"}, function (data) {
                $rootScope.todos.funcionario = data;

                angular.forEach($rootScope.todos.funcionario, function(vl, k){

                    var t = $rootScope.todos.cargos.map(function(e){ return e._id; }).indexOf(vl.carteira[vl.carteira.length - 1].cargo);

                    if(t != -1){
                        vl.cargoStr = $rootScope.todos.cargos[t].nome;
                    }

                });

                deferred.resolve();
            });

            return deferred.promise;

        };

        this.contrato = function(){

            var deferred = $q.defer();

            dtBase.query({db: "contrato"}, function (data) {
                $rootScope.todos.contrato = data;

                if($rootScope.todos.forn){

                    $rootScope.todos.ativos = [];

                    for(var i = 0; i < $rootScope.todos.contrato.length; i++){

                        var prod = false;

                        var t = $rootScope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf($rootScope.todos.contrato[i].tipo);

                        if(t != -1){
                            $rootScope.todos.contrato[i].tipoFull = $rootScope.itemTipo.tipo[t].nome;
                            prod = $rootScope.itemTipo.tipo[t].temProduto;
                        }

                        var f = $rootScope.todos.forn.map(function(e){ return e._id; }).indexOf($rootScope.todos.contrato[i].forn);

                        if(f != -1){
                            $rootScope.todos.contrato[i].fornFull = $rootScope.todos.forn[f].nome;
                        }

                        var hj = $rootScope.zeraHora(),
                            df = $rootScope.zeraHora($rootScope.todos.contrato[i].datafim);

                        $rootScope.todos.contrato[i].vencido = (hj > df);

                        $rootScope.todos.contrato[i].listAtivos = "";

                        angular.forEach($rootScope.todos.contrato[i].ativos, function(value) {

                            if(prod){

                                var pr = $rootScope.todos.produto.map(function(e){ return e._id; }).indexOf(value.produto);

                                if(pr != -1){
                                    $rootScope.todos.contrato[i].listAtivos += ($rootScope.todos.contrato[i].listAtivos === "") ?
                                        $rootScope.todos.produto[pr].nome : ", " + $rootScope.todos.produto[pr].nome;
                                }

                            }else{

                                if(value.item === 'N'){
                                    $rootScope.todos.contrato[i].listAtivos += ($rootScope.todos.contrato[i].listAtivos === "") ?
                                        value.nome : ", " + value.nome;
                                }

                            }

                            value.contrato = $rootScope.todos.contrato[i]._id;
                            value.forn = $rootScope.todos.contrato[i].forn;

                            if(value.mede){

                                var md = $rootScope.todos.mdcontrato.map(function(e){ return e._id;}).indexOf($rootScope.todos.contrato[i].modelo);

                                if(md != -1){

                                    var frm = ($rootScope.todos.mdcontrato[md].forma) ? $rootScope.todos.mdcontrato[md].forma : $rootScope.todos.mdcontrato[md].tipo;

                                    value.formaMedicao = {
                                        periodo: $rootScope.todos.mdcontrato[md].periodo,
                                        forma: frm
                                    }
                                }

                            }

                            this.push(value);
                        }, $rootScope.todos.ativos);

                    }

                    deferred.resolve();

                }
            });

            return deferred.promise;

        };


        /* LOCAÇÃO */
        this.control = function(){

            var deferred = $q.defer();

            dtBase.query({db: "control"}, function (data) {
                $rootScope.todos.listControle = data;

                for(var i = 0; i < $rootScope.todos.listControle.length; i++){

                    var dt = new Date($rootScope.todos.listControle[i].data);

                    $rootScope.todos.listControle[i].dataBr = dt.toLocaleDateString();

                    if($rootScope.todos.listControle[i].ctl === 'equip'){

                        if($rootScope.todos.listControle[i].categ === 'cac'){

                            var ini = new Date($rootScope.todos.listControle[i].horaini);
                            $rootScope.todos.listControle[i].hiniStr = ini.toLocaleTimeString().substr(0, 5);

                            var fim = new Date($rootScope.todos.listControle[i].horafim);
                            $rootScope.todos.listControle[i].hfimStr = fim.toLocaleTimeString().substr(0, 5);

                        }

                    }

                    if($rootScope.todos.listControle[i].ctl === 'abast') {
                        var hr = new Date($rootScope.todos.listControle[i].hora);
                        $rootScope.todos.listControle[i].horaStr = hr.toLocaleTimeString().substr(0, 5);

                        var c = $rootScope.todos.contrato.map(function(e){ return e._id; }).indexOf($rootScope.todos.listControle[i].ativo);

                        if(c != -1){
                            $rootScope.todos.listControle[i].ativoStr = $rootScope.todos.contrato[c].nome;
                        }
                    }

                }
                deferred.resolve();
            });

            return deferred.promise;

        };


        /* LOGÍSTICA */
        this.saidas = function(){

            var deferred = $q.defer();

            dtBase.query({db: "saidas"}, function (data) {
                $rootScope.todos.saidas = data;

                angular.forEach($rootScope.todos.saidas, function(vl, i){

                    var dt = new Date(vl.data);
                    vl.dataOrigem = dt;
                    vl.dataBr = dt.toLocaleDateString();

                    var hr = new Date(vl.hora);
                    vl.horaStr = hr.toLocaleTimeString().substr(0, 5);

                    var idx = $rootScope.todos.produto.map(function(e){ return e._id; }).indexOf(vl.produto);

                    if(idx != -1){
                        vl.prodStr = $rootScope.todos.produto[idx].nome;
                    }

                    var plc = $rootScope.todos.ativos.map(function(e){ return e.id; }).indexOf(vl.ativo);

                    if(plc != -1){
                        vl.placa = $rootScope.todos.ativos[plc].placa;
                    }


                });

                deferred.resolve();
            });

            return deferred.promise;

        };

        this.chegadas = function(){

            var deferred = $q.defer();

            dtBase.query({db: "chegadas"}, function (data) {
                $rootScope.todos.chegadas = data;

                angular.forEach($rootScope.todos.chegadas, function(vl, i){

                    var dt = new Date(vl.data);
                    vl.chegaBr = dt.toLocaleDateString();

                });

                deferred.resolve();
            });

            return deferred.promise;

        };

        this.ajustes = function(){

            var deferred = $q.defer();

            dtBase.query({db: "ajustes"}, function (data) {
                $rootScope.todos.ajustes = data;
                deferred.resolve();
            });

            return deferred.promise;

        };


        /* PRODUÇÃO */
        this.producao = function(){

            var deferred = $q.defer();

            dtBase.query({db: "producao"}, function (data) {
                $rootScope.todos.producao = data;

                angular.forEach($rootScope.todos.producao, function(vl, i){

                    var dt = new Date(vl.data);
                    vl.dataBr = dt.toLocaleDateString();

                    var idx = $rootScope.todos.turno.map(function(e){ return e._id; }).indexOf(vl.turno);

                    if(idx != -1){
                        vl.turnoStr = $rootScope.todos.turno[idx].nome;
                    }

                });

                deferred.resolve();
            });

            return deferred.promise;

        };

        this.labor = function(){

            var deferred = $q.defer();

            dtBase.query({db: "labor"}, function (data) {
                $rootScope.todos.labor = data;

                angular.forEach($rootScope.todos.labor, function(vl, i){

                    var dt = new Date(vl.data);
                    vl.dataBr = dt.toLocaleDateString();

                    var hr = new Date(vl.hora);
                    vl.horaStr = hr.toLocaleTimeString().substr(0, 5);

                    var idx = $rootScope.todos.produto.map(function(e){ return e._id; }).indexOf(vl.produto);

                    if(idx != -1){
                        vl.prodStr = $rootScope.todos.produto[idx].nome;
                    }

                });

                deferred.resolve();
            });

            return deferred.promise;

        };


        /* PESSOAL */
        this.pessoal = function(){

            var deferred = $q.defer();

            dtBase.query({db: "pessoal"}, function (data) {
                $rootScope.todos.pessoal = data;

                angular.forEach($rootScope.todos.pessoal, function(vl, i){

                    var dt = new Date(vl.data);
                    vl.dataBr = dt.toLocaleDateString();

                });
                deferred.resolve();
            });

            return deferred.promise;

        };

        this.alimenta = function(){

            var deferred = $q.defer();

            dtBase.query({db: "alimenta"}, function (data) {
                $rootScope.todos.alimenta = data;

                angular.forEach($rootScope.todos.alimenta, function(vl, i){

                    var dt = new Date(vl.data);
                    vl.dataBr = dt.toLocaleDateString();

                    vl.prodStr = "";

                    angular.forEach(vl.produtos, function(val, idx){

                        if(val.quant){

                            if(idx > 0 ){
                                vl.prodStr += "; ";
                            }

                            vl.prodStr += (val.nome + " - " + val.quant);

                        }
                    })

                });
                deferred.resolve();
            });

            return deferred.promise;

        };


        /* MEDIÇÕES EMITIDAS */
        this.medicoes = function(){

            var deferred = $q.defer();

            dtBase.query({db: "medicoes"}, function (data) {
                $rootScope.todos.medicoes = data;
                deferred.resolve();
            });

            return deferred.promise;

        };

    })


    // Salva informações entre controllers
    .service('comunica', function() {

        this.salva = function(item) {
            this.info = item;
        };

        this.retorna = function() {
            return this.info;
        };

    });
