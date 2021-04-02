/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

myapp.directive('cGrid', ['$compile','$filter', function($compile,$filter) {
  return {
    restrict: 'EA',
    templateUrl: 'cGrid.html',
    scope: {
        data: '=',
        config: '=',
        footer: '='
    },
    controller: function($scope) {
        
     
    },
    link: function($scope,element,attrs) {
        $scope.$on('thumiengiam', function (event, args) {
            $scope.disabled = args.data;
            if(args.data) {
                $scope.checkall = true;
            }
        });
        $scope.disabled = false;
        $scope.filter = $scope.$eval(attrs.cfilter);
        $scope.vheight = $scope.$eval(attrs.vheight);
        $scope.vwidth = $scope.$eval(attrs.vwidth);
        $scope.cFilter = {};
        $scope.config.forEach(function(data) {
            if(data.filter == true) {
                $scope.cFilter[data.field] = ""
            }
        })
        $scope.row = [];
        $scope.idSelectedVote = null;
        var t = new Date();
        $scope.headerID = "idheader_"+attrs.id;
        $scope.footerID = "idfooter_"+attrs.id;
        $scope.setSelected = function (idSelectedVote) {
           
           $scope.idSelectedVote = idSelectedVote;
           $scope.$emit('selectitem.'+attrs.id, idSelectedVote);
        };
        $scope.$watch('data', function () {
            var remainingCount = $filter('filter')($scope.data, { selected: false }).length;
            $scope.checkall = !remainingCount && $scope.data.length > 0;
        }, true);
        if ($scope.data.length > 0){
            $scope.data = $scope.data.map(function(_obj) {
                      _obj['selected'] = true;
                      return _obj;
                  })
        }
        $scope.changeCheckall = function(checkall) {
            if (checkall == true) {
                $scope.data = $scope.data.map(function(_obj) {
                      _obj['selected'] = true;
                      return _obj;
                  })
            } else {
                $scope.data = $scope.data.map(function(_obj) {
                      _obj['selected'] = false;
                      return _obj;
                  })  
            }
        }
        $scope.iconaction = function($event,callback,obj,data) {
            console.log("attrs.id", attrs.id)
            if (typeof callback === "function") {
                callback({obj: obj, data: data,event:$event});
            }
        }
        $scope.acfooter = function($event,callback,obj,data) {
            console.log("attrs.id", attrs.id)
            if (typeof callback === "function") {
                callback({obj: obj, data: data,event:$event});
            }
        }
        
    }
  };      
}])
myapp.filter('sumOfValue', function () {
    return function (data, key,option,minus) {        
        if (angular.isUndefined(data) || angular.isUndefined(key)|| angular.isUndefined(option))
            return 0;        
        var sum = 0;        
        angular.forEach(data,function(value){
            if(value[option] == true || option == false) {
                sum = sum + Number(value[key]);
            }
        });    
        return sum-minus;
    }
}).filter('countData', function () {
    return function (data) {        
        if (angular.isUndefined(data)) 
            return 0;        
        var sum = data.length;
        return sum;
    }})
.filter('displayLargerZero', function () {
    return function (data,flag) {        
        if (angular.isUndefined(data)) 
            return 0; 
        if (flag  == false) {
            return data < 0? data*-1: 0;
        }
        return data > 0? data: 0;
    }})
.filter('format', function () {
    return function (data) {        
        if (angular.isUndefined(data)) 
            return data;    
        return formatNumber(data);
    }})
.filter('convertloai',function(){
        return function (data) {        
            if (angular.isUndefined(data)) 
                return data;    
            return data == 1? "VP": "BHYT";
        }
    }).directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        
        //var obj = JSON.parse(attrs.scroll);
        
        element.bind("scroll", function(event) {
            console.log("nguyen ab",event.currentTarget.scrollLeft)
            element.parent().find('.class_scroll').css("left",-event.currentTarget.scrollLeft);
            //scope.visible = false;
            scope.$apply();
        });
    };
});
    ;
