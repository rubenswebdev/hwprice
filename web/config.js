(function () {
'use strict';

angular.module('app')
 .constant('myConfig', {
        api: 'http://' + document.location.host,
    });

angular.module('core')
 .constant('coreConfig', {
    cache: false,
});
})();
