(function () {
    'use strict';

    angular
        .module('tr.layout.sidenav')
        .directive('menuLink', menuLinkDirective);

    function menuLinkDirective() {
        return {
            scope: {
                section: '='
            },
            templateUrl: 'app/components/layout/sidenav/menu-link.tmpl.html',
            link: link
        };

        function link(scope, element) {
            var controller = element.parent().controller();
            scope.isSelected = isSelected;
            scope.focusSection = focusSection;

            function isSelected() {
                return controller.isSelected(scope.section);
            }

            function focusSection() {
                controller.autoFocusContent = true
            }
        }

    }

})();