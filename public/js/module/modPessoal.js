/*
 módulo de Pessoal v1.0
 2016 Nilton Cruz
 */

'use strict';

angular.module( 'modPessoal', ['modBase'] )

    .run(['$rootScope', function($rootScope){

        var caminho = "partial/pessoal/";

        var ini =
            '<table class="scroll" at-table at-list="lista">' +
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
            '</table>';


        // Menu de Controles
        $rootScope.menu.pessoal = [

            /* 1 - FALTAS */
            {
                id: "ponto",
                nome: "Pontos",
                link: "/ponto",
                ativo: false,
                modal: caminho + 'ponto.html',
                ctl: 'pontoCtl',
                dbase: 'pessoal',
                size: 'lg',
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="data" style="width: 20%">Data</th>' +
                '<th at-attribute="presencaTot" style="width: 25%">Presenças</th>' +
                '<th at-attribute="faltaTot" style="width: 25%">Faltas</th>' +
                '<th at-attribute="outrosTot" style="width: 25%">Outros</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-sortable at-initial-sorting="desc" at-attribute="data" ng-click="novo(item)" style="width: 20%">{{item.dataBr}}</td>' +
                '<td at-implicit at-sortable at-attribute="presencaTot" ng-click="novo(item)" style="width: 25%"></td>' +
                '<td at-implicit at-sortable at-attribute="faltaTot" ng-click="novo(item)" style="width: 25%"></td>' +
                '<td at-implicit at-sortable at-attribute="outrosTot" ng-click="novo(item)" style="width: 25%"></td>' +

                fim
            },

            /* 2 - ALIMENTAÇÃO */
            {
                id: "alimenta",
                nome: "Alimentação",
                link: "/alimenta",
                ativo: false,
                modal: caminho + 'alimenta.html',
                ctl: 'alimentaCtl',
                size: "",
                dbase: 'alimenta',
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="data" style="width: 20%">Data</th>' +
                '<th at-attribute="prodStr" style="width: 75%">Produtos</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-sortable at-initial-sorting="desc" at-attribute="data" ng-click="novo(item)" style="width: 20%">{{item.dataBr}}</td>' +
                '<td at-implicit at-sortable at-attribute="prodStr" ng-click="novo(item)" style="width: 75%"></td>' +

                fim
            }

        ];


        // Tipos de Ocorrências - Pessoal
        $rootScope.tipoPessoal = [

            {id: "PS", nome: "PRESENÇA", justifica: false, periodo: false},
            {id: "FL", nome: "FALTA", justifica: true, periodo: false},
            {id: "FG", nome: "FOLGA", justifica: true, periodo: false},
            {id: "FR", nome: "FÉRIAS", justifica: false, periodo: true},
            {id: "AT", nome: "ATESTADO", justifica: false, periodo: true},
            {id: "SP", nome: "SUSPENSO", justifica: true, periodo: true},
            {id: "LP", nome: "LICENÇA PAT.", justifica: false, periodo: true},
            {id: "LP", nome: "LICENÇA MAT.", justifica: false, periodo: true},
            {id: "LI", nome: "LICENÇA INSS", justifica: false, periodo: true},
            {id: "RR", nome: "REPOUSO R.", justifica: true, periodo: true}

        ];

    }]);
