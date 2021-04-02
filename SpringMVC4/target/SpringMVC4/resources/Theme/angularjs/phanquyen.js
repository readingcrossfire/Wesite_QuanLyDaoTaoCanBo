var phanquyen = angular.module('phanquyen', ['ui.grid', 'ui.grid.selection']);

phanquyen.controller('MainCtrl', ['$scope', '$q', '$http', function ($scope, $q, $http) {
    var empName;
    $scope.perms = [{'value': 1, 'label': 'Cập nhật trạng thái'},
        {'value': 2, 'label': 'Cập nhật hạn dùng'}
    ];
    $scope.employees = [];
    $scope.gridOptions = {
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        appScopeProvider: {
            mapValue: function (row) {
                return row.entity.loaiQuyen == 1 ? 'Trạng thái' : 'Hạn dùng';
            }
        }
    };
    $scope.gridOptions.columnDefs = [
        {displayName: 'Mã nhân viên', field: 'maNhanVien', width: "20%"},
        {displayName: 'Tên nhân viên', field: 'tenNhanVien', width: "30%"},
        {displayName: 'Ngày thêm', field: 'ngayThem', width: "20%", type: 'date', cellFilter: 'date:\'yyyy-MM-dd\''},
        {displayName: 'Loại quyền', field: 'loaiQuyen', width: "30%", cellTemplate: '<div>{{grid.appScope.mapValue(row)}}</div>'}
    ];

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            $scope.emlSelected = row.entity.maNhanVien;
            $scope.permType = row.entity.loaiQuyen;
            empName = row.entity.tenNhanVien;
        });
    };
    $http({
        method: 'GET',
        url: 'get_init_data',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: []
    }).success(function (data) {
        $http({
            method: 'POST',
            url: 'danhsachnhanvien',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({"dvtt": data.dvtt, "khoa": data.phongBan})
        }).success(function (data) {
            $scope.employees = data;
        }).error(function (data, status) {
            console.log("Response error ", status, data);
        });
        getGridData();
    }).error(function (data, status) {
        console.log("Response error ", status, data);
    });

    $scope.getEmpName = function () {
        var empId = $scope.emlSelected;
        empName = $.grep($scope.employees, function (emp) {
            return emp.MA_NHANVIEN == empId;
        })[0].TEN_NHANVIEN;
    };

    $scope.addEmployee = function () {
        var jsonData = {"maNhanVien": $scope.emlSelected, "tenNhanVien": empName, "loaiQuyen": $scope.permType};
        $http({
            method: 'POST',
            url: 'themnhanvien_capnhatttvt',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            data: jsonData
        }).success(function () {
            jAlert("Phân quyền thành công cho nhân viên " + empName, "Thông báo");
            getGridData();
        }).error(function (data, status) {
            console.log('Response error ', status, data);
        })
    };

    $scope.removeEmployee = function () {
        $http({
            method: 'DELETE',
            url: 'xoanhanvien_capnhatttvt/' + $scope.emlSelected + '/' + $scope.permType
        }).success(function () {
            jAlert("Xóa quyền thành công cho nhân viên " + empName, "Thông báo");
            getGridData();
        }).error(function (data, status) {
            console.log('Response error ', status, data);
        })
    };

    function getGridData() {
        $http({
            method: 'GET',
            url: 'danhsachnhanvien_phanquyen'
        }).success(function (data) {
                $scope.gridOptions.data = data;
            }
        ).error(function (data, status) {
            console.log('Response error ', status, data);
        });
    };
}]);