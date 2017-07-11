(function () {
'use strict';

angular.module('home')
 .controller('HomeController', HomeController);

HomeController.$inject = ['ApiService', 'toaster'];

function HomeController(ApiService, toaster) {
    var vm = this;
    var apiRoute = '/home/';
    var stateDefault = 'home';

    vm.buscar = buscar;
    vm.buscarAll = buscarAll;

    vm.lojas = [];

    start();

    function start() {
        ApiService.get('/api/lojas').then(function (lojas) {
            console.log(lojas);
            vm.lojas = lojas;
        });
    }

    function buscar(loja) {
        ApiService.post('/api/produtos', loja).then(function (produtos) {
            loja.produtos = produtos;
        });
    }

    function buscarAll() {
        vm.lojas.forEach(function (loja) {
            loja.termo = vm.termo;
            buscar(loja);
        });
    }
}
})();
