(function () {
'use strict';

angular.module('home')
 .controller('HomeController', HomeController);

HomeController.$inject = ['ApiService', 'toaster'];

function HomeController(ApiService, toaster) {
    var vm = this;
    var apiRoute = '/home/';
    var stateDefault = 'home';

    vm.lojas = [];

    start();

    function start() {
        ApiService.get('/api/lojas').then(function (lojas) {
            console.log(lojas);
            vm.lojas = lojas;
        });
    }
}
})();
