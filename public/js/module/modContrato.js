/*
 módulo de Contratos (Locações) v1.0
 2016 Nilton Cruz
 */

'use strict';

angular.module( 'modContrato', ['modBase'] )

    .run(['$rootScope', function($rootScope){

        var caminho = "partial/controles/";

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



        // Menu de Controles
        $rootScope.menu.controles = [

            /* 1 - MÁQUINAS */
            {
                id: "equip",
                nome: "Equipamentos",
                link: "/equip",
                ativo: false,
                modal: caminho + 'equip.html',
                ctl: 'equipCtl',
                campos: [{id: "geral", nome: "Geral"},
                    {id: "dataBr", nome: "Data", tipo: "data"},
                    {id: "ativo", nome: "Ativo", tipo: "selecao"}],
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="data" style="width: 20%">Data</th>' +
                '<th at-attribute="ativo" style="width: 20%">Ativo</th>' +
                '<th at-attribute="hini" style="width: 20%">Início</th>' +
                '<th at-attribute="hfim" style="width: 20%">Final</th>' +
                '<th at-attribute="htotal" style="width: 15%">Total</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-sortable at-initial-sorting="desc" at-attribute="data" ng-click="novo(item)" style="width: 20%">{{item.dataBr}}</td>' +
                '<td at-implicit at-sortable at-attribute="ativo" ng-click="novo(item)" style="width: 20%"></td>' +
                '<td at-sortable at-attribute="hini" ng-click="novo(item)" style="width: 20%">' +
                '{{(item.categ != "cac") ? item.hini : item.hiniStr.slice(0, 5)}}</td>' +
                '<td at-sortable at-attribute="hfim" ng-click="novo(item)" style="width: 20%">' +
                '{{(item.categ != "cac") ? item.hfim : item.hfimStr.slice(0, 5)}}</td>' +
                '<td at-implicit at-sortable at-attribute="htotal" ng-click="novo(item)" style="width: 15%"></td>' +

                fim
            },

            /* 2 - ABASTECIMENTO */
            {
                id: "abast",
                nome: "Abastecimentos",
                link: "/abast",
                ativo: false,
                modal: caminho + 'abast.html',
                ctl: 'abastCtl',
                campos: [{id: "geral", nome: "Geral"},
                    {id: "dataBr", nome: "Data", tipo: "data"},
                    {id: "ativo", nome: "Fonte", tipo: "selecao"},
                    {id: "abastecido", nome: "Ativo", tipo: "selecao"}],
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="data" style="width: 10%">Data</th>' +
                '<th at-attribute="hora" style="width: 10%">Hora</th>' +
                '<th at-attribute="ativo" style="width: 15%">Fonte</th>' +
                '<th at-attribute="processo" style="width: 15%">Processo</th>' +
                '<th at-attribute="quant" style="width: 15%">Litros</th>' +
                '<th at-attribute="abastecido" style="width: 15%">Ativo</th>' +
                '<th at-attribute="ultSaldo" style="width: 15%">Saldo</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-sortable at-initial-sorting="desc" at-attribute="data" ng-click="novo(item)" style="width: 10%">{{item.dataBr}}</td>' +
                '<td at-sortable at-attribute="hora" ng-click="novo(item)" style="width: 10%;">{{item.horaStr}}</td>' +
                '<td at-sortable at-attribute="ativo" ng-click="novo(item)" style="width: 15%">{{(item.categ == "pst") ? item.ativoStr : item.ativo }}</td>' +
                '<td at-sortable at-attribute="processo" ng-click="novo(item)" style="width: 15%">' +
                '{{ (item.processo == "E") ? "Entrada" : (item.processo == "S") ? "Saída" : "Aferição" }}' +
                '</td>' +
                '<td at-implicit at-sortable at-attribute="quant" ng-click="novo(item)" style="width: 15%"></td>' +
                '<td at-sortable at-attribute="abastecido" ng-click="novo(item)" style="width: 15%">' +
                '{{ (item.abastecido)? item.abastecido : "-" }}</td>' +
                '<td at-implicit at-sortable at-attribute="ultSaldo" ng-click="novo(item)" style="width: 15%"></td>' +

                fim
            },

            /* 3 - DÉBITO / CRÉDITO */
            {
                id: "debcred",
                nome: "Débitos / Créditos",
                link: "/debcred",
                ativo: false,
                modal: caminho + 'debcred.html',
                ctl: 'debcredCtl',
                campos: [{id: "geral", nome: "Geral"},
                    {id: "dataBr", nome: "Data", tipo: "data"},
                    {id: "ativo", nome: "Ativo", tipo: "selecao"},
                    {id: "tipo", nome: "Tipo", tipo: "selecao", itens:[{id: "D", nome: "Débito"}, {id: "C", nome: "Crédito"}]}],
                tab: ini +

                    // LISTA DOS CAMPOS DE HEADER
                '<th at-attribute="data" style="width: 20%">Data</th>' +
                '<th at-attribute="ativo" style="width: 30%">Ativo</th>' +
                '<th at-attribute="tipo" style="width: 30%">Tipo</th>' +
                '<th at-attribute="valor" style="width: 15%">Valor</th>' +

                mid +

                    // LISTA DOS CAMPOS DE BODY (item.campo)
                '<td at-sortable at-initial-sorting="desc" at-attribute="data" ng-click="novo(item)" style="width: 20%">{{item.dataBr}}</td>' +
                '<td at-implicit at-sortable at-attribute="ativo" ng-click="novo(item)" style="width: 30%"></td>' +
                '<td at-sortable at-attribute="tipo" ng-click="novo(item)" style="width: 30%">' +
                '{{ (item.tipo == "D")? "Débito" : "Crédito" }}</td>' +
                '<td at-attribute="valor" ng-click="novo(item)" ng-class="{negativo: ' +
                "item.tipo == 'D'}" +
                '" style="width: 15%">{{ ( (item.tipo == "D") ? (item.valor * -1) : item.valor ) | currency:"R$ " }}</td>' +

                fim
            }/*,

            /!* 4 - LINK P/ MEDIÇÕES *!/
            {
                id: "med",
                nome: "Medição",
                link: "/med"
            }*/
        ];


        // Lista de itens de contrato
        $rootScope.itemTipo = [];

        // Periodicidade
        $rootScope.itemTipo.periodo = [
            {id: "M", nome: "Mensal", vlfixo: true}
        ];

        // Tipo de Medição
        $rootScope.itemTipo.forma = [
            {id: "HM", nome: "Horímetro", link: caminho + "horim.html", med: "Horim"},
            {id: "HK", nome: "Hora / Km", link: caminho + "horakm.html", med: "Horakm"},
            {id: "H", nome: "Hora", link: caminho + "horakm.html", med: "Horakm"},
            {id: "K", nome: "Km", link: caminho + "horakm.html", med: "Horakm"},
            {id: "L", nome: "Litro", link: caminho + "combus.html", med: "Combus"},
            {id: "T", nome: "Tonelada"}
        ];

        // Categoria de Produtos
        $rootScope.itemTipo.categoria = [
            {id: "prod", nome: "Produção"},
            {id: "abast", nome: "Abastecimento"},
            {id: "refeitorio", nome: "Refeição"}
        ];

        // Itens de Tipo de Contrato - Principais
        $rootScope.itemTipo.tipo = [

            /* 1 - MÁQUINAS */
            {
                id: "maq",
                nome: "Máquina",
                categ: "equip",
                formaMed: true,    // Possui forma de medição?
                abastece: true,    // Pode ser abastecido?
                entrada: false,    // Tem entrada de combustível para saída?,
                capacidade: false, // Qual a capacidade máxima?
                temProduto: false, // Ativos ou Produtos?
                mede: true,        // Faz medição?
                zera: false        // Zera Horímetro/Km em todos lançamentos?
            },

            /* 2 - CAÇAMBA */
            {
                id: "cac",
                nome: "Caçamba",
                categ: "equip",
                formaMed: true,
                abastece: true,
                entrada: false,
                capacidade: false,
                temProduto: false,
                mede: true,
                zera: false
            },

            /* 3 - MELOSA */
            {
                id: "mel",
                nome: "Melosa",
                categ: "abast",
                formaMed: true,
                abastece: true,
                entrada: false,
                capacidade: true,
                temProduto: false,
                mede: false,
                zera: false
            },

            /* 4 - TANQUE */
            {
                id: "tnq",
                nome: "Tanque",
                categ: "abast",
                formaMed: true,
                abastece: false,
                entrada: true,
                capacidade: true,
                temProduto: false,
                mede: false,
                zera: false
            },

            /* 5 - POSTO */
            {
                id: "pst",
                nome: "Posto",
                categ: "abast",
                formaMed: true,
                abastece: false,
                entrada: false,
                capacidade: false,
                temProduto: true,
                mede: true,
                zera: false
            },

            /* 6 - IMÓVEIS */
            {
                id: "imo",
                nome: "Imóvel",
                categ: "imovel",
                formaMed: false,
                abastece: false,
                entrada: false,
                capacidade: false,
                temProduto: false,
                mede: true,
                zera: false
            },

            /* 7 - VEÍCULOS */
            {
                id: "vei",
                nome: "Veículo",
                categ: "veiculo",
                formaMed: false,
                abastece: true,
                entrada: false,
                capacidade: false,
                temProduto: false,
                mede: true,
                zera: false
            },

            /* 8 - REFEITÓRIOS */
            {
                id: "ref",
                nome: "Refeitório",
                categ: "refeitorio",
                formaMed: false,
                abastece: false,
                entrada: false,
                capacidade: false,
                temProduto: true,
                mede: true,
                zera: false
            }

        ];

    }]);
