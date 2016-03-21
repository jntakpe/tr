(function () {
    'use strict';

    angular
        .module('tr')
        .config(routerConfig);

    function routerConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    }

})();
