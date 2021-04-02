function ThongbaohuyController($scope,$rootScope, $mdDialog, DataService, thongtinbn,thongtinthanhtoan,data,donhuylai) {
    
    $scope.thongtinbn = thongtinbn;
    $scope.thongtinthanhtoan = thongtinthanhtoan;
    $scope.sua = false;
    $scope.donhuylai = [];
    $scope.lydo = '';
    $scope.tennguoigui = $scope.thongtinthanhtoan.tennhanvien;
    if(donhuylai.length > 0) {
       $scope.sua = true; 
       $scope.donhuylai = donhuylai[0];
       $scope.lydo = $scope.donhuylai.LY_DO;
       $scope.tennguoigui = $scope.donhuylai.TEN_NGUOI_YEUCAU;
    }
    
    $scope.data = data;
    $scope.suadon = function() {
        DataService.postData("cmu_post", [{
            param:'url',
            data: [
                $scope.thongtinthanhtoan.dvtt,
                data.data.SOVAOVIEN,
                data.data.MA_LAN_TT,
                
                $scope.lydo,
                $scope.tennguoigui,
                0,
                'CMU_XOAUPDATEDONHD'
            ]
        }]).then(function(pattern) {
            $mdDialog.show(
                $mdDialog.alert({multiple:true,skipHide: true})
                  .parent(angular.element(document.getElementsByTagName('body')))
                  .clickOutsideToClose(true)
                  .title('Thông báo')
                  .textContent("Cập nhật thành công.")
                  .ok('ĐÓNG')

              );
            $rootScope.$broadcast('HIDELOADING');   
            $mdDialog.hide();
        }, function() {
            $rootScope.$broadcast('HIDELOADING');
            $mdDialog.show(
                $mdDialog.alert({multiple:true,skipHide: true})
                  .parent(angular.element(document.getElementsByTagName('body')))
                  .clickOutsideToClose(true)
                  .title('Thông báo')
                  .textContent("Đã có lỗi xảy ra.")
                  .ok('ĐÓNG')

              );
            $mdDialog.hide();
        })
    }
    $scope.xoadon = function() {
        DataService.postData("cmu_post", [{
            param:'url',
            data: [
                $scope.thongtinthanhtoan.dvtt,
                data.data.SOVAOVIEN,
                data.data.MA_LAN_TT,
               3,$scope.thongtinthanhtoan.manv,
                'CMU_UPDATEDONHUYHD'
            ]
        }]).then(function(pattern) {
            $mdDialog.show(
                $mdDialog.alert({multiple:true,skipHide: true})
                  .parent(angular.element(document.getElementsByTagName('body')))
                  .clickOutsideToClose(true)
                  .title('Thông báo')
                  .textContent("Xóa thành công.")
                  .ok('ĐÓNG')

              );
            $rootScope.$broadcast('HIDELOADING');   
            $mdDialog.hide();
        }, function() {
            $rootScope.$broadcast('HIDELOADING');
            $mdDialog.show(
                $mdDialog.alert({multiple:true,skipHide: true})
                  .parent(angular.element(document.getElementsByTagName('body')))
                  .clickOutsideToClose(true)
                  .title('Thông báo')
                  .textContent("Đã có lỗi xảy ra.")
                  .ok('ĐÓNG')

              );
                
            $mdDialog.hide();
        })
    }
    $scope.taodonhuy = function() {
        var ngayravien = $scope.thongtinbn.load.NGAYRA.split("/");
        var ravien = '-1'
        if($scope.thongtinbn.load.NGAYRA != null && ngayravien.length > 2) {
            ravien = ngayravien[2]+"-"+ngayravien[1]+"-"+ngayravien[0];
        }
        var ngaythanhtoan = data.data.NGAY_THANH_TOAN.split(" ");
        ngaythanhtoan = ngaythanhtoan[0].split("/");
        $rootScope.$broadcast('SHOWLOADING');
        DataService.postData("cmu_post", [{
                                            param:'url',
                                            data: [
                                                $scope.thongtinthanhtoan.dvtt,
                                                data.data.MA_LAN_TT,
                                                data.data.SOVAOVIEN,
                                                $scope.thongtinbn.TEN_PHONGBAN,
                                                $scope.thongtinbn.TEN_BENH_NHAN,
                                                $scope.thongtinbn.MA_KHOA_TT,
                                                $scope.lydo,
                                                $scope.tennguoigui,
                                                data.data.MA_THE,
                                                $scope.thongtinthanhtoan.tennhanvien,
                                                ravien,
                                                $scope.thongtinthanhtoan.manv,
                                                $scope.thongtinbn.MA_BENH_NHAN,
                                                ngaythanhtoan[2]+"-"+ngaythanhtoan[1]+"-"+ngaythanhtoan[0],
                                                $scope.thongtinthanhtoan.kyhieubienlai,
                                                $scope.thongtinthanhtoan.serial,
                                                $scope.thongtinthanhtoan.sobienlai,
                                                $scope.thongtinthanhtoan.sotientt,
                                                'CMU_TAODONHUYHD'
                                            ]
                                        }]).then(function(pattern) {
                                            $mdDialog.show(
                                                $mdDialog.alert({multiple:true,skipHide: true})
                                                  .parent(angular.element(document.getElementsByTagName('body')))
                                                  .clickOutsideToClose(true)
                                                  .title('Thông báo')
                                                  .textContent("Tạo đơn yêu cầu thành công.")
                                                  .ok('ĐÓNG')

                                              );
                                            $rootScope.$broadcast('HIDELOADING');   
                                            $mdDialog.hide();
                                            $scope.indonhuylai();
                                        }, function() {
                                            $rootScope.$broadcast('HIDELOADING');
                                            $mdDialog.show(
                                                $mdDialog.alert({multiple:true,skipHide: true})
                                                  .parent(angular.element(document.getElementsByTagName('body')))
                                                  .clickOutsideToClose(true)
                                                  .title('Thông báo')
                                                  .textContent("Đã có lỗi xảy ra.")
                                                  .ok('ĐÓNG')

                                              );
                                            $mdDialog.hide();
                                        })
    }
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.indonhuylai = function() {
        var arr = [data.data.SOVAOVIEN,data.data.MA_LAN_TT];
        var param = ['sovaovien', 'stt_lantt'];
        var url = "cmu_injasper?url=" + convertArray(arr)+"&param="+ convertArray(param)+"&loaifile=pdf&jasper=DONHUYLAI";
        $(location).attr('href', url);
    }
}