/*
 controller de Contratos (Locações) v1.0
 2016 Nilton Cruz
 */

"use strict";

app

    // CONTROLLER PAI DE CONTROLE DE EQUIPAMENTOS
    .controller("equipCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "control";
        $scope.tmpAtivos = [];
        $scope.itens = angular.copy(atual);
        $scope.desc = [];


        // Date Pickers
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

                    if(m != -1 && $scope.itemTipo.tipo[m].categ === 'equip'){

                        var dtCtIni = $scope.zeraHora($scope.todos.contrato[t].dataini),
                            dtCtFim = $scope.zeraHora($scope.todos.contrato[t].datafim);

                        if(dtAtual >= dtCtIni && dtAtual <= dtCtFim){
                            if($scope.todos.ativos[i].formaMedicao){

                                if($scope.todos.ativos[i].formaMedicao.forma != 'T'){
                                    $scope.tmpAtivos.push($scope.todos.ativos[i]);
                                }

                            }else{
                                $scope.tmpAtivos.push($scope.todos.ativos[i]);
                            }

                        }

                    }

                }


            }

        };


        // Pega Campos de Lançamento
        $scope.info = function(item){

            var tmpInput = item.forma;

            var t = $scope.tmpAtivos.map(function(e){ return e.id; }).indexOf(item.ativo);

            if(t != -1){

                $scope.desc.descricao = $scope.tmpAtivos[t].descricao;
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

                            if(tmpInput == item.forma){
                                $scope.$broadcast("reload" + $scope.itemTipo.forma[f].med);
                            }
                        }
                    }
                }

            }

        };


        // Inicializa
        function inicializa(item){
            $scope.campo = angular.copy(item);
            $scope.campo.data = new Date($scope.campo.data);
            $scope.pegaAtivos($scope.campo);
            $scope.info($scope.campo);
        }

        if($scope.itens.length > 0){
            inicializa($scope.itens[0]);
        } else {
            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.data = new Date();
            $scope.pegaAtivos($scope.campo);
        }


        // Campos que podem ser Fixados
        $scope.fixados = [];
        $scope.fixados.data = false;
        $scope.fixados.ativo = false;

        // Fixa / Desafixa Campos
        $scope.fixar = function(cmp){

            $scope.fixados[cmp] = !$scope.fixados[cmp];

        };


        // Limpa campos
        $scope.zera = function () {

            var tmp = angular.copy($scope.campo);

            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.data = new Date();
            $scope.pegaAtivos($scope.campo);

            // Retorna itens fixados
            var lst = Object.keys($scope.fixados);

            for(var i = 0; i < lst.length; i++){

                var t = lst[i];
                if($scope.fixados[t]){
                    $scope.campo[t] = tmp[t];

                    if(t == 'ativo'){
                        $scope.info($scope.campo);
                    }
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
            delete $scope.campo.inputs;
            delete $scope.campo.hiniStr;
            delete $scope.campo.hfimStr;
            delete $scope.campo.forma;

            $scope.registraLanc($scope.campo);

            $scope.campo.ctl = "equip";

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


    // CONTROLLER PAI DE CONTROLE DE ABASTECIMENTOS
    .controller("abastCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "control";
        $scope.tmpAtivos = [];
        $scope.tmpAbastecidos = [];
        $scope.itens = angular.copy(atual);
        $scope.desc = [];
        $scope.saldo = [];
        $scope.semSaldo = false;
        $scope.ehTanque = false;
        $scope.ehMelosa = false;
        $scope.tmpProd = undefined;
        $scope.dataLimite = false;

        // Date Pickers
        $scope.picker = {abreDt: false};

        $scope.abrePicker = function(){
            $scope.picker.abreDt = true;
        };

        // Pega Ativos a serem Abastecidos
        function pegaAbastecidos(item){

            $scope.tmpAbastecidos = [{id: "AVULSO", nome: "AVULSO"}];

            var dtAtual = $scope.zeraHora(item.data);

            for(var i = 0; i < $scope.todos.ativos.length; i++){

                var idx = $scope.todos.ativos[i].contrato;

                var t = $scope.todos.contrato.map(function(e){ return e._id; }).indexOf(idx);

                if(t != -1){

                    var m = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf($scope.todos.contrato[t].tipo);

                    if(m != -1 && $scope.itemTipo.tipo[m].abastece){

                        var dtCtIni = $scope.zeraHora($scope.todos.contrato[t].dataini),
                            dtCtFim = $scope.zeraHora($scope.todos.contrato[t].datafim);

                        if(dtAtual >= dtCtIni && dtAtual <= dtCtFim){
                            $scope.tmpAbastecidos.push($scope.todos.ativos[i]);
                        }

                    }

                }

            }
        }


        // Pega Ativos com base nas datas de contrato
        $scope.pegaAtivos = function(item){

            $scope.tmpAtivos = [];

            var dtAtual = $scope.zeraHora(item.data);

            // Pega Ativos
            for(var i = 0; i < $scope.todos.ativos.length; i++){

                var idx = $scope.todos.ativos[i].contrato;

                var t = $scope.todos.contrato.map(function(e){ return e._id; }).indexOf(idx);

                if(t != -1){

                    if($scope.todos.contrato[t].tipo != "pst"){

                        var m = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf($scope.todos.contrato[t].tipo);

                        if(m != -1 && $scope.itemTipo.tipo[m].categ === 'abast'){

                            var dtCtIni = $scope.zeraHora($scope.todos.contrato[t].dataini),
                                dtCtFim = $scope.zeraHora($scope.todos.contrato[t].datafim);

                            if(dtAtual >= dtCtIni && dtAtual <= dtCtFim){
                                $scope.tmpAtivos.push($scope.todos.ativos[i]);
                            }

                        }

                    }

                }

            }

            // Pega Postos
            angular.forEach($scope.todos.contrato, function(val){

                if(val.tipo === 'pst'){

                    var dtCtIni = $scope.zeraHora(val.dataini),
                        dtCtFim = $scope.zeraHora(val.datafim);

                    if(dtAtual >= dtCtIni && dtAtual <= dtCtFim){
                        val.id = val._id;
                        this.push(val);
                    }

                }

            }, $scope.tmpAtivos);

            pegaAbastecidos(item);

        };


        // Pega Campos de Lançamento
        $scope.info = function(item){

            $scope.semSaldo = false;
            $scope.ehTanque = false;
            $scope.ehMelosa = false;
            $scope.tmpProd = undefined;

            var tmpInput = item.forma;

            var t = $scope.tmpAtivos.map(function(e){ return e.id; }).indexOf(item.ativo);

            if(t != -1){

                var cnt = ($scope.tmpAtivos[t].tipo === 'pst') ? $scope.tmpAtivos[t]._id : $scope.tmpAtivos[t].contrato;

                $scope.desc.descricao = $scope.tmpAtivos[t].descricao;

                if($scope.tmpAtivos[t].tipo === 'pst'){

                    $scope.semSaldo = true;

                    cnt = $scope.tmpAtivos[t]._id;

                    var fr = $scope.todos.forn.map(function(e){ return e._id; }).indexOf($scope.tmpAtivos[t].forn);

                    if(fr != -1){
                        $scope.desc.descricao = $scope.todos.forn[fr].nome;
                    }

                    $scope.desc.produtos = [];

                    var dtAtual = $scope.zeraHora(item.data);

                    // Pega Produtos Baseados na Data
                    angular.forEach($scope.tmpAtivos[t].ativos, function(vl){

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

                    }, $scope.desc.produtos);

                }else if($scope.tmpAtivos[t].tipo === 'tnq'){

                    $scope.ehTanque = true;

                    $scope.desc.produtos = [];

                    if(item.processo == 'E'){

                        angular.forEach($scope.todos.produto, function(vl){

                            if(vl.categ === 'abast'){
                                this.push(vl);
                            }

                        }, $scope.desc.produtos);

                    }else{

                        var da = $scope.zeraHora(item.data);

                        var tmp = [];

                        angular.forEach($scope.todos.listControle, function(vl){

                            if(vl.ativo === item.ativo && vl.ctl === 'abast' && vl.processo === 'E'){

                                var dt = $scope.zeraHora(vl.data);

                                if(da >= dt){
                                    this.push({prod: vl.produto, valor: vl.vlunit});
                                }

                            }

                        }, tmp);

                        if(tmp.length > 0){

                            var pr = $scope.todos.produto.map(function(e){ return e._id; }).indexOf(tmp[tmp.length - 1].prod);

                            if(pr != -1){
                                $scope.desc.produtos.push({
                                    _id: tmp[tmp.length - 1].prod,
                                    nome: $scope.todos.produto[pr].nome,
                                    valor: tmp[tmp.length - 1].valor
                                });

                                $scope.tmpProd = $scope.desc.produtos[0]._id;

                            }

                        }

                    }

                }else if($scope.tmpAtivos[t].tipo === 'mel'){

                    $scope.ehMelosa = true;

                    var da2 = $scope.zeraHora(item.data);

                    $scope.desc.produtos = [];
                    var tmp2 = [];

                    angular.forEach($scope.todos.listControle, function(vl){

                        if(vl.abastecido === item.ativo && vl.ctl === 'abast' && vl.processo === 'S'){

                            var dt = $scope.zeraHora(vl.data);

                            if(da2 >= dt){

                                angular.forEach($scope.todos.listControle, function(vl2){

                                    if(vl.ativo === vl2.ativo && vl2.ctl === 'abast' && vl2.processo === 'E'){

                                        var dtE = $scope.zeraHora(vl2.data);

                                        if(dtE <= dt){
                                            tmp2.push({prod: vl2.produto, valor: vl2.vlunit});
                                        }

                                    }

                                });

                            }

                        }

                    });

                    if(tmp2.length > 0){

                        var pr2 = $scope.todos.produto.map(function(e){ return e._id; }).indexOf(tmp2[tmp2.length - 1].prod);

                        if(pr2 != -1){
                            $scope.desc.produtos.push({
                                _id: tmp2[tmp2.length - 1].prod,
                                nome: $scope.todos.produto[pr2].nome,
                                valor: tmp2[tmp2.length - 1].valor
                            });

                            $scope.tmpProd = $scope.desc.produtos[0]._id;

                        }

                    }

                }

                item.categ = $scope.tmpAtivos[t].tipo;

                var p = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf(item.categ);

                if(p != -1){
                    $scope.desc.ctg = $scope.itemTipo.tipo[p].nome;
                }

                var c = $scope.todos.contrato.map(function(e){ return e._id;}).indexOf(cnt);

                if (c != -1){

                    var m = $scope.todos.mdcontrato.map(function(e){ return e._id;}).indexOf($scope.todos.contrato[c].modelo);

                    if( m != -1){

                        var f = $scope.itemTipo.forma.map(function(e){ return e.id;}).indexOf($scope.todos.mdcontrato[m].forma);

                        if(f != -1){
                            item.inputs = $scope.itemTipo.forma[f].link;
                            item.forma = $scope.itemTipo.forma[f].id;

                            if(tmpInput == item.forma){
                                $scope.$broadcast("reload" + $scope.itemTipo.forma[f].med);
                            }
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

            var dt = $scope.zeraHora($scope.campo.data);
            dt.setMinutes($scope.campo.hora.getMinutes());
            dt.setHours($scope.campo.hora.getHours() + 24);

            var hj = new Date();

            $scope.dataLimite = hj > dt;

        }

        if($scope.itens.length > 0){
            inicializa($scope.itens[0]);
        } else {
            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.data = new Date();
            $scope.campo.hora = new Date();
            $scope.campo.processo = 'S';
            $scope.saldo.futuro = 0.00;
            $scope.pegaAtivos($scope.campo);

        }


        // Campos que podem ser Fixados
        $scope.fixados = [];
        $scope.fixados.data = false;
        $scope.fixados.ativo = false;

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
            $scope.campo.processo = 'S';
            $scope.saldo.futuro = 0.00;
            $scope.pegaAtivos($scope.campo);

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
            delete $scope.campo.inputs;

            $scope.campo.ctl = "abast";

            if(!$scope.semSaldo){
                $scope.campo.ultSaldo = $scope.saldo.futuro;
            }

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

                    $scope.verifica.loading = false;

                });


            }, function () {
                $scope.verifica.loading = false;
                alert("Erro no Banco de Dados");
            });

        };

    })


    // CONTROLLER DE DÉBITOS/CRÉDITOS
    .controller("debcredCtl", function ($scope, dtBase, inicia, $uibModalInstance, atual) {

        var dbs = "control";
        $scope.tmpAtivos = [];
        $scope.itens = angular.copy(atual);
        $scope.desc = [];


        // Date Pickers
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

                    if(m != -1){

                        var dtCtIni = $scope.zeraHora($scope.todos.contrato[t].dataini),
                            dtCtFim = $scope.zeraHora($scope.todos.contrato[t].datafim);

                        if(dtAtual >= dtCtIni && dtAtual <= dtCtFim){
                            $scope.tmpAtivos.push($scope.todos.ativos[i]);
                        }

                    }

                }

            }

        };


        // Pega Campos de Lançamento
        $scope.info = function(item){

            var t = $scope.tmpAtivos.map(function(e){ return e.id; }).indexOf(item.ativo);

            if(t != -1){

                $scope.desc.descricao = $scope.tmpAtivos[t].descricao;
                item.categ = $scope.tmpAtivos[t].tipo;

                var p = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf(item.categ);

                if(p != -1){
                    $scope.desc.ctg = $scope.itemTipo.tipo[p].nome;
                }

            }

        };


        // Inicializa
        function inicializa(item){
            $scope.campo = angular.copy(item);
            $scope.campo.data = new Date($scope.campo.data);
            $scope.pegaAtivos($scope.campo);
            $scope.info($scope.campo);
        }

        if($scope.itens.length > 0){
            inicializa($scope.itens[0]);
        } else {
            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.data = new Date();
            $scope.campo.tipo = 'D';
            $scope.pegaAtivos($scope.campo);

        }


        // Campos que podem ser Fixados
        $scope.fixados = [];
        $scope.fixados.data = false;
        $scope.fixados.tipo = false;
        $scope.fixados.ativo = false;

        // Fixa / Desafixa Campos
        $scope.fixar = function(cmp){

            $scope.fixados[cmp] = !$scope.fixados[cmp];

        };


        // Limpa campos
        $scope.zera = function () {

            var tmp = angular.copy($scope.campo);

            $scope.campo = angular.copy(new dtBase({db: dbs}));
            $scope.campo.data = new Date();
            $scope.campo.tipo = 'D';
            $scope.pegaAtivos($scope.campo);

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

            $scope.campo.ctl = "debcred";

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


    /* CONTROLLER FILHOS */

    // CONTROLLER FILHO - CONTROLE DE HORÍMETRO
    .controller("horimCtl", function ($scope) {

        $scope.maisOp = false;
        $scope.ultValor = undefined;

        // Cálculo de Horas
        $scope.calcula = function(){

            if($scope.campo.hini && $scope.campo.hfim){

                $scope.campo.htotal = ($scope.campo.hfim - $scope.campo.hini).toFixed(2);
                $scope.campo.htotal = parseFloat($scope.campo.htotal);

            }

        };


        // Pega último horímetro
        function ultHor(item){

            $scope.campo.hini = undefined;
            $scope.ultValor = undefined;

            var lnc = new Date(0);
            var final;

            for(var i = 0; i < $scope.todos.listControle.length; i++){

                if($scope.todos.listControle[i].ativo === item.ativo && $scope.todos.listControle[i].ctl === 'equip'){

                    // Novo Lançamento
                    if(!item._id) {

                        var cg = $scope.itemTipo.tipo.map(function (e) {
                            return e.id;
                        }).indexOf($scope.todos.listControle[i].categ);

                        if (cg != -1) {

                            if ($scope.itemTipo.tipo[cg].zera) {
                                $scope.campo.hini = 0;
                            } else {
                                var dt = $scope.zeraHora($scope.todos.listControle[i].data);

                                lnc = (dt > lnc) ? dt : lnc;

                                if (lnc === dt) {
                                    final = i;
                                }
                            }

                        }

                        // Pega o último horímetro do dia anterior do lançamento atual
                    }else{

                        var dt2 = $scope.zeraHora($scope.todos.listControle[i].data);

                        if(dt2 < $scope.zeraHora(item.data)){
                            $scope.ultValor = angular.copy($scope.todos.listControle[i].hfim);
                        }

                    }

                }

            }

            if(final){
                $scope.ultValor = angular.copy($scope.todos.listControle[final].hfim);
                $scope.campo.hini = angular.copy($scope.ultValor);
            }

        }

        if(!$scope.campo._id){
            ultHor($scope.campo);
        }

        $scope.$on("reloadHorim", function(){
            ultHor($scope.campo);
        });


    })


    // CONTROLLER FILHO - CONTROLE DE HORA/KM
    .controller("horakmCtl", function ($scope) {

        $scope.maisOp = false;
        $scope.habilita = [];
        $scope.habilita.hora = false;
        $scope.habilita.km = false;

        // Cálculo de Horas/Km
        $scope.calcula = function(){

            if($scope.campo.horaini && $scope.campo.horafim){

                var hours = (Math.abs($scope.campo.horafim - $scope.campo.horaini) / 36e5).toFixed(2);
                $scope.campo.htotal = parseFloat(hours);

            }

            if($scope.campo.kmini && $scope.campo.kmfim){

                var km = ($scope.campo.kmfim - $scope.campo.kmini).toFixed(2);
                $scope.campo.kmtotal = parseFloat(km);

            }

        };


        // Pega último Km
        function ultKm(item){

            $scope.campo.kmini = undefined;
            $scope.habilita.hora = ($scope.campo.forma.indexOf("H") != -1);
            $scope.habilita.km = ($scope.campo.forma.indexOf("K") != -1);


            if($scope.habilita.km){
                var lnc = new Date(0);
                var final;

                for(var i = 0; i < $scope.todos.listControle.length; i++){

                    if($scope.todos.listControle[i].ativo === item.ativo && $scope.todos.listControle[i].ctl === "equip"){

                        var cg = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf($scope.todos.listControle[i].categ);

                        if(cg != -1){

                            if($scope.itemTipo.tipo[cg].zera){
                                $scope.campo.kmini = 0;
                            }else{
                                var dt = $scope.zeraHora($scope.todos.listControle[i].data);

                                lnc = (dt > lnc) ? dt : lnc;

                                if(lnc === dt){
                                    final = i;
                                }
                            }

                        }

                    }

                }

                if(final){
                    $scope.campo.kmini = $scope.todos.listControle[final].kmfim;
                }

            }

        }

        if(!$scope.campo._id){
            ultKm($scope.campo);
        }else{
            $scope.habilita.hora = ($scope.campo.forma.indexOf("H") != -1);
            $scope.habilita.km = ($scope.campo.forma.indexOf("K") != -1);
        }

        $scope.$on("reloadHorakm", function(){
            ultKm($scope.campo);
        });

    })


    // CONTROLLER FILHO - CONTROLE DE COMBUSTÍVEL
    .controller("combusCtl", function($scope) {

        $scope.maisOp = false;
        $scope.erroAbastecido = false;


        //Verifica se Abastecido tem Capacidade
        function verificaAbastecido(item){

            $scope.erroAbastecido = false;

            var a = $scope.todos.ativos.map(function(e){ return e.id;}).indexOf(item.abastecido);

            if( a != -1 && $scope.todos.ativos[a].capacidade){

                var ent = 0, sai = 0;

                // Pega Entradas e Saídas
                angular.forEach($scope.todos.listControle, function(vl){

                    if(vl.ctl === 'abast'){

                        if(vl.abastecido === item.abastecido){
                            ent += vl.quant;
                        }else if(vl.ativo === item.abastecido){
                            sai += vl.quant;
                        }

                    }

                });

                var tot = ent - sai;

                if(tot + parseFloat(item.quant) > $scope.todos.ativos[a].capacidade){
                    $scope.erroAbastecido = true;
                }

            }

        }


        // Cálculo de Quantidade de Litros
        $scope.calcula = function(){

            if( ($scope.campo.processo === 'S'|| $scope.campo.processo === 'A') && !$scope.semSaldo){

                if($scope.campo.bombaini && $scope.campo.bombafim){

                    var km = ($scope.campo.bombafim - $scope.campo.bombaini).toFixed(2);

                    $scope.campo.quant = parseFloat(km);

                    if($scope.campo.processo === 'S'){
                        $scope.saldo.futuro = (parseFloat($scope.saldo.atual) - $scope.campo.quant).toFixed(2);
                    }else{
                        $scope.saldo.futuro = parseFloat($scope.saldo.atual);
                    }

                    if($scope.campo.produto){

                        var pr = $scope.desc.produtos.map(function(e){ return e._id; }).indexOf($scope.campo.produto);

                        if(pr != -1){
                            $scope.desc.valorTotal = $scope.desc.produtos[pr].valor * $scope.campo.quant;
                        }

                    }

                }

            }else{

                if($scope.ehTanque){

                    if($scope.campo.quant && $scope.campo.vlunit){

                        var qt = parseFloat($scope.campo.quant);

                        $scope.desc.valorTotal = $scope.campo.vlunit * qt;

                        $scope.saldo.futuro = (parseFloat($scope.saldo.atual) + qt).toFixed(2);

                    }

                }else{

                    if($scope.campo.quant && $scope.campo.produto){

                        var p = $scope.desc.produtos.map(function(e){ return e._id; }).indexOf($scope.campo.produto);

                        if(p != -1){
                            $scope.desc.valorTotal = $scope.desc.produtos[p].valor * $scope.campo.quant;
                            $scope.saldo.futuro = (parseFloat($scope.saldo.atual) + $scope.campo.quant).toFixed(2);
                        }

                    }

                }

            }


            if($scope.campo.abastecido && $scope.campo.quant && $scope.campo.processo == 'S') {
                verificaAbastecido($scope.campo);
            }

        };


        // Pega último valor da bomba
        function ultBomba(item){

            // Reseta Campos
            $scope.campo.bombaini = undefined;
            $scope.campo.bombafim = undefined;
            $scope.campo.quant = undefined;
            $scope.campo.produto = undefined;
            $scope.campo.abastecido = undefined;
            $scope.campo.kmabastecido = undefined;
            $scope.campo.cheio = false;
            $scope.campo.custos = undefined;
            $scope.campo.obs = undefined;
            $scope.desc.valorTotal = undefined;
            $scope.saldo.futuro = 0;

            if($scope.tmpProd){
                $scope.campo.produto = $scope.tmpProd;

                if(!$scope.ehTanque && !$scope.ehMelosa){
                    $scope.campo.processo = 'S';
                }
            }

            var cg = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf(item.categ);

            if(cg != -1) {

                if ($scope.itemTipo.tipo[cg].zera) {
                    $scope.campo.bombaini = 0;
                }

                if ($scope.itemTipo.tipo[cg].capacidade) {

                    var t = $scope.todos.ativos.map(function(e){ return e.id; }).indexOf(item.ativo);

                    if(t != -1){
                        $scope.saldo.capacidade = $scope.todos.ativos[t].capacidade;
                    }

                }
            }

            var lnc = new Date(0);
            var final;

            var ent = 0, sai = 0;

            // Pega Entradas
            if(!$scope.ehTanque) {

                angular.forEach($scope.todos.listControle, function(vl){

                    if(vl.ctl === 'abast' && vl.abastecido === item.ativo){
                        ent += vl.quant;
                    }

                });

            }else{

                angular.forEach($scope.todos.listControle, function(vl){

                    if(vl.ctl === 'abast' && vl.ativo === item.ativo && vl.processo === 'E'){
                        ent += vl.quant;
                    }

                });

            }

            // Pega Saídas
            for(var i = 0; i < $scope.todos.listControle.length; i++){

                if($scope.todos.listControle[i].ativo === item.ativo && $scope.todos.listControle[i].ctl === 'abast'){

                    if($scope.todos.listControle[i].processo === 'S'){

                        if(!$scope.campo.bombaini){
                            var dt = $scope.zeraHora($scope.todos.listControle[i].data);
                            var hr = new Date($scope.todos.listControle[i].hora);

                            dt.setHours(hr.getHours());
                            dt.setMinutes(hr.getMinutes());

                            lnc = (dt > lnc) ? dt : lnc;

                            if(lnc === dt){
                                final = i;
                            }
                        }

                        sai += $scope.todos.listControle[i].quant;

                    }
                }

            }

            var tot = ent - sai;

            $scope.saldo.atual = tot.toFixed(2);

            if(final){
                $scope.campo.bombaini = angular.copy($scope.todos.listControle[final].bombafim);
            }


            if(tot <= 0 && $scope.ehTanque){
                $scope.campo.processo = 'E';
                $scope.info($scope.campo);
            }

        }

        if(!$scope.campo._id && !$scope.semSaldo){
            ultBomba($scope.campo);
        }

        $scope.$on("reloadCombus", function(){
            ultBomba($scope.campo);
        });

    });
