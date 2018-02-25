/*
 módulo de Produção v1.0
 2016 Nilton Cruz
 */

'use strict';

angular.module( 'modProducao', ['modBase'] )

    .run(['$rootScope', function($rootScope){

        var caminho = "partial/producao/";

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
            '<tr>'+
            '<td class="text-center" style="width: 5%; margin-top: 2px;"><input type="checkbox" ng-change="addLista(item)" ng-model="item.chk"></td>';

        var fim =
            '</tr>'+
            '</tbody>'+
            '</table>' +
            '<div class="text-center">';


        // Menu de Controles
        $rootScope.menu.producao = [

            /* 1 - PRODUÇÕES */
            {
                id: "prod",
                nome: "Produções",
                link: "/prod",
                ativo: false,
                modal: caminho + 'prod.html',
                ctl: 'prodCtl',
                dbase: "producao",
                campos: [{id: "geral", nome: "Geral"},
                    {id: "dataBr", nome: "Data", tipo: "data"},
                    {id: "turnoStr", nome: "Turno", tipo: "selecao"}],
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="data" style="width: 35%">Data</th>' +
                '<th at-attribute="turnoStr" style="width: 30%">Turno</th>' +
                '<th at-attribute="quant" style="width: 30%">Quant.</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-sortable at-initial-sorting="desc" at-attribute="data" ng-click="novo(item)" style="width: 35%">{{item.dataBr}}</td>' +
                '<td at-implicit at-sortable at-attribute="turnoStr" ng-click="novo(item)" style="width: 30%"></td>' +
                '<td at-implicit at-sortable at-attribute="quant" ng-click="novo(item)" style="width: 30%"></td>' +

                fim
            },

            /* 2 - LABORATÓRIO */
            {
                id: "labor",
                nome: "Laboratório",
                link: "/labor",
                ativo: false,
                modal: caminho + 'labor.html',
                ctl: 'laborCtl',
                dbase: "labor",
                campos: [{id: "geral", nome: "Geral"},
                    {id: "dataBr", nome: "Data", tipo: "data"},
                    {id: "prodStr", nome: "Produto", tipo: "selecao"},
                    {id: "amostra", nome: "Amostra", tipo: "texto"}],
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="data" style="width: 19%">Data</th>' +
                '<th at-attribute="hora" style="width: 19%">Hora</th>' +
                '<th at-attribute="prodStr" style="width: 19%">Produto</th>' +
                '<th at-attribute="teor" style="width: 19%">Teor</th>' +
                '<th at-attribute="amostra" style="width: 19%">Amostra</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-sortable at-initial-sorting="desc" at-attribute="data" ng-click="novo(item)" style="width: 19%">{{item.dataBr}}</td>' +
                '<td at-sortable at-attribute="hora" ng-click="novo(item)" style="width: 19%">{{item.horaBr}}</td>' +
                '<td at-implicit at-sortable at-attribute="prodStr" ng-click="novo(item)" style="width: 19%"></td>' +
                '<td at-implicit at-sortable at-attribute="teor" ng-click="novo(item)" style="width: 19%"></td>' +
                '<td at-implicit at-sortable at-attribute="amostra" ng-click="novo(item)" style="width: 19%"></td>' +

                fim
            }
        ];

    }]);
