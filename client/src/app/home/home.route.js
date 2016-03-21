(function () {
    'use strict';

    angular
        .module('tr.home')
        .config(configHomeRoute);

    function configHomeRoute($stateProvider) {
        $stateProvider.state('main.home', {
            url: '/',
            templateUrl: 'app/home/home.html',
            data: {
                title: 'Accueil'
            }
        });
    }

})();
