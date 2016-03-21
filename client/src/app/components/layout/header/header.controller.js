(function () {
    'use strict';

    angular
        .module('tr.layout.header')
        .controller('HeaderController', HeaderController);

    function HeaderController($scope, headerService) {
        var vm = this;
        vm.openMenu = openMenu;

        $scope.$on('$stateChangeSuccess', updateBreadcrumb);

        function updateBreadcrumb() {
            vm.breadcrumb = headerService.breadcrumbData()
        }

        function openMenu() {
            headerService.openMenu();
        }
    }

})();
