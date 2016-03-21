(function () {
    'use strict';

    angular
        .module('tr.layout.sidenav')
        .directive('menuToggle', menuToggleDirective);

    function menuToggleDirective($timeout) {
        return {
            scope: {
                section: '='
            },
            templateUrl: 'app/components/layout/sidenav/menu-toggle.tmpl.html',
            link: link
        };

        function link(scope, element) {
            var controller = element.parent().controller();
            var parentNode = element[0].parentNode.parentNode.parentNode;
            scope.isOpen = isOpen;
            scope.toggle = toggle;
            scope.$watch(isOpen, open);

            if (parentNode.classList.contains('parent-list-item')) {
                var heading = parentNode.querySelector('h2');
                element[0].firstChild.setAttribute('aria-describedby', heading.id);
            }

            function isOpen() {
                return controller.isOpen(scope.section)
            }

            function toggle() {
                controller.toggleOpen(scope.section)
            }

            function open(open) {
                var ul = element.find('ul');
                var targetHeight = open ? getTargetHeight() : 0;
                $timeout(function () {
                    return ul.css({height: targetHeight + 'px'})
                }, 0, false);

                function getTargetHeight() {
                    var targetHeight;
                    ul.addClass('no-transition');
                    ul.css('height', '');
                    targetHeight = ul.prop('clientHeight');
                    ul.css('height', 0);
                    ul.removeClass('no-transition');
                    return targetHeight;
                }
            }
        }

    }

})();