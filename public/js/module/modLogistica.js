/*
 módulo de Logística v1.0
 2016 Nilton Cruz
 */

'use strict';

angular.module( 'modLogistica', ['modBase'] )

    .run(['$rootScope', function($rootScope){

        var caminho = "partial/logistica/";

        var ini =
            '<table class="scroll" at-table at-list="lista | porTodos: pesquisa.geral | porCampo: pesquisa">' +
            '<thead ng-class="{size: lista.length > 16}">'+
            '<tr>'+
            '<th class="text-center" style="width: 5%; margin-top: 4px">'+
            '<input type="checkbox" ng-change="addAll(selAll)" ng-model="selAll" ' +
            'ui-indeterminate="atual.length > 0 && atual.length != lista.length">'+
            '</th>';

        var mid =
            '</tr>'+
            '</thead>'+
            '<tbody>'+
            '<tr ng-class="{linhaAlta: ' +
            "logAtual.id != 'saida'" +
            '}">'+
            '<td class="text-center" style="width: 5%;" ng-style="{' +
            "'margin-top': (logAtual.id == 'chegada') ? '5px' : '2px'" +
            '}"><input type="checkbox" ng-change="addLista(item)" ng-model="item.chk" ' +
            'ng-if="logAtual.id ' +
            "== 'chegada' "+
            '|| !item.chegou"></td>';

        var fim =
            '</tr>'+
            '</tbody>'+
            '</table>';


        // Menu de Controles
        $rootScope.menu.logistica = [

            /* 1 - SAÍDAS */
            {
                id: "saida",
                nome: "Saídas",
                link: "/saida",
                ativo: false,
                modal: caminho + 'saida.html',
                ctl: 'saidaCtl',
                size: 'lg',
                dbase: 'saidas',
                campos: [{id: "geral", nome: "Geral"},
                    {id: "dataBr", nome: "Data", tipo: "data"},
                    {id: "placa", nome: "Placa", tipo: "selecao"},
                    {id: "nf", nome: "NF", tipo: "texto"},
                    {id: "prodStr", nome: "Produto", tipo: "selecao"}],
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="data" style="width: 12%">Data</th>' +
                '<th at-attribute="hora" style="width: 11%">Hora</th>' +
                '<th at-attribute="ticket" style="width: 11%">Ticket</th>' +
                '<th at-attribute="peso" style="width: 11%">Peso</th>' +
                '<th at-attribute="nf" style="width: 11%">NF</th>' +
                '<th at-attribute="pesonf" style="width: 11%">Peso NF</th>' +
                '<th at-attribute="placa" style="width: 13%">Placa</th>' +
                '<th at-attribute="prodStr" style="width: 12%">Produto</th>' +
                '<th at-attribute="chegou" style="width: 3%"> &nbsp; </th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-sortable at-initial-sorting="desc" at-attribute="data" ng-click="novo(item)" style="width: 12%">{{item.dataBr}}</td>' +
                '<td at-sortable at-attribute="hora" ng-click="novo(item)" style="width: 11%">{{item.horaStr}}</td>' +
                '<td at-implicit at-sortable at-attribute="ticket" ng-click="novo(item)" style="width: 11%"></td>' +
                '<td at-implicit at-sortable at-attribute="peso" ng-click="novo(item)" style="width: 11%"></td>' +
                '<td at-implicit at-sortable at-attribute="nf" ng-click="novo(item)" style="width: 11%"></td>' +
                '<td at-implicit at-sortable at-attribute="pesonf" ng-click="novo(item)" style="width: 11%"></td>' +
                '<td at-implicit at-sortable at-attribute="placa" ng-click="novo(item)" style="width: 13%"></td>' +
                '<td at-implicit at-sortable at-attribute="prodStr" ng-click="novo(item)" style="width: 12%"></td>' +
                '<td at-attribute="chegou" class="text-center" style="width: 3%">' +
                '<i class="fa fa-truck fa-lg text-warning" ' +
                'ng-click="novo(item)" ng-if="!item.chegou" title="Em Transporte"></i>' +
                '<i class="fa fa-check-circle fa-lg text-success" ' +
                'ng-if="item.chegou" title="Recebido"></i>' +
                '</td>' +

                fim
            },

            /* 2 - EM TRANSPORTE */
            {
                id: "transporte",
                nome: "Em Transporte",
                link: "/transporte",
                ativo: false,
                modal: caminho + 'saida.html',
                ctl: 'saidaCtl',
                size: 'lg',
                dbase: 'chegadas',
                campos: [{id: "geral", nome: "Geral"},
                    {id: "dataBr", nome: "Data", tipo: "data"},
                    {id: "placa", nome: "Placa", tipo: "selecao"},
                    {id: "nf", nome: "NF", tipo: "texto"},
                    {id: "prodStr", nome: "Produto", tipo: "selecao"}],
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="data" style="width: 10%">Data</th>' +
                '<th at-attribute="hora" style="width: 10%">Hora</th>' +
                '<th at-attribute="nf" style="width: 10%">NF</th>' +
                '<th at-attribute="pesonf" style="width: 10%">Peso NF</th>' +
                '<th at-attribute="placa" style="width: 10%">Placa</th>' +
                '<th at-attribute="prodStr" style="width: 10%">Produto</th>' +
                '<th at-attribute="chega" style="width: 18%"> Chegada</th>' +
                '<th at-attribute="balanca" style="width: 12%">Balança</th>' +
                '<th at-attribute="block" style="width: 5%"> &nbsp; </th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-sortable at-initial-sorting="desc" at-attribute="data" ng-click="novo(item)" style="width: 10%; margin-top: 8px; cursor: pointer;">{{item.dataBr}}</td>' +
                '<td at-sortable at-attribute="hora" ng-click="novo(item)" style="width: 10%; margin-top: 8px; cursor: pointer;">{{item.horaStr}}</td>' +
                '<td at-implicit at-sortable at-attribute="nf" ng-click="novo(item)" style="width: 10%; margin-top: 8px; cursor: pointer;"></td>' +
                '<td at-implicit at-sortable at-attribute="pesonf" ng-click="novo(item)" style="width: 10%; margin-top: 8px; cursor: pointer;"></td>' +
                '<td at-implicit at-sortable at-attribute="placa" ng-click="novo(item)" style="width: 10%; margin-top: 8px; cursor: pointer;"></td>' +
                '<td at-implicit at-sortable at-attribute="prodStr" ng-click="novo(item)" style="width: 10%; margin-top: 8px; cursor: pointer;"></td>' +

                '<td at-sortable at-attribute="chega" ng-click="item.block = false" style="width: 18%; margin: 0;">' +
                '<div class="input-group" ng-class="' +
                "{'has-error': " +
                '!item.chega}">' +
                '<input class="form-control input-sm" uib-datepicker-popup="dd/MM/yy" datepicker-options="dateOptions"' +
                'show-button-bar="false" ng-model="item.chega" is-open="item.aberto" min-date="item.dataOrigem" ' +
                'datepicker-append-to-body="true" ng-readonly="item.block || atual.length > 0"/>' +
                '<span class="input-group-btn" ng-if="!item.block && atual.length == 0">' +
                '<button type="button" class="btn btn-sm btn-primary" ng-click="abrePickerItem(item)">' +
                '<i class="fa fa-calendar"></i></button>' +
                '</span>' +
                '</div>' +
                '</td>' +

                '<td at-sortable at-attribute="balanca" ng-click="item.block = false" style="width: 12%; margin: 0;">' +
                '<input class="form-control input-sm" type="number" ng-model="item.balanca" min="0" step="0.1"' +
                ' ng-readonly="item.block || atual.length > 0">' +
                '</td>' +

                '<td at-attribute="block" class="text-center" style="width: 5%; margin: 0;">' +
                '<i class="fa fa-check-square-o fa-2x text-success" style="padding-top: 5px;" ' +
                'ng-if="!item.block && item.chega" ng-click="salvaItem(item)" title="Salvar"></i>' +
                '</td>' +

                fim
            },

            /* 3 - CHEGADAS */
            {
                id: "chegada",
                nome: "Chegadas",
                link: "/chegada",
                ativo: false,
                modal: caminho + 'saida.html',
                ctl: 'saidaCtl',
                size: 'lg',
                dbase: 'chegadas',
                campos: [{id: "geral", nome: "Geral"},
                    {id: "dataBr", nome: "Data", tipo: "data"},
                    {id: "placa", nome: "Placa", tipo: "selecao"},
                    {id: "nf", nome: "NF", tipo: "texto"},
                    {id: "prodStr", nome: "Produto", tipo: "selecao"},
                    {id: "chegaBr", nome: "Chegada", tipo: "data"}],
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="data" style="width: 10%">Data</th>' +
                '<th at-attribute="hora" style="width: 10%">Hora</th>' +
                '<th at-attribute="nf" style="width: 10%">NF</th>' +
                '<th at-attribute="pesonf" style="width: 10%">Peso NF</th>' +
                '<th at-attribute="ativo" style="width: 10%">Placa</th>' +
                '<th at-attribute="prodStr" style="width: 10%">Produto</th>' +
                '<th at-attribute="chega" style="width: 18%"> Chegada</th>' +
                '<th at-attribute="balanca" style="width: 12%">Balança</th>' +
                '<th at-attribute="block" style="width: 5%"> &nbsp; </th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-sortable at-initial-sorting="desc" at-attribute="data" ng-click="novo(item)" style="width: 10%; margin-top: 8px; cursor: pointer;">{{item.dataBr}}</td>' +
                '<td at-sortable at-attribute="hora" ng-click="novo(item)" style="width: 10%; margin-top: 8px; cursor: pointer;">{{item.horaStr}}</td>' +
                '<td at-implicit at-sortable at-attribute="nf" ng-click="novo(item)" style="width: 10%; margin-top: 8px; cursor: pointer;"></td>' +
                '<td at-implicit at-sortable at-attribute="pesonf" ng-click="novo(item)" style="width: 10%; margin-top: 8px; cursor: pointer;"></td>' +
                '<td at-implicit at-sortable at-attribute="placa" ng-click="novo(item)" style="width: 10%; margin-top: 8px; cursor: pointer;"></td>' +
                '<td at-implicit at-sortable at-attribute="prodStr" ng-click="novo(item)" style="width: 10%; margin-top: 8px; cursor: pointer;"></td>' +

                '<td at-sortable at-attribute="chega" ng-click="item.block = false" style="width: 18%; margin: 0;">' +
                '<div class="input-group" ng-class="' +
                "{'has-error': " +
                '!item.chega}">' +
                '<input class="form-control input-sm" uib-datepicker-popup="dd/MM/yy" datepicker-options="dateOptions"' +
                'show-button-bar="false" ng-model="item.chega" is-open="item.aberto" min-date="item.dataOrigem" ' +
                'datepicker-append-to-body="true" ng-readonly="item.block || atual.length > 0"/>' +
                '<span class="input-group-btn" ng-if="!item.block && atual.length == 0">' +
                '<button type="button" class="btn btn-sm btn-primary" ng-click="abrePickerItem(item)">' +
                '<i class="fa fa-calendar"></i></button>' +
                '</span>' +
                '</div>' +
                '</td>' +

                '<td at-sortable at-attribute="balanca" ng-click="item.block = false" style="width: 12%; margin: 0;">' +
                '<input class="form-control input-sm" type="number" ng-model="item.balanca" min="0" step="0.1"' +
                ' ng-readonly="item.block || atual.length > 0">' +
                '</td>' +

                '<td at-attribute="block" class="text-center" style="width: 5%; margin: 0;">' +
                '<i class="fa fa-check-square-o fa-2x text-success" style="padding-top: 5px;" ' +
                'ng-if="!item.block && item.chega" ng-click="salvaItem(item)" title="Salvar"></i>' +
                '</td>' +

                fim
            },

            /* 4 - AJUSTES */
            {
                id: "ajuste",
                nome: "Ajustes",
                link: "/ajuste",
                ativo: false,
                modal: caminho + 'ajuste.html',
                ctl: 'ajusteCtl',
                size: '',
                dbase: 'ajustes',
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="data" style="width: 50%"> Período </th>' +
                '<th at-attribute="percentual" style="width: 45%"> Percentual (%) </th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)

                '<td at-sortable at-initial-sorting="desc" at-attribute="data" ng-click="novo(item)" style="width: 50%">' +
                '{{ pegaMes[item.mes].nome + "/" + item.ano }}</td>' +
                '<td at-implicit at-sortable at-attribute="percentual" ng-click="novo(item)" style="width: 45%"></td>' +

                fim
            }
        ];

    }]);
