(function () {
  'use strict';

  angular
    .module('tr')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
