/*
 controller de Medições v1.0
 2016 Nilton Cruz
 */

"use strict";

app

    // CONTROLLER MEDIÇÕES - BASE
    .controller("medCtl", function($scope, $q, dtBase, inicia){

        $scope.ativa('med');

        var dbs = "medicoes";

        $scope.medidor = [];
        $scope.medidor.gerado = false;
        $scope.medidor.emitido = false;
        $scope.medidor.busca = "forn";
        $scope.medidor.tipo = "mes";
        $scope.medidor.carouselIndex = 0;
        $scope.slides = [];
        var resumoEquips = [];
        var debCreds = [];
        var tmpItens = [];
        var campo = angular.copy(new dtBase({db: dbs}));
        $scope.tmpLista = [];
        $scope.tmpAtivos = [];
        $scope.bloqueia = false;

        var dt = new Date();

        $scope.medidor.fMes = dt.getMonth();
        $scope.medidor.fAno = dt.getFullYear();
        $scope.medidor.dataini = new Date(dt.getFullYear(), dt.getMonth(), 1);
        $scope.medidor.datafim = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
        /*$scope.medidor.datamax = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);*/

        // Limpa Pesquisa
        $scope.limpaInput = function(){
            $scope.medidor.forn = '';
            $scope.medidor.gerado = false;
        };

        //DatePicker
        $scope.picker = {abreIni: false, abreFim: false};

        $scope.abrePicker = function(b){

            if(b){
                $scope.picker.abreIni = true;
            }else{
                $scope.picker.abreFim = true;
            }

        };


        /* FUNÇÕES DE FORMULÁRIOS */

        // 0 - FORMULÁRIO - OBSERVAÇÕES
        function geraFormObs(item, obs){

            var novo = [];
            novo.id = item.id;
            novo.form = item.form;
            novo.nome = item.nome + "_obs";
            novo.formaMed = item.formaMed;
            novo.empresa = item.empresa;
            novo.medicao = item.medicao;
            novo.medicao2 = item.medicao2;
            novo.dataImp = item.dataImp;
            novo.chk = item.chk;
            novo.contrato = item.contrato;
            novo.atual = [];
            novo.atual.pageId = item.atual.nome + " - OBS.";
            novo.atual.nome = item.atual.nome;
            novo.atual.tipo = item.atual.tipo;
            novo.atual.descricao = item.atual.descricao;
            novo.atual.contrato = item.atual.contrato;
            novo.atual.data = item.atual.data;
            novo.atual.valor = item.atual.valor;
            novo.valorDC = item.valorDC;
            novo.valorTotal = item.valorTotal;
            novo.fecha = "partial/medicoes/formobs.html";
            novo.observa = obs;

            $scope.slides.push(novo);

        }

        // 1 - CAPA
        function geraCapa(item){

            var f = $scope.todos.forn.map(function (e){ return e.nome; }).indexOf($scope.medidor.forn);

            if(f != -1){

                item.fornece = angular.copy($scope.todos.forn[f]);

                if(item.fornece.pagamento){

                    var pag = "";

                    switch (item.fornece.pagamento){

                        case "V":

                            pag = "À VISTA";
                            break;

                        case "C":

                            pag = "CHEQUE";
                            break;

                        case "D":

                            pag = "DEPÓSITO";
                            break;

                        case "B":

                            pag = "BOLETO";
                            break;

                    }

                    item.fornece.formaPg = pag;

                }

                if($scope.medidor.tipo === 'mes'){
                    item.inicio = new Date($scope.medidor.fAno, $scope.medidor.fMes, 1);
                    item.final = new Date($scope.medidor.fAno, item.inicio.getMonth() + 1, 0);
                }else{
                    item.inicio = new Date($scope.medidor.dataini);
                    item.final = new Date($scope.medidor.datafim);
                }

                $scope.bloqueia = $scope.zeraHora(dt) < $scope.zeraHora(item.inicio);

                // Equipamentos
                item.equips = resumoEquips;

                item.valorMedicao = 0;

                angular.forEach(item.equips, function(v, i){
                    item.valorMedicao += v.valorTotal;
                });

                // Débitos/Créditos
                item.debcreds = debCreds;

                item.valorDebcred = 0;

                angular.forEach(item.debcreds, function(v, i){
                    item.valorDebcred += v.valor;
                });

            }

        }

        // 2 - FORMULÁRIO - HORÍMETRO
        function geraFormHorim(item){

            var t = $scope.todos.ativos.map(function(e){ return e.id; }).indexOf(item.id);

            if(t != -1){

                item.atual = [];

                // DADOS EQUIPAMENTO
                item.atual.pageId = $scope.todos.ativos[t].nome.toUpperCase();
                item.atual.nome = $scope.todos.ativos[t].nome.toUpperCase();
                item.atual.descricao = $scope.todos.ativos[t].descricao.toUpperCase();
                item.atual.valor = $scope.todos.ativos[t].valor;
                item.atual.gmin = ($scope.todos.ativos[t].gmin) ? $scope.todos.ativos[t].gmin : 200;

                var tp = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf($scope.todos.ativos[t].tipo);

                if(tp != -1){
                    item.atual.tipo = $scope.itemTipo.tipo[tp].nome.toUpperCase();
                }

                var descontaDiesel = false;
                var ct = $scope.todos.contrato.map(function(e){ return e._id; }).indexOf($scope.todos.ativos[t].contrato);

                if(ct != -1){
                    item.atual.contrato = $scope.todos.contrato[ct].nome.toUpperCase();

                    var dt = $scope.zeraHora($scope.todos.contrato[ct].dataini);

                    item.atual.data = dt.toLocaleDateString();

                    descontaDiesel = ($scope.todos.contrato[ct].combus === 'L');
                }
                // FINAL DADOS EQUIPAMENTO


                // DIAS TRABALHADOS
                var ini, fim;
                var semana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

                if($scope.medidor.tipo === 'mes'){
                    ini = new Date($scope.medidor.fAno, $scope.medidor.fMes, 1);
                    fim = new Date($scope.medidor.fAno, ini.getMonth() + 1, 0);

                    ini = $scope.zeraHora(ini);
                    fim = $scope.zeraHora(fim);

                    var difer = Math.abs(fim.getTime() - ini.getTime());
                    item.dias = Math.ceil(difer / (1000 * 3600 * 24)) + 1;
                }else{
                    ini = new Date($scope.medidor.dataini);
                    fim = new Date($scope.medidor.datafim);

                    ini = $scope.zeraHora(ini);
                    fim = $scope.zeraHora(fim);

                    var fim2 = new Date(ini.getFullYear(), ini.getMonth() + 1, 0);

                    var difer1 = Math.abs(fim2.getTime() - ini.getTime());
                    item.dias = Math.ceil(difer1 / (1000 * 3600 * 24)) + 1;
                }


                // Valor da Garantia por Dia
                var diaGmin = item.atual.gmin / item.dias;
                item.valorHora = item.atual.valor / item.atual.gmin;
                item.valorDiaria = item.atual.valor / item.dias;

                item.diasTrab = 0;
                item.hTrab = 0;
                item.hGarant = 0;
                item.consumo = 0;
                item.valorDC = 0;

                item.trabalho = [];
                var tmpObs = [];

                for(var i = 0; i < $scope.todos.listControle.length; i++){

                    var dtCt = $scope.zeraHora($scope.todos.listControle[i].data);

                    if($scope.todos.listControle[i].ctl === "equip"
                        && item.id === $scope.todos.listControle[i].ativo
                        && ( (dtCt >= ini && dtCt <= fim)
                        || dtCt.toLocaleDateString() === ini.toLocaleDateString()
                        || dtCt.toLocaleDateString() === fim.toLocaleDateString() )){

                        var debito;

                        // Pega Status
                        var st;
                        var s = $scope.todos.status.map(function(e){ return e._id; }).indexOf($scope.todos.listControle[i].status);

                        if(s != -1){
                            st = $scope.todos.status[s].nome;
                            debito = $scope.todos.status[s].debito;
                        }

                        // Pega Atividade
                        var at;
                        var a = $scope.todos.atividade.map(function(e){ return e._id; }).indexOf($scope.todos.listControle[i].atividade);

                        if(a != -1){
                            at = $scope.todos.atividade[a].nome;
                        }

                        // Pega valor da garantia no dia
                        var valorGmin, qtDiesel = 0;

                        // Pega consumo de diesel / débito e crédito
                        angular.forEach($scope.todos.listControle, function(vl){

                            var dtTeste = $scope.zeraHora(vl.data);

                            // Pega consumo de diesel
                            if(vl.ctl === 'abast' && vl.processo === 'S'
                                && dtTeste.toLocaleDateString() === dtCt.toLocaleDateString()
                                && vl.abastecido === item.id){

                                qtDiesel = vl.quant;

                                if(descontaDiesel){

                                    var vld, dtComp;

                                    switch (vl.categ){

                                        case "pst":

                                            var t = $scope.todos.contrato.map(function(e){ return e.nome; }).indexOf(vl.ativo);

                                            if(t != -1){
                                                dtComp = new Date(0);

                                                angular.forEach($scope.todos.contrato[t].ativos, function(val){

                                                    if(val.produto === vl.produto){

                                                        var dat = $scope.zeraHora(val.data);

                                                        if( (ini >= dat && dat <= fim) && (dat > dtComp && dat < dtTeste) ){
                                                            dtComp = dat;
                                                            vld = val.valor;
                                                        }

                                                    }

                                                });
                                            }

                                            break;

                                        default:

                                            dtComp = new Date(0);

                                            angular.forEach($scope.todos.listControle, function(val){

                                                if(vl.ativo === val.ativo &&
                                                    vl.ctl === 'abast' &&
                                                    vl.processo === 'E' &&
                                                    val.produto === vl.produto){

                                                    var dat = $scope.zeraHora(val.data);

                                                    if( (ini >= dat && dat <= fim) && (dat > dtComp && dat < dtTeste) ){
                                                        dtComp = dat;
                                                        vld = val.valor;
                                                    }

                                                }

                                            });

                                            break;
                                    }

                                    if(vld){

                                        item.valorDC += ((vld * qtDiesel) * -1);

                                        debCreds.push({
                                            data: vl.dataBr,
                                            ativo: item.equip,
                                            descricao: item.equip + " - Abastecimento",
                                            valor: ( (vld * qtDiesel) * -1)
                                        });
                                    }
                                }
                            }

                            // Pega débito/crédito
                            if(vl.ctl === 'debcred'
                                && dtTeste.toLocaleDateString() === dtCt.toLocaleDateString()
                                && vl.ativo === item.id){

                                var vlr = (vl.tipo === 'D') ? (vl.valor * -1) : vl.valor;

                                item.valorDC += vlr;

                                debCreds.push({
                                    data: vl.dataBr,
                                    ativo: vl.ativo,
                                    descricao: vl.ativo + " - " + vl.descricao,
                                    valor: vlr
                                })
                            }

                        });

                        if(debito === "E"){
                            valorGmin = diaGmin;
                            item.diasTrab++;
                        }else if(debito === "A"){
                            valorGmin = diaGmin / 2;
                            item.diasTrab++;
                        }else{

                            if($scope.todos.listControle[i].htotal > (diaGmin / 2)){
                                valorGmin = ($scope.todos.listControle[i].htotal > diaGmin) ? diaGmin : $scope.todos.listControle[i].htotal;
                            }else{
                                valorGmin = 0;
                            }

                        }

                        item.trabalho.push({
                            dataOrig: dtCt,
                            data: dtCt.toLocaleDateString(),
                            semana: semana[dtCt.getDay()],
                            hini: $scope.todos.listControle[i].hini,
                            hfim: $scope.todos.listControle[i].hfim,
                            htotal: $scope.todos.listControle[i].htotal,
                            gmin: valorGmin.toFixed(2),
                            diaria: (valorGmin === 0) ? 0 : item.valorDiaria,
                            diesel: (qtDiesel != 0) ? qtDiesel : "",
                            status: st,
                            atividade: at
                        });

                        item.hTrab += $scope.todos.listControle[i].htotal;
                        item.hGarant += valorGmin;
                        item.consumo += qtDiesel;

                        // Verfica se há Observações
                        if($scope.todos.listControle[i].obs){
                            tmpObs.push({
                                dataOrig: dtCt,
                                data: dtCt.toLocaleDateString(),
                                semana: semana[dtCt.getDay()],
                                hini: $scope.todos.listControle[i].hini,
                                hfim: $scope.todos.listControle[i].hfim,
                                htotal: $scope.todos.listControle[i].htotal,
                                gmin: valorGmin.toFixed(2),
                                diaria: (valorGmin === 0) ? 0 : (debito === "A") ? item.valorDiaria/2 : item.valorDiaria,
                                diesel: (qtDiesel != 0) ? qtDiesel : "",
                                status: st,
                                atividade: at,
                                obs: $scope.todos.listControle[i].obs
                            });
                        }

                    }

                }

                if(item.trabalho.length > 0){

                    // Organiza Lançamentos
                    item.trabalho.sort(function(a, b){
                        var dateA = $scope.zeraHora(a.dataOrig),
                            dateB = $scope.zeraHora(b.dataOrig);

                        return dateA - dateB;
                    });

                    item.pagAtual = $scope.slides.length + 2;
                    item.valorTotal = item.valorHora * ( (item.hTrab > item.hGarant) ? item.hTrab : item.hGarant );
                    $scope.slides.push(item);
                    resumoEquips.push(item);

                    // Verifica se Gera Página de Obs.
                    if(tmpObs.length > 0) {

                        tmpObs.sort(function(a, b){
                            var dateA = $scope.zeraHora(a.dataOrig),
                                dateB = $scope.zeraHora(b.dataOrig);

                            return dateA - dateB;
                        });

                        geraFormObs(item, tmpObs);
                    }

                }
                // FINAL DIAS TRABALHADOS

            }

        }

        // 3 - FORMULÁRIO - HORA/KM
        function geraFormHorakm(item){

            var t = $scope.todos.ativos.map(function(e){ return e.id; }).indexOf(item.id);

            if(t != -1){

                item.atual = [];

                $scope.mede = [];
                $scope.mede.hora = ($scope.todos.ativos[t].formaMedicao.forma.indexOf("H") != -1);
                $scope.mede.km = ($scope.todos.ativos[t].formaMedicao.forma.indexOf("K") != -1);

                // DADOS EQUIPAMENTO
                item.atual.pageId = $scope.todos.ativos[t].nome.toUpperCase();
                item.atual.nome = $scope.todos.ativos[t].nome.toUpperCase();
                item.atual.descricao = $scope.todos.ativos[t].descricao.toUpperCase();
                item.atual.valor = $scope.todos.ativos[t].valor;
                item.atual.gmin = ($scope.todos.ativos[t].gmin) ? $scope.todos.ativos[t].gmin : 200;

                var tp = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf($scope.todos.ativos[t].tipo);

                if(tp != -1){
                    item.atual.tipo = $scope.itemTipo.tipo[tp].nome.toUpperCase();
                }

                var descontaDiesel = false;
                var ct = $scope.todos.contrato.map(function(e){ return e._id; }).indexOf($scope.todos.ativos[t].contrato);

                if(ct != -1){
                    item.atual.contrato = $scope.todos.contrato[ct].nome.toUpperCase();

                    var dt = $scope.zeraHora($scope.todos.contrato[ct].dataini);

                    item.atual.data = dt.toLocaleDateString();

                    descontaDiesel = ($scope.todos.contrato[ct].combus === 'L');
                }
                // FINAL DADOS EQUIPAMENTO


                // DIAS TRABALHADOS
                var ini, fim;
                var semana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

                if($scope.medidor.tipo === 'mes'){
                    ini = new Date($scope.medidor.fAno, $scope.medidor.fMes, 1);
                    fim = new Date($scope.medidor.fAno, ini.getMonth() + 1, 0);

                    ini = $scope.zeraHora(ini);
                    fim = $scope.zeraHora(fim);

                    var difer = Math.abs(fim.getTime() - ini.getTime());
                    item.dias = Math.ceil(difer / (1000 * 3600 * 24)) + 1;
                }else{
                    ini = new Date($scope.medidor.dataini);
                    fim = new Date($scope.medidor.datafim);

                    ini = $scope.zeraHora(ini);
                    fim = $scope.zeraHora(fim);

                    var fim2 = new Date(ini.getFullYear(), ini.getMonth() + 1, 0);

                    var difer1 = Math.abs(fim2.getTime() - ini.getTime());
                    item.dias = Math.ceil(difer1 / (1000 * 3600 * 24)) + 1;
                }

                // Valor da Garantia por Dia
                var diaGmin = item.atual.gmin / item.dias;
                item.valorHora = item.atual.valor / item.atual.gmin;
                item.valorDiaria = item.atual.valor / item.dias;

                item.diasTrab = 0;
                item.hTrab = 0;
                item.hGarant = 0;
                item.consumo = 0;
                item.valorDC = 0;

                item.trabalho = [];
                var tmpObs = [];

                for(var i = 0; i < $scope.todos.listControle.length; i++){

                    var dtCt = $scope.zeraHora($scope.todos.listControle[i].data);

                    if($scope.todos.listControle[i].ctl === "equip"
                        && item.id === $scope.todos.listControle[i].ativo
                        && ( (dtCt >= ini && dtCt <= fim)
                        || dtCt.toLocaleDateString() === ini.toLocaleDateString()
                        || dtCt.toLocaleDateString() === fim.toLocaleDateString() )) {

                        var debito;

                        // Pega Status
                        var st;
                        var s = $scope.todos.status.map(function(e){ return e._id; }).indexOf($scope.todos.listControle[i].status);

                        if(s != -1){
                            st = $scope.todos.status[s].nome;
                            debito = $scope.todos.status[s].debito;
                        }

                        // Pega Atividade
                        var at;
                        var a = $scope.todos.atividade.map(function(e){ return e._id; }).indexOf($scope.todos.listControle[i].atividade);

                        if(a != -1){
                            at = $scope.todos.atividade[a].nome;
                        }

                        // Pega valor da garantia no dia
                        var valorGmin, qtDiesel = 0;
                        var vlSoma = ($scope.mede.hora) ? $scope.todos.listControle[i].htotal : $scope.todos.listControle[i].kmtotal;

                        // Pega consumo de diesel / débito e crédito
                        angular.forEach($scope.todos.listControle, function(vl){

                            var dtTeste = $scope.zeraHora(vl.data);

                            // Pega consumo de diesel
                            if(vl.ctl === 'abast' && vl.processo === 'S'
                                && dtTeste.toLocaleDateString() === dtCt.toLocaleDateString()
                                && vl.abastecido === item.id){

                                qtDiesel = vl.quant;

                                if(descontaDiesel){

                                    var vld, dtComp;

                                    switch (vl.categ){

                                        case "pst":

                                            var t = $scope.todos.contrato.map(function(e){ return e.nome; }).indexOf(vl.ativo);

                                            if(t != -1){
                                                dtComp = new Date(0);

                                                angular.forEach($scope.todos.contrato[t].ativos, function(val){

                                                    if(val.produto === vl.produto){

                                                        var dat = $scope.zeraHora(val.data);

                                                        if( (ini >= dat && dat <= fim) && (dat > dtComp && dat < dtTeste) ){
                                                            dtComp = dat;
                                                            vld = val.valor;
                                                        }

                                                    }

                                                });
                                            }

                                            break;

                                        default:

                                            dtComp = new Date(0);

                                            angular.forEach($scope.todos.listControle, function(val){

                                                if(vl.ativo === val.ativo &&
                                                    vl.ctl === 'abast' &&
                                                    vl.processo === 'E' &&
                                                    val.produto === vl.produto){

                                                    var dat = $scope.zeraHora(val.data);

                                                    if( (ini >= dat && dat <= fim) && (dat > dtComp && dat < dtTeste) ){
                                                        dtComp = dat;
                                                        vld = val.valor;
                                                    }

                                                }

                                            });

                                            break;
                                    }

                                    if(vld){

                                        item.valorDC += ( (vld * qtDiesel) * -1);

                                        debCreds.push({
                                            data: vl.dataBr,
                                            ativo: item.equip,
                                            descricao: item.equip + " - Abastecimento",
                                            valor: ( (vld * qtDiesel) * -1)
                                        });
                                    }
                                }
                            }

                            // Pega débito/crédito
                            if(vl.ctl === 'debcred'
                                && dtTeste.toLocaleDateString() === dtCt.toLocaleDateString()
                                && vl.ativo === item.id){

                                var vlr = (vl.tipo === 'D') ? (vl.valor * -1) : vl.valor;

                                item.valorDC += vlr;

                                debCreds.push({
                                    data: vl.dataBr,
                                    ativo: vl.ativo,
                                    descricao: vl.ativo + " - " + vl.descricao,
                                    valor: vlr
                                })
                            }

                        });

                        // Pega Valor Garantia
                        if(debito === "E"){
                            valorGmin = diaGmin;
                            item.diasTrab++;
                        }else if(debito === "A"){
                            valorGmin = diaGmin / 2;
                            item.diasTrab++;
                        }else{

                            if(vlSoma > (diaGmin / 2)){
                                valorGmin = (vlSoma > diaGmin) ? diaGmin : vlSoma;
                            }else{
                                valorGmin = 0;
                            }

                        }

                        // Prepara item a ser adicionado
                        var adic = {
                            dataOrig: dtCt,
                            data: dtCt.toLocaleDateString(),
                            semana: semana[dtCt.getDay()],
                            gmin: valorGmin.toFixed(2),
                            diaria: (valorGmin === 0) ? 0 : (debito === "A") ? item.valorDiaria/2 : item.valorDiaria,
                            diesel: (qtDiesel != 0) ? qtDiesel : "",
                            status: st,
                            atividade: at
                        };

                        if($scope.mede.hora){
                            adic.hini = new Date($scope.todos.listControle[i].horaini);
                            adic.hfim = new Date($scope.todos.listControle[i].horafim);
                            adic.htotal = $scope.todos.listControle[i].htotal;
                        }

                        if($scope.mede.km){
                            adic.kmini = $scope.todos.listControle[i].kmini;
                            adic.kmfim = $scope.todos.listControle[i].kmfim;
                            adic.kmtotal = $scope.todos.listControle[i].kmtotal;
                        }

                        item.trabalho.push(adic);

                        // Faz somas
                        item.hTrab += vlSoma;
                        item.hGarant += valorGmin;
                        item.consumo += qtDiesel;

                        // Verfica se há Observações
                        if($scope.todos.listControle[i].obs){
                            adic.obs = $scope.todos.listControle[i].obs;
                            tmpObs.push(adic);
                        }

                    }

                }

                if(item.trabalho.length > 0){

                    // Organiza Lançamentos
                    item.trabalho.sort(function(a, b){
                        var dateA = $scope.zeraHora(a.dataOrig),
                            dateB = $scope.zeraHora(b.dataOrig);

                        return dateA - dateB;
                    });

                    item.pagAtual = $scope.slides.length + 2;
                    item.valorTotal = item.valorHora * ( (item.hTrab > item.hGarant) ? item.hTrab : item.hGarant );
                    $scope.slides.push(item);
                    resumoEquips.push(item);

                    // Verifica se Gera Página de Obs.
                    if(tmpObs.length > 0) {

                        tmpObs.sort(function(a, b){
                            var dateA = $scope.zeraHora(a.dataOrig),
                                dateB = $scope.zeraHora(b.dataOrig);

                            return dateA - dateB;
                        });

                        geraFormObs(item, tmpObs);
                    }

                }
                // FINAL DIAS TRABALHADOS

            }

        }

        // 4 - FORMULÁRIO - FIXO
        function geraFormFixo(item){

            var t = $scope.todos.ativos.map(function(e){ return e.id; }).indexOf(item.id);

            if(t != -1){

                var passa = true;

                item.atual = [];

                // DADOS EQUIPAMENTO
                item.atual.pageId = $scope.todos.ativos[t].nome.toUpperCase();
                item.atual.nome = $scope.todos.ativos[t].nome.toUpperCase();
                item.atual.descricao = $scope.todos.ativos[t].descricao.toUpperCase();
                item.atual.valor = $scope.todos.ativos[t].valor;

                var tp = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf($scope.todos.ativos[t].tipo);

                if(tp != -1){
                    item.atual.tipo = $scope.itemTipo.tipo[tp].nome.toUpperCase();
                }

                var ct = $scope.todos.contrato.map(function(e){ return e._id; }).indexOf($scope.todos.ativos[t].contrato);

                var dtIni, dtFim;

                if(ct != -1){
                    item.atual.contrato = $scope.todos.contrato[ct].nome.toUpperCase();

                    dtIni = $scope.zeraHora($scope.todos.contrato[ct].dataini);
                    dtFim = $scope.zeraHora($scope.todos.contrato[ct].datafim);

                    item.atual.data = dtIni.toLocaleDateString();
                }
                // FINAL DADOS EQUIPAMENTO


                // DIAS TRABALHADOS
                var ini, fim, totdias;

                if($scope.medidor.tipo === 'mes'){
                    ini = new Date($scope.medidor.fAno, $scope.medidor.fMes, 1);
                    fim = new Date($scope.medidor.fAno, ini.getMonth() + 1, 0);
                    totdias = fim.getDate();
                }else{
                    ini = new Date($scope.medidor.dataini);
                    fim = new Date($scope.medidor.datafim);

                    var dm = new Date(ini.getFullYear(), ini.getMonth() + 1, 0);
                    totdias = dm.getDate();
                }

                ini = $scope.zeraHora(ini);
                fim = $scope.zeraHora(fim);

                // Verifica as Datas
                if(ini.getMonth() === dtIni.getMonth() &&
                    ini.getFullYear() === dtIni.getFullYear() &&
                    ini < dtIni){
                    ini = dtIni;
                }

                if(fim.getMonth() === dtFim.getMonth() &&
                    fim.getFullYear() === dtFim.getFullYear() &&
                    fim > dtFim){
                    fim = dtFim
                }

                passa = (ini <= dtFim) && (ini >= dtIni);

                if(passa){

                    var difer = Math.abs(fim.getTime() - ini.getTime());
                    item.diasTrab = Math.ceil(difer / (1000 * 3600 * 24)) + 1;

                    item.valorBase = item.atual.valor / totdias;

                    item.valorTotal = item.valorBase * item.diasTrab;

                    item.trabalho = [];
                    item.trabalho.push({data: ini.toLocaleDateString()});
                    item.trabalho.push({data: fim.toLocaleDateString()});
                    // FINAL DIAS TRABALHADOS


                    // DÉBITOS/CRÉDITOS
                    item.atual.debcreds = [];

                    angular.forEach($scope.todos.listControle, function(vl, idx){

                        var dtTeste = $scope.zeraHora(vl.data);

                        if(vl.ctl === 'debcred'
                            && ( dtTeste >= ini && dtTeste <= fim )
                            && vl.ativo === item.id){

                            var vlr = (vl.tipo === 'D') ? (vl.valor * -1) : vl.valor;

                            item.valorDC += vlr;

                            item.atual.debcreds.push({
                                data: vl.dataBr,
                                descricao: vl.ativo + " - " + vl.descricao,
                                valor: vlr
                            });

                            debCreds.push({
                                data: vl.dataBr,
                                ativo: vl.ativo,
                                descricao: vl.ativo + " - " + vl.descricao,
                                valor: vlr
                            });
                        }

                    });

                    item.atual.valorDebcred = 0;

                    angular.forEach(item.atual.debcreds, function(v, i){
                        item.atual.valorDebcred += v.valor;
                    });
                    // FINAL DÉBITOS/CRÉDITOS


                    // FINALIZA
                    item.pagAtual = $scope.slides.length + 2;
                    $scope.slides.push(item);
                    resumoEquips.push(item);
                }

            }

        }

        // 5 - FORMULÁRIO - REFEITÓRIO
        function geraFormRef(item){

            var t = $scope.todos.contrato.map(function(e){ return e._id; }).indexOf(item.contrato);

            if(t != -1){

                var passa = true;

                item.atual = [];

                // DADOS EQUIPAMENTO
                item.atual.pageId = $scope.todos.contrato[t].nome.toUpperCase();
                item.atual.nome = $scope.todos.contrato[t].nome.toUpperCase();

                var fr = $scope.todos.forn.map(function(e){ return e._id; }).indexOf($scope.todos.contrato[t].forn);

                if(fr != -1){
                    item.atual.descricao = $scope.todos.forn[fr].nome.toUpperCase();
                }

                var tp = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf($scope.todos.contrato[t].tipo);

                if(tp != -1){
                    item.atual.tipo = $scope.itemTipo.tipo[tp].nome.toUpperCase();
                }

                var dtIni, dtFim;

                item.atual.contrato = $scope.todos.contrato[t].nome.toUpperCase();

                dtIni = $scope.zeraHora($scope.todos.contrato[t].dataini);
                dtFim = $scope.zeraHora($scope.todos.contrato[t].datafim);

                item.atual.data = dtIni.toLocaleDateString();

                // FINAL DADOS EQUIPAMENTO


                // PRODUTOS
                var ini, fim;
                var semana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

                if($scope.medidor.tipo === 'mes'){
                    ini = new Date($scope.medidor.fAno, $scope.medidor.fMes, 1);
                    fim = new Date($scope.medidor.fAno, ini.getMonth() + 1, 0);
                }else{
                    ini = new Date($scope.medidor.dataini);
                    fim = new Date($scope.medidor.datafim);
                }

                ini = $scope.zeraHora(ini);
                fim = $scope.zeraHora(fim);

                // Verifica as Datas
                if(ini.getMonth() === dtIni.getMonth() &&
                    ini.getFullYear() === dtIni.getFullYear() &&
                    ini < dtIni){
                    ini = dtIni;
                }

                if(fim.getMonth() === dtFim.getMonth() &&
                    fim.getFullYear() === dtFim.getFullYear() &&
                    fim > dtFim){
                    fim = dtFim
                }

                passa = (ini <= dtFim) && (ini >= dtIni);

                if(passa){

                    /*                    var difer = Math.abs(fim.getTime() - ini.getTime());
                     item.diasTrab = Math.ceil(difer / (1000 * 3600 * 24)) + 1;*/

                    item.diasTrab = 0;
                    item.trabalho = [];
                    item.produtos = [];

                    angular.forEach($scope.todos.alimenta, function(vl, idx){

                        var dtTeste = $scope.zeraHora(vl.data);

                        if( ( dtTeste >= ini && dtTeste <= fim ) && vl.forn === item.contrato){

                            var dia = 0;

                            angular.forEach(vl.produtos, function(vl2){

                                var pr = item.produtos.map(function(e){ return e._id; }).indexOf(vl2._id);

                                if(vl2.quant && pr != -1){

                                    item.produtos[pr].quant += vl2.quant;

                                    dia += (vl2.quant * item.produtos[pr].vlUnit);

                                }else{

                                    var vlfim, dtComp = new Date(0);

                                    angular.forEach($scope.todos.contrato[t].ativos, function(val){

                                        if(val.produto === vl2._id){

                                            var dat = $scope.zeraHora(val.data);

                                            if( (ini >= dat && dat <= fim) && dat > dtComp){
                                                dtComp = dat;
                                                vlfim = val.valor;
                                            }

                                        }

                                    });

                                    var p = $scope.todos.produto.map(function(e){ return e._id; }).indexOf(vl2._id);

                                    if(vl2.quant && vlfim && p != -1){

                                        item.produtos.push({
                                            _id: vl2._id,
                                            nome: $scope.todos.produto[p].nome,
                                            quant: vl2.quant,
                                            vlUnit: vlfim
                                        });

                                        dia += (vl2.quant * vlfim);
                                    }

                                }

                            });

                            item.trabalho.push({
                                dataOrig: dtTeste,
                                data: dtTeste.toLocaleDateString(),
                                semana: semana[dtTeste.getDay()],
                                descricao: vl.prodStr,
                                diaria: dia
                            });

                            item.diasTrab++;

                        }

                    });

                    // FINAL PRODUTOS

                    if(item.trabalho.length > 0){

                        // Organiza Lançamentos
                        item.trabalho.sort(function(a, b){
                            var dateA = $scope.zeraHora(a.dataOrig),
                                dateB = $scope.zeraHora(b.dataOrig);

                            return dateA - dateB;
                        });

                        item.valorTotal = 0;

                        angular.forEach(item.produtos, function(vl){

                            vl.vlTotal = (vl.quant * vl.vlUnit);

                            item.valorTotal += vl.vlTotal;

                        });

                        // Adiciona itens em branco pra fechar caixa
                        while(item.produtos.length % 3 != 0){
                            item.produtos.push({nome: ""});
                        }

                        // DÉBITOS/CRÉDITOS
                        item.valorDC = 0;

                        angular.forEach($scope.todos.listControle, function(vl){

                            var dtTeste = $scope.zeraHora(vl.data);

                            if(vl.ctl === 'debcred'
                                && ( dtTeste >= ini && dtTeste <= fim )
                                && vl.ativo === item.id){

                                var vlr = (vl.tipo === 'D') ? (vl.valor * -1) : vl.valor;

                                item.valorDC += vlr;

                                debCreds.push({
                                    data: vl.dataBr,
                                    ativo: vl.ativo,
                                    descricao: vl.ativo + " - " + vl.descricao,
                                    valor: vlr
                                });
                            }

                        });
                        // FINAL DÉBITOS/CRÉDITOS

                        // FINALIZA
                        item.pagAtual = $scope.slides.length + 2;
                        $scope.slides.push(item);
                        resumoEquips.push(item);
                    }

                }

            }

        }

        // 6 - FORMULÁRIO - POSTO
        function geraFormPosto(item){

            var t = $scope.todos.contrato.map(function(e){ return e._id; }).indexOf(item.contrato);

            if(t != -1){

                var passa = true;

                item.atual = [];

                // DADOS EQUIPAMENTO
                item.atual.pageId = $scope.todos.contrato[t].nome.toUpperCase();
                item.atual.nome = $scope.todos.contrato[t].nome.toUpperCase();

                var fr = $scope.todos.forn.map(function(e){ return e._id; }).indexOf($scope.todos.contrato[t].forn);

                if(fr != -1){
                    item.atual.descricao = $scope.todos.forn[fr].nome.toUpperCase();
                }

                var tp = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf($scope.todos.contrato[t].tipo);

                if(tp != -1){
                    item.atual.tipo = $scope.itemTipo.tipo[tp].nome.toUpperCase();
                }

                var dtIni, dtFim;

                item.atual.contrato = $scope.todos.contrato[t].nome.toUpperCase();

                dtIni = $scope.zeraHora($scope.todos.contrato[t].dataini);
                dtFim = $scope.zeraHora($scope.todos.contrato[t].datafim);

                item.atual.data = dtIni.toLocaleDateString();

                // FINAL DADOS EQUIPAMENTO


                // PRODUTOS
                var ini, fim;
                var semana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

                if($scope.medidor.tipo === 'mes'){
                    ini = new Date($scope.medidor.fAno, $scope.medidor.fMes, 1);
                    fim = new Date($scope.medidor.fAno, ini.getMonth() + 1, 0);
                }else{
                    ini = new Date($scope.medidor.dataini);
                    fim = new Date($scope.medidor.datafim);
                }

                ini = $scope.zeraHora(ini);
                fim = $scope.zeraHora(fim);

                // Verifica as Datas
                if(ini.getMonth() === dtIni.getMonth() &&
                    ini.getFullYear() === dtIni.getFullYear() &&
                    ini < dtIni){
                    ini = dtIni;
                }

                if(fim.getMonth() === dtFim.getMonth() &&
                    fim.getFullYear() === dtFim.getFullYear() &&
                    fim > dtFim){
                    fim = dtFim
                }

                passa = (ini <= dtFim) && (ini >= dtIni);

                if(passa){

                    /*var difer = Math.abs(fim.getTime() - ini.getTime());
                     item.diasTrab = Math.ceil(difer / (1000 * 3600 * 24)) + 1;*/

                    item.diasTrab = 0;
                    item.trabalho = [];
                    item.produtos = [];
                    var tmpStr = [];
                    var tmpDias = [];


                    angular.forEach($scope.todos.listControle, function(vl, idx){

                        var dtTeste = $scope.zeraHora(vl.data);

                        if( vl.ctl === 'abast' && vl.processo === 'S' && vl.categ === 'pst' &&
                            ( dtTeste >= ini && dtTeste <= fim ) &&
                            vl.ativo === item.contrato){

                            var tst = tmpDias.map(function(e){ return e.data; }). indexOf(dtTeste.toLocaleDateString());

                            if(tst === -1) {
                                tmpStr = [];
                            }else{
                                tmpStr = tmpDias[tst].prods;
                            }

                            var dia = 0;

                            var d = item.produtos.map(function(e){ return e._id; }).indexOf(vl.produto);

                            if(vl.quant && d != -1){

                                item.produtos[d].quant += vl.quant;

                                var d2 = tmpStr.map(function(e){ return e._id; }).indexOf(vl.produto);

                                if(d2 != -1){
                                    tmpStr[d2].quant += vl.quant;
                                }else{
                                    tmpStr.push({
                                        _id: vl.produto,
                                        nome: item.produtos[d].nome,
                                        quant: vl.quant
                                    });
                                }

                                dia += (vl.quant * item.produtos[d].vlUnit);

                            }else{

                                var vlfim, dtComp = new Date(0);

                                angular.forEach($scope.todos.contrato[t].ativos, function(val){

                                    if(val.produto === vl.produto){

                                        var dat = $scope.zeraHora(val.data);

                                        if( (ini >= dat && dat <= fim) && dat > dtComp){
                                            dtComp = dat;
                                            vlfim = val.valor;
                                        }

                                    }

                                });

                                var p = $scope.todos.produto.map(function(e){ return e._id; }).indexOf(vl.produto);

                                if(vl.quant && vlfim && p != -1){

                                    item.produtos.push({
                                        _id: vl.produto,
                                        nome: $scope.todos.produto[p].nome,
                                        quant: vl.quant,
                                        vlUnit: vlfim
                                    });

                                    tmpStr.push({
                                        _id: vl.produto,
                                        nome: $scope.todos.produto[p].nome,
                                        quant: vl.quant
                                    });

                                    dia += (vl.quant * vlfim);
                                }

                            }


                            if(tst === -1) {

                                tmpDias.push({
                                    dataOrig: dtTeste,
                                    data: dtTeste.toLocaleDateString(),
                                    prods: tmpStr,
                                    diaria: dia
                                });

                            }else{

                                tmpDias[tst].diaria += dia;
                                /*tmpDias[tst].prods = tmpStr;*/

                            }

                        }

                    });

                    // FINAL PRODUTOS
                    if(tmpDias.length > 0){

                        tmpDias.sort(function(a, b){
                            var dateA = $scope.zeraHora(a.dataOrig),
                                dateB = $scope.zeraHora(b.dataOrig);

                            return dateA - dateB;
                        });


                        angular.forEach(tmpDias, function(vl){

                            var prodStr = "";

                            angular.forEach(vl.prods, function(v, ind){

                                if(ind > 0 ){
                                    prodStr += "; ";
                                }

                                prodStr += (v.nome + " - " + (v.quant.toFixed(2)));

                            });


                            this.push({
                                dataOrig: vl.dataOrig,
                                data: vl.data,
                                semana: semana[vl.dataOrig.getDay()],
                                descricao: prodStr,
                                diaria: vl.diaria
                            });

                            item.diasTrab++;


                        }, item.trabalho);


                        item.valorTotal = 0;

                        angular.forEach(item.produtos, function(vl){

                            vl.vlTotal = (vl.quant * vl.vlUnit);

                            item.valorTotal += vl.vlTotal;

                        });

                        // Adiciona itens em branco pra fechar caixa
                        while(item.produtos.length % 3 != 0){
                            item.produtos.push({nome: ""});
                        }


                        // DÉBITOS/CRÉDITOS
                        item.valorDC = 0;

                        angular.forEach($scope.todos.listControle, function(vl, idx){

                            var dtTeste = $scope.zeraHora(vl.data);

                            if(vl.ctl === 'debcred'
                                && ( dtTeste >= ini && dtTeste <= fim )
                                && vl.ativo === item.id){

                                var vlr = (vl.tipo === 'D') ? (vl.valor * -1) : vl.valor;

                                item.valorDC += vlr;
                                debCreds.push({
                                    data: vl.dataBr,
                                    ativo: vl.ativo,
                                    descricao: vl.ativo + " - " + vl.descricao,
                                    valor: vlr
                                });
                            }

                        });

                        // FINAL DÉBITOS/CRÉDITOS


                        // FINALIZA

                        item.pagAtual = $scope.slides.length + 2;
                        $scope.slides.push(item);
                        resumoEquips.push(item);
                    }

                }

            }

        }

        // 7 - FORMULÁRIO - TONELADA
        function geraFormTon(item){

            var t = $scope.todos.ativos.map(function(e){ return e.id; }).indexOf(item.id);

            if(t != -1){

                var passa = true;

                item.atual = [];

                // DADOS EQUIPAMENTO
                item.atual.pageId = $scope.todos.ativos[t].nome.toUpperCase();
                item.atual.nome = $scope.todos.ativos[t].nome.toUpperCase();
                item.atual.descricao = $scope.todos.ativos[t].descricao.toUpperCase();
                item.atual.valor = $scope.todos.ativos[t].valor;

                var tp = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf($scope.todos.ativos[t].tipo);

                if(tp != -1){
                    item.atual.tipo = $scope.itemTipo.tipo[tp].nome.toUpperCase();
                }

                var dtIni, dtFim;

                var ct = $scope.todos.contrato.map(function(e){ return e._id; }).indexOf($scope.todos.ativos[t].contrato);

                if(ct != -1){
                    item.atual.contrato = $scope.todos.contrato[ct].nome.toUpperCase();

                    dtIni = $scope.zeraHora($scope.todos.contrato[ct].dataini);
                    dtFim = $scope.zeraHora($scope.todos.contrato[ct].datafim);

                    item.atual.data = dtIni.toLocaleDateString();
                }

                // FINAL DADOS EQUIPAMENTO


                // PRODUTOS
                var ini, fim;
                var semana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

                if($scope.medidor.tipo === 'mes'){
                    ini = new Date($scope.medidor.fAno, $scope.medidor.fMes, 1);
                    fim = new Date($scope.medidor.fAno, ini.getMonth() + 1, 0);
                }else{
                    ini = new Date($scope.medidor.dataini);
                    fim = new Date($scope.medidor.datafim);
                }

                ini = $scope.zeraHora(ini);
                fim = $scope.zeraHora(fim);

                // Verifica as Datas
                if(ini.getMonth() === dtIni.getMonth() &&
                    ini.getFullYear() === dtIni.getFullYear() &&
                    ini < dtIni){
                    ini = dtIni;
                }

                if(fim.getMonth() === dtFim.getMonth() &&
                    fim.getFullYear() === dtFim.getFullYear() &&
                    fim > dtFim){
                    fim = dtFim
                }

                passa = (ini <= dtFim) && (ini >= dtIni);

                if(passa){

                    item.diasTrab = 0;
                    item.trabalho = [];
                    item.produtos = [];
                    var tmpStr = [];

                    angular.forEach($scope.todos.saidas, function(vl, idx){

                        var dtTeste = $scope.zeraHora(vl.data);

                        if( ( dtTeste >= ini && dtTeste <= fim ) &&
                            vl.ativo.toUpperCase() === item.atual.nome && vl.chegou){

                            var dia = 0;

                            var d = item.produtos.map(function(e){ return e._id; }).indexOf(vl.produto);

                            if(vl.peso && d != -1){

                                var qt2 = vl.peso;

                                angular.forEach($scope.todos.ajustes, function(v){
                                    var dtt = new Date(v.data);

                                    if(dtTeste.getMonth() === dtt.getMonth() &&
                                        dtTeste.getFullYear() === dtt.getFullYear()){
                                        qt2 += (qt2 * (v.percentual / 100));
                                    }

                                });

                                item.produtos[d].quant += qt2;

                                var d2 = tmpStr.map(function(e){ return e._id; }).indexOf(vl.produto);

                                if(d2 != -1){
                                    tmpStr[d2].quant = qt2;
                                }

                                dia += (qt2 * item.produtos[d].vlUnit);

                            }else{

                                var p = $scope.todos.produto.map(function(e){ return e._id; }).indexOf(vl.produto);

                                if(vl.peso && p != -1){

                                    var qt = vl.peso;

                                    angular.forEach($scope.todos.ajustes, function(v){
                                        var dtt = new Date(v.data);

                                        if(dtTeste.getMonth() === dtt.getMonth() &&
                                            dtTeste.getFullYear() === dtt.getFullYear()){
                                            qt += (qt * (v.percentual / 100));
                                        }

                                    });

                                    item.produtos.push({
                                        _id: vl.produto,
                                        nome: $scope.todos.produto[p].nome,
                                        quant: qt,
                                        vlUnit: item.atual.valor
                                    });

                                    tmpStr.push({
                                        _id: vl.produto,
                                        nome: $scope.todos.produto[p].nome,
                                        quant: qt
                                    });

                                    dia += (qt * item.atual.valor);
                                }

                            }

                            var prodStr = "";

                            angular.forEach(tmpStr, function(v, ind){

                                if(ind > 0 ){
                                    prodStr += "; ";
                                }

                                prodStr += (v.nome + " - " + v.quant.toFixed(2));

                            });

                            item.trabalho.push({
                                dataOrig: dtTeste,
                                data: dtTeste.toLocaleDateString(),
                                semana: semana[dtTeste.getDay()],
                                descricao: prodStr,
                                diaria: dia
                            });

                            item.diasTrab++;

                        }

                    });

                    // FINAL PRODUTOS
                    if(item.trabalho.length > 0){

                        item.trabalho.sort(function(a, b){
                            var dateA = $scope.zeraHora(a.dataOrig),
                                dateB = $scope.zeraHora(b.dataOrig);

                            return dateA - dateB;
                        });

                        item.valorTotal = 0;

                        angular.forEach(item.produtos, function(vl){

                            vl.vlTotal = (vl.quant * vl.vlUnit);

                            item.valorTotal += vl.vlTotal;

                        });

                        // Adiciona itens em branco pra fechar caixa
                        while(item.produtos.length % 3 != 0){
                            item.produtos.push({nome: ""});
                        }


                        // DÉBITOS/CRÉDITOS
                        item.valorDC = 0;

                        angular.forEach($scope.todos.listControle, function(vl, idx){

                            var dtTeste = $scope.zeraHora(vl.data);

                            if(vl.ctl === 'debcred'
                                && ( dtTeste >= ini && dtTeste <= fim )
                                && vl.ativo === item.id){

                                var vlr = (vl.tipo === 'D') ? (vl.valor * -1) : vl.valor;

                                item.valorDC += vlr;
                                debCreds.push({
                                    data: vl.dataBr,
                                    ativo: vl.ativo,
                                    descricao: vl.ativo + " - " + vl.descricao,
                                    valor: vlr
                                });
                            }

                        });

                        // FINAL DÉBITOS/CRÉDITOS


                        // FINALIZA

                        item.pagAtual = $scope.slides.length + 2;
                        $scope.slides.push(item);
                        resumoEquips.push(item);
                    }

                }

            }

        }


        /* FINAL - FUNÇÕES DE FORMULÁRIOS */


        // Verifica Medições Emitidas
        function verificaMed(){

            campo = angular.copy(new dtBase({db: dbs}));
            $scope.medidor.emitido = false;

            angular.forEach($scope.todos[dbs], function(vl){

                var f = $scope.todos.forn.map(function (e){ return e._id; }).indexOf(vl.forn);

                if(f != -1) {

                    if( $scope.todos.forn[f].nome === $scope.medidor.forn &&
                        $scope.zeraHora(vl.inicio) >= $scope.zeraHora($scope.slides[0].inicio) &&
                        $scope.zeraHora(vl.final) <= $scope.zeraHora($scope.slides[0].final) ){

                        $scope.medidor.emitido = true;
                        campo = angular.copy(vl);

                        angular.forEach($scope.tmpLista, function(v){

                            var e = vl.equips.map(function(e){ return e.id; }).indexOf(v.id);

                            if(e != -1){

                                v.emitido = vl.equips[e].fechou;

                            }

                        });

                    }

                }

            });

        }


        // Gera Medições
        $scope.geraMed = function(item){

            // Define Data Máxima
            /*if(item.tipo === 'periodo' && item.dataini){
             var dm = new Date(item.dataini);
             item.datamax = new Date(dm.getFullYear(), dm.getMonth() + 1, 0);
             }*/

            $scope.slides = [];
            $scope.tmpLista = [];
            resumoEquips = [];
            debCreds = [];

            $scope.medidor.carouselIndex = 0;
            $scope.medidor.gerado = false;

            if(item.forn
                && ( (item.tipo === "mes" && item.fMes && item.fAno)
                || (item.tipo === "periodo" && item.dataini && item.datafim) ) ){

                var equips = [];

                var f = $scope.todos.forn.map(function (e){ return e.nome; }).indexOf(item.forn);

                if(f != -1){

                    var idx = $scope.todos.forn[f]._id;

                    // Pega Equipamentos do Fornecedor
                    angular.forEach($scope.todos.ativos, function(vl, idt){

                        var passa = !$scope.medidor.ativo || $scope.medidor.ativo === vl.id;

                        if(passa && vl.forn === idx && vl.mede){

                            var t = $scope.menu.medicoes.map(function(e){ return e.id; }).indexOf(vl.formaMedicao.forma);

                            if(t != -1){

                                var p = $scope.menu.medicoes[t].periodos.map(function(e){ return e.id;}).indexOf(vl.formaMedicao.periodo);

                                if(p != -1){
                                    equips.push({
                                        id: vl.id,
                                        page: $scope.menu.medicoes[t].periodos[p].form,
                                        equip: vl.nome,
                                        periodo: vl.formaMedicao.periodo,
                                        forma: vl.formaMedicao.forma
                                    });
                                }

                            }

                        }

                    });

                    // Verifica se é fornecedor de Produtos
                    if(!$scope.medidor.ativo){
                        angular.forEach($scope.todos.contrato, function(vl, idt){

                            if(vl.forn === idx){

                                var t = $scope.itemTipo.tipo.map(function(e){ return e.id; }).indexOf(vl.tipo);

                                if(t != -1 && $scope.itemTipo.tipo[t].temProduto && $scope.itemTipo.tipo[t].mede){

                                    var m = $scope.menu.medicoes.map(function(e){ return e.id; }).indexOf(vl.tipo);

                                    if(m != -1){

                                        var md = $scope.todos.mdcontrato.map(function(e){ return e._id; }).indexOf(vl.modelo);

                                        if(md != -1){

                                            var p = $scope.menu.medicoes[m].periodos.map(function(e){ return e.id;})
                                                .indexOf($scope.todos.mdcontrato[md].periodo);

                                            if(p != -1){
                                                equips.push({
                                                    id: vl.nome,
                                                    page: $scope.menu.medicoes[m].periodos[p].form,
                                                    equip: vl.nome,
                                                    periodo: $scope.todos.mdcontrato[md].periodo,
                                                    forma: vl.tipo,
                                                    contrato: vl._id
                                                });
                                            }

                                        }

                                    }

                                }

                            }

                        });
                    }

                    // Adiciona Capa
                    equips.push({id: "capa", page: $scope.menu.medicoes[1].form});

                    for(var i = 0; i < equips.length; i++){

                        // Cabeçalho
                        var novo = [];

                        novo.id = equips[i].id;
                        novo.form = $scope.menu.medicoes[0].form;
                        novo.nome = "slide_" + equips[i].id.replace(/ /g,'').replace(/[^a-zA-Z0-9 ]/g, "");
                        novo.formaMed = {periodo: equips[i].periodo, forma:  equips[i].forma};
                        novo.dataImp = dt.toLocaleDateString();
                        novo.chk = true;

                        if(equips[i].contrato){
                            novo.contrato = equips[i].contrato;
                        }

                        var t = $scope.todos.clientes.map(function(e){ return e._id; }).indexOf($scope.usuario.empresa);

                        if(t != -1){
                            novo.empresa = angular.copy($scope.todos.clientes[t]);
                        }

                        if(item.tipo === "mes"){

                            var me, an;

                            var m = $scope.pegaMes.map(function(e){ return e.value; }).indexOf(item.fMes);

                            if(m != -1){
                                me = $scope.pegaMes[m].nome;
                            }

                            var a = $scope.pegaAno.map(function(e){ return e.value; }).indexOf(item.fAno);

                            if(a != -1){
                                an = $scope.pegaAno[a].ano;
                            }

                            if(me && an){
                                novo.medicao = me + "/" + an;
                            }

                        }else{

                            var di = new Date(item.dataini);
                            var df = new Date(item.datafim);

                            novo.medicao = di.toLocaleDateString();
                            novo.medicao2 = " à " + df.toLocaleDateString();

                        }
                        // Final do Cabeçalho


                        // Redireciona para as próximas páginas
                        novo.fecha = equips[i].page;
                        if(equips[i].equip){ novo.equip = equips[i].equip; }

                        // Insere na lista para visualização
                        if(equips[i].id != "capa"){

                            if(equips[i].periodo == 'M'){

                                switch (equips[i].forma){

                                    case "HM":
                                        geraFormHorim(novo);
                                        break;

                                    case "HK":
                                        geraFormHorakm(novo);
                                        break;

                                    case "ref":
                                        geraFormRef(novo);
                                        break;

                                    case "pst":
                                        geraFormPosto(novo);
                                        break;

                                    case "T":
                                        geraFormTon(novo);
                                        break;

                                    default:
                                        geraFormFixo(novo);
                                        break;

                                }

                            }

                        }else{

                            if($scope.slides.length > 0){
                                geraCapa(novo);
                                novo.pagAtual = 1;
                                $scope.slides.unshift(novo);
                            }

                        }

                    }

                    if($scope.slides.length > 0) {

                        angular.forEach($scope.slides, function(vl){
                            $scope.tmpLista.push(vl);
                        });

                        verificaMed();

                        $scope.medidor.gerado = true;

                    }
                }
            }

        };


        // Salva Medição Impressa
        function salvaMed(item) {

            var f = $scope.todos.forn.map(function (e){ return e.nome; }).indexOf($scope.medidor.forn);

            if(f != -1) {
                campo.forn = $scope.todos.forn[f]._id;
            }

            campo.inicio = $scope.zeraHora(item[0].inicio);
            campo.final = $scope.zeraHora(item[0].final);
            campo.equips = [];

            angular.forEach(item, function(vl){

                if(vl.id != 'capa'){
                    this.push({id: vl.id, fechou: vl.chk, altera: vl.altera, valor: vl.valorTotal});
                }

            }, campo.equips);

            $scope.registraLanc(campo);

            campo.$save({db: dbs}, function (data) {

                inicia[dbs]().then(function () {
                    verificaMed();
                });

            }, function () {
                alert("Erro no Banco de Dados");
            });

        }


        // Gera Pdf
        $scope.savePdf = function(){

            $scope.verifica.loading = true;

            var preparaSlide = function(idx){
                var deferred = $q.defer();

                $scope.medidor.carouselIndex = idx;

                deferred.resolve();

                return deferred.promise;
            };

            var i = 0;

            var content = [];

            var novaPage = function () {

                if (i < $scope.slides.length) {

                    preparaSlide(i).then(function(){

                        var p = angular.element(document.querySelector("#" + $scope.slides[i].nome));

                        html2canvas(p[0], {
                            onrendered: function(canvas) {
                                var hg = (canvas.height > 950) ? 800 : null;
                                var data = canvas.toDataURL();
                                content.push({
                                    image: data,
                                    width: canvas.width - 200,
                                    height: hg

                                });

                                i++;

                                if(i < $scope.slides.length){

                                    content[content.length - 1].pageBreak = 'after';

                                }

                                novaPage();
                            }
                        });

                    })

                } else {
                    preparaSlide(0).then(function() {

                        var docDefinition = {
                            pageSize: 'A4',
                            content: content,
                            pageMargins: [ 10, 20, 10, 5 ]
                        };
                        pdfMake.createPdf(docDefinition).download("medicao.pdf");

                        salvaMed($scope.tmpLista);

                        $scope.verifica.loading = false;
                    })
                }

            };

            novaPage();

        };


        // Adiciona / Remove Itens da Medição
        $scope.addLista = function(item){

            var t = $scope.tmpLista.map(function(e){ return e.nome; }).indexOf(item.nome);

            if (t != -1){

                // Remove Item
                if(!item.chk){

                    if(!item.observa) {

                        // Remove da Capa
                        // ATIVO
                        angular.forEach($scope.slides[0].equips, function (vl, idx) {

                            if (vl.equip.toUpperCase() === item.atual.nome) {

                                tmpItens.push({id: idx, ativo: true, item: vl});

                                $scope.slides[0].equips.splice(idx, 1);
                            }
                        });

                        // DEBCRED
                        angular.forEach($scope.slides[0].debcreds, function (vl, idx) {

                            if (vl.ativo.toUpperCase() === item.atual.nome) {

                                tmpItens.push({id: idx, ativo: false, item: vl});

                                $scope.slides[0].debcreds.splice(idx, 1);
                            }
                        });

                    }

                    $scope.slides.splice(t, 1);

                }else{

                    // Retorna Item
                    if(!item.observa) {

                        // Retorna à Capa
                        // ATIVO
                        angular.forEach(tmpItens, function (vl, idx) {
                            if (vl.ativo && vl.item.equip.toUpperCase() === item.atual.nome) {
                                $scope.slides[0].equips.splice(vl.id, 0, vl.item);
                                tmpItens.splice(idx, 1);
                            }
                        });

                        // DEBCRED
                        angular.forEach(tmpItens, function (vl, idx) {
                            if (!vl.ativo && vl.item.ativo.toUpperCase() === item.atual.nome) {
                                $scope.slides[0].debcreds.splice(vl.id, 0, vl.item);
                                tmpItens.splice(idx, 1);
                            }
                        });

                    }

                    $scope.slides.splice(t, 0, $scope.tmpLista[t]);
                }


                if(!item.observa) {

                    // Refaz Somas
                    $scope.slides[0].valorMedicao = 0;
                    angular.forEach($scope.slides[0].equips, function (v) {
                        $scope.slides[0].valorMedicao += v.valorTotal;
                    });

                    // Refaz Deb/Cred
                    $scope.slides[0].valorDebcred = 0;

                    angular.forEach($scope.slides[0].debcreds, function (v, i) {
                        $scope.slides[0].valorDebcred += v.valor;
                    });

                }

                $scope.medidor.carouselIndex = 0;

            }

        };


        // Altera Medições
        $scope.mudaMed = function(item){

            switch (item.altera){

                case "P":
                    item.valorTotal = item.valorHora * ( (item.hTrab > item.hGarant) ? item.hTrab : item.hGarant );
                    break;

                case "H":
                    item.valorTotal = item.valorHora * item.hTrab;
                    break;

                case "G":
                    item.valorTotal = item.valorHora * item.hGarant;
                    break;

                case "D":
                    item.valorTotal = 0;

                    angular.forEach(item.trabalho, function(vl){
                        item.valorTotal += vl.diaria;
                    });

                    break;
            }

            // Refaz Somas
            $scope.slides[0].valorMedicao = 0;
            angular.forEach($scope.slides[0].equips, function(v){
                $scope.slides[0].valorMedicao += v.valorTotal;
            });

            // Altera valor de página de Obs
            angular.forEach($scope.slides, function(vl){
                if(vl.id == item.id && vl.observa){
                    vl.valorTotal = item.valorTotal;
                }
            });

        };


        // Inicializa Ativos
        angular.forEach($scope.todos.ativos, function(vl){
            if(vl.id){ this.push(vl); }
        }, $scope.tmpAtivos);

        // Pega Fornecedor através do Ativo
        $scope.pegaForn = function(item){

            var t = $scope.tmpAtivos.map(function(e){ return e.id; }).indexOf(($scope.medidor.ativo));

            if(t != -1){

                var f = $scope.todos.forn.map(function(e){ return e._id; }).indexOf($scope.tmpAtivos[t].forn);

                if(f != -1){
                    $scope.medidor.forn = $scope.todos.forn[f].nome;
                    $scope.geraMed($scope.medidor);
                }

            }

        };


        //Limpa Busca
        $scope.limpaBusca = function(){
            $scope.medidor.forn = undefined;
            $scope.medidor.ativo = undefined;
            $scope.slides = [];
            $scope.tmpLista = [];
        };

    });
