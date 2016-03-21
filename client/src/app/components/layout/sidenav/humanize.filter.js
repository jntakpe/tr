(function () {
    'use strict';

    angular
        .module('tr.layout.sidenav')
        .filter('humanizeMenu', function humanizeMenu() {
            return function (menu) {
                if (!menu) {
                    return;
                }
                if (menu.type === 'directive') {
                    return menu.name.replace(/([A-Z])/g, function ($1) {
                        return '-' + $1.toLowerCase();
                    });
                }
                return menu.label || menu.name;
            };
        });
})();