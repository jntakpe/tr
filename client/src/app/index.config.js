(function () {
    'use strict';

    angular
        .module('tr')
        .config(config);

    function config(toastrConfig, $mdThemingProvider) {
        configToastr(toastrConfig);
        configTheme($mdThemingProvider);
    }

    function configToastr(toastrConfig) {
        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 3000;
        toastrConfig.positionClass = 'toast-top-right';
        toastrConfig.preventDuplicates = true;
        toastrConfig.progressBar = true;
    }

    function configTheme($mdThemingProvider) {
        $mdThemingProvider.definePalette('custom-blue', $mdThemingProvider.extendPalette('blue', {
            '50': '#DCEFFF',
            '100': '#AAD1F9',
            '200': '#7BB8F5',
            '300': '#4C9EF1',
            '400': '#1C85ED',
            '500': '#106CC8',
            '600': '#0159A2',
            '700': '#025EE9',
            '800': '#014AB6',
            '900': '#013583',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': '50 100 200 A100',
            'contrastStrongLightColors': '300 400 A200 A400'
        }));

        $mdThemingProvider.definePalette('custom-red', $mdThemingProvider.extendPalette('red', {
            'A100': '#DE3641'
        }));

        $mdThemingProvider.theme('custom-dark', 'default')
            .primaryPalette('yellow')
            .dark();

        $mdThemingProvider.theme('default')
            .primaryPalette('custom-blue')
            .accentPalette('custom-red');
    }


})();
