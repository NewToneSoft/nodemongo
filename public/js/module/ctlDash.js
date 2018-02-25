/*
 controller de Dashboard v1.0
 2016 Nilton Cruz
 */

"use strict";

app

    // CONTROLLER DE DASHBOARD
    .controller("dashCtl", function ($scope, $window, $uibModal) {

        // Ajusta o tamanho da área do Dashboard
        angular.element( document.querySelector( '.areaDrop' )).css('height', ($window.innerHeight - 200) + "px");

        $scope.abas = [];
        $scope.abas.widgets = [];

        $scope.periodo = [];
        $scope.periodo.data = $scope.zeraHora();
        $scope.periodo.str = ($scope.lang.actual === 'pt') ?
        $scope.pegaMes[$scope.periodo.data.getMonth()].mes + "/" + $scope.periodo.data.getFullYear().toString().substr(2,2) :
        $scope.pegaMes[$scope.periodo.data.getMonth()].month + "/" + $scope.periodo.data.getFullYear().toString().substr(2,2);
        $scope.periodo.atras = true;
        $scope.periodo.frente = false;

        /* FUNÇÕES DE GRÁFICOS / INFOS */

        // Resumo de Logística
        function resumoLog(item){
            $scope.dash.areas[item].infos = [];
            $scope.dash.areas[item].infos.resumo = angular.copy($scope.todos.saidas);
            $scope.dash.areas[item].infos.transp = 0;
            $scope.dash.areas[item].infos.recebe = 0;
            $scope.dash.widgets[5].data = {};
            $scope.dash.widgets[5].data.labels = [];
            $scope.dash.widgets[5].data.datasets = [{
                label: ($scope.lang.actual === 'pt') ? 'Tons/Dia': 'Tons/Day',
                backgroundColor: 'rgba(53, 152, 220, 0.2)',
                borderColor: 'rgba(53, 152, 220, 1)',
                data: []
            }];

            angular.forEach($scope.dash.areas[item].infos.resumo, function(vl){

                var qt = vl.peso;
                var dtTeste = new Date(vl.data);

                angular.forEach($scope.todos.ajustes, function(v){
                    var dtt = new Date(v.data);

                    if(dtTeste.getMonth() === dtt.getMonth() &&
                        dtTeste.getFullYear() === dtt.getFullYear()){
                        qt += (qt * (v.percentual / 100));
                    }

                });

                if(vl.chegou){
                    $scope.dash.areas[item].infos.recebe += qt;
                }else{
                    $scope.dash.areas[item].infos.transp += qt;
                }

                // Pega Descrição
                angular.forEach($scope.todos.ativos, function(val){

                    if(val.id === vl.ativo){

                        vl.ativoStr = val.placa;

                        var desc = "";

                        var fn = $scope.todos.forn.map(function(e){ return e._id; }).indexOf(val.forn);

                        if(fn != -1){
                            desc = $scope.todos.forn[fn].nome + " - ";
                        }

                        vl.descricao = desc + val.nome;
                        vl.descricao = vl.descricao.toUpperCase();

                    }

                });


                // Prepara Gráfico
                var dat = dtTeste.toLocaleDateString();

                var idx = $scope.dash.widgets[5].data.labels.indexOf(dat);

                if(idx == -1){
                    $scope.dash.widgets[5].data.labels.push(dat);
                    $scope.dash.widgets[5].data.datasets[0].data.push(qt);
                }else{
                    $scope.dash.widgets[5].data.datasets[0].data[idx] += qt;
                }

            });

            $scope.dash.areas[item].infos.resumo.sort(function(a, b){
                var dateA = $scope.zeraHora(a.data),
                    dateB = $scope.zeraHora(b.data);

                return dateB - dateA;
            });

        }

        // Resumo de Abastecimentos
        function resumoAbast(item){

            $scope.dash.areas[item].infos = [];
            $scope.dash.widgets[2].data = {};
            $scope.dash.widgets[2].data.labels = [];
            $scope.dash.widgets[2].data.datasets = [{
                label: ($scope.lang.actual === 'pt') ? 'Litros/Mês': 'Liters/Month',
                backgroundColor: 'rgba(50, 197, 210, 0.2)',
                borderColor: 'rgba(50, 197, 210, 1)',
                data: []
            }];

            var tmpAtivos = [];

            var tmpResumo = [];

            var dtAtual = $scope.zeraHora();

            var ultDt = new Date(0);

            // Pega Ativos
            angular.forEach($scope.todos.ativos, function(vl){

                var t = $scope.todos.contrato.map(function(e){ return e._id; }).indexOf(vl.contrato);

                if(t != -1){

                    if($scope.todos.contrato[t].tipo != "pst"){

                        var m = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf($scope.todos.contrato[t].tipo);

                        if(m != -1 && $scope.itemTipo.tipo[m].categ === 'abast'){

                            var dtCtIni = $scope.zeraHora($scope.todos.contrato[t].dataini),
                                dtCtFim = $scope.zeraHora($scope.todos.contrato[t].datafim);

                            if(dtAtual >= dtCtIni && dtAtual <= dtCtFim){
                                this.push(vl);
                            }

                        }

                    }

                }

            }, tmpAtivos);

            // Pega Quantidades
            if(tmpAtivos.length > 0){

                var gEnt = 0, gSai = 0;

                angular.forEach(tmpAtivos, function(val){

                    var ent = 0, sai = 0, res = [];

                    angular.forEach($scope.todos.listControle, function(vl){

                        if(vl.ctl === 'abast'){

                            // Pega Entradas
                            if(val.tipo != 'tnq'){

                                if(vl.abastecido === val.id){
                                    ent += vl.quant;

                                    var t = res.map(function(e){ return e.data }).indexOf(vl.dataBr);

                                    if(t != -1){

                                        res[t].entrada += vl.quant;

                                    }else{

                                        res.push({
                                            data: vl.dataBr,
                                            dataOrig: vl.data,
                                            entrada: vl.quant,
                                            saida: 0
                                        });

                                    }

                                }

                            }else{

                                if(vl.processo === 'E' && vl.ativo === val.id){
                                    ent += vl.quant;

                                    var t2 = res.map(function(e){ return e.data }).indexOf(vl.dataBr);

                                    if(t2 != -1){

                                        res[t2].entrada += vl.quant;

                                    }else{

                                        res.push({
                                            data: vl.dataBr,
                                            dataOrig: vl.data,
                                            entrada: vl.quant,
                                            saida: 0
                                        });

                                    }
                                }

                            }

                            // Pega Saídas
                            if(vl.processo === 'S' && vl.ativo === val.id){

                                sai += vl.quant;

                                var t3 = res.map(function(e){ return e.data }).indexOf(vl.dataBr);

                                if(t3 != -1){

                                    res[t3].saida += vl.quant;

                                }else{

                                    res.push({
                                        data: vl.dataBr,
                                        dataOrig: vl.data,
                                        entrada: 0,
                                        saida: vl.quant
                                    });

                                }

                            }

                        }



                    });

                    if(ent > 0 || sai > 0){

                        gEnt += ent;
                        gSai += sai;

                        // Organiza Resumo
                        res.sort(function(a, b){
                            var dateA = $scope.zeraHora(a.dataOrig),
                                dateB = $scope.zeraHora(b.dataOrig);

                            return dateA - dateB;
                        });

                        angular.forEach(res, function(vl, idx){

                            if(idx > 0){
                                vl.saldo = (res[idx-1].saldo + vl.entrada) - vl.saida;
                            }else{
                                vl.saldo = vl.entrada - vl.saida;
                            }

                            var dtO = $scope.zeraHora(vl.dataOrig);

                            if(dtO > ultDt){
                                ultDt = dtO;
                            }
                            tmpResumo.push(vl);
                        });

                        this.push({
                            nome: val.nome,
                            entrada: ent,
                            saida: sai,
                            saldo: (ent - sai),
                            resumo: res
                        });

                    }

                }, $scope.dash.areas[item].infos);

                $scope.dash.areas[item].infos.push({
                    nome: ($scope.lang.actual === 'pt') ? 'TOTAIS': 'TOTALS',
                    entrada: gEnt,
                    saida: gSai,
                    saldo: (gEnt - gSai),
                    ultData : ultDt.toLocaleDateString()
                });

                tmpResumo.sort(function(a, b){
                    var dateA = $scope.zeraHora(a.dataOrig),
                        dateB = $scope.zeraHora(b.dataOrig);

                    return dateA - dateB;
                });

                angular.forEach(tmpResumo, function(vl){

                    var d = $scope.zeraHora(vl.dataOrig);

                    var dat = ($scope.lang.actual === 'pt') ?
                    $scope.pegaMes[d.getMonth()].mes + "/" + d.getFullYear().toString().substr(2,2) :
                    $scope.pegaMes[d.getMonth()].month + "/" + d.getFullYear().toString().substr(2,2);

                    var idx = $scope.dash.widgets[2].data.labels.indexOf(dat);

                    if(idx == -1){
                        $scope.dash.widgets[2].data.labels.push(dat);
                        $scope.dash.widgets[2].data.datasets[0].data.push(vl.saida);
                    }else{
                        $scope.dash.widgets[2].data.datasets[0].data[idx] += vl.saida;
                    }

                });

            }

        }

        // Resumo de Locações
        function resumoLocacao(item){

            $scope.dash.areas[item].infos = [];

            var tmpAtivos = [];

            // Pega Ativos
            angular.forEach($scope.todos.ativos, function(vl){

                var t = $scope.todos.contrato.map(function(e){ return e._id; }).indexOf(vl.contrato);

                if(t != -1){

                    var m = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf($scope.todos.contrato[t].tipo);

                    if(m != -1 && $scope.itemTipo.tipo[m].categ === 'equip'){

                        var dtCtIni = $scope.zeraHora($scope.todos.contrato[t].dataini),
                            dtCtFim = $scope.zeraHora($scope.todos.contrato[t].datafim);

                        if($scope.periodo.data >= dtCtIni && $scope.periodo.data <= dtCtFim){

                            if(vl.formaMedicao){

                                if(vl.formaMedicao.forma != 'T'){
                                    this.push(vl);
                                }

                            }else{
                                this.push(vl);
                            }

                        }

                    }

                }

            }, tmpAtivos);


            // Pega Quantidades
            if(tmpAtivos.length > 0){

                angular.forEach(tmpAtivos, function(val){

                    var trab = 0, gar = 0, dies = 0, res = [];

                    // Pega Valor da Garantia
                    var gmin = (val.gmin) ? val.gmin : 200;
                    var dtIni = new Date($scope.periodo.data.getFullYear(), $scope.periodo.data.getMonth(), 1);
                    var dtFim = new Date($scope.periodo.data.getFullYear(), $scope.periodo.data.getMonth() + 1, 0);
                    dtIni = $scope.zeraHora(dtIni);
                    dtFim = $scope.zeraHora(dtFim);
                    var difer = Math.abs(dtFim.getTime() - dtIni.getTime());
                    var dias = Math.ceil(difer / (1000 * 3600 * 24)) + 1;
                    var diaGmin = gmin / dias;


                    // Pega Lançamentos
                    angular.forEach($scope.todos.listControle, function(vl){

                        if(vl.ctl === 'equip' && vl.ativo === val.id){

                            var dt = $scope.zeraHora(vl.data);

                            if(dt.getMonth() === $scope.periodo.data.getMonth() && dt.getFullYear() === $scope.periodo.data.getFullYear() ){

                                var ini, fim;

                                if(vl.categ === 'maq'){
                                    ini = vl.hini;
                                    fim = vl.hfim;
                                }else{
                                    var ti = new Date(vl.horaini);
                                    var tf = new Date(vl.horafim);

                                    ini = ti.toLocaleTimeString().substr(0,5);
                                    fim = tf.toLocaleTimeString().substr(0,5);

                                }

                                var s = $scope.todos.status.map(function(e){ return e._id; }).indexOf(vl.status);
                                var valorGmin = 0;
                                var st, at;

                                // Pega Status
                                if(s != -1){

                                    st = $scope.todos.status[s].nome;

                                    if($scope.todos.status[s].debito === "E"){
                                        valorGmin = diaGmin;
                                    }else if($scope.todos.status[s].debito === "A"){
                                        valorGmin = diaGmin / 2;
                                    }else{

                                        if(vl.htotal > (diaGmin / 2)){
                                            valorGmin = (vl.htotal > diaGmin) ? diaGmin : vl.htotal;
                                        }

                                    }

                                }

                                // Pega Atividade
                                var a = $scope.todos.atividade.map(function(e){ return e._id; }).indexOf(vl.atividade);

                                if(a != -1){
                                    at = $scope.todos.atividade[a].nome;
                                }

                                // Verifica se já existe lançamento
                                var ox = res.map(function(e){ return e.data; }).indexOf(vl.dataBr);

                                if(ox != -1){

                                    res[ox].inicio = ini;
                                    res[ox].final = fim;
                                    res[ox].trab = vl.htotal;
                                    res[ox].gar = valorGmin;
                                    res[ox].status = st;
                                    res[ox].atividade = at;
                                    res[ox].porHora = (res[ox].diesel / vl.htotal).toFixed(1);

                                }else{

                                    res.push({
                                        data: vl.dataBr,
                                        dataOrig: vl.data,
                                        inicio: ini,
                                        final: fim,
                                        trab: vl.htotal,
                                        gar: valorGmin,
                                        status: st,
                                        atividade: at,
                                        diesel: 0,
                                        porHora: 0
                                    });

                                }

                                trab += vl.htotal;
                                gar += valorGmin;

                            }

                        }


                        // Pega consumo de diesel
                        if(vl.ctl === 'abast' && vl.processo === 'S' && vl.abastecido.toUpperCase() === val.id.toUpperCase() && vl.quant){

                            var dtTeste = $scope.zeraHora(vl.data);

                            if(dtTeste.getMonth() === $scope.periodo.data.getMonth() && dtTeste.getFullYear() === $scope.periodo.data.getFullYear() ){

                                var idx = res.map(function(e){ return e.data; }).indexOf(dtTeste.toLocaleDateString());

                                if(idx != -1){

                                    res[idx].diesel += vl.quant;

                                    if(res[idx].htotal){
                                        res[idx].porHora = (res[idx].diesel / res[idx].htotal).toFixed(1);
                                    }

                                }else{

                                    res.push({
                                        data: vl.dataBr,
                                        dataOrig: vl.data,
                                        diesel: vl.quant,
                                        porHora: 0
                                    });

                                }

                                dies += vl.quant;

                            }

                        }

                    });

                    if(trab > 0 || gar > 0){

                        // Organiza Resumo
                        res.sort(function(a, b){
                            var dateA = $scope.zeraHora(a.dataOrig),
                                dateB = $scope.zeraHora(b.dataOrig);

                            return dateA - dateB;
                        });

                        this.push({
                            cod: val.nome,
                            descricao: val.descricao,
                            ht: trab,
                            hg: gar,
                            ds: dies,
                            resumo: res
                        });

                    }

                }, $scope.dash.areas[item].infos);

                // Ordena Alfabeticamente
                $scope.dash.areas[item].infos.sort(function(a, b){
                    var nameA = a.cod.toLowerCase(), nameB = b.cod.toLowerCase();
                    if (nameA < nameB)
                        return -1;
                    if (nameA > nameB)
                        return 1;
                    return 0;
                });

            }

        }

        /* FINAL - FUNÇÕES DE GRÁFICOS / INFOS */

        // Executa as Funções
        $scope.fazFunc = function(item){

            switch (item){

                case 'log':
                    resumoLog(item);
                    break;

                case 'abast':
                    resumoAbast(item);
                    break;

                case 'locacao':
                    resumoLocacao(item);
                    break;

            }

        };


        // Fecha Modal
        var modalController = function ($scope, $uibModalInstance, atual, lang) {

            if(atual){
                $scope.campo = atual;
            }

            $scope.lang = lang;

            $scope.cancel = function () {
                $uibModalInstance.close();
            };

            $scope.mudaAba = function(item){
                $uibModalInstance.close(item);
            }

        };

        // Abre Modal de Dash
        $scope.abreModal = function(link, b, item, tam){

            var atual;

            if(item){
                atual = item;
            }

            if(!b){
                var md = $uibModal.open({
                    templateUrl: link,
                    controller: modalController,
                    size: tam,
                    resolve: {
                        atual: function () {
                            return atual;
                        },
                        lang: function () {
                            return $scope.lang;
                        }
                    }

                });

                md.result.then(function(id){
                    if(id){
                        $scope.abas.tabAtual = id;
                        $scope.abaAtual(id);
                    }
                });
            }

        };


        // Pega Widgets Específicos de Cada Aba
        $scope.abaAtual = function(item){

            $scope.abas.widgets = [];

            angular.forEach($scope.dash.widgets, function(vl){

                if(vl.categ === item){

                    if(!$scope.usuario.visitor){
                        this.push(vl);
                    }else{
                        if(vl.id != "AB0"){
                            this.push(vl);
                        }
                    }

                }

            }, $scope.abas.widgets);

        };


        // Altera Período do Resumo
        $scope.mudaPeriodo = function(b, item){

            var hoje = new Date();

            if(b){
                $scope.periodo.data.setMonth($scope.periodo.data.getMonth() - 1);
            }else{
                $scope.periodo.data.setMonth($scope.periodo.data.getMonth() + 1);
            }

            $scope.periodo.str = ($scope.lang.actual === 'pt') ?
            $scope.pegaMes[$scope.periodo.data.getMonth()].mes + "/" + $scope.periodo.data.getFullYear().toString().substr(2,2) :
            $scope.pegaMes[$scope.periodo.data.getMonth()].month + "/" + $scope.periodo.data.getFullYear().toString().substr(2,2);

            var atras = $scope.zeraHora($scope.periodo.data), frente = $scope.zeraHora($scope.periodo.data);
            atras.setMonth(atras.getMonth() - 1);
            frente.setMonth(frente.getMonth() + 1);

            $scope.periodo.atras = (atras.getFullYear() >= 2016);
            $scope.periodo.frente = (frente.getMonth() <= hoje.getMonth());

            $scope.fazFunc(item);

        };


        // Inicializa Gráficos
        angular.forEach($scope.dash.areas, function(vl, id){

            if(!$scope.usuario.visitor){
                $scope.fazFunc(id);
            }else{
                if(vl.id == 'main' || vl.id == 'log'){
                    $scope.fazFunc(id);
                }else{
                    vl.visible = false;
                }
            }

        });

        $scope.abaAtual('main');

        $scope.$on("mudaIdioma", function(){
            angular.forEach($scope.dash.areas, function(vl, id){

                if(!$scope.usuario.visitor){
                    $scope.fazFunc(id);
                }else{
                    if(vl.id == 'main' || vl.id == 'log'){
                        $scope.fazFunc(id);
                    }else{
                        vl.visible = false;
                    }
                }

            });

            $scope.abaAtual($scope.abas.tabAtual);

            $scope.verifica.loading = false;

        });

        // VERIFICAR SE O USUÁRIO ALTEROU O DEFAULT

    });