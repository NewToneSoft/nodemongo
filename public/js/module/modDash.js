/*
 módulo de Dashboard v1.0
 2016 Nilton Cruz
 */

'use strict';

angular.module( 'modDash', ['modBase'] )

    .run(['$rootScope', function($rootScope){

        var topo = 65,
            esquerda = 25;

        $rootScope.lang = [];
        $rootScope.lang.actual = 'pt';

        $rootScope.dash = [];

        $rootScope.dash.areas = {
            main: {id: "main", nome: 'Geral', name: 'Main', infos: [], visible: true},
            log: {id: "log", nome: 'Logística', name: 'Logistic', infos: [], visible: true},
            abast: {id: "abast", nome: 'Abastecimentos', name: 'Supplies', infos: [], visible: true},
            locacao: {id: "locacao", nome: 'Locações', name: 'Equipments', infos: [], visible: true}
        };

        $rootScope.dash.widgets = [

            /* ABASTECIMENTOS */
            // ESTOQUE DE DIESEL (MAIN)
            {
                id: 'AB0',
                categ: 'main',
                color: '#32c5d2',
                estilo: 'main',
                visible: true,
                top: topo,
                left: esquerda,
                input: '<div class="icone"> <i class="fa fa-tint"></i> </div>'+
                '<div class="detalhe">' +
                '<div class="numero"> {{ dash.areas["abast"].infos[ dash.areas["abast"].infos.length - 1 ].saldo | number: 0}} L.</div>' +
                '<div class="desc"> {{(lang.actual === "pt") ? "Estoque de Diesel" : "Oil Stock" }}<br>' +
                '<span style="font-size: 12px;"> {{ ((lang.actual === "pt") ? "até " : " until ") + ' +
                'dash.areas["abast"].infos[ dash.areas["abast"].infos.length - 1 ].ultData }}</span> </div>' +
                '</div>' +
                '<a class="mais" style="background-color: #2bb8c4;" ng-click="abreModal(' +
                "'resumogeral.html', false" +
                ')"> + {{(lang.actual === "pt") ? "VEJA MAIS" : "VIEW MORE"}}<i class="fa fa-arrow-circle-o-right fa-lg"></i></a>'+

                    /* MODAL */
                '<script type="text/ng-template" id="resumogeral.html">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" ng-click="cancel()" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span></button>' +
                '<h4 class="modal-title text-center"> {{(lang.actual === "pt") ? "Resumo - Combustíveis" : "Summary - Oil Supply" }} </h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div style="padding: 0 15px">' +
                '<table class="tableDash">' +
                '<thead style="background-color: #c9d3dd;">'+
                '<tr style="height: 30px;">'+
                '<th style="text-align: center;"> {{(lang.actual === "pt") ? "Ativo" : "Equipment" }} </th>'+
                '<th style="text-align: center;"> {{(lang.actual === "pt") ? "Entradas" : "Entries" }} </th>'+
                '<th style="text-align: center;"> {{(lang.actual === "pt") ? "Saídas" : "Outputs" }} </th>'+
                '<th style="text-align: center;"> {{(lang.actual === "pt") ? "Saldo" : "Balance" }} </th>'+
                '</tr>'+
                '</thead>'+
                '<tbody class="text-center" style="border-top: 1px solid #8C8C8C;">'+
                '<tr ng-repeat="pr in dash.areas[' +
                " 'abast' "+
                '].infos">'+
                '<td> <h5>{{ pr.nome }}</h5> </td>'+
                '<td> <h6 ng-class="{zerado: pr.entrada == 0}"> {{ pr.entrada | number:2 }}</h6> </td>'+
                '<td> <h6 ng-class="{zerado: pr.saida == 0}"> {{ pr.saida | number:2 }}</h6> </td>'+
                '<td> <h6 ng-class="{zerado: pr.saldo == 0}"> {{ pr.saldo | number:2 }}</h6> </td>'+
                '</tr>'+
                '</tbody>'+
                '</table>'+
                '</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<div class="pull-right">' +
                '<button class="btn btn-primary" type="button" style="background-color: #395a7a; border-radius: 0;" ' +
                'ng-click="mudaAba(' +
                "'abast'" +
                ')"> {{(lang.actual === "pt") ? "Ir para Abastecimentos" : "Go to Oil Supplies" }}</button>' +
                '</div>' +
                '</div>' +
                '</script>'
            },

            // TABELA DE RESUMO DE ABASTECIMENTOS
            {
                id: 'AB1',
                categ: 'abast',
                estilo: 'tab',
                visible: true,
                top: topo,
                left: esquerda + 455,
                width: 450,
                /*height: 400,*/
                input:'<div style="padding: 5px; min-height: 30px; border-bottom: 1px solid #e7ecf1; color: #32c5d2;">' +
                '<div class="text-center" style="font-size: 15px; line-height: 20px; text-transform: uppercase; ' +
                'font-weight: 700;">' +
                '<i class="fa fa-tint"></i>' +
                '<span style="padding-left: 5px;">{{(lang.actual === "pt") ? "Resumo - Abastecimentos" : "Summary - Oil Supplies" }}</span>' +
                '</div> </div>' +
                '<table class="tableDash">' +
                '<thead>'+
                '<tr style="height: 30px;">'+
                '<th style="text-align: center;"> {{(lang.actual === "pt") ? "Ativo" : "Equipment" }} </th>'+
                '<th style="text-align: center;"> {{(lang.actual === "pt") ? "Entradas" : "Entries" }} </th>'+
                '<th style="text-align: center;"> {{(lang.actual === "pt") ? "Saídas" : "Outputs" }} </th>'+
                '<th style="text-align: center;"> {{(lang.actual === "pt") ? "Saldo" : "Balance" }} </th>'+
                '</tr>'+
                '</thead>'+
                '<tbody class="total text-center">'+
                '<tr ng-repeat="pr in dash.areas[' +
                " 'abast' "+
                '].infos" on-finish-render="AB1" ng-click="abreModal(' +
                "'resumoesp.html', $last, pr" +
                ')" >'+
                '<td> <h5>{{ pr.nome }}</h5> </td>'+
                '<td> <h6 ng-class="{zerado: pr.entrada == 0}"> {{ pr.entrada | number:2 }}</h6> </td>'+
                '<td> <h6 ng-class="{zerado: pr.saida == 0}"> {{ pr.saida | number:2 }}</h6> </td>'+
                '<td> <h6 ng-class="{zerado: pr.saldo == 0}"> {{ pr.saldo | number:2 }}</h6> </td>'+
                '</tr>'+
                '</tbody>'+
                '</table>'+
                '</div>' +

                    /* MODAL */
                '<script type="text/ng-template" id="resumoesp.html">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" ng-click="cancel()" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span></button>' +
                '<h3 class="modal-title text-center"> {{(lang.actual === "pt") ? "RESUMO" : "SUMMARY" }} - {{campo.nome.toUpperCase()}}</h3>'+
                '</div>' +
                '<div class="modal-body">' +
                '<div style="padding: 0 15px">' +
                '<table class="scroll tableDash" at-table at-list="campo.resumo" style="margin-bottom: 0 !important;">' +
                '<thead ng-class="{size: campo.resumo.length > 16}">'+
                '<tr>'+
                '<th class="text-center" at-attribute="dataOrig" style="width: 25%">{{(lang.actual === "pt") ? "Data" : "Date" }}</th>' +
                '<th class="text-center" at-attribute="entrada" style="width: 25%">{{(lang.actual === "pt") ? "Entradas" : "Entries" }}</th>' +
                '<th class="text-center" at-attribute="saida" style="width: 25%">{{(lang.actual === "pt") ? "Saídas" : "Outputs" }}</th>' +
                '<th class="text-center" at-attribute="saldo" style="width: 25%">{{(lang.actual === "pt") ? "Saldo" : "Balance" }}</th>' +
                '</tr>'+
                '</thead>'+
                '<tbody class="text-center">'+
                '<tr>'+
                '<td at-initial-sorting="desc" at-sortable at-attribute="dataOrig" style="width: 25%"> {{item.data}} </td>' +
                '<td at-sortable at-attribute="entrada" ng-class="{zerado: item.entrada == 0}" style="width: 25%">' +
                ' {{item.entrada | number:2}} </td>' +
                '<td at-sortable at-attribute="saida" ng-class="{zerado: item.saida == 0}" style="width: 25%">' +
                ' {{item.saida | number:2}} </td>' +
                '<td at-sortable at-attribute="saldo" ng-class="{zerado: item.saldo == 0}" style="width: 25%">' +
                ' {{item.saldo | number:2}} </td>' +
                '</tr>'+
                '</tbody>'+
                '</table>'+
                '</div>' +
                '</div>' +
                '</script>'

            },

            // GRÁFICO DE CONSUMO DE COMBUSTÍVEL
            {
                id: 'AB2',
                categ: 'abast',
                estilo: 'graf',
                visible: true,
                top: topo,
                left: esquerda,
                width: 450,
                tipo: "line",
                icon: "tint",
                color: '#32c5d2',
                input: "{{(lang.actual == 'pt') ? 'Abastecimentos' : 'Supplies'}}"

            },
            /* FINAL - ABASTECIMENTOS */


            /* LOGÍSTICA */
            // EM TRANSPORTE (MAIN)
            {
                id: 'LG0',
                categ: 'main',
                estilo: 'main',
                visible: true,
                color: '#3598dc',
                top: topo,
                left: esquerda + 335,
                input: '<div class="icone"> <i class="fa fa-truck"></i> </div>'+
                '<div class="detalhe">' +
                '<div class="numero"> {{ (dash.areas["log"].infos.transp + dash.areas["log"].infos.recebe) | number: 0}} Tons.</div>' +
                '<div class="desc"> ' +
                '{{(lang.actual === "pt") ? "Em Transporte" : "In Transportation" }}: ' +
                '<strong> {{ dash.areas["log"].infos.transp | number: 2}}</strong> Tons.<br/>' +

                '{{(lang.actual === "pt") ? "Recebidos" : "Received" }}: ' +
                '<strong> {{ dash.areas["log"].infos.recebe | number: 2}}</strong> Tons.' +

                '</div> </div>' +
                '<a class="mais" style="background-color: #258fd7;" ng-click="abreModal(' +
                "'resumolog.html', false, null, 'lg'" +
                ')"> + {{(lang.actual === "pt") ? "VEJA MAIS" : "VIEW MORE"}}<i class="fa fa-arrow-circle-o-right fa-lg"></i></a>'+


                    /*                '<h4 class="text-center" style="margin-top: 15px; text-decoration: underline;"> {{(lang.actual === "pt") ? "Logística" : "Logistic" }} </h4>' +
                     '<h3 class="text-center" style="margin-top: 10px;"> {{(lang.actual === "pt") ? "Em Transporte" : "In Transportation" }}: ' +
                     '<strong> {{ dash.areas["log"].infos.transp | number: 2}} </strong>' +
                     '</h3>' +
                     '<h3 class="text-center" style="margin-top: 10px;"> {{(lang.actual === "pt") ? "Recebidos" : "Received" }}: ' +
                     '<strong> {{ dash.areas["log"].infos.recebe | number: 2}} </strong>' +
                     '</h3>' +
                     '<hr style="margin: 0;">' +
                     '<h2 class="text-center" style="margin-top: 10px;"> Total: ' +
                     '<strong> {{ (dash.areas["log"].infos.transp + dash.areas["log"].infos.recebe) | number: 2}} </strong>' +
                     '</h2>' +
                     '</div>'+*/

                    /* MODAL */
                '<script type="text/ng-template" id="resumolog.html">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" ng-click="cancel()" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span></button>' +
                '<h4 class="modal-title text-center"> {{(lang.actual === "pt") ? "Resumo - Logística" : "Summary - Logistic" }} </h4>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div style="padding: 0 15px">' +
                '<table class="scroll tableDash">' +
                '<thead style="background-color: #c9d3dd;">'+
                '<tr style="height: 30px;">'+
                '<th style="text-align: center; width: 12%">{{(lang.actual === "pt") ? "Data" : "Date" }}</th>' +
                '<th style="text-align: center; width: 11%">{{(lang.actual === "pt") ? "Hora" : "Hour" }}</th>' +
                '<th style="text-align: center; width: 11%">Ticket</th>' +
                '<th style="text-align: center; width: 11%">{{(lang.actual === "pt") ? "Peso" : "Weight" }}</th>' +
                '<th style="text-align: center; width: 11%">{{(lang.actual === "pt") ? "NF" : "Invoice" }}</th>' +
                '<th style="text-align: center; width: 11%">{{(lang.actual === "pt") ? "Peso NF" : "Inv. Weight" }}</th>' +
                '<th style="text-align: center; width: 13%">{{(lang.actual === "pt") ? "Placa" : "Equipment" }}</th>' +
                '<th style="text-align: center; width: 12%">{{(lang.actual === "pt") ? "Produto" : "Product" }}</th>' +
                '<th style="width: 3%"> &nbsp; </th>' +
                '</tr>'+
                '</thead>'+
                '<tbody class="text-center" style="border-top: 1px solid #8C8C8C;">'+
                '<tr ng-repeat="pr in dash.areas[' +
                " 'log' "+
                '].infos.resumo">'+
                '<td style="width: 12%">{{pr.dataBr}}</td>' +
                '<td style="width: 11%">{{pr.horaStr}}</td>' +
                '<td style="width: 11%">{{pr.ticket}}</td>' +
                '<td style="width: 11%">{{pr.peso | number:2}}</td>' +
                '<td style="width: 11%">{{pr.nf}}</td>' +
                '<td style="width: 11%">{{pr.pesonf | number:2}}</td>' +
                '<td style="width: 13%" title="{{pr.descricao}}">{{pr.ativoStr}}</td>' +
                '<td style="width: 12%">{{pr.prodStr}}</td>' +
                '<td class="text-center" style="width: 3%">' +
                '<i class="fa fa-truck fa-lg text-warning" ng-if="!pr.chegou" title="Em Transporte"></i>' +
                '<i class="fa fa-check-circle fa-lg text-success" ng-if="pr.chegou" title="Recebido"></i>' +
                '</td>' +
                '</tr>'+
                '</tbody>'+
                '</table>'+
                '</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<div class="pull-right">' +
                '<button class="btn btn-primary" type="button" style="background-color: #395a7a; border-radius: 0;" ' +
                'ng-click="mudaAba(' +
                "'log'" +
                ')"> {{(lang.actual === "pt") ? "Ir para Logística" : "Go to Logistic" }}</button>' +
                '</div>' +
                '</div>' +
                '</script>'
            },

            // TABELA DE RESUMO DE LOGÍSTICA
            {
                id: 'LG1',
                categ: 'log',
                estilo: 'tab',
                visible: true,
                top: topo,
                left: esquerda + 405,
                width: 500,
                /*height: 400,*/
                input: '<div style="padding: 5px; min-height: 30px; border-bottom: 1px solid #e7ecf1; color: #3598dc;">' +
                '<div class="text-center" style="font-size: 15px; line-height: 20px; text-transform: uppercase; ' +
                'font-weight: 700;">' +
                '<i class="fa fa-truck"></i>' +
                '<span style="padding-left: 5px;">{{(lang.actual === "pt") ? "Resumo - Logística" : "Summary - Logistic" }}</span>' +
                '</div> </div>' +
                '<table class="scroll tableDash" style="margin-bottom: 0 !important;">' +
                '<thead>'+
                '<tr style="height: 30px;">'+
                '<th style="text-align: center; width: 12%">{{(lang.actual === "pt") ? "Data" : "Date" }}</th>' +
                '<th style="text-align: center; width: 11%">{{(lang.actual === "pt") ? "Hora" : "Hour" }}</th>' +
                '<th style="text-align: center; width: 11%">Ticket</th>' +
                '<th style="text-align: center; width: 11%">{{(lang.actual === "pt") ? "Peso" : "Weight" }}</th>' +
                '<th style="text-align: center; width: 11%">{{(lang.actual === "pt") ? "NF" : "Invoice" }}</th>' +
                '<th style="text-align: center; width: 11%">{{(lang.actual === "pt") ? "Peso NF" : "Inv. Weight" }}</th>' +
                '<th style="text-align: center; width: 13%">{{(lang.actual === "pt") ? "Ativo" : "Equipment" }}</th>' +
                '<th style="text-align: center; width: 12%">{{(lang.actual === "pt") ? "Produto" : "Product" }}</th>' +
                '<th style="width: 3%"> &nbsp; </th>' +
                '</tr>'+
                '</thead>'+
                '<tbody class="text-center" style="height: 200px;">'+
                '<tr ng-repeat="pr in dash.areas[' +
                " 'log' "+
                '].infos.resumo" on-finish-render="LG1">'+
                '<td style="width: 12%">{{pr.dataBr}}</td>' +
                '<td style="width: 11%">{{pr.horaStr}}</td>' +
                '<td style="width: 11%">{{pr.ticket}}</td>' +
                '<td style="width: 11%">{{pr.peso | number:2}}</td>' +
                '<td style="width: 11%">{{pr.nf}}</td>' +
                '<td style="width: 11%">{{pr.pesonf | number:2}}</td>' +
                '<td style="width: 13%" title="{{pr.descricao}}">{{pr.ativoStr}}</td>' +
                '<td style="width: 12%">{{pr.prodStr}}</td>' +
                '<td class="text-center" style="width: 3%">' +
                '<i class="fa fa-truck fa-lg text-warning" ng-if="!pr.chegou" title="Em Transporte"></i>' +
                '<i class="fa fa-check-circle fa-lg text-success" ng-if="pr.chegou" title="Recebido"></i>' +
                '</td>' +
                '</tr>'+
                '</tbody>'+
                '</table>'+
                '</div>'

            },

            // GRÁFICO DE RESUMO DE LOGÍSTICA
            {
                id: 'LG2',
                categ: 'log',
                estilo: 'graf',
                visible: true,
                top: topo,
                left: esquerda,
                width: 400,
                tipo: "bar",
                icon: "truck",
                color: '#3598dc',
                input: "{{(lang.actual == 'pt') ? 'Tons. Transportadas' : 'Tons. Transported'}}"

            },
            /* FINAL - LOGÍSTICA */


            /* LOCAÇÕES */
            // TABELA DE RESUMO DE LOCAÇÕES
            {
                id: 'LC1',
                categ: 'locacao',
                estilo: 'tab',
                visible: true,
                top: topo,
                left: esquerda,
                width: 650,
                input: '<div style="padding: 5px; min-height: 30px; border-bottom: 1px solid #e7ecf1;">' +
                '<div class="text-center" style="font-size: 15px; line-height: 20px; text-transform: uppercase; ' +
                'font-weight: 700;">' +
                '<i class="dashIcon fa fa-angle-double-left fa-lg" title="Mês Anterior" ng-if="periodo.atras" ng-click="mudaPeriodo(true, ' +
                "'locacao'"+
                ')"></i>'+
                '{{(lang.actual === "pt") ? "Locações" : "Equipments"}} - {{periodo.str}}' +
                '<i class="dashIcon fa fa-angle-double-right fa-lg" title="Próximo Mês" ng-if="periodo.frente" ng-click="mudaPeriodo(false, ' +
                "'locacao'"+
                ')"></i>'+
                '</div> </div>' +
                '<table class="scroll tableDash" style="margin-bottom: 0 !important;">' +
                '<thead>'+
                '<tr style="height: 30px;">'+
                '<th style="text-align: center; width: 20%;"> {{(lang.actual === "pt") ? "Cód" : "Code" }} </th>'+
                '<th style="text-align: center; width: 40%;"> {{(lang.actual === "pt") ? "Descrição" : "Description" }} </th>'+
                '<th style="text-align: center; width: 13%;"> {{(lang.actual === "pt") ? "Horas Trab." : "Work. Hours" }} </th>'+
                '<th style="text-align: center; width: 11%;"> {{(lang.actual === "pt") ? "Horas Gar." : "Guarant. Hours" }} </th>'+
                '<th style="text-align: center; width: 11%;"> {{(lang.actual === "pt") ? "Diesel" : "Oil" }} </th>'+
                '<th style="text-align: center; width: 5%;"> </th>'+
                '</tr>'+
                '</thead>'+
                '<tbody class="text-center" style="height: 200px;">'+
                '<tr ng-repeat="pr in dash.areas[' +
                " 'locacao' "+
                '].infos" on-finish-render="LC1" ng-click="abreModal(' +
                "'resumoloc.html', false, pr, 'lg'" +
                ')">'+
                '<td style="width: 20%; cursor: pointer;"> {{ pr.cod }} </td>'+
                '<td style="text-align: left; width: 40%; cursor: pointer;">  {{ pr.descricao }} </td>'+
                '<td style="width: 13%; cursor: pointer;" ng-class="{zerado: pr.ht == 0}"> {{ pr.ht | number:1 }} </td>'+
                '<td style="width: 11%; cursor: pointer;" ng-class="{zerado: pr.hg == 0}"> {{ pr.hg | number:1 }} </td>'+
                '<td style="width: 11%; cursor: pointer;" ng-class="{zerado: pr.ds == 0}"> {{ pr.ds | number:1 }} </td>'+
                '<td style="width: 5%; cursor: pointer;"> ' +
                '<i class="fa fa-minus-circle fa-lg text-danger" ng-if="pr.hg >= pr.ht"></i>'+
                '<i class="fa fa-check-circle fa-lg text-success" ng-if="pr.ht > pr.hg"></i>' +
                '</td>'+
                '</tr>'+
                '</tbody>'+
                '</table>'+
                '</div>' +

                    /* MODAL */
                '<script type="text/ng-template" id="resumoloc.html">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" ng-click="cancel()" aria-label="Close">' +
                '<span aria-hidden="true">&times;</span></button>' +
                '<h3 class="modal-title text-center"> {{(lang.actual === "pt") ? "RESUMO" : "SUMMARY" }} - {{campo.cod.toUpperCase()}}</h3>'+
                '</div>' +
                '<div class="modal-body">' +
                '<div style="padding: 0 15px">' +
                '<table class="scroll tableDash" at-table at-list="campo.resumo" style="margin-bottom: 0 !important;">' +
                '<thead ng-class="{size: campo.resumo.length > 16}">'+
                '<tr>'+
                '<th class="text-center" at-attribute="dataOrig" style="width: 12%">{{(lang.actual === "pt") ? "Data" : "Date" }}</th>' +
                '<th class="text-center" at-attribute="inicio" style="width: 9%">{{(lang.actual === "pt") ? "Início" : "Begin" }}</th>' +
                '<th class="text-center" at-attribute="final" style="width: 9%">Final</th>' +
                '<th class="text-center" at-attribute="trab" style="width: 9%">{{(lang.actual === "pt") ? "Trab." : "Work" }}</th>' +
                '<th class="text-center" at-attribute="gar" style="width: 9%">Gar.</th>' +
                '<th class="text-center" at-attribute="diesel" style="width: 10%">{{(lang.actual === "pt") ? "Diesel/Dia" : "Oil/Day" }}</th>' +
                '<th class="text-center" at-attribute="porHora" style="width: 10%">{{(lang.actual === "pt") ? "Diesel/Hora" : "Oil/Hour" }}</th>' +
                '<th class="text-center" at-attribute="status" style="width: 15%">Status</th>' +
                '<th class="text-center" at-attribute="atividade" style="width: 17%">{{(lang.actual === "pt") ? "Ativ." : "Activ." }}</th>' +
                '</tr>'+
                '</thead>'+
                '<tbody class="text-center">'+
                '<tr>'+
                '<td at-initial-sorting="asc" at-sortable at-attribute="dataOrig" style="width: 12%"> {{item.data}} </td>' +
                '<td at-implicit at-sortable at-attribute="inicio" style="width: 9%"></td>' +
                '<td at-implicit at-sortable at-attribute="final" style="width: 9%"></td>' +
                '<td at-sortable at-attribute="trab" ng-class="{zerado: item.trab == 0}" style="width: 9%">' +
                ' {{item.trab | number:1}} </td>' +
                '<td at-sortable at-attribute="gar" ng-class="{zerado: item.gar == 0}" style="width: 9%">' +
                ' {{item.gar | number:1}} </td>' +
                '<td at-sortable at-attribute="diesel" ng-class="{zerado: item.diesel == 0}" style="width: 10%">' +
                ' {{item.diesel | number:1}} </td>' +
                '<td at-sortable at-attribute="porHora" ng-class="{zerado: item.porHora == 0}" style="width: 10%">' +
                ' {{item.porHora | number:1}} </td>' +
                '<td at-implicit at-sortable at-attribute="status" style="width: 15%;"></td>' +
                '<td at-implicit at-sortable at-attribute="atividade" style="width: 17%;"></td>' +
                '</tr>'+
                '</tbody>'+
                '</table>'+
                '</div>' +
                '</div>' +
                '</script>'

            }
            /* FINAL - LOCAÇÕES */

        ];

    }]);
