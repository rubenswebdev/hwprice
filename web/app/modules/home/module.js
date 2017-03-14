(function () {
'use strict';

var module = 'home';
var controller = 'HomeController';

angular.module(module, []).config(states);

states.$inject = ['$stateProvider', 'LoadingProvider'];

function states($stateProvider, LoadingProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            views: {
                '': {
                    templateUrl: LoadingProvider.uncache('app/modules/home/home.html'),
                    controller: controller,
                    controllerAs: 'vm',
                },
                nav: {
                    templateUrl: LoadingProvider.uncache('app/templates/nav.html'),
                },
            },
        });
}
})();
