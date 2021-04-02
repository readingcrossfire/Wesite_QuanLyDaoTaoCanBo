angular.module('VNPTHRM').controller("MENUController", ['$scope','uiGridConstants', '$http', function ($scope, uiGridConstants, $http) {
var data = [];
$scope.nguyen = 'abc';
$scope.menu = {
        sections: [
            {
                name: "Quản lí nhân sự",
                type: "toggle",
                hidden: false,
                children: [
                    {
                        name: "Quản lí nhân sự",
                        type: "link",
                        hidden: false,
                    }
                ]
            }
        ]
    }  
    

}])