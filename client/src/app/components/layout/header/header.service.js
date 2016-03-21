(function () {
    'use strict';

    angular
        .module('tr.layout.header')
        .factory('headerService', headerService);

    function headerService($state, $timeout, $mdSidenav) {
        return {
            parentsData: parentsData,
            breadcrumbData: breadcrumbData,
            openMenu: openMenu
        };

        function parentsData(currentStateData) {
            var breadcrumb = [];
            currentStateData.breadcrumb = currentStateData.breadcrumb || [];
            currentStateData.breadcrumb.forEach(function pushState(stateName) {
                breadcrumb.push({
                    title: $state.get(stateName).data.title,
                    name: stateName
                });
            });
            return breadcrumb;
        }

        function breadcrumbData() {
            if ($state.$current.data) {
                return {
                    title: $state.$current.data.title,
                    parents: parentsData($state.$current.data)
                };
            }
            return {};
        }

        function openMenu() {
            $timeout(function () {
                $mdSidenav('menu-left').open();
            });
        }
    }

})();
