function HoanungbenhnhanController($scope,$rootScope, $mdDialog, DataService, thongtinbn,lanthanhtoan,dvtt,manv) {
    
    $scope.thongtinbn = thongtinbn;
    $scope.lanthanhtoan = lanthanhtoan;
    $scope.ngayhoanung = new Date();
    if ($scope.lanthanhtoan[0].NGAYHOANUNG != null) {
        var match_tn = $scope.lanthanhtoan[0].NGAYHOANUNG.match(/^(\d+)\/(\d+)\/(\d+)$/);
        console.log("date", match_tn[2] + '-' + match_tn[1] + '-' + match_tn[0]);
       $scope.ngayhoanung = new Date(match_tn[3] + '-' + match_tn[2] + '-' + match_tn[1]);
    }
    function thongbao(message) {
        $mdDialog.show(
                            $mdDialog.alert({multiple:true,skipHide: true})
                              .parent(angular.element(document.getElementsByTagName('body')))
                              .clickOutsideToClose(true)
                              .title('Thông báo')
                              .textContent(message)
                              .ok('ĐÓNG')

                          );
    }
    $scope.listctConfig = [
            
            {
                name: "Trạng thái",
                flex: 15,
                field: "TRANGTHAI",
                display: true,
                filter: false
            },
            {
                name: "Tổng tiền",
                flex: 15,
                field: "TONGTIEN",
                display: true,
                format: true,
                filter: false
            },
            {
                name: "Tạm ứng",
                flex: 15,
                field: "TAMUNG",
                display: true,
                format: true,
                filter: false
            },
            {
                name: "Hoàn ứng",
                flex: 15,
                field: "HOANUNG",
                format: true,
                display: true,
                filter: false
            },
            {
                name: "Số biên lai",
                flex: 10,
                field: "SOBIENLAI",
                display: true,
                filter: false
            },
            {
                name: "Quyển BL",
                flex: 10,
                field: "QUYENBIENLAI",
                display:  true,
                filter: false
            },
            {
                name: "Nhân viên",
                flex: 10,
                field: "TENNHANVIEN",
                display:  true,
                filter: false
            },
            {
                name: "",
                flex: 10,
                field: "ICONS_ACTION",
                icons: [
                   
                    {
                        icon: function(data) {
                            console.log("data",data);
                            return data.data.TRANGTHAI == 'Chưa hoàn ứng'? 'monetization_on': '';
                        },
                        callback: function(data) {
                            var confirm = $mdDialog.confirm({multiple:true,skipHide: true})
                            .title('Thông báo')
                            .textContent('Bạn có chắc hoàn ứng cho bệnh nhân này?')
                            .ariaLabel('Lucky day')
                            .ok('Đồng ý')
                            .cancel('Hủy');
                            $mdDialog.show(confirm).then(function() {
                                $rootScope.$broadcast('SHOWLOADING');
                                var url = "hgi_themlan_hoanung";
                                var t = new Date();
                                var stt_benhan = $scope.thongtinbn.STT_BENHAN;
                                var stt_dotdieutri = $scope.thongtinbn.STT_DOTDIEUTRI;
                                var mabenhnhan = $scope.thongtinbn.MA_BENH_NHAN;
                                var tenbenhnhan = $scope.thongtinbn.TEN_BENH_NHAN;
                                var tuoi = t.getFullYear() - Number($scope.thongtinbn.NAMSINH);
                                var tongtien = data.data.TONGTIEN;
                                var tamung = data.data.TAMUNG;
                                var hoanung = data.data.HOANUNG;
                                var nhanvien = manv;
                                var diachi = $scope.thongtinbn.load.DIACHI;
                                var ngaytao = parseDateToString($scope.ngayhoanung);
                                var sobienlai = data.data.SOBIENLAI = ""? 0 : data.data.SOBIENLAI;
                                var quyenbienlai = data.data.QUYENBIENLAI = "" ? 0 : data.data.QUYENBIENLAI;
                                var arr = [dvtt, stt_benhan, stt_dotdieutri, mabenhnhan, tenbenhnhan, tuoi, tongtien, tamung, hoanung, nhanvien, diachi, ngaytao, sobienlai, quyenbienlai];
                                    $.post(url, {
                                        url: convertArray(arr)
                                    }).done(function () {
                                        $rootScope.$broadcast('HIDELOADING');
                                        thongbao("Hoàn ứng thành công.")
                                        data.data.TRANGTHAI = 'Đã hoàn ứng';
                                        
                                    }).complete(function(){

                                    });
                            }, function() {

                            });
                            
                        },
                        title: function(data) {
                            return "Hoàn ứng";
                        }
                    },
                    {
                        icon: function(data) {
                            return data.data.TRANGTHAI != 'Chưa hoàn ứng' ? 'clear': '';
                        },
                        callback: function(data) {
                                var confirm = $mdDialog.confirm({multiple:true,skipHide: true})
                                .title('Thông báo')
                                .textContent('Bạn có chắc *Hủy* hoàn ứng cho bệnh nhân này?')
                                .ariaLabel('Lucky day')
                                .ok('Đồng ý')
                                .cancel('Hủy');
                                $mdDialog.show(confirm).then(function() {
                                    $rootScope.$broadcast('SHOWLOADING');
                                    var url = "hgi_huylan_hoanung";
                                    var stt_benhan = $scope.thongtinbn.STT_BENHAN;
                                    var stt_dotdieutri = $scope.thongtinbn.STT_DOTDIEUTRI;
                                    var mabenhnhan = $scope.thongtinbn.MA_BENH_NHAN;
                                    var arr = [dvtt, stt_benhan, stt_dotdieutri, mabenhnhan];
                                        $.post(url, {
                                            url: convertArray(arr)
                                        }).done(function () {
                                            $rootScope.$broadcast('HIDELOADING');
                                            thongbao("Hủy hoàn ứng thành công.")
                                            data.data.TRANGTHAI = 'Chưa hoàn ứng'
                                            data.data.TENNHANVIEN = ''
                                        }).complete(function(){
                                            load_grid_danhsach();
                                        });
                                }, function() {

                                });
                                
                            
                        },
                        title: function(data) {
                            return "Hủy hoàn ứng";
                        }
                    },
                    {
                        icon: function(data) {
                            return data.data.TRANGTHAI != 'Chưa hoàn ứng' ? 'print': '';
                        },
                        callback: function(data) {
                            var t = new Date()
                            var stt_benhan = $scope.thongtinbn.STT_BENHAN;
                            var stt_dotdieutri = $scope.thongtinbn.STT_DOTDIEUTRI;
                            var mabenhnhan = $scope.thongtinbn.MA_BENH_NHAN;
                            var tenbenhnhan = $scope.thongtinbn.TEN_BENH_NHAN;
                            var tuoi = t.getFullYear() - Number($scope.thongtinbn.NAMSINH);
                            var sobienlai = data.data.SOBIENLAI == "" ? "0" : data.data.SOBIENLAI;
                            var tongtien = data.data.TONGTIEN;
                            var tamung = data.data.TAMUNG;
                            var hoanung = data.data.HOANUNG;
                            var nhanvien = manv;
                            var diachi = $scope.thongtinbn.load.DIACHI;
                            var match_tn = moment($scope.ngayhoanung).format('DD/MM/YYYY').match(/^(\d+)\/(\d+)\/(\d+)$/);
                            var nhanvienthu = data.data.TENNHANVIEN == null ? "" : data.data.TENNHANVIEN ;
                            var sobhyt = $scope.thongtinbn.load.SOBAOHIEMYTE;
                            var gioitinh = $scope.thongtinbn.GIOI_TINH == 0 || $scope.thongtinbn.load.GIOITINH == 0 ?  "Nữ":"Nam";
                            var arr = [dvtt, stt_benhan, stt_dotdieutri, mabenhnhan, tenbenhnhan, tuoi, tongtien, tamung,
                            hoanung, nhanvien, diachi, nhanvienthu, sobhyt, gioitinh, match_tn[1], match_tn[2], match_tn[3], sobienlai];
                            var url = "hgi_inhoanung?url=" + convertArray(arr);
                            $(location).attr('href', url);

                        },
                        title: function(data) {
                            return "In hoàn ứng";
                        }
                    }
                ],
                display: true
            }
    ];
    
    $scope.fctthanhtoan =  [
        ];
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    
}