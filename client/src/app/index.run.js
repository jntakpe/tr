(function () {
    'use strict';

    angular
        .module('tr')
        .run(runBlock);

    function runBlock($log) {
        $log.debug('runBlock end');
    }

})();
