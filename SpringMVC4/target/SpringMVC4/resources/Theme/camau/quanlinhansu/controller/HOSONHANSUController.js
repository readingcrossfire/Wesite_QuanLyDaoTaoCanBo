angular.module('VNPTHRM').controller("HOSONHANSUController", ['$scope','uiGridConstants', '$http', function ($scope, uiGridConstants, $http) {
var data = [];

$scope.gridOptions = {
    paginationPageSizes: [25, 50, 75,100,200],
    paginationPageSize: 25,
    enableColumnResizing: true,
    enableRowSelection: true, 
    enableRowHeaderSelection: false,
    multiSelect: false,
    modifierKeysToMultiSelect: false,
    noUnselect:true,
    enableFiltering: true,
    enableGridMenu: true,
    columnDefs: [
        { field: 'MA_NHANVIEN',name: "Mã NV", width: '10%', pinnedLeft:true},
        { field: 'TEN_NHANVIEN',name: "Họ và tên", width: '15%', pinnedLeft:true },
        { field: 'GIOITINH',name: "Giới tính", width: '10%'},
        { field: 'NGAYSINH',name: "Ngày sinh", width: '10%'},
        { field: 'TRINHDODAOTAO',name: "Trình độ đào tạo", width: '10%'},
        { field: 'NOIDAOTAO',name: "Nơi đào tạo", width: '10%'},
        { field: 'CHUYENNGHANH',name: "Chuyên nghành", width: '10%'},
        { field: 'VITRICONGVIEC',name: "Vị trí công việc", width: '10%'},
        { field: 'PHONGBANCONGTAC',name: "Nợi làm việc", width: '10%'},
        { field: 'NGAYTHUVIEC',name: "NGÀY THỬ VIỆC", width: '10%'},
        { field: 'NGAYCHINHTHUC',name: "Ngày chính thức", width: '10%'},
        { field: 'LOAIHOPDONG',name: "Loại hợp đồng", width: '10%'},
        { field: 'TRANGTHAI',name: "Trạng thái", width: '10%'}
        
    ],
    data: data,
    onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
    }
};
 
$scope.toggleFooter = function() {
  $scope.gridOptions.showGridFooter = !$scope.gridOptions.showGridFooter;
  $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
};
 
$scope.toggleColumnFooter = function() {
  $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
  $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
};
 
$http.get('/web_his/cmu_getlist?url=96019```CMU_DSNHANVIENTOANBV')
  .then(function(response) {
    var data = response.data;
    console.log("response",response);
    $scope.gridOptions.data = data;
  });
    

}])