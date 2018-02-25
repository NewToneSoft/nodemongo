/*
 módulo de Cadastros v1.0
 2016 Nilton Cruz
 */

'use strict';

angular.module( 'modCadastro', ['modBase'] )

    .run(['$rootScope', function($rootScope){

        var caminho = "partial/cadastros/";

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
            '</table>';


        // Itens de Cadastro
        $rootScope.menu.cadastro = [

            /* 1 - CONTRATOS */
            {
                nome: "Contratos",
                sing: "Contrato",
                link: "/contrato",
                ativo: false,
                modal: caminho + 'contrato.html',
                ctl: 'contratoCtl',
                dbase: 'contrato',
                size: 'lg',
                campos: [{id: "geral", nome: "Geral"},
                    {id: "tipoFull", nome: "Tipo", tipo: "selecao"},
                    {id: "fornFull", nome: "Fornecedor", tipo: "texto"},
                    {id: "listAtivos", nome: "Ativo", tipo: "texto"}],
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="tipoFull" style="width: 15%;">Tipo</th>' +
                '<th at-attribute="fornFull" style="width: 40%;">Fornecedor</th>' +
                '<th at-attribute="listAtivos" style="width: 30%;">Ativos</th>' +
                '<th at-attribute="vencido" style="width: 10%;">Válido</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-implicit at-sortable at-initial-sorting="asc" at-attribute="tipoFull" ng-click="novo(item)" style="width: 15%"></td>' +
                '<td at-implicit at-sortable at-attribute="fornFull" ng-click="novo(item)" style="width: 40%"></td>' +
                '<td at-implicit at-sortable at-attribute="listAtivos" ng-click="novo(item)" style="width: 30%"></td>' +
                '<td class="text-center" at-sortable at-attribute="vencido" ng-click="novo(item)" style="width: 10%">' +
                '<i class="fa fa-exclamation-circle fa-lg text-danger" ' +
                'ng-if="item.vencido" title="Vencido"></i>' +
                '<i class="fa fa-check-circle fa-lg text-success" ' +
                'ng-if="!item.vencido" title="Válido"></i>' +
                '</td>' +

                fim
            },

            /* 2 - FORNECEDORES */
            {
                nome: "Fornecedores",
                sing:"Fornecedor",
                link: "/forn",
                ativo: false,
                modal: caminho + 'forn.html',
                ctl: 'fornCtl',
                dbase: 'forn',
                size: 'lg',
                campos: [{id: "geral", nome: "Geral"}],
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="nome" style="width: 95%">Fornecedor</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-implicit at-sortable at-initial-sorting="asc" at-attribute="nome" ng-click="novo(item)" style="width: 95%"></td>' +

                fim
            },

            /* 3 - FUNCIONÁRIOS */
            {
                nome: "Funcionários",
                sing:"Funcionário",
                link: "/funcionario",
                ativo: false,
                modal: caminho + 'funcionario.html',
                ctl: 'funcionarioCtl',
                dbase: 'funcionario',
                size: 'lg',
                campos: [{id: "geral", nome: "Geral"},
                    {id: "nome", nome: "Nome", tipo: "texto"},
                    {id: "cargoStr", nome: "Cargo", tipo: "selecao"}],
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="nome" style="width: 65%">Funcionário</th>' +
                '<th at-attribute="cargoStr" style="width: 30%">Cargo</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-implicit at-sortable at-initial-sorting="asc" at-attribute="nome" ng-click="novo(item)" style="width: 65%"></td>' +
                '<td at-sortable at-attribute="cargoStr" ng-click="novo(item)" style="width: 30%"> {{item.cargoStr}}</td>' +

                fim
            },

            /* 4 - STATUS / ATIVIDADES */
            {
                nome: "Atividades",
                sing: "Atividade",
                link: "/atividade",
                ativo: false,
                modal: caminho + 'atividade.html',
                ctl: 'atividadeCtl',
                dbase: 'atividade',
                size: '',
                campos: [{id: "geral", nome: "Geral"},
                    {id: "nome", nome: "Nome", tipo: "texto"},
                    {id: "statusFull", nome: "Status", tipo: "selecao"}],
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="nome" style="width: 65%">Atividade</th>' +
                '<th at-attribute="statusFull" style="width: 30%">Status</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-implicit at-sortable at-initial-sorting="asc" at-attribute="nome" ng-click="novo(item)" style="width: 65%"></td>' +
                '<td at-implicit at-sortable at-attribute="statusFull" ng-click="novo(item)" style="width: 30%"></td>' +

                fim
            },

            /* 5 - PRODUTOS */
            {
                nome: "Produtos",
                sing: "Produto",
                link: "/produto",
                ativo: false,
                modal: caminho + 'produto.html',
                ctl: 'produtoCtl',
                dbase: 'produto',
                size: '',
                campos: [{id: "geral", nome: "Geral"}],
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="nome" style="width: 45%">Produto</th>' +
                '<th at-attribute="categStr" style="width: 50%">Categoria</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-implicit at-sortable at-initial-sorting="asc" at-attribute="nome" ng-click="novo(item)" style="width: 45%"></td>' +
                '<td at-implicit at-sortable at-attribute="categStr" ng-click="novo(item)" style="width: 50%"></td>' +

                fim
            },

            /* 6 - EQUIPES */
            {
                nome: "Equipes",
                sing: "Equipe",
                link: "/equipe",
                ativo: false,
                modal: caminho + 'equipe.html',
                ctl: 'equipeCtl',
                dbase: 'equipe',
                size: 'lg',
                campos: [{id: "geral", nome: "Geral"},
                    {id: "nome", nome: "Nome", tipo: "texto"},
                    {id: "hiniStr", nome: "Início", tipo: "texto"},
                    {id: "hfimStr", nome: "Fim", tipo: "texto"}],
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="nome" style="width: 65%">Equipe</th>' +
                '<th at-attribute="qtd" style="width: 30%">Qtd. Pessoas</th>' +


                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-implicit at-sortable at-initial-sorting="asc" at-attribute="nome" ng-click="novo(item)" style="width: 65%"></td>' +
                '<td at-implicit at-sortable at-attribute="qtd" ng-click="novo(item)" style="width: 30%"></td>' +


                fim
            },

            /* 7 - TURNOS */
            {
                nome: "Turnos",
                sing: "Turno",
                link: "/turno",
                ativo: false,
                modal: caminho + 'turno.html',
                ctl: 'turnoCtl',
                dbase: 'turno',
                size: 'lg',
                campos: [{id: "geral", nome: "Geral"},
                    {id: "nome", nome: "Nome", tipo: "texto"},
                    {id: "hiniStr", nome: "Início", tipo: "texto"},
                    {id: "hfimStr", nome: "Fim", tipo: "texto"}],
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="nome" style="width: 65%">Turno</th>' +
                '<th at-attribute="hini" style="width: 15%">Início</th>' +
                '<th at-attribute="hfim" style="width: 15%">Fim</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-implicit at-sortable at-initial-sorting="asc" at-attribute="nome" ng-click="novo(item)" style="width: 65%"></td>' +
                '<td at-sortable at-attribute="hini" ng-click="novo(item)" style="width: 15%"> {{item.hiniStr}}</td>' +
                '<td at-sortable at-attribute="hfim" ng-click="novo(item)" style="width: 15%"> {{item.hfimStr}}</td>' +

                fim
            }

        ];

    }]);
