VNPTHRM = angular.module('VNPTHRM', ['ngMaterial', 'ngMessages','ui.router','ui.grid', 'ui.grid.pagination', 
    'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection']);
VNPTHRM.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            controller: 'HOMEController',
            template: "abc"
        })
        .state('nhanvien', {   
            url: '/nhanvien',
            controller: 'HOSONHANSUController',
            templateUrl: "resources/camau/quanlinhansu/views/hosonhansu.html"    
        });
         
}).run(function($state) {
    
});
