(function () {
'use strict';

/**
     * Config for the router
     */
angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    'toaster',
    'core',
    'home',
    ])

.config(configuration);

configuration.$inject = ['$urlRouterProvider'];

function configuration($urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
}

})();
