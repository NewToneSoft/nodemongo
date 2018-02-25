/*
 módulo de Medições v1.0
 2016 Nilton Cruz
 */

'use strict';

angular.module( 'modMedicao', ['modBase'] )

    .run(['$rootScope', function($rootScope){

        var caminho = "partial/medicoes/";

        // Menu de Medições
        $rootScope.menu.medicoes = [

            /* 1 - CABEÇALHO */
            {
                id: "geral",
                form: caminho + "geral.html"
            },

            /* 2 - CAPA */
            {
                id: "capa",
                form: caminho + "capa.html"
            },

            /* 3 - HORÍMETRO */
            {
                id: "HM",
                periodos: [
                    {id: "M", form: caminho + "formhorim.html"}
                ]

            },

            /* 4 - HORA/KM */
            {
                id: "HK",
                periodos: [
                    {id: "M", form: caminho + "formhorakm.html"}
                ]
            },

            /* 5 - VEÍCULO */
            {
                id: "vei",
                periodos: [
                    {id: "M", form: caminho + "formfixo.html"}
                ]
            },

            /* 6 - IMÓVEL */
            {
                id: "imo",
                periodos: [
                    {id: "M", form: caminho + "formfixo.html"}
                ]
            },

            /* 7 - REFEITÓRIO */
            {
                id: "ref",
                periodos: [
                    {id: "M", form: caminho + "formprod.html"}
                ]
            },

            /* 8 - POSTO */
            {
                id: "pst",
                periodos: [
                    {id: "M", form: caminho + "formprod.html"}
                ]
            },

            /* 9 - TONELADA */
            {
                id: "T",
                periodos: [
                    {id: "M", form: caminho + "formprod.html"}
                ]
            }
        ];

    }]);
