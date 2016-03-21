(function () {
    'use strict';

    angular
        .module('tr.layout')
        .config(configLayoutRoute);

    function configLayoutRoute($stateProvider) {
        $stateProvider.state('layout', {
            templateUrl: 'app/components/layout/layout.html'
        });

        $stateProvider.state('main', {
            parent: 'layout',
            abstract: true,
            views: {
                'sidenav': {
                    templateUrl: 'app/components/layout/sidenav/sidenav.html',
                    controller: 'SidenavController as sidenav'
                },
                'header': {
                    templateUrl: 'app/components/layout/header/header.html',
                    controller: 'HeaderController as header'
                }
            }
        });
    }
})();
