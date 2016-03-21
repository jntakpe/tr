(function () {
    'use strict';

    angular
        .module('tr.layout.sidenav')
        .controller('SidenavController', SidenavController);

    function SidenavController(sidenavService, menuContent) {
        var vm = this;
        vm.menuContent = menuContent;
        vm.isSelected = isSelected;
        vm.isOpen = isOpen;
        vm.toggleOpen = toggleOpen;
        vm.sSectionActive = sSectionActive;


        function isSelected(page) {
            return sidenavService.isPageSelected(page);
        }

        function isOpen(section) {
            return sidenavService.isSectionSelected(section);
        }

        function toggleOpen(section) {
            sidenavService.toggleSelectSection(section);
        }

        function sSectionActive(section) {
            return sidenavService.isSectionActive(section);
        }
    }

})();


