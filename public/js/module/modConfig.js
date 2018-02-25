/*
 módulo de Configurações Gerais v1.0
 2016 Nilton Cruz
 */

'use strict';

angular.module( 'modConfig', ['modBase'] )

    .run(['$rootScope', function($rootScope){

        var caminho = "partial/config/";

        var ini =
            '<table class="scroll" at-table at-list="lista | porTodos: pesquisa.texto">' +
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


        // Itens de Cadastro
        $rootScope.menu.config = [

            /* 1 - STATUS */
            {
                nome: "Status",
                sing: "Status",
                modal: caminho + 'status.html',
                ctl: 'statusCtl',
                dbase: 'status',
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="nome" style="width: 65%">Status</th>' +
                '<th at-attribute="debito" style="width: 30%">Débito</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-implicit at-sortable at-initial-sorting="asc" at-attribute="nome" ng-click="novo(item)" style="width: 65%"></td>' +
                '<td at-implicit at-sortable at-attribute="debito" ng-click="novo(item)" style="width: 30%"></td>' +

                fim
            },

            /* 2 - CENTROS DE CUSTO */
            {
                nome: "Centros de Custo",
                sing: "Centro de Custo",
                modal: caminho + 'custos.html',
                ctl: 'custosCtl',
                dbase: 'custos',
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="nome" style="width: 95%">Centros de Custo</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-implicit at-sortable at-initial-sorting="asc" at-attribute="nome" ng-click="novo(item)" style="width: 95%"></td>' +

                fim
            },

            /* 3 - CARGOS */
            {
                nome: "Cargos",
                sing: "Cargo",
                modal: caminho + 'cargos.html',
                ctl: 'cargosCtl',
                dbase: 'cargos',
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="nome" style="width: 65%">Cargos</th>' +
                '<th at-attribute="periculosidade" style="width: 15%">Periculosidade</th>' +
                '<th at-attribute="insalubridade" style="width: 15%">Insalubridade</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-implicit at-sortable at-initial-sorting="asc" at-attribute="nome" ng-click="novo(item)" style="width: 65%"></td>' +
                '<td at-sortable at-attribute="periculosidade" ng-click="novo(item)" style="width: 15%">' +
                '{{ (item.periculosidade) ? item.periculosidade + "%" : "0%" }}' +
                '</td>' +
                '<td at-sortable at-attribute="insalubridade" ng-click="novo(item)" style="width: 15%">' +
                '{{ (item.insalubridade) ? item.insalubridade + "%" : "0%" }}' +
                '</td>' +

                fim
            },

            /* 4 - TIPOS DE MÁQUINAS */
            {
                nome: "Tipos de Máquina",
                sing: "Tipo de Máquina",
                modal: caminho + 'tipomaq.html',
                ctl: 'tipomaqCtl',
                dbase: 'tipomaq',
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="nome" style="width: 95%">Tipo de Máquina</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-implicit at-sortable at-initial-sorting="asc" at-attribute="nome" ng-click="novo(item)" style="width: 95%"></td>' +

                fim
            },

            /* 5 - MODELOS DE CONTRATO */
            {
                nome: "Modelos de Contrato",
                sing: "Modelo de Contrato",
                modal: caminho + 'mdcontrato.html',
                ctl: 'mdcontratoCtl',
                dbase: 'mdcontrato',
                size: 'lg',
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="nome" style="width: 24%">Modelo de Contrato</th>' +
                '<th at-attribute="tipoFull" style="width: 24%">Tipo de Contrato</th>' +
                '<th at-attribute="periodoFull" style="width: 24%">Periodicidade</th>' +
                '<th at-attribute="formaFull" style="width: 23%">Forma</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-implicit at-sortable at-initial-sorting="asc" at-attribute="nome" ng-click="novo(item)" style="width: 24%"></td>' +
                '<td at-implicit at-sortable at-attribute="tipoFull" ng-click="novo(item)" style="width: 24%"></td>' +
                '<td at-implicit at-sortable at-attribute="periodoFull" ng-click="novo(item)" style="width: 24%"></td>' +
                '<td at-implicit at-sortable at-attribute="formaFull" ng-click="novo(item)" style="width: 23%"></td>' +

                fim
            },

            /* 6 - CLIENTES */
            {
                nome: "Clientes",
                sing: "Cliente",
                modal: caminho + 'cliente.html',
                ctl: 'clienteCtl',
                dbase: 'clientes',
                size: 'lg',
                admin: true,
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="nome" style="width: 95%">Cliente</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-implicit at-sortable at-initial-sorting="asc" at-attribute="nome" ng-click="novo(item)" style="width: 95%"></td>' +

                fim
            },

            /* 7 - USUÁRIOS */
            {
                nome: "Usuários",
                sing: "Usuário",
                modal: caminho + 'usuario.html',
                ctl: 'usuarioCtl',
                dbase: 'usuarios',
                size: '',
                admin: true,
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="nome" style="width: 95%">Usuário</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-implicit at-sortable at-initial-sorting="asc" at-attribute="nome" ng-click="novo(item)" style="width: 95%"></td>' +

                fim
            }

        ];

    }]);
