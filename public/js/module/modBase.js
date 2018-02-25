/*
 módulo Base v1.0
 2016 Nilton Cruz
 */

'use strict';

angular.module( 'modBase', [] )

    .run(['$rootScope', function($rootScope){

        // Itens de Menu
        $rootScope.menu = [];

        // Ativa item (cadastros)
        $rootScope.ativaItem = function(lista, tipo){

            var t1 = lista.map(function(e){ return e.nome; }).indexOf(tipo);

            if(t1 != -1){

                angular.forEach(lista, function(value, key){
                    lista[key].ativo = (lista[key].nome == tipo);
                });

            }

        };

    }]);