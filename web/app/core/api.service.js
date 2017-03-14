(function () {
'use strict';
angular.module('core')
 .factory('ApiService', ApiService);

ApiService.$inject = ['$http', '$q', 'myConfig', '$state'];

function ApiService($http, $q, myConfig, $state) {

    var service = {
        get: get,
        del: del,
        post: post,
        put: put,
    };

    return service;

    function post(url, data) {
        var deferred = $q.defer();
        $http.post(myConfig.api + url, data).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {

            deferred.reject(err);
        });

        return deferred.promise;
    }

    function put(url, data) {
        var deferred = $q.defer();

        $http({
                    url: myConfig.api + url,
                    method: 'PUT',
                    data: data,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {

            deferred.reject(err);
        });

        return deferred.promise;
    }

    function get(url) {
        var deferred = $q.defer();
        $http.get(myConfig.api + url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {

            deferred.reject(err);
        });

        return deferred.promise;
    }

    function del(url) {
        var deferred = $q.defer();
        $http.delete(myConfig.api + url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {

            deferred.reject(err);
        });

        return deferred.promise;
    }
}
})();
