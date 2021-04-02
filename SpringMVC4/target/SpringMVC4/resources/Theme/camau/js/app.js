function formatNumber(n) {
    return new Intl.NumberFormat("en-US").format(n);
}
function sumData(data, key,option) {
    var sum = 0; 
    if(data.length >0) {
        angular.forEach(data,function(value){
            if(value[option] == true || angular.isUndefined(value[option])) {
                sum = sum + Number(value[key]);
                sum = Number(sum.toFixed(2))
            }
        }); 
    }
    return sum;    
}
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
function parseDateToString(date) {
    return moment(date).format('YYYY-MM-DD');
}
function parseDateToString2(date) {
    return moment(date).format('DD/MM/YYYY');
}
function c_string_formatdate(str) {
    if (str != "") {
        var arr = str.split("/");
        return arr[2] + "-" + arr[1] + "-" + arr[0];
    }
}

function c_convert_to_string(arr) {
    if (arr != null && arr.length > 0) {
        var str = arr[0].toString().replace("```", "");
        str=str.replace("&", "+");

        for (i = 1; i < arr.length; i++) {
            if(arr[i] == undefined){
                arr[i] ="";
            }
            str += "```" + arr[i].toString().replace("```", "").replace("&","+");
        }
        return encodeURIComponent(str);
    }
}

function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'";]/g, function (c) {
        switch (c) {
            case '<': return ' nhỏ hơn ';
            case '>': return ' lớn hơn ';
            case '&': return ' và ';
            case '\'': return ' ';
            case '"': return ' ';
            case ';': return ',';
        }
    });
}
myapp = angular.module('HISAPP', ['ngMaterial', 'ngMessages']);
myapp.config(function($mdDateLocaleProvider) {
  $mdDateLocaleProvider.formatDate = function(date) {
    return date ? moment(date).format('DD-MM-YYYY') : '';
  };
  
  $mdDateLocaleProvider.parseDate = function(dateString) {
    var m = moment(dateString, 'DD-MM-YYYY', true);
    return m.isValid() ? m.toDate() : new Date();
  };
})
myapp.controller('AppCtrl', function($scope,$rootScope,$sce, $mdDialog, $mdMedia,$element,DataService,$timeout, $q, $log) {
        $scope.ngaybatdau  = new Date();
        $scope.ngayketthuc  = new Date();
        $scope.ngaybd = new Date();
        $scope.ngaykt = new Date();
        $scope.loaihd = -1;
        $scope.loaibnhd = -1
        $scope.listkhoa = [];
        $scope.thongtinbn = {};
        $scope.thongtinhuyhoadon = {};
        $scope.chitietthanhtoan = [];
        $scope.chitietlantt = [];
        $scope.dsqbl = [];
        $scope.loadingDs = false;
        $scope.trangthaihuyhoadon = false;
        $scope.selectedbn = false;
        $scope.hoadonphathanh = [];
        $scope.dsyeucauhuyhd = [];
        $scope.admin = 0;
        $scope.showLoading = false
        $scope.hoadonle = {
            maquyenbienlai: '',
            sobienlai: '0000000',
            gioitinh: " ",
            dantoc: "  ",
            chitietthanhtoan : [
                {
                    noidung: "",
                    thanhtien: "",
                    dvt: "",
                    dongia: "",
                    soluong: ""
                }
                
            ],
            hinhthuctt:"TM",
            tendichvu: "",
            thanhtien: 0,
            diachi: " "
        }
        $scope.dsnhanvien = [];
        $scope.phongban = "";
        $scope.filternhanvien = "0";
        $scope.filtermaquyenbienlai = ""
        $scope.filtercobhyt = -1;
        $scope.tennhanvien = '';
        $scope.hienthichitietthanhtoan = 0;
        function kiemtrabnhoantatkham() {
                $.post("kiemtrabnhoantatkham", {
                    id_tiepnhan: $scope.thongtinbn.ID_TIEPNHAN
                }).done(function (data) {
                    $scope.thongtinthanhtoan.hoantatkham = data;
                });
        }
        $scope.init = function(dvtt,manv,admin) {
            $scope.dvtt = dvtt;
            $scope.manv = manv;
            $scope.admin = admin;
            $scope.trangthaibn = 0;
            $scope.khoa = -1;
            $scope.loaivienphi = 'BHYT';
            DataService
                    .getData("/web_his/cmu_getlist",[$scope.dvtt,'CMU_DS_KHOA'])
                    .then(function(data){
                        $scope.listkhoa = data;
                        $scope.khoa = -1    
            });
            laydsquyenbienlai();
            loadAll();
            $scope.hoadonphathanh = [];
            
            $scope.phongban = arguments[14];
            $scope.tennhanvien = arguments[15];
            laydsnhanvien();
            $scope.hienthichitietthanhtoan = arguments[16];
            $scope.thongtinthanhtoan = {
                ngaythu: new Date(),
                tientamung: 0,
                sotientt: 0,
                sotienbntra: 0,
                sotienthoilai: 0,
                tienmiengiam: 0,
                maquyenbienlai: "",
                kyhieubienlai: '',
                sobienlai: "",
                trutamung: 0, 
                dvtt: $scope.dvtt,
                bltieptheo: false,
                tmiengiam: false,
                admin: admin,
                manv:manv,
                hoantatkham: 0,
                xemct: false,
                account: arguments[3],
                acpass: arguments[4],
                username: arguments[5],
                password: arguments[6],
                businessservice: arguments[7],
                portalservice: arguments[8],
                publishservice: arguments[9],
                pattern: arguments[10],
                serial: arguments[11],
                serialbhyt: arguments[12],
                ngaytrienkhai: arguments[13],
                key_hd: '',
                kyhieu_quyenbienlai: '',
                tennhanvien: $scope.tennhanvien,
                hoadonchitiet: arguments[16],
                ghichu: "",
                hgi_hoanung: arguments[17],
                nguoimiengiam: 0,
                danhsachnguoimiengiam: [],
                ttlaphoadon: arguments[18],
                hinhthucthanhtoan: 'Tiền mặt',
                vat: '-1',
                hienthistg: 0,
                hienthichitietnoitru: 0,
                masothue: "",
                tendonvi: ""
            }
            DataService.getData("/web_his/cmu_getlist",[$scope.dvtt,'CMU_GETNHANVIENMIENGIAM'])
                    .then(function(data){
                        $scope.thongtinthanhtoan.danhsachnguoimiengiam = data; 
            });
            DataService.postData("cmu_post",[ {
                        param: 'url',
                        data: [
                            $scope.dvtt,'960463',
                            'DM_TSDV_SL_MTSO'
                        ]
            }])
                    .then(function(data){
                        $scope.thongtinthanhtoan.hienthichitietnoitru = data; 
            });
            DataService.postData("/web_his/cmu_post",[ {
                                                                param: 'url',
                                                                data: [
                                                                    $scope.dvtt,
                                                                    '960460',
                                                                    'DM_TSDV_SL_MTSO'
                                                                ]
            }]).then(function(thamso){
                            $scope.thongtinthanhtoan.hienthistg = thamso; 
                });
        }
        function laydsnhanvien() {
            DataService
                    .getData("/web_his/cmu_getlist",[$scope.phongban,'CMU_DSNHANVIEN'])
                    .then(function(data){
                        $scope.dsnhanvien = data;
            });
        }
        $scope.reloaddsbn = function() {
            $scope.laydsbn();
        }
        $scope.laydsbn = function(event) {
            $scope.loadingDs = true;
            resetData();
            DataService
                    .getData("/web_his/cmu_getlist",[
                            $scope.dvtt
                            ,parseDateToString($scope.ngaybatdau),parseDateToString($scope.ngayketthuc)
                            ,$scope.trangthaibn,181500,
                            $scope.loaivienphi,$scope.khoa
                            ,'CMU_VIENPHI_DS'])
                    .then(function(data){
                        $scope.listbn = data;
                        $scope.loadingDs = false;
            }, function(){
                $scope.loadingDs = false;
                thongbaoloi("Đã có lỗi không lấy được danh sách bệnh nhân.")
            });
        }
        function resetData() {
            $scope.listbn = [];
            $scope.hoadonphathanh = [];
            $scope.dsyeucauhuyhd = [];
            $scope.selectedbn = false;
            $scope.listthanhtoan = [];
            $scope.thongtinbn = {};
            $scope.thongtinhuyhoadon = {};
            $scope.trangthaihuyhoadon = false;
            $scope.listtamung = [];
            $scope.thongtinthanhtoan.ngaythu =  new Date()
            $scope.thongtinthanhtoan.tientamung =  0;
            $scope.thongtinthanhtoan.sotientt = 0;
            $scope.thongtinthanhtoan.sotienbntra = 0;
            $scope.thongtinthanhtoan.sotienthoilai = 0;
            $scope.thongtinthanhtoan.tienmiengiam = 0;
            $scope.thongtinthanhtoan.maquyenbienlai = "";
            $scope.thongtinthanhtoan.kyhieubienlai = '';
            $scope.thongtinthanhtoan.sobienlai = "";
            $scope.thongtinthanhtoan.trutamung = 0;
            $scope.thongtinthanhtoan.bltieptheo = false;
            $scope.thongtinthanhtoan.tmiengiam = false;
            $scope.thongtinthanhtoan.hoantatkham =  0;
            $scope.thongtinthanhtoan.xemct=false;
            $scope.thongtinthanhtoan.key_hd = '';
            $scope.thongtinthanhtoan.kyhieu_quyenbienlai = '';
            $scope.thongtinthanhtoan.ghichu = '';
            $scope.thongtinthanhtoan.nguoimiengiam =  0;
            $scope.thongtinthanhtoan.vat =  -1;
            $scope.thongtinthanhtoan.hinhthucthanhtoan =  'Tiền mặt';
            $scope.thongtinthanhtoan.masothue =  '';
            $scope.thongtinthanhtoan.tendonvi =  '';
            $scope.lanttselected = {};
        }
        $scope.laydshd = function() {
            $scope.showLoading = true;
            DataService
                    .getData("/web_his/cmu_getlist",[
                            $scope.dvtt,
                            $scope.loaibnhd
                            ,parseDateToString($scope.ngaybd),
                            parseDateToString($scope.ngaykt) ,
                            $scope.loaihd,
                            $scope.filtermaquyenbienlai,
                            $scope.filternhanvien,
                            $scope.filtercobhyt
                            ,'CMU_DS_HDDT'])
                    .then(function(data){
                        
                        $scope.listdshd = data;
                        $scope.showLoading = false;
                          
                
            });
        }
        $scope.$on('LOADDSBNSAUTT', function(data) {
            $scope.laydsbn(data);
        });
        $scope.$on('SHOWLOADING', function(data) {
            $scope.showLoading = true;
        });
        $scope.$on('HIDELOADING', function(data) {
             $scope.showLoading = false;
        });
        function gettenphongban(id) {
            var t = '';
            $scope.listkhoa.forEach(function(data) {
                if (data.MA_PHONGBAN == id) 
                    t = data.TEN_PHONGBAN
            })
            return t;
        }
        $scope.inbangke = function() {
            if($scope.thongtinbn.LOAIVP == 'NOITRU' || $scope.thongtinbn.LOAIVP == 'BANT') {
                var url = "noitru_taobangke";
                var arr = [$scope.dvtt,$scope.thongtinbn.STT_DOTDIEUTRI
                                        ,$scope.thongtinbn.STT_BENHAN,
                                        $scope.thongtinbn.SOPHIEUTHANHTOAN
                                        ,$scope.thongtinbn.MA_BENH_NHAN];
                $.post(url, {
                    url: c_convert_to_string(arr)
                }).done(function (data) {  
                    if (data != -1) {
                            $.post("noitru_trangthaiketthuc_svv", {
                                sovaovien: $scope.thongtinbn.SOVAOVIEN,
                                sovaovien_dt: $scope.thongtinbn.SOVAOVIEN_DT,
                                dvtt: $scope.dvtt,
                                stt_benhan: $scope.thongtinbn.STT_BENHAN,
                                stt_dotdieutri: $scope.thongtinbn.STT_DOTDIEUTRI
                            }).done(function (dt) {
                                if (dt == "0" || dt == "1")
                                    dt = "1";
                                if (dt == "6")
                                    dt = "3";

                                var arr_bk = [$scope.dvtt, $scope.thongtinbn.STT_DOTDIEUTRI, 
                                    $scope.thongtinbn.STT_BENHAN, 
                                    $scope.thongtinbn.SOPHIEUTHANHTOAN, $scope.thongtinbn.MA_BENH_NHAN, dt, $scope.thongtinbn.SOVAOVIEN, $scope.thongtinbn.SOVAOVIEN_DT];
                                $(location).attr('href', 'noitru_inbangke?url=' + c_convert_to_string(arr_bk));
                                if ($scope.thongtinbn.LOAIVP == 'BANT') {
                                    $.ajax({
                                        url: "check_out_byt_bant?sovaovien_dt=" + $scope.thongtinbn.SOVAOVIEN_DT + "&sovaovien=" 
                                                + $scope.thongtinbn.SOVAOVIEN + "&dvtt=" + $scope.dvtt,
                                        type: "post"
                                    });
                                } else {
                                    $.ajax({
                                        url: "check_out_byt_noi_tru?sovaovien_dt=" + $scope.thongtinbn.SOVAOVIEN_DT + "&sovaovien=" 
                                                + $scope.thongtinbn.SOVAOVIEN + "&dvtt=" + $scope.dvtt,
                                        type: "post"
                                    });
                                }
                              
                            });
                        } else {
                            alert("Chưa có dữ liệu. Vui lòng in lại bảng kê");
                        }
                })                  
            } else if ($scope.thongtinbn.LOAIVP == 'BHYT' || $scope.thongtinbn.LOAIVP == 'THUPHI')  {
                if($scope.thongtinbn.load.SOTHEBHYT != '' &&  $scope.thongtinbn.load.SOTHEBHYT != null ) {
                    var url = "taobangke_truocin?makb=kb_" + $scope.thongtinbn.ID_TIEPNHAN + "&dvtt="+$scope.dvtt+"&sophieu=" + $scope.thongtinbn.SOPHIEUTHANHTOAN;
                    $.ajax({
                            url: url
                        }).done(function (data) {
                            $(location).attr('href', 'inbangke_gt?makb=kb_' + $scope.thongtinbn.ID_TIEPNHAN + "&dvtt="+$scope.dvtt+"&sophieu=" + $scope.thongtinbn.SOPHIEUTHANHTOAN);
                        });
                    
                } else {
                    var url = "taobangkekhongbaohiem_truocin?makb=kb_" + $scope.thongtinbn.ID_TIEPNHAN + "&dvtt="+$scope.dvtt+"&idtiepnhan=" + $scope.thongtinbn.ID_TIEPNHAN;
                    $.ajax({
                            url: url
                        }).done(function (data) {
                            $(location).attr('href', 'inbangke_gt?makb=kb_' + $scope.thongtinbn.ID_TIEPNHAN + "&dvtt="+$scope.dvtt+"&sophieu=" + $scope.thongtinbn.SOPHIEUTHANHTOAN);
                        });
                }
                
            } else {
                
            }
        }
        function trangthaibn(loaivp,trangthai) {
            var t = '';
            if(loaivp == 'BHYT' || loaivp == 'THUPHI') {
                switch(trangthai) {
                    case 3: 
                        t = "Cấp toa cho về";
                        break;
                    case 7: 
                        t = 'Nhập Viện';
                        break;
                    case 6:
                        t = "Chuyển viện";    
                        break;
                }
            }
            if(loaivp != 'BHYT' && loaivp != 'THUPHI') {
                switch(trangthai) {
                    case 1: 
                        t = "Kết thúc đợt điều trị";
                        break;
                    
                    case 6:
                        t = "Trốn viện";    
                        break;
                    case 4:
                        t = "Chuyển viện";    
                        break;  
                    case 0:
                        t = "Đang nằm viện";    
                        break;    
                    default: 
                        t = 'Ra viện';
                        break;
                }
            }
            return t;
        }
        $scope.listbn = [];
        $scope.listbnConfig = [
            {
                name: "SỐ PHIẾU",
                flex: 30,
                field: "SOPHIEUTHANHTOAN",
                display: true,
                filter: true
            },
            {
                name: "HỌ TÊN",
                flex: 70,
                field: "TEN_BENH_NHAN",
                display: true,
                filter: true
            },
            {
                name: "SOVAOVIEN",
                flex: 0,
                field: "SOVAOVIEN",
                display: false,
                filter: false
            },
            {
                name: "SOVAOVIEN_DT",
                flex: 0,
                field: "SOVAOVIEN_DT",
                display: false,
                filter: false
            },
            {
                name: "MA_BENH_NHAN",
                flex: 0,
                field: "MA_BENH_NHAN",
                display: false,
                filter: false
            },
            {
                name: "TEN_PHONGBAN",
                flex: 0,
                field: "TEN_PHONGBAN",
                display: false,
                filter: false
            },
            {
                name: "STT_BENHAN",
                flex: 0,
                field: "STT_BENHAN",
                display: false,
                filter: false
            },
            {
                name: "SO_THE_BHYT",
                flex: 0,
                field: "SO_THE_BHYT",
                display: false,
                filter: false
            }
        ]
        $scope.listbnfooter = [
            {
                flex: 100,
                type: "COUNT",
                text: "Tổng số BN: "
            }
        ]
        $scope.listthanhtoan = [];
        $scope.listttConfig = [
            {
                name: "STT",
                flex: 5,
                field: "STT_LANTHANHTOAN",
                display: true,
                filter: false
            },
            {
                name: "Số BL",
                flex: 15,
                field: "SO_BIEN_LAI",
                display: true,
                filter: false
            },
            {
                name: "Quyển BL",
                flex: 15,
                field: "KYHIEU_QUYEN_BIENLAI",
                display: true,
                filter: false
            },
            {
                name: "Số tiền",
                flex: 15,
                field: "SOTIENPHAITHANHTOAN",
                display: true,
                filter: false,
                format: true
            },
            {
                name: "Ngày TT",
                flex: 15,
                field: "NGAY_THU",
                display: true,
                filter: false
            },
            {
                name: "Người thu",
                flex: 20,
                field: "TEN_NHANVIEN",
                display: true,
                filter: false
            },
            {
                name: "",
                flex: 15,
                field: "ICONS_ACTION",
                icons: [
                    {
                        
                        icon: function(data) {
                            return 'print';
                        },
                        callback: function(data) {
                            if ($scope.thongtinbn.LOAIVP == 'NOITRU' || $scope.thongtinbn.LOAIVP == 'BANT' || $scope.thongtinbn.LOAIVP == 'NTDICHVU'){
                                var arr = [$scope.dvtt, 
                                    data.data.STT_BENHAN,
                                    data.data.STT_LANTT,
                                    data.data.SOTIENPHAITHANHTOAN, 
                                    data.data.STT_DOTDIEUTRI, 
                                    new Intl.NumberFormat("en-US").format(data.data.SOTIENPHAITHANHTOAN),
                                    data.data.TEN_NHANVIEN, "NOP",'0','0'];
                                if(data.data.SOTIENTHOILAI == 0) {
                                    var url = "noitru_inphieuthutien?url=" + c_convert_to_string(arr);
                                    $(location).attr('href', url);
                                } else {
                                    
                                    arr[3] = data.data.SOTIENTHOILAI;
                                    arr[5] = new Intl.NumberFormat("en-US").format(data.data.SOTIENTHOILAI);
                                    var url = "noitru_inphieuhoanung?url=" + c_convert_to_string(arr);
                                    $(location).attr('href', url);
                                }
                            } else if ($scope.thongtinbn.LOAIVP == 'BHYT' || $scope.thongtinbn.LOAIVP == 'THUPHI') {
                                var dongchitra = (100 -   $scope.thongtinbn.load.TYLEBAOHIEM) + " %";
                                var arr = [
                                        $scope.dvtt,
                                        $scope.thongtinbn.ID_TIEPNHAN, data.data.STT_LANTT
                                        , data.data.SOTIENPHAITHANHTOAN,
                                        new Intl.NumberFormat("en-US").format(data.data.SOTIENPHAITHANHTOAN)
                                        , encodeURIComponent(dongchitra),'0','0',"0","0","0","0","0","0","0","0","0"];
                                if(data.data.SOTIENTHOILAI == 0) {
                                    var url = "inphieuthutien_cobhyt?url=" + c_convert_to_string(arr);
                                    $(location).attr('href', url);  
                                } else {
                                    var url = "inphieuthoanung_ngoaitru?url=" + c_convert_to_string(arr);
                                    $(location).attr('href', url);
                                }
                                
                            }
                            
                            
                            
                        }
                    },
                    {
                        icon: function(data) {
                             
                            return 'list';
                        },
                        callback: function(data) {
                            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
                            $scope.thongtinthanhtoan.xemct = true;
                            $scope.thongtinthanhtoan.kyhieubienlai = data.data.KYHIEU_QUYEN_BIENLAI;
                            $scope.thongtinthanhtoan.sobienlai = data.data.SO_BIEN_LAI;
                            $scope.thongtinthanhtoan['ngaybntt'] = data.data.NGAY_GIO_TAO;
                            $scope.thongtinthanhtoan.sotientt = data.data.SOTIENPHAITHANHTOAN;
                            $scope.thongtinthanhtoan.sotienbntra = data.data.SOTIENBNTRA;
                            $scope.thongtinthanhtoan.tienmiengiam = data.data.SOTIENMIENGIAM;
                            $scope.thongtinthanhtoan.sotienthoilai = data.data.SOTIENTHOILAI;
                            $scope.thongtinthanhtoan.ghichu = !data.data.GHICHU ? "": data.data.GHICHU;
                            $scope.thongtinthanhtoan.tennhanvienmiengiam = !data.data.TENNHANVIENMIENGIAM ? "0": data.data.TENNHANVIENMIENGIAM;
                            console.log("$scope.thongtinbn", $scope.thongtinbn);
                            DataService
                                .getData("/web_his/cmu_getlist",[
                                        $scope.thongtinbn.ID_TIEPNHAN == undefined? "": $scope.thongtinbn.ID_TIEPNHAN,
                                        $scope.dvtt,
                                        data.data.STT_LANTT,
                                        $scope.thongtinbn.SOVAOVIEN,
                                        $scope.thongtinbn.STT_BENHAN == undefined? "":$scope.thongtinbn.STT_BENHAN,
                                        $scope.thongtinbn.STT_DOTDIEUTRI == undefined? "": $scope.thongtinbn.STT_DOTDIEUTRI,
                                        $scope.thongtinbn.SOVAOVIEN_DT == undefined? "": $scope.thongtinbn.SOVAOVIEN_DT,
                                        $scope.thongtinbn.LOAIVP,
                                        'CMU_CHITIET_LANTT'])
                                .then(function(dt){
                                    $scope.chitietlantt = dt; 
                                    $mdDialog.show({
                                        multiple: true,
                                        skipHide: true,
                                       controller: DialogController,
                                       templateUrl: 'dialog.html',
                                       parent: angular.element(document.body),
                                       targetEvent: data.event,
                                       clickOutsideToClose:true,
                                       locals: {
                                           thongtinbn: $scope.thongtinbn,
                                           thongtinthanhtoan: $scope.thongtinthanhtoan,
                                           chitietthanhtoan: $scope.chitietlantt,
                                           dsqbl: $scope.dsqbl,
                                           hoadonphathanh: $scope.hoadonphathanh,
                                           laphoadonthaythe: false,
                                            dsyeucauhuyhd: $scope.dsyeucauhuyhd,
                                            loaivienphi: $scope.loaivienphi
                                       },
                                       fullscreen: useFullScreen
                                     }).then(function(answer) { }, function() {});
                                        $scope.$watch(function() {
                                          return $mdMedia('xs') || $mdMedia('sm');
                                        }, function(wantsFullScreen) {
                                          $scope.customFullscreen = (wantsFullScreen === true);
                                        });    
                                })
                        }
                    },
                    {
                        icon: function(data) {
                            if (data.data['KHOABIENLAI'] == undefined) {
                                data.data['KHOABIENLAI'] = 0;
                            }    
                            return data.data['KHOABIENLAI'] == 0 ?'lock': 'lock_open';
                        },
                        callback: function(data) {
                            if($scope.admin == 0) {
                                thongbaoloi("Bạn không có quyền mở khóa");
                                return false;
                            }
                             $.post("kiemtra_lockbienlai", {
                                dvtt: $scope.dvtt,
                                nhanvienthu: data.data.NHAN_VIEN_TAO,
                                maquyenbienlai: data.data.MA_QUYEN_BIENLAI == 0 ? "" : data.data.MA_QUYEN_BIENLAI,
                                sobienlai: data.data.SO_BIEN_LAI,
                                keyQL: data.data.STT_LANTT + '-' + data.data.NHAN_VIEN_TAO
                            }).done(function (mokhoa) {
                                var log = " thanh toán: Nhân viên thu: "
                                + data.data.TEN_NHANVIEN + "; Ngày Thu: " + data.data.NGAY_GIO_TAO
                                + "; SỐ BIÊN LAI :" + data.data.SO_BIEN_LAI + "; Bệnh Nhân:"
                                + $scope.thongtinbn.TEN_BENH_NHAN + "-" + $scope.thongtinbn.MA_BENH_NHAN
                                log = mokhoa == 0 ? "Mở khóa" + log : "Khóa" + log;
                                var confirm = $mdDialog.confirm()
                                    .title('Thông Báo')
                                    .textContent('Bạn có chắc sẽ '+ (mokhoa == 0 ? "Mở khóa" : "Khóa") + " lần thanh toán này?")
                                    .ariaLabel('')
                                    .targetEvent(data.event)
                                    .ok('OK')
                                    .cancel('HỦY');
                                $mdDialog.show(confirm).then(function() {
                                    $.post("unlock_xoa_bienlai", {
                                      dvtt: $scope.dvtt,
                                      nhanvienthu: data.data.NHAN_VIEN_TAO,
                                      maquyenbienlai: data.data.MA_QUYEN_BIENLAI == 0 ? "" : data.data.MA_QUYEN_BIENLAI,
                                      sobienlai: data.data.SO_BIEN_LAI,
                                      trangthai: mokhoa == 0? 1:0,
                                      keyQL: data.data.STT_LANTT + '-' + data.data.NHAN_VIEN_TAO,
                                      huy: 1,
                                      log: log
                                    }).done(function (dt) {
                                            data.data['KHOABIENLAI'] = mokhoa == '0'? 1: 0;
                                            $(data.event.currentTarget).html(mokhoa == '0'? 'lock_open': 'lock')
                                    })
                                }, function() {
                                  
                                });
                                
                            })
                            
                        }
                    },
                    {
                        icon:  function(data) {
                            return 'delete_forever';
                        },
                        callback: function(data) {
                            $scope.showLoading = true;
                            DataService
                                .getData("/web_his/cmu_getlist",[
                                    $scope.dvtt
                                    ,$scope.manv
                                    ,'CMU_GETNHANVIEN_VIP'])
                                .then(function(_nhanvien){
                                     if( data.data.KHOABIENLAI == 0 || (_nhanvien.length == 0 && $scope.manv != data.data.NHAN_VIEN_TAO)) {
                                        $scope.showLoading = false;
                                        thongbaoloi(
                                                $scope.manv != data.data.NHAN_VIEN_TAO?"Không được quyền xóa biên lai": "Biên lai đã được khóa. Vui lòng mở khóa", data.event)
                                    } else {
                                        if(data.data['SO_BIEN_LAI'] !=0 && data.data['SO_BIEN_LAI'] != null && data.data.TRANGTHAI == 1) {
                                            if ($scope.thongtinbn.LOAIVP == 'NOITRU' || $scope.thongtinbn.LOAIVP == 'BANT') {
                                                        var url = "noitru_vienphi_lantt_delete_svv_n";
                                                        var arr = [data.data.STT_LANTT, 
                                                                $scope.dvtt, $scope.thongtinbn.SOPHIEUTHANHTOAN, 
                                                                $scope.thongtinbn.STT_BENHAN,$scope.thongtinbn.STT_DOTDIEUTRI, 
                                                                $scope.thongtinbn.MA_BENH_NHAN,
                                                                data.data.MA_QUYEN_BIENLAI == null ? "" : data.data.MA_QUYEN_BIENLAI,
                                                                data.data.SOBIENLAI, 0];
                                                        $.post(url, {
                                                            url: c_convert_to_string(arr),
                                                            sovaovien: $scope.thongtinbn.SOVAOVIEN,
                                                            sovaovien_dt: $scope.thongtinbn.SOVAOVIEN_DT
                                                        }).done(function (dt) {
                                                            thongbaoloi("Xóa lần thanh toán thành công");
                                                            $scope.showLoading = false;
                                                            if (data.data.KEY_HD != null) {
                                                                DataService.capnhathoadonhuy({
                                                                    key_hd: data.data.KEY_HD,
                                                                    stt_lantt: data.data.STT_LANTT,
                                                                    dvtt: $scope.dvtt,
                                                                    sovaovien: $scope.thongtinbn.SOVAOVIEN
                                                                });
                                                            }  else {
                                                                $scope.thongtinthanhtoan['STT_LANTT'] = data.data.STT_LANTT;
                                                                $scope.thongtinbn['SOVAOVIEN_NOI'] = $scope.thongtinbn.SOVAOVIEN;
                                                                $scope.thongtinbn['SOVAOVIEN_DT'] = $scope.thongtinbn.SOVAOVIEN_DT;
                                                                DataService.xoahddtchuaphathanh($scope);
                                                            }
                                                            DataService.lockbienlai($scope,data.data.STT_LANTT,data.data.MA_QUYEN_BIENLAI,data.data.SO_BIEN_LAI,1,2).done(function() {
                                                                $.post("lay_tru_tam_ung_svv", {
                                                                        dvtt: $scope.dvtt,
                                                                        stt_dotdieutri: $scope.thongtinbn.STT_DOTDIEUTRI,
                                                                        stt_benhan: $scope.thongtinbn.STT_BENHAN,
                                                                        sovaovien: $scope.thongtinbn.SOVAOVIEN,
                                                                        sovaovien_dt: $scope.thongtinbn.SOVAOVIEN_DT
                                                                    }).done(function (dtres) {
                                                                        $scope.laydsbn(data.event);
                                                                    });
                                                            })
                                                        });
                                                    } else if ($scope.thongtinbn.LOAIVP == 'NTDICHVU')
                                                    {
                                                        DataService.postData('cmu_post',[ {
                                                                param: 'url',
                                                                data: [
                                                                    $scope.dvtt,
                                                                    data.data.STT_LANTT,
                                                                    $scope.thongtinbn.SOVAOVIEN,
                                                                    'CMU_DEL_LTT_DICHVU'
                                                                ]
                                                            }


                                                        ]).then(function() {
                                                            if (data.data.KEY_HD != null) {
                                                                DataService.capnhathoadonhuy({
                                                                    key_hd: data.data.KEY_HD,
                                                                    stt_lantt: data.data.STT_LANTT,
                                                                    dvtt: $scope.dvtt,
                                                                    sovaovien: $scope.thongtinbn.SOVAOVIEN
                                                                });
                                                            } else {
                                                                $scope.thongtinthanhtoan['STT_LANTT'] = data.data.STT_LANTT;
                                                                $scope.thongtinbn['SOVAOVIEN_NOI'] = $scope.thongtinbn.SOVAOVIEN;
                                                                $scope.thongtinbn['SOVAOVIEN_DT'] = $scope.thongtinbn.SOVAOVIEN_DT;
                                                                DataService.xoahddtchuaphathanh($scope);
                                                            }   
                                                            $scope.showLoading = false;
                                                            thongbaoloi("Xóa lần thanh toán thành công");
                                                            $scope.laydsbn(data.event);
                                                        })
                                                    } else if ($scope.thongtinbn.LOAIVP == 'THUPHI') {
                                                        var arr = [data.data.STT_LANTT, $scope.dvtt,
                                                            $scope.thongtinbn.ID_TIEPNHAN, $scope.thongtinbn.SOVAOVIEN,
                                                            data.data.MA_QUYEN_BIENLAI,
                                                            data.data.SO_BIEN_LAI, $scope.thongtinbn.TEN_BENH_NHAN, 0
                                                        ];
                                                        var url = "huylantt_khongbhyt";
                                                        $.post(url, {url: c_convert_to_string(arr)}).done(function (dt) {
                                                            if (dt == "1")
                                                                thongbaoloi("Bệnh nhân đã được khám bệnh không thể hủy!");
                                                            else if (dt == "2")
                                                                thongbaoloi("Bệnh nhân khám yêu cầu đã được khám bệnh không thể hủy!");
                                                            else if (dt == "3")
                                                                thongbaoloi("Vui lòng hủy xuất thuốc trước!");
                                                            else {
                                                                if (data.data.KEY_HD != null) {
                                                                    DataService.capnhathoadonhuy({
                                                                        key_hd: data.data.KEY_HD,
                                                                        stt_lantt: data.data.STT_LANTT,
                                                                        dvtt: $scope.dvtt,
                                                                        sovaovien: $scope.thongtinbn.SOVAOVIEN
                                                                    });
                                                                }  else {
                                                                    $scope.thongtinthanhtoan['STT_LANTT'] = data.data.STT_LANTT;
                                                                    $scope.thongtinbn['SOVAOVIEN_NOI'] = 0;
                                                                    $scope.thongtinbn['SOVAOVIEN_DT'] = 0;
                                                                    DataService.xoahddtchuaphathanh($scope);
                                                                }   
                                                                thongbaoloi("Xóa lần thanh toán thành công");
                                                                DataService.lockbienlai($scope,data.data.STT_LANTT,data.data.MA_QUYEN_BIENLAI,data.data.SO_BIEN_LAI,1,2).done(function() {
                                                                    $scope.laydsbn(data.event);
                                                                })
                                                            }
                                                            $scope.showLoading = false;
                                                        });
                                                    }
                                                    else {
                                                        var arr = [data.data.STT_LANTT, 
                                                            $scope.dvtt, $scope.thongtinbn.SOPHIEUTHANHTOAN, 
                                                            $scope.thongtinbn.ID_TIEPNHAN, $scope.thongtinbn.SOVAOVIEN,
                                                            data.data.MA_QUYEN_BIENLAI == null ? 0 : data.data.MA_QUYEN_BIENLAI,
                                                            data.data.SO_BIEN_LAI, $scope.thongtinbn.TEN_BENH_NHAN, 0];
                                                        var url = "huylantt_cobhyt_svv";
                                                        $.post(url, {url: c_convert_to_string(arr)}).done(function (dt) {
                                                            if (dt == "1") {
                                                                thongbaoloi("Bệnh nhân đã được xuất thuốc. Vui lòng hủy xuất thuốc trước.", data.event);

                                                            } else {
                                                            if (data.data.KEY_HD != null) {
                                                                DataService.capnhathoadonhuy({
                                                                    key_hd: data.data.KEY_HD,
                                                                    stt_lantt: data.data.STT_LANTT,
                                                                    dvtt: $scope.dvtt,
                                                                    sovaovien: $scope.thongtinbn.SOVAOVIEN
                                                                });
                                                            }  else {
                                                                $scope.thongtinthanhtoan['STT_LANTT'] = data.data.STT_LANTT;
                                                                $scope.thongtinbn['SOVAOVIEN_NOI'] = 0;
                                                                $scope.thongtinbn['SOVAOVIEN_DT'] = 0;
                                                                DataService.xoahddtchuaphathanh($scope);
                                                            } 
                                                            $scope.showLoading = false;    
                                                            thongbaoloi("Xóa lần thanh toán thành công");    
                                                            DataService.lockbienlai($scope,data.data.STT_LANTT,data.data.MA_QUYEN_BIENLAI,data.data.SO_BIEN_LAI,1,2).done(function() {
                                                                var arr = [$scope.dvtt, "kb_" + $scope.thongtinbn.ID_TIEPNHAN, $scope.thongtinbn.SOPHIEUTHANHTOAN, 
                                                                c_string_formatdate(data.data.NGAY_GIO_TAO), $scope.thongtinbn.SOVAOVIEN];
                                                                $.post("update_trangthai_huyxacnhanthanhtoan_svv", {url: c_convert_to_string(arr)}).done(function (data) {
                                                                    $scope.laydsbn(data.event);
                                                                });
                                                            })

                                                        }
                                                        });
                                                    }
                                        } else {
                                            $timeout(function() {
                                                DataService.kiemtrahoadondatontai($scope,data).done(function(_dt) {
                                                    if(_dt.indexOf("ERR") == 0) {
                                                        thongbaoloi("Đã có lỗi xảy ra vui lòng kiểm tra lại.")
                                                        $scope.showLoading = false;
                                                    } else {
                                                       var xml = (new DOMParser()).parseFromString(_dt,"text/xml");
                                                       if(xml.getElementsByTagName("invNum").length > 0) {
                                                           thongbaoloi("Hóa đơn đã được phát hành rồi, vui lòng liên hệ quản trị để xóa.")
                                                           DataService.capnhatsobienlai($scope,data.data.STT_LANTT,Number(xml.getElementsByTagName("invNum")[0].innerHTML),data.data.KEY_HD);
                                                            if (xml.getElementsByTagName("payment")[0].innerHTML == 0) {
                                                               DataService.thanhtoanhddt($scope,
                                                                {data: {ID: data.data.ID,
                                                                    MA_BN: $scope.thongtinbn.MA_BENH_NHAN, 
                                                                    NGAYTHUVIENPHI: data.data.NGAYTHUVIENPHI,
                                                                    KEY_HD: data.data.KEY_HD
                                                                }});

                                                                DataService.chuyendoihoadon($scope,
                                                                {data: {
                                                                    KEY_HD: $scope.thongtinthanhtoan.pattern + ';'+$scope.thongtinthanhtoan.serial+';'+xml.getElementsByTagName("invNum")[0].innerHTML
                                                                }},$scope.thongtinthanhtoan.tennhanvien);
                                                                if($("#cmu_inappagg").val() == 1) {
                                                                    var _tdate = data.data.NGAYTHUVIENPHI.split("/")
                                                                    DataService.inapphoadon($scope,$scope.chitietthanhtoan,data,new Date(_tdate[2]+"-"+_tdate[1]+"-"+_tdate[0]),xml.getElementsByTagName("invNum")[0].innerHTML);
                                                                }

                                                           }
                                                           $scope.showLoading = false;   


                                                       } else {         
                                                            if ($scope.thongtinbn.LOAIVP == 'NOITRU' || $scope.thongtinbn.LOAIVP == 'BANT') {
                                                                var url = "noitru_vienphi_lantt_delete_svv_n";
                                                                var arr = [data.data.STT_LANTT, 
                                                                        $scope.dvtt, $scope.thongtinbn.SOPHIEUTHANHTOAN, 
                                                                        $scope.thongtinbn.STT_BENHAN,$scope.thongtinbn.STT_DOTDIEUTRI, 
                                                                        $scope.thongtinbn.MA_BENH_NHAN,
                                                                        data.data.MA_QUYEN_BIENLAI == null ? "" : data.data.MA_QUYEN_BIENLAI,
                                                                        data.data.SOBIENLAI, 0];
                                                                $.post(url, {
                                                                    url: c_convert_to_string(arr),
                                                                    sovaovien: $scope.thongtinbn.SOVAOVIEN,
                                                                    sovaovien_dt: $scope.thongtinbn.SOVAOVIEN_DT
                                                                }).done(function (dt) {
                                                                    thongbaoloi("Xóa lần thanh toán thành công");
                                                                    if (data.data.KEY_HD != null) {
                                                                        DataService.capnhathoadonhuy({
                                                                            key_hd: data.data.KEY_HD,
                                                                            stt_lantt: data.data.STT_LANTT,
                                                                            dvtt: $scope.dvtt,
                                                                            sovaovien: $scope.thongtinbn.SOVAOVIEN
                                                                        });
                                                                    }  else {
                                                                        $scope.thongtinthanhtoan['STT_LANTT'] = data.data.STT_LANTT;
                                                                        $scope.thongtinbn['SOVAOVIEN_NOI'] = $scope.thongtinbn.SOVAOVIEN;
                                                                        $scope.thongtinbn['SOVAOVIEN_DT'] = $scope.thongtinbn.SOVAOVIEN_DT;
                                                                        DataService.xoahddtchuaphathanh($scope);
                                                                    }
                                                                    DataService.lockbienlai($scope,data.data.STT_LANTT,data.data.MA_QUYEN_BIENLAI,data.data.SO_BIEN_LAI,1,2).done(function() {
                                                                        $.post("lay_tru_tam_ung_svv", {
                                                                                dvtt: $scope.dvtt,
                                                                                stt_dotdieutri: $scope.thongtinbn.STT_DOTDIEUTRI,
                                                                                stt_benhan: $scope.thongtinbn.STT_BENHAN,
                                                                                sovaovien: $scope.thongtinbn.SOVAOVIEN,
                                                                                sovaovien_dt: $scope.thongtinbn.SOVAOVIEN_DT
                                                                            }).done(function (dtres) {
                                                                                $scope.laydsbn(data.event);
                                                                            });
                                                                    })
                                                                });
                                                            } else if ($scope.thongtinbn.LOAIVP == 'NTDICHVU')
                                                            {
                                                                DataService.postData('cmu_post',[ {
                                                                        param: 'url',
                                                                        data: [
                                                                            $scope.dvtt,
                                                                            data.data.STT_LANTT,
                                                                            $scope.thongtinbn.SOVAOVIEN,
                                                                            'CMU_DEL_LTT_DICHVU'
                                                                        ]
                                                                    }


                                                                ]).then(function() {
                                                                    if (data.data.KEY_HD != null) {
                                                                        DataService.capnhathoadonhuy({
                                                                            key_hd: data.data.KEY_HD,
                                                                            stt_lantt: data.data.STT_LANTT,
                                                                            dvtt: $scope.dvtt,
                                                                            sovaovien: $scope.thongtinbn.SOVAOVIEN
                                                                        });
                                                                    } else {
                                                                        $scope.thongtinthanhtoan['STT_LANTT'] = data.data.STT_LANTT;
                                                                        $scope.thongtinbn['SOVAOVIEN_NOI'] = $scope.thongtinbn.SOVAOVIEN;
                                                                        $scope.thongtinbn['SOVAOVIEN_DT'] = $scope.thongtinbn.SOVAOVIEN_DT;
                                                                        DataService.xoahddtchuaphathanh($scope);
                                                                    }   
                                                                    $scope.showLoading = false;
                                                                    thongbaoloi("Xóa lần thanh toán thành công");
                                                                    $scope.laydsbn(data.event);
                                                                })
                                                            } else if ($scope.thongtinbn.LOAIVP == 'THUPHI') {
                                                                var arr = [data.data.STT_LANTT, $scope.dvtt,
                                                                    $scope.thongtinbn.ID_TIEPNHAN, $scope.thongtinbn.SOVAOVIEN,
                                                                    data.data.MA_QUYEN_BIENLAI,
                                                                    data.data.SO_BIEN_LAI, $scope.thongtinbn.TEN_BENH_NHAN, 0
                                                                ];
                                                                var url = "huylantt_khongbhyt";
                                                                $.post(url, {url: c_convert_to_string(arr)}).done(function (dt) {
                                                                    if (dt == "1")
                                                                        thongbaoloi("Bệnh nhân đã được khám bệnh không thể hủy!");
                                                                    else if (dt == "2")
                                                                        thongbaoloi("Bệnh nhân khám yêu cầu đã được khám bệnh không thể hủy!");
                                                                    else if (dt == "3")
                                                                        thongbaoloi("Vui lòng hủy xuất thuốc trước!");
                                                                    else {
                                                                        if (data.data.KEY_HD != null) {
                                                                            DataService.capnhathoadonhuy({
                                                                                key_hd: data.data.KEY_HD,
                                                                                stt_lantt: data.data.STT_LANTT,
                                                                                dvtt: $scope.dvtt,
                                                                                sovaovien: $scope.thongtinbn.SOVAOVIEN
                                                                            });
                                                                        }  else {
                                                                            $scope.thongtinthanhtoan['STT_LANTT'] = data.data.STT_LANTT;
                                                                            $scope.thongtinbn['SOVAOVIEN_NOI'] = 0;
                                                                            $scope.thongtinbn['SOVAOVIEN_DT'] = 0;
                                                                            DataService.xoahddtchuaphathanh($scope);
                                                                        }   
                                                                        thongbaoloi("Xóa lần thanh toán thành công");
                                                                        DataService.lockbienlai($scope,data.data.STT_LANTT,data.data.MA_QUYEN_BIENLAI,data.data.SO_BIEN_LAI,1,2).done(function() {
                                                                            $scope.laydsbn(data.event);
                                                                        })
                                                                    }
                                                                    $scope.showLoading = false;
                                                                });
                                                            }
                                                            else {
                                                                var arr = [data.data.STT_LANTT, 
                                                                    $scope.dvtt, $scope.thongtinbn.SOPHIEUTHANHTOAN, 
                                                                    $scope.thongtinbn.ID_TIEPNHAN, $scope.thongtinbn.SOVAOVIEN,
                                                                    data.data.MA_QUYEN_BIENLAI == null ? 0 : data.data.MA_QUYEN_BIENLAI,
                                                                    data.data.SO_BIEN_LAI, $scope.thongtinbn.TEN_BENH_NHAN, 0];
                                                                var url = "huylantt_cobhyt_svv";
                                                                $.post(url, {url: c_convert_to_string(arr)}).done(function (dt) {
                                                                    if (dt == "1") {
                                                                        thongbaoloi("Bệnh nhân đã được xuất thuốc. Vui lòng hủy xuất thuốc trước.", data.event);

                                                                    } else {
                                                                    if (data.data.KEY_HD != null) {
                                                                        DataService.capnhathoadonhuy({
                                                                            key_hd: data.data.KEY_HD,
                                                                            stt_lantt: data.data.STT_LANTT,
                                                                            dvtt: $scope.dvtt,
                                                                            sovaovien: $scope.thongtinbn.SOVAOVIEN
                                                                        });
                                                                    }  else {
                                                                        $scope.thongtinthanhtoan['STT_LANTT'] = data.data.STT_LANTT;
                                                                        $scope.thongtinbn['SOVAOVIEN_NOI'] = 0;
                                                                        $scope.thongtinbn['SOVAOVIEN_DT'] = 0;
                                                                        DataService.xoahddtchuaphathanh($scope);
                                                                    } 
                                                                    $scope.showLoading = false;    
                                                                    thongbaoloi("Xóa lần thanh toán thành công");    
                                                                    DataService.lockbienlai($scope,data.data.STT_LANTT,data.data.MA_QUYEN_BIENLAI,data.data.SO_BIEN_LAI,1,2).done(function() {
                                                                        var arr = [$scope.dvtt, "kb_" + $scope.thongtinbn.ID_TIEPNHAN, $scope.thongtinbn.SOPHIEUTHANHTOAN, 
                                                                        c_string_formatdate(data.data.NGAY_GIO_TAO), $scope.thongtinbn.SOVAOVIEN];
                                                                        $.post("update_trangthai_huyxacnhanthanhtoan_svv", {url: c_convert_to_string(arr)}).done(function (data) {
                                                                            $scope.laydsbn(data.event);
                                                                        });
                                                                    })

                                                                }
                                                                });
                                                            }
                                                        }
                                                    }
                                                })
                                            },5000)
                                            
                                        }    
                                    }   
                                })
                            
                        }
                    },
                    {
                        icon:  function(data) {
                            return data.data.TRANGTHAI == 1?"":"assignment_turned_in";
                        },
                        callback: function(data) {
                            
                             var confirm = $mdDialog.confirm({multiple:true,skipHide: true})
                            .title('Thông báo')
                            .textContent('Bạn có chắc phát hành hóa đơn này.')
                            .ariaLabel('Lucky day')
                            .ok('Đồng ý')
                            .cancel('Hủy');

                            $mdDialog.show(confirm).then(function() {
                                if ($scope.manv != data.data.NHAN_VIEN_TAO) {
                                    thongbaoloi("Bạn không có quyền phát hành hóa đơn này?")
                                    return false;
                                }
                            if(data.data.TRANGTHAI != 1) {
                                $scope.showLoading = true;
                                DataService.kiemtrahoadondatontai($scope,data).done(function(_dt) {
                                    if(_dt.indexOf("ERR") == 0) {
                                        thongbaoloi("Đã có lỗi xảy ra vui lòng kiểm tra lại.")
                                    } else {
                                       var xml = (new DOMParser()).parseFromString(_dt,"text/xml");
                                       if(xml.getElementsByTagName("invNum").length > 0) {
                                           DataService.capnhatsobienlai($scope,data.data.STT_LANTT,Number(xml.getElementsByTagName("invNum")[0].innerHTML),data.data.KEY_HD);
                                           if (xml.getElementsByTagName("payment")[0].innerHTML == 0) {
                                               DataService.thanhtoanhddt($scope,
                                                {data: {ID: data.data.ID,
                                                    MA_BN: $scope.thongtinbn.MA_BENH_NHAN, 
                                                    NGAYTHUVIENPHI: data.data.NGAYTHUVIENPHI,
                                                    KEY_HD: data.data.KEY_HD
                                                }});
                                                data.data['SO_BIEN_LAI']=Number(xml.getElementsByTagName("invNum")[0].innerHTML);
                                                DataService.chuyendoihoadon($scope,
                                                {data: {
                                                    KEY_HD: $scope.thongtinthanhtoan.pattern + ';'+$scope.thongtinthanhtoan.serial+';'+xml.getElementsByTagName("invNum")[0].innerHTML
                                                }},$scope.thongtinthanhtoan.tennhanvien);
                                                if($("#cmu_inappagg").val() == 1) {
                                                    var _tdate = data.data.NGAYTHUVIENPHI.split("/")
                                                    DataService.inapphoadon($scope,$scope.chitietthanhtoan,data,new Date(_tdate[2]+"-"+_tdate[1]+"-"+_tdate[0]),xml.getElementsByTagName("invNum")[0].innerHTML);
                                                }
                                                $scope.showLoading = false;
                                           }     
                                       } else {
                                           DataService
                                                .getData("cmu_getlist",
                                                    [   
                                                        $scope.thongtinthanhtoan.dvtt,
                                                        data.data.MA_QUYEN_BIENLAI,'CMU_LAY_PATTERN'
                                                    ]
                                                ).then(function(pattern) {
                                                     $scope.thongtinthanhtoan.pattern = pattern[0].PATTERN;
                                                     $scope.thongtinthanhtoan.serial = pattern[0].SERIAL;
                                                     $scope.thongtinthanhtoan.serialbhyt = pattern[0].SERIALBHYT;
                                                     $scope.thongtinthanhtoan.hoadonchitiet = $scope.hienthichitietthanhtoan;
                                                     $scope.thongtinthanhtoan.vat = pattern[0].VAT;
                                                     var loaivp = $scope.thongtinbn.LOAIVP;

                                                     loadctlantt(data).then(function(cttlt){
                                                            $scope.chitietthanhtoan = cttlt;
                                                            $scope.thongtinbn.LOAIVP = loaivp;     
                                                            DataService.phathanhhoadon($scope,data).done(function (dt) {
                                                                if(dt.indexOf("SOBIENLAI") == -1)  {
                                                                    $rootScope.$broadcast('HIDELOADING');
                                                                }
                                                                if (dt == 1) {
                                                                    thongbaoloi("Tài khoản đăng nhập sai hoặc không có quyền!");
                                                                } else if (dt == 3) {
                                                                    thongbaoloi("Dữ liệu xml đầu vào không đúng quy định!");
                                                                } else if (dt == 5) {
                                                                    thongbaoloi("Không phát hành được hóa đơn!");
                                                                } else if (dt == 6) {
                                                                    thongbaoloi("Không đủ hóa đơn trong lô phát hành!");
                                                                } else if (dt == 7) {
                                                                    thongbaoloi("User name không phù hợp, không tìm thấy company tương ứng cho user!");
                                                                } else if (dt == 10) {
                                                                    thongbaoloi("Lô có số hóa đơn vượt quá max cho phép!");
                                                                } else if (dt == 20) {
                                                                    thongbaoloi("Pattern hoặc serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng ký có sử dụng Pattern và serial!");
                                                                } else {
                                                                    $scope.showLoading = false;
                                                                    $scope.lanttselected['TRANGTHAI'] = 1;
                                                                    thongbaoloi("Phát hành hóa đơn thành công!");
                                                                    data.data['SO_BIEN_LAI'] = dt.split("SOBIENLAI")[1];
                                                                    DataService.capnhatsobienlai($scope,data.data.STT_LANTT,dt.split("SOBIENLAI")[1],data.data.KEY_HD);
                                                                    DataService.postData('cmu_post',
                                                                    [   {
                                                                            param: 'url',
                                                                            data: [
                                                                            $scope.thongtinthanhtoan.dvtt,
                                                                            $scope.thongtinbn.SOVAOVIEN,
                                                                            $scope.thongtinbn.SOVAOVIEN_DT == null || $scope.thongtinbn.SOVAOVIEN_DT == undefined? 0:$scope.thongtinbn.SOVAOVIEN_DT,
                                                                            data.data.STT_LANTT
                                                                            ,data.data.KEY_HD,
                                                                            $scope.thongtinbn.LOAIVP
                                                                            ,'CMU_KIEMTRAHDSAISOT']
                                                                        }
                                                                    ]).then(function(_sohoadon){
                                                                        DataService.chuyendoihoadon($scope,
                                                                        {data: {
                                                                            KEY_HD: $scope.thongtinthanhtoan.pattern + ';'+$scope.thongtinthanhtoan.serial+';'+pad(_sohoadon,7,'0')
                                                                        }},$scope.thongtinthanhtoan.tennhanvien);
                                                                    })
                                                                    DataService.thanhtoanhddt($scope,
                                                                            {data: {ID: data.data.ID,
                                                                                MA_BN: $scope.thongtinbn.MA_BENH_NHAN, 
                                                                                NGAYTHUVIENPHI: data.data.NGAYTHUVIENPHI,
                                                                                KEY_HD: data.data.KEY_HD
                                                                            }});
                                                                }
                                                            });         
                                                        })
                                                })
                                           
                                       }
                                    }
                                })
                                
                            }  
                            }, function() {

                            });
                            
                            
                            
                            
                        },
                        title: function(data) {
                            return data.TRANGTHAI == 1?"":"Phát hành hóa đơn";
                        }
                    },
                    {
                        icon:  function(data) {
                            console.log("data",data);
                            return data.data.TRANGTHAI == 1? 'receipt': '';
                        },
                        callback: function(data) {
                            if (data.data.TRANGTHAI == 1) {
                                DataService.getPattern(
                                                    $scope.thongtinthanhtoan.dvtt,
                                                    data.data.MA_QUYEN_BIENLAI).then(function(pattern) {
                                                    $scope.thongtinthanhtoan.pattern = pattern[0].PATTERN;
                                                    $scope.thongtinthanhtoan.serial = pattern[0].SERIAL;
                                                    $scope.thongtinthanhtoan.serialbhyt = pattern[0].SERIALBHYT;
                                                    $scope.thongtinthanhtoan.vat = pattern[0].VAT;
                                                    DataService.chuyendoihoadon($scope,
                                                    {data: {
                                                        KEY_HD: $scope.thongtinthanhtoan.pattern + ';'+$scope.thongtinthanhtoan.serial+';'+data.data['SO_BIEN_LAI']
                                                    }},data.data.TEN_NHANVIEN);
                                                    $scope.thongtinthanhtoan.xemct = true;
                                                    $scope.thongtinthanhtoan.kyhieubienlai = data.data.KYHIEU_QUYEN_BIENLAI;
                                                    $scope.thongtinthanhtoan.sobienlai = data.data.SO_BIEN_LAI;
                                                    $scope.thongtinthanhtoan['ngaybntt'] = data.data.NGAY_GIO_TAO;
                                                    $scope.thongtinthanhtoan.sotientt = data.data.SOTIENPHAITHANHTOAN;
                                                    $scope.thongtinthanhtoan.sotienbntra = data.data.SOTIENBNTRA;
                                                    $scope.thongtinthanhtoan.tienmiengiam = data.data.SOTIENMIENGIAM;
                                                    $scope.thongtinthanhtoan.sotienthoilai = data.data.SOTIENTHOILAI;
                                                    if($("#cmu_inappagg").val() == 1) {
                                                        DataService
                                                        .getData("/web_his/cmu_getlist",[
                                                                $scope.thongtinbn.ID_TIEPNHAN == undefined? "": $scope.thongtinbn.ID_TIEPNHAN,
                                                                $scope.dvtt,
                                                                data.data.STT_LANTT,
                                                                $scope.thongtinbn.SOVAOVIEN,
                                                                $scope.thongtinbn.STT_BENHAN == undefined? "":$scope.thongtinbn.STT_BENHAN,
                                                                $scope.thongtinbn.STT_DOTDIEUTRI == undefined? "": $scope.thongtinbn.STT_DOTDIEUTRI,
                                                                $scope.thongtinbn.SOVAOVIEN_DT == undefined? "": $scope.thongtinbn.SOVAOVIEN_DT,
                                                                $scope.thongtinbn.LOAIVP,
                                                                'CMU_CHITIET_LANTT'])
                                                        .then(function(dt){
                                                            var t = data.data.NGAYTHUVIENPHI.split("/");
                                                            DataService.inapphoadon($scope,dt,data,new Date(t[2]+"-"+t[1]+"-"+t[0]),pad(data.data['SO_BIEN_LAI'],7,'0'));    
                                                        })
                                                    }            
                                                    
                                    })
                                
                            }
                            
                        },
                        title: function() {
                            return "In hóa đơn";
                        }
                    },
                    {
                        icon: function(data) {
                            return data.data.TRANGTHAI == 1? 'description': '';
                        },
                        callback: function(data) {
                            DataService
                            .getData("/web_his/cmu_getlist",[
                                $scope.dvtt
                                ,$scope.manv
                                ,'CMU_GETNHANVIEN_VIP'])
                            .then(function(_nhanvien){
                                if($scope.manv != data.data.NHAN_VIEN_TAO && _nhanvien.length ==0) {
                                    thongbaoloi("Bạn không có quyền tạo đơn hủy lai", data.event)
                                } else {
                                    $scope.thongtinthanhtoan.kyhieubienlai = data.data.KYHIEU_QUYEN_BIENLAI;
                                    $scope.thongtinthanhtoan.sobienlai = data.data.SO_BIEN_LAI;
                                    $scope.thongtinthanhtoan['ngaybntt'] = data.data.NGAY_GIO_TAO;
                                    $scope.thongtinthanhtoan.sotientt = data.data.SOTIENPHAITHANHTOAN;
                                    $scope.thongtinthanhtoan.sotienbntra = data.data.SOTIENBNTRA;
                                    $scope.thongtinthanhtoan.tienmiengiam = data.data.SOTIENMIENGIAM;
                                    $scope.thongtinthanhtoan.sotienthoilai = data.data.SOTIENTHOILAI;
                                    DataService
                                        .getData("cmu_getlist",
                                            [   
                                                $scope.thongtinthanhtoan.dvtt,
                                                data.data.MA_QUYEN_BIENLAI,'CMU_LAY_PATTERN'
                                            ]
                                        ).then(function(pattern) {
                                            DataService
                                            .getData("cmu_getlist",
                                                [   
                                                    $scope.thongtinthanhtoan.dvtt,
                                                    data.data.SOVAOVIEN,
                                                    data.data.MA_LAN_TT,
                                                    'CMU_THONGTINDONHUYLAI'
                                                ]
                                            ).then(function(donhuylai) {
                                                $scope.thongtinthanhtoan.pattern = pattern[0].PATTERN;
                                                $scope.thongtinthanhtoan.serial = pattern[0].SERIAL;
                                                $scope.thongtinthanhtoan.serialbhyt = pattern[0].SERIALBHYT;
                                                $scope.thongtinthanhtoan.hoadonchitiet = $scope.hienthichitietthanhtoan;
                                                $mdDialog.show({
                                                   multiple: true,
                                                   skipHide: true,
                                                   controller: ThongbaohuyController,
                                                   templateUrl: 'thongbaohuy.html',
                                                   parent: angular.element(document.body),
                                                   clickOutsideToClose:true,
                                                   locals: {
                                                       thongtinbn: $scope.thongtinbn,
                                                       thongtinthanhtoan: $scope.thongtinthanhtoan,
                                                       chitietthanhtoan: $scope.chitietthanhtoan,
                                                       data:data,
                                                       donhuylai: donhuylai
                                                   },
                                                   fullscreen: true
                                               }).then(function(answer) {
                                               }, function() {
                                               });
                                               $scope.$watch(function() {
                                                 return $mdMedia('xs') || $mdMedia('sm');
                                               }, function(wantsFullScreen) {
                                                 $scope.customFullscreen = true;
                                               });
                                            })   

                                        })

                                }
                            })
                        }
                    },
                    {
                        icon: function(data) {
                            return data.data.TRANGTHAI == 1? 'autorenew': '';
                        },
                        callback: function(data) {
                           $scope.showLoading = true;
                           DataService.postData('cmu_post',
                            [   {
                                    param: 'url',
                                    data: [
                                    $scope.dvtt,
                                    data.data.SOVAOVIEN == 0?data.data.SOVAOVIEN_NOI:data.data.SOVAOVIEN,
                                    data.data.SOVAOVIEN_DT,
                                    data.data.STT_LANTT
                                    ,data.data.KEY_HD,
                                    $scope.thongtinbn.LOAIVP
                                    ,'CMU_KIEMTRAHDSAISOT']
                                }
                            ]).then(function(_sohoadon){
                               
                                DataService
                                    .getData("cmu_getlist",
                                        [   
                                            $scope.thongtinthanhtoan.dvtt,
                                            data.data.MA_QUYEN_BIENLAI,'CMU_LAY_PATTERN'
                                        ]
                                    ).then(function(pattern) {
                                        $scope.thongtinthanhtoan.pattern = pattern[0].PATTERN;
                                        $scope.thongtinthanhtoan.serial = pattern[0].SERIAL;
                                        $scope.thongtinthanhtoan.serialbhyt = pattern[0].SERIALBHYT;
                                        $scope.thongtinthanhtoan.hoadonchitiet = $scope.hienthichitietthanhtoan;
                                        $scope.showLoading = false;
                                        data.data['SO_BIEN_LAI'] = _sohoadon;
                                        DataService.chuyendoihoadon($scope,
                                                {data: {
                                                    KEY_HD: $scope.thongtinthanhtoan.pattern + ';'+$scope.thongtinthanhtoan.serial+';'+pad(_sohoadon,7,'0')
                                                }},$scope.thongtinthanhtoan.tennhanvien); 
                                    })
                               
                            },function() {
                                thongbaoloi("Đã có lỗi xảy ra", data.event);
                                $scope.showLoading = false;
                            })
                        }
                    }
                    ,{
                        icon: function(data) {
                            return data.data.TRANGTHAI == 1? 'speaker_notes_off': '';
                        },
                        callback: function(data) {
                            if (data.data.KHOABIENLAI == 0) {
                                thongbaoloi("Vui lòng mở khóa biên lai.", data.event)
                            } else {
                                DataService
                                .getData("/web_his/cmu_getlist",[
                                    $scope.dvtt
                                    ,$scope.manv
                                    ,'CMU_GETNHANVIEN_VIP'])
                                .then(function(_nhanvien){
                                    if(_nhanvien.length == 0) {
                                        thongbaoloi("Bạn không có quyền thực hiện thao tác này.", data.event)
                                    } else {
                                        var confirm = $mdDialog.confirm({multiple:true,skipHide: true})
                                        .title('Thông báo')
                                        .textContent('Bạn có chắc phát hủy phát hành hóa đơn này?')
                                        .ariaLabel('')
                                        .ok('Đồng ý')
                                        .cancel('Hủy');
                                        $mdDialog.show(confirm).then(function() {    
                                            $scope.showLoading = true;
                                            DataService
                                                .getData("/web_his/cmu_getlist",[
                                                    $scope.dvtt
                                                    ,data.data.SOVAOVIEN == null?data.data.SOVAOVIEN_NOI:data.data.SOVAOVIEN,
                                                    data.data.STT_LANTT,
                                                    ,'CMU_KTHDHUYHD'])
                                                .then(function(_dsdonhuyhoadon){
                                                    if(_dsdonhuyhoadon.length > 0) {
                                                        if ($scope.thongtinbn.LOAIVP == 'NOITRU' || $scope.thongtinbn.LOAIVP == 'BANT') {
                                                            var url = "noitru_vienphi_lantt_delete_svv_n";
                                                            var arr = [data.data.STT_LANTT, 
                                                                    $scope.dvtt, $scope.thongtinbn.SOPHIEUTHANHTOAN, 
                                                                    $scope.thongtinbn.STT_BENHAN,$scope.thongtinbn.STT_DOTDIEUTRI, 
                                                                    $scope.thongtinbn.MA_BENH_NHAN,
                                                                    data.data.MA_QUYEN_BIENLAI == null ? "" : data.data.MA_QUYEN_BIENLAI,
                                                                    data.data.SOBIENLAI, 0];
                                                            $.post(url, {
                                                                url: c_convert_to_string(arr),
                                                                sovaovien: $scope.thongtinbn.SOVAOVIEN,
                                                                sovaovien_dt: $scope.thongtinbn.SOVAOVIEN_DT
                                                            }).done(function (dt) {

                                                                if (data.data.KEY_HD != null) {
                                                                    DataService.capnhathoadonhuy({
                                                                        key_hd: data.data.KEY_HD,
                                                                        stt_lantt: data.data.STT_LANTT,
                                                                        dvtt: $scope.dvtt,
                                                                        sovaovien: $scope.thongtinbn.SOVAOVIEN
                                                                    });
                                                                }  else {
                                                                    $scope.thongtinthanhtoan['STT_LANTT'] = data.data.STT_LANTT;
                                                                    $scope.thongtinbn['SOVAOVIEN_NOI'] = $scope.thongtinbn.SOVAOVIEN;
                                                                    $scope.thongtinbn['SOVAOVIEN_DT'] = $scope.thongtinbn.SOVAOVIEN_DT;
                                                                    DataService.xoahddtchuaphathanh($scope);
                                                                }
                                                                xoahoadon(data);
                                                                DataService.lockbienlai($scope,data.data.STT_LANTT,data.data.MA_QUYEN_BIENLAI,data.data.SO_BIEN_LAI,1,2).done(function() {
                                                                    $.post("lay_tru_tam_ung_svv", {
                                                                            dvtt: $scope.dvtt,
                                                                            stt_dotdieutri: $scope.thongtinbn.STT_DOTDIEUTRI,
                                                                            stt_benhan: $scope.thongtinbn.STT_BENHAN,
                                                                            sovaovien: $scope.thongtinbn.SOVAOVIEN,
                                                                            sovaovien_dt: $scope.thongtinbn.SOVAOVIEN_DT
                                                                        }).done(function (dtres) {
                                                                            $scope.laydsbn(data.event);
                                                                        });
                                                                })
                                                            });
                                                        } else if ($scope.thongtinbn.LOAIVP == 'NTDICHVU')
                                                        {
                                                            DataService.postData('cmu_post',[ {
                                                                    param: 'url',
                                                                    data: [
                                                                        $scope.dvtt,
                                                                        data.data.STT_LANTT,
                                                                        $scope.thongtinbn.SOVAOVIEN,
                                                                        'CMU_DEL_LTT_DICHVU'
                                                                    ]
                                                                }


                                                            ]).then(function() {
                                                                if (data.data.KEY_HD != null) {
                                                                    DataService.capnhathoadonhuy({
                                                                        key_hd: data.data.KEY_HD,
                                                                        stt_lantt: data.data.STT_LANTT,
                                                                        dvtt: $scope.dvtt,
                                                                        sovaovien: $scope.thongtinbn.SOVAOVIEN
                                                                    });
                                                                } else {
                                                                    $scope.thongtinthanhtoan['STT_LANTT'] = data.data.STT_LANTT;
                                                                    $scope.thongtinbn['SOVAOVIEN_NOI'] = $scope.thongtinbn.SOVAOVIEN;
                                                                    $scope.thongtinbn['SOVAOVIEN_DT'] = $scope.thongtinbn.SOVAOVIEN_DT;
                                                                    DataService.xoahddtchuaphathanh($scope);
                                                                }   
                                                                xoahoadon(data);
                                                                $scope.laydsbn(data.event);
                                                            })
                                                        } else if ($scope.thongtinbn.LOAIVP == 'THUPHI') {
                                                            var arr = [data.data.STT_LANTT, $scope.dvtt,
                                                                $scope.thongtinbn.ID_TIEPNHAN, $scope.thongtinbn.SOVAOVIEN,
                                                                data.data.MA_QUYEN_BIENLAI,
                                                                data.data.SO_BIEN_LAI, $scope.thongtinbn.TEN_BENH_NHAN, 0
                                                            ];
                                                            var url = "huylantt_khongbhyt";
                                                            $.post(url, {url: c_convert_to_string(arr)}).done(function (dt) {
                                                                if (dt == "1")
                                                                    thongbaoloi("Bệnh nhân đã được khám bệnh không thể hủy!");
                                                                else if (dt == "2")
                                                                    thongbaoloi("Bệnh nhân khám yêu cầu đã được khám bệnh không thể hủy!");
                                                                else if (dt == "3")
                                                                    thongbaoloi("Vui lòng hủy xuất thuốc trước!");
                                                                else {
                                                                    if (data.data.KEY_HD != null) {
                                                                        DataService.capnhathoadonhuy({
                                                                            key_hd: data.data.KEY_HD,
                                                                            stt_lantt: data.data.STT_LANTT,
                                                                            dvtt: $scope.dvtt,
                                                                            sovaovien: $scope.thongtinbn.SOVAOVIEN
                                                                        });
                                                                    }  else {
                                                                        $scope.thongtinthanhtoan['STT_LANTT'] = data.data.STT_LANTT;
                                                                        $scope.thongtinbn['SOVAOVIEN_NOI'] = 0;
                                                                        $scope.thongtinbn['SOVAOVIEN_DT'] = 0;
                                                                        DataService.xoahddtchuaphathanh($scope);
                                                                    }   
                                                                    xoahoadon(data);
                                                                    DataService.lockbienlai($scope,data.data.STT_LANTT,data.data.MA_QUYEN_BIENLAI,data.data.SO_BIEN_LAI,1,2).done(function() {
                                                                        $scope.laydsbn(data.event);
                                                                    })
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            var arr = [data.data.STT_LANTT, 
                                                                $scope.dvtt, $scope.thongtinbn.SOPHIEUTHANHTOAN, 
                                                                $scope.thongtinbn.ID_TIEPNHAN, $scope.thongtinbn.SOVAOVIEN,
                                                                data.data.MA_QUYEN_BIENLAI == null ? 0 : data.data.MA_QUYEN_BIENLAI,
                                                                data.data.SO_BIEN_LAI, $scope.thongtinbn.TEN_BENH_NHAN, 0];
                                                            var url = "huylantt_cobhyt_svv";
                                                            $.post(url, {url: c_convert_to_string(arr)}).done(function (dt) {
                                                                if (dt == "1") {
                                                                    thongbaoloi("Bệnh nhân đã được xuất thuốc. Vui lòng hủy xuất thuốc trước.", data.event);
                                                                } else {
                                                                if (data.data.KEY_HD != null) {
                                                                    DataService.capnhathoadonhuy({
                                                                        key_hd: data.data.KEY_HD,
                                                                        stt_lantt: data.data.STT_LANTT,
                                                                        dvtt: $scope.dvtt,
                                                                        sovaovien: $scope.thongtinbn.SOVAOVIEN
                                                                    });
                                                                }  else {
                                                                    $scope.thongtinthanhtoan['STT_LANTT'] = data.data.STT_LANTT;
                                                                    $scope.thongtinbn['SOVAOVIEN_NOI'] = 0;
                                                                    $scope.thongtinbn['SOVAOVIEN_DT'] = 0;
                                                                    DataService.xoahddtchuaphathanh($scope);
                                                                } 

                                                                xoahoadon(data);

                                                                DataService.lockbienlai($scope,data.data.STT_LANTT,data.data.MA_QUYEN_BIENLAI,data.data.SO_BIEN_LAI,1,2).done(function() {
                                                                    var arr = [$scope.dvtt, "kb_" + $scope.thongtinbn.ID_TIEPNHAN, $scope.thongtinbn.SOPHIEUTHANHTOAN, 
                                                                    c_string_formatdate(data.data.NGAY_GIO_TAO), $scope.thongtinbn.SOVAOVIEN];
                                                                    $.post("update_trangthai_huyxacnhanthanhtoan_svv", {url: c_convert_to_string(arr)}).done(function (data) {
                                                                        $scope.laydsbn(data.event);
                                                                    });
                                                                })

                                                            }
                                                            });
                                                        }
                                                    }  else {
                                                        $scope.showLoading = false;
                                                        thongbaoloi("Bạn phải tạo đơn xin hủy hóa đơn", data.event);
                                                    }  
                                            })
                                        },function(){})
                                        
                                    }
                                })
                            }
                        }
                    }
                    
                    
                ],
                display: true,
                filter: false
            }
        ];
        
        
        $scope.flantt = [
            {
                flex: 85,
                type: "SUM",
                text: "Tổng tiền: ",
                fieldSUM: 'SOTIENPHAITHANHTOAN',
                option: false,
                minus: 0
            },
            {
                flex: 15,
                type: "",
                text: "",
                field: 'ICONS_ACTION',
                icons: [
                    {
                        
                        icon: function(data) {
                            return 'print';
                        },
                        callback: function(data) {
                            console.log("data",data)
                            if ($scope.thongtinbn.LOAIVP == 'NOITRU' || $scope.thongtinbn.LOAIVP == 'BANT') {
                                var ngaythu = "";
                                var nguoithu = "";
                                var t = new Date();
                                var arr = [$scope.dvtt, $scope.thongtinbn.SOVAOVIEN, $scope.thongtinbn.SOVAOVIEN_DT, 
                                    $scope.thongtinbn.STT_BENHAN, $scope.thongtinbn.STT_DOTDIEUTRI,
                                    "", t.getDate(), t.getMonth()+1<10? ("0"+ (t.getMonth()+1)) : t.getMonth()+1, t.getFullYear(), "", "", "0"];
                                var url = "inphieuthanhtoan_hoantien?url=" + convertArray(arr);
                                $(location).attr('href', url);
                            }
                            
                        },
                        title: function() {
                            return "In phiếu tổng tiền"
                        }
                    }
                ]
            }  
        ]
        
        $scope.listtamung = [];
        $scope.listtuConfig = [
            {
                name: "STT",
                flex: 5,
                field: "STT_LANTAMUNG",
                display: true,
                filter: false
            },
            {
                name: "Số BL",
                flex: 15,
                field: "SO_BIEN_LAI",
                display: true,
                filter: false
            },
            {
                name: "Quyển BL",
                flex: 15,
                field: "KYHIEU_QUYEN_BIENLAI",
                display: true,
                filter: false
            },
            {
                name: "Số tiền",
                flex: 15,
                field: "SOTIENBNTRA",
                display: true,
                filter: false,
                format: true
            },
            {
                name: "Ngày TT",
                flex: 15,
                field: "NGAY_GIO_TAO",
                display: true,
                filter: false
            },
            {
                name: "Người thu",
                flex: 20,
                field: "TEN_NHANVIEN",
                display: true,
                filter: false
            },
            {
                name: "",
                flex: 15,
                field: "ICONS_ACTION",
                icons: [
                    {
                        
                        icon: function(data) {
                            return 'print';
                        },
                        callback: function(data) {
                            var date1 = new Date($scope.thongtinbn.load.NGAY_SINH);
                            var date2 = new Date();
                            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                            var tuoi = '';    
                            if (diffDays > 365) {
                                tuoi = Math.round(diffDays / 365)
                            } else if (diffDays < 365 && diffDays > 29) {
                                tuoi = Math.round(diffDays / 30) + ' Tháng'
                            } else {
                                tuoi = diffDays + ' Ngày'

                            }
                            var arr = [
                                $scope.dvtt,
                                $scope.thongtinbn.STT_BENHAN, 
                                data.data.STT_LANTAMUNG, 
                                $scope.thongtinbn.TEN_BENH_NHAN, 
                                tuoi, $scope.thongtinbn.GIOITINH == 0? 'Nữ': 'Nam', 
                                " ", $scope.thongtinbn.STT_DOTDIEUTRI,
                                formatNumber(data.data.SOTIENBNTRA), $scope.thongtinbn.MA_BENH_NHAN, $scope.thongtinbn.load.SOBAOHIEMYTE, $scope.thongtinbn.TEN_PHONGBAN
                                , data.data.SO_BIEN_LAI, "ac", "", data.data.TEN_NHANVIEN, data.data.NGAY_GIO_TAO.split(" ")[0]];
                            var url = "inphieuthutientamung?url=" + c_convert_to_string(arr);
                            $(location).attr('href', url);
                            
                        }
                    }        
                ],
                display: true,
                filter: false
            }
        ];
        $scope.ftamung =  [
            {
                flex: 100,
                type: "SUM",
                text: "Tổng tiền: ",
                fieldSUM: 'SOTIENBNTRA',
                option: false,
                minus: 0
            }
        ];
        
        $scope.listdshd = [];
        $scope.listdshdConfig = 
                [
                    {
                        name: "Mã KH",
                        flex: 5,
                        field: "MA_BN",
                        display: true,
                        filter: true
                    },
                    {
                        name: "Tên BN",
                        flex: 10,
                        field: "HO_TEN",
                        display: true,
                        filter: true
                    },
                    {
                        name: "Số thẻ",
                        flex: 10,
                        field: "MA_THE",
                        display: true,
                        filter: true
                    },
                    {
                        name: "Ngày thu",
                        flex: 10,
                        field: "NGAYTHUVIENPHI",
                        display: true,
                        filter: true
                    },
                    {
                        name: "Người thu",
                        flex: 10,
                        field: "TEN_NHANVIEN",
                        display: true,
                        filter: true
                    },
                    {
                        name: "Số tiền HĐ",
                        flex: 10,
                        field: "THANHTHIEN_CHITRA",
                        display: true,
                        filter: true
                    },
                    {
                        name: "Số tiền TT",
                        flex: 10,
                        field: "SOTIENBNTRA",
                        display: true,
                        filter: true
                    },
                    {
                        name: "QBL",
                        flex: 10,
                        field: "KYHIEU_QUYEN_BIENLAI",
                        display: true,
                        filter: true
                    },
                    {
                        name: "SBL",
                        flex: 5,
                        field: "SO_BIEN_LAI",
                        display: true,
                        filter: true
                    },
                    {
                        name: "Loại HĐ",
                        flex: 5,
                        field: "HINHTHUC_BN",
                        display: true,
                        filter: true
                    },
                    {
                        name: "Phát hành",
                        flex: 5,
                        field: "TRANGTHAI_TT",
                        display: true,
                        filter: true
                    },
                    {
                        name: "Thanh toán",
                        flex: 5,
                        field: "TRANGTHAI_THANHTOAN_TT",
                        display: true,
                        filter: true
                    },
                    {
                        name: "",
                        flex: 5,
                        field: "ICONS_ACTION",
                        icons: [
                            {
                                icon: function(data) {
                                    return data.data.TRANGTHAI == 1?'print':'';
                                },
                                callback: function(data) {
                                    DataService.getPattern(
                                                    $scope.thongtinthanhtoan.dvtt,
                                                    data.data.MA_QUYEN_BIENLAI).then(function(pattern) {
                                                    $scope.thongtinthanhtoan.pattern = pattern[0].PATTERN;
                                                    $scope.thongtinthanhtoan.serial = pattern[0].SERIAL;
                                                    $scope.thongtinthanhtoan.serialbhyt = pattern[0].SERIALBHYT;
                                                    $scope.thongtinthanhtoan.vat = pattern[0].VAT;
                                                    DataService.chuyendoihoadon($scope,
                                                    {data: {
                                                        KEY_HD: $scope.thongtinthanhtoan.pattern + ';'+$scope.thongtinthanhtoan.serial+';'+data.data['SO_BIEN_LAI']
                                                    }},data.data.TEN_NHANVIEN);
                                    })
                                    
                                },
                                title: function(data) {
                                    return "Tải hóa đơn";
                                }
                            },
                            {
                                icon: function(data) {

                                    return 'list';
                                },
                                callback: function(data) {
                                    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
                                    
                                        loadctlantt(data).then(function(dt){
                                            $scope.chitietlantt = dt; 
                                            $scope.thongtinthanhtoan.kyhieubienlai = dt[0].KYHIEU_QUYEN_BIENLAI;
                                            $scope.thongtinthanhtoan.sobienlai = dt[0].SO_BIEN_LAI
                                            $scope.thongtinbn['load']['DIACHI'] = data.data.DAICHI
                                            $mdDialog.show({
                                                multiple: true,
                                                skipHide: true,
                                               controller: DialogController,
                                               templateUrl: 'dialog.html',
                                               parent: angular.element(document.body),
                                               targetEvent: data.event,
                                               clickOutsideToClose:true,
                                               locals: {
                                                   thongtinbn: $scope.thongtinbn,
                                                   thongtinthanhtoan: $scope.thongtinthanhtoan,
                                                   chitietthanhtoan: $scope.chitietlantt,
                                                   dsqbl: $scope.dsqbl,
                                                   hoadonphathanh: $scope.hoadonphathanh,
                                                   laphoadonthaythe: false,
                                                   dsyeucauhuyhd: $scope.dsyeucauhuyhd,
                                                   loaivienphi: $scope.loaivienphi
                                               },
                                               fullscreen: useFullScreen
                                             }).then(function(answer) { }, function() {});
                                                $scope.$watch(function() {
                                                  return $mdMedia('xs') || $mdMedia('sm');
                                                }, function(wantsFullScreen) {
                                                  $scope.customFullscreen = (wantsFullScreen === true);
                                                });    
                                        })
                                },
                                title: function(data) {
                                    return "Chi tiết hóa đơn";
                                }
                            },
                            {
                                icon: function(data) {
                                    if(data.data.TRANGTHAI == 2) {
                                        return '';
                                    }
                                    return data.data.TRANGTHAI == 1?'assignment_late':'assignment_turned_in';
                                },
                                callback: function(data) {
                                    DataService
                                    .getData("/web_his/cmu_getlist",[
                                        $scope.dvtt
                                        ,$scope.manv
                                        ,'CMU_GETNHANVIEN_VIP'])
                                    .then(function(_nhanvien){
                                        if (_nhanvien.length == 0 && $scope.manv != data.data.NHAN_VIEN_TAO) {
                                            thongbaoloi("Bạn không có quyền phát hành hóa đơn này.")
                                            return false;
                                        }
                                        var confirm = $mdDialog.confirm({multiple:true,skipHide: true})
                                        .title('Thông báo')
                                        .textContent('Bạn có chắc phát hành/hủy hóa đơn này?')
                                        .ariaLabel('')
                                        .ok('Đồng ý')
                                        .cancel('Hủy');
                                        $mdDialog.show(confirm).then(function() {    
                                            if(data.data.TRANGTHAI != 1) {
                                                $scope.showLoading = true;
                                                var loaivp = $scope.thongtinbn.LOAIVP;
                                                loadctlantt(data).then(function(cttlt){
                                                    $scope.chitietthanhtoan = cttlt;
                                                    $scope.thongtinbn['load']['DIACHI'] = data.data.DAICHI
                                                    $scope.thongtinthanhtoan.kyhieubienlai = cttlt[0].KYHIEU_QUYEN_BIENLAI;
                                                    $scope.thongtinthanhtoan.sobienlai = cttlt[0].SO_BIEN_LAI
                                                    $scope.thongtinthanhtoan.maquyenbienlai = cttlt[0].MA_QUYEN_BIENLAI
                                                    $scope.thongtinbn.TEN_PHONGBAN = '';
                                                    $scope.thongtinbn['GIOI_TINH'] = data.data.GIOITINH
                                                    $scope.thongtinbn['hinhthucthanhtoan'] = data.data.HINHTHUCTHANHTOAN
                                                    if($scope.thongtinbn.LOAIVP != 'HDBL') {

                                                        $scope.listkhoa.forEach(function(_khoa) {
                                                            if(_khoa.MA_PHONGBAN == data.data.KHOADIEUTRI) {
                                                                $scope.thongtinbn.TEN_PHONGBAN = _khoa.TEN_PHONGBAN
                                                            }
                                                        })
                                                    } else {
                                                        data.data['dantoc'] = data.data.ICD
                                                        data.data['noidung'] = cttlt[0].NOIDUNG

                                                    }

                                                    if($scope.thongtinbn.LOAIVP == 'NTDICHVU') {
                                                        $scope.thongtinbn['SOVAOVIEN'] = data.data.SOVAOVIEN_NOI
                                                    }
                                                    DataService.getPattern(
                                                            $scope.thongtinthanhtoan.dvtt,
                                                            $scope.thongtinthanhtoan.maquyenbienlai).then(function(pattern) {
                                                            $scope.thongtinthanhtoan.pattern = pattern[0].PATTERN;
                                                            $scope.thongtinthanhtoan.serial = pattern[0].SERIAL;
                                                            $scope.thongtinthanhtoan.serialbhyt = pattern[0].SERIALBHYT;
                                                            $scope.thongtinthanhtoan.vat = pattern[0].VAT;
                                                            if($scope.thongtinbn.LOAIVP == undefined) {
                                                                $scope.thongtinbn.LOAIVP =   loaivp;
                                                             }
                                                            DataService.phathanhhoadon($scope,data).then(function(dt) {
                                                                if(dt.indexOf("SOBIENLAI") == -1)  {
                                                                    $rootScope.$broadcast('HIDELOADING');
                                                                }
                                                                if (dt == 1) {
                                                                    thongbaoloi("Tài khoản đăng nhập sai hoặc không có quyền!");
                                                                } else if (dt == 3) {
                                                                    thongbaoloi("Dữ liệu xml đầu vào không đúng quy định!");
                                                                } else if (dt == 5) {
                                                                    thongbaoloi("Không phát hành được hóa đơn!");
                                                                } else if (dt == 6) {
                                                                    thongbaoloi("Không đủ hóa đơn trong lô phát hành!");
                                                                } else if (dt == 7) {
                                                                    thongbaoloi("User name không phù hợp, không tìm thấy company tương ứng cho user!",  data.event);
                                                                } else if (dt == 10) {
                                                                    thongbaoloi("Lô có số hóa đơn vượt quá max cho phép!");
                                                                } else if (dt == 20) {
                                                                    thongbaoloi("Pattern hoặc serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng ký có sử dụng Pattern và serial!",  data.event);
                                                                } else {
                                                                    data.data['TRANGTHAI'] = 1;
                                                                    thongbaoloi("Phát hành hóa đơn thành công");
                                                                    data.data['SO_BIEN_LAI'] = pad(dt.split("SOBIENLAI")[1],7,'0')
                                                                    $scope.showLoading = false;
                                                                    $scope.thongtinbn['SOVAOVIEN'] = data.data.SOVAOVIEN_NOI
                                                                    console.log("thong tin bn ", $scope.thongtinbn);
                                                                    DataService.capnhatsobienlai($scope,data.data.MA_LAN_TT,dt.split("SOBIENLAI")[1],data.data.KEY_HD);
                                                                    DataService.thanhtoanhddt($scope,
                                                                            {data: {ID: data.data.ID,
                                                                                MA_BN: $scope.thongtinbn.MA_BENH_NHAN, 
                                                                                NGAYTHUVIENPHI: data.data.NGAYTHUVIENPHI ,
                                                                                KEY_HD: data.data.KEY_HD
                                                                            }});
                                                                }
                                                            })
                                                   })
                                                })
                                            } else {
                                                if (data.data.LOAIVP == 'HDBL') {
                                                    DataService.huythanhtoanhddt($scope,data).then(function(res) {
                                                        if (res == '0') {
                                                             DataService.huyphathanhhoad($scope,data).then(function(dt) {
                                                                if (dt == '0') {
                                                                    thongbaoloi("Hủy thành công!", data.event);
                                                                } else if (dt == 1) {
                                                                    thongbaoloi("Tài khoản đăng nhập sai hoặc không có quyền!", data.event);
                                                                } else if (dt == 2) {
                                                                    thongbaoloi("Không tồn tại hóa đơn cần hủy!", data.event);
                                                                } else if (dt == 8) {
                                                                    thongbaoloi("Hóa đơn đã được thay thế rồi, hủy rồi!", data.event);
                                                                } else if (dt == 9) {
                                                                    thongbaoloi("Trạng thái hóa đơn không được hủy!", data.event);
                                                                }
                                                            })
                                                        } else if (res == 1) {
                                                            thongbaoloi("Tài khoản đăng nhập sai hoặc không có quyền!", data.event);
                                                        } else if (res == 6) {
                                                            thongbaoloi("Không tìm thấy hóa đơn tương ứng!", data.event);
                                                        } else if (res == 7) {
                                                            thongbaoloi("Không gạch nợ được!", data.event);
                                                        } else if (res == 13) {
                                                            thongbaoloi("Hóa đơn đã được gạch nợ!", data.event);
                                                        }
                                                    }) 
                                                } else {
                                                    DataService
                                                    .getData("/web_his/cmu_getlist",[
                                                        $scope.dvtt
                                                        ,data.data.SOVAOVIEN == null?data.data.SOVAOVIEN_NOI:data.data.SOVAOVIEN
                                                        ,'CMU_KIEMTRAHDTHAYTHE'])
                                                    .then(function(_dsdonhuyhoadon){
                                                        if(_dsdonhuyhoadon.length > 0) {
                                                             
                                                            DataService
                                                            .postData("cmu_post",
                                                                [{
                                                                    param:'url',
                                                                    data: [
                                                                        $scope.dvtt
                                                                        ,data.data.SOVAOVIEN == null?data.data.SOVAOVIEN_NOI:data.data.SOVAOVIEN
                                                                        ,data.data.LOAIVP,
                                                                        data.data.MA_LAN_TT,
                                                                        ,'CMU_KIEMTRALANTT'
                                                                    ]}
                                                                ]
                                                                )
                                                            .then(function(_ttlantt){
                                                                if(_ttlantt != 2) {
                                                                    thongbaoloi("Bạn phải hủy lần thanh toán trước", data.event);
                                                                } else {
                                                                    $scope.showLoading = true;
                                                                   DataService.huythanhtoanhddt($scope,data).then(function(res) {
                                                                        if (res == '0') {
                                                                             DataService.huyphathanhhoad($scope,data).then(function(dt) {
                                                                                if (dt == '0') {
                                                                                    thongbaoloi("Hủy thành công!", data.event);
                                                                                } else if (dt == 1) {
                                                                                    thongbaoloi("Tài khoản đăng nhập sai hoặc không có quyền!", data.event);
                                                                                } else if (dt == 2) {
                                                                                    thongbaoloi("Không tồn tại hóa đơn cần hủy!", data.event);
                                                                                } else if (dt == 8) {
                                                                                    thongbaoloi("Hóa đơn đã được thay thế rồi, hủy rồi!", data.event);
                                                                                } else if (dt == 9) {
                                                                                    thongbaoloi("Trạng thái hóa đơn không được hủy!", data.event);
                                                                                }
                                                                                $scope.showLoading = false;
                                                                            })
                                                                        } else if (res == 1) {
                                                                            $scope.showLoading = false;
                                                                            thongbaoloi("Tài khoản đăng nhập sai hoặc không có quyền!", data.event);
                                                                        } else if (res == 6) {
                                                                            $scope.showLoading = false;
                                                                            thongbaoloi("Không tìm thấy hóa đơn tương ứng!", data.event);
                                                                        } else if (res == 7) {
                                                                            $scope.showLoading = false;
                                                                            thongbaoloi("Không gạch nợ được!", data.event);
                                                                        } else if (res == 13) {
                                                                            $scope.showLoading = false;
                                                                            thongbaoloi("Hóa đơn đã được gạch nợ!", data.event);
                                                                        }
                                                                    }) 
                                                                }
                                                            })


                                                        } else {
                                                            thongbaoloi("Bạn phải tạo đơn xin hủy hóa đơn", data.event);
                                                        }    
                                                    });
                                                }


                                            }
                                        },function(){})
                                    })
                                },
                                title: function(data) {
                                    return data.TRANGTHAI == 1?"Hủy phát hành":"Phát hành hóa đơn";
                                }
                            },
                            {
                                icon: function(data) {
                                    return data.data.LOAIVP == 'HDBL' && data.data.TRANGTHAI == 0?'delete_forever':'';
                                },
                                callback: function(data) {
                                    if ($scope.manv != data.data.NHAN_VIEN_TAO) {
                                        thongbaoloi("Bạn không có quyền xóa hóa đơn của người khác.")
                                        return false;
                                    }
                                    if(data.data.TRANGTHAI == 0) {
                                        DataService.postData("cmu_post", [{
                                            param:'url',
                                            data: [
                                                $scope.dvtt,
                                                data.data.MA_LAN_TT,
                                                data.data.MA_BN,
                                                'CMU_XOA_HDBL'
                                            ]
                                        }]).then(function(pattern) {
                                            thongbaoloi("Xóa hóa đơn thành công");
                                            $scope.laydshd();
                                        })
                                    } else {
                                        thongbaoloi("Hóa đơn đã phát hành không thể xóa")
                                        return false;
                                    }
                                    
                                },
                                title: function(data) {
                                    return "Xóa hóa đơn";
                                }
                            },
                            {
                               icon: function(data) {
                                    return data.data.LOAIVP == 'HDBL'?'description':'';
                                },
                                callback: function(data) {
                                    DataService
                                    .getData("/web_his/cmu_getlist",[
                                        $scope.dvtt
                                        ,$scope.manv
                                        ,'CMU_GETNHANVIEN_VIP'])
                                    .then(function(_nhanvien){
                                        if($scope.manv != data.data.NHAN_VIEN_TAO && _nhanvien.length ==0) {
                                            thongbaoloi("Bạn không có quyền tạo đơn hủy lai", data.event)
                                        } else {
                                            $scope.thongtinthanhtoan.kyhieubienlai = data.data.KYHIEU_QUYEN_BIENLAI;
                                            $scope.thongtinthanhtoan.sobienlai = data.data.SO_BIEN_LAI;
                                            $scope.thongtinthanhtoan['ngaybntt'] = data.data.NGAY_GIO_TAO;
                                            $scope.thongtinthanhtoan.sotientt = data.data.SOTIENPHAITHANHTOAN;
                                            $scope.thongtinthanhtoan.sotienbntra = data.data.SOTIENBNTRA;
                                            $scope.thongtinthanhtoan.tienmiengiam = data.data.SOTIENMIENGIAM;
                                            $scope.thongtinthanhtoan.sotienthoilai = data.data.SOTIENTHOILAI;
                                            $scope.thongtinbn['MA_BENH_NHAN'] = data.data.MA_BN;
                                            $scope.thongtinbn['TEN_PHONGBAN'] = '';
                                            $scope.thongtinbn['TEN_BENH_NHAN'] = data.data.TEN_BENH;
                                            $scope.thongtinbn['MA_KHOA_TT'] = '';
                                            $scope.thongtinbn['MA_THE'] = '';
                                            data.data['NGAY_THANH_TOAN'] = data.data.NGAYTHUVIENPHI;
                                            $scope.thongtinbn['load'] = {};
                                            $scope.thongtinbn['load']['NGAYRA'] = "";
                                            DataService
                                                .getData("cmu_getlist",
                                                    [   
                                                        $scope.thongtinthanhtoan.dvtt,
                                                        data.data.MA_QUYEN_BIENLAI,'CMU_LAY_PATTERN'
                                                    ]
                                                ).then(function(pattern) {
                                                    DataService
                                                    .getData("cmu_getlist",
                                                        [   
                                                            $scope.thongtinthanhtoan.dvtt,
                                                            data.data.SOVAOVIEN,
                                                            data.data.MA_LAN_TT,
                                                            'CMU_THONGTINDONHUYLAI'
                                                        ]
                                                    ).then(function(donhuylai) {
                                                        $scope.thongtinthanhtoan.pattern = pattern[0].PATTERN;
                                                        $scope.thongtinthanhtoan.serial = pattern[0].SERIAL;
                                                        $scope.thongtinthanhtoan.serialbhyt = pattern[0].SERIALBHYT;
                                                        $scope.thongtinthanhtoan.hoadonchitiet = $scope.hienthichitietthanhtoan;
                                                        $mdDialog.show({
                                                           multiple: true,
                                                           skipHide: true,
                                                           controller: ThongbaohuyController,
                                                           templateUrl: 'thongbaohuy.html',
                                                           parent: angular.element(document.body),
                                                           clickOutsideToClose:true,
                                                           locals: {
                                                               thongtinbn: $scope.thongtinbn,
                                                               thongtinthanhtoan: $scope.thongtinthanhtoan,
                                                               chitietthanhtoan: $scope.chitietthanhtoan,
                                                               data:data,
                                                               donhuylai: donhuylai
                                                           },
                                                           fullscreen: true
                                                       }).then(function(answer) {
                                                       }, function() {
                                                       });
                                                       $scope.$watch(function() {
                                                         return $mdMedia('xs') || $mdMedia('sm');
                                                       }, function(wantsFullScreen) {
                                                         $scope.customFullscreen = true;
                                                       });
                                                    })   

                                                })

                                        }
                                    })
                                    
                                },
                                title: function(data) {
                                    return "Tạo đơn hủy lai";
                                } 
                            }
                        ],
                        display: true,
                    }
                ]
        
        $scope.fdshd = [
            {
                flex: 45,
                type: "COUNT",
                text: "Tổng Số BN: ",
                fieldSUM: 'HO_TEN',
                option: false,
                minus: 0
            },
            {
                flex: 10,
                type: "SUM",
                text: "",
                fieldSUM: 'THANHTHIEN_CHITRA',
                option: false,
                minus: 0
            },
            {
                flex: 10,
                type: "SUM",
                text: "",
                fieldSUM: 'SOTIENBNTRA',
                option: false,
                minus: 0
            },
            {
                flex: 35,
                type: "",
                text: "",
                fieldSUM: '',
                option: false,
                minus: 0
            },
        ]
        
        $scope.indshoadon = function() {
            var thoigian = "Từ ngày " + parseDateToString2($scope.ngaybd) + " đến ngày " + parseDateToString2($scope.ngaykt)       
            var url = "cmu_dsbnhddt?dvtt="+$scope.dvtt+"&tungay=" + parseDateToString($scope.ngaybd) + "&denngay=" 
                            + parseDateToString($scope.ngaykt) +"&thoigian="+thoigian + "&noitru="+$scope.loaibnhd
                            + "&manhanvien="+$scope.filternhanvien + "&phathanh="+$scope.loaihd + "&loaibh="+$scope.filtercobhyt
                            +"&maquyenbienlai="+$scope.filtermaquyenbienlai    ;
                    $(location).attr('href', url);
        }
        
        function thongbaoloi(message) {
            $mdDialog.show(
                                $mdDialog.alert({multiple:true,skipHide: true})
                                  .parent(angular.element(document.getElementsByTagName('body')))
                                  .clickOutsideToClose(true)
                                  .title('Thông báo')
                                  .textContent(message)
                                  .ok('ĐÓNG')

                              );
        }
        function laydstamung(item) {
             var url = "noitru_tt_tamung_mng_thall?sovaovien=" + item.SOVAOVIEN + "&sovaovien_dt=" + item.SOVAOVIEN_DT +
                     "&dvtt="+$scope.dvtt+"&stt_dotdieutri=" + item.STT_DOTDIEUTRI + "&stt_benhan=" + item.STT_BENHAN;
             $.get(url).done(function(data) {
                 $scope.listtamung = data;
             })
        }
        $scope.taohoadonbanle = function(inhd) {
            var t = new Date();
            var makh = t.getTime();
            if($scope.hoadonle.tenkh != undefined && $scope.hoadonle.tenkh.trim() != "" &&
                    $scope.hoadonle.maquyenbienlai != '' ) {
                $scope.showLoading = true;
                var flag = false;
                $scope.hoadonle.chitietthanhtoan.forEach(function(object,index) {
                    $scope.hoadonle.tendichvu += object.noidung.replace(/;/g,'')+"_!!!_"+object.dvt.replace(/;/g,'')+"_!!!_"+object.soluong+"_!!!_"+object.dongia+"_!!!_"+object.thanhtien;
                    if (index < $scope.hoadonle.chitietthanhtoan.length - 1) {
                        $scope.hoadonle.tendichvu+=';'
                    }
                    if(!isNaN(object.thanhtien)) {
                        $scope.hoadonle.thanhtien = $scope.hoadonle.thanhtien + Number(object.thanhtien);
                        $scope.hoadonle.thanhtien = Number($scope.hoadonle.thanhtien.toFixed(2))

                    } else {
                        flag = true;
                    }
                    if(object.noidung.trim() == '') {
                        flag = true;
                    }

                })
                if(flag || $scope.hoadonle.thanhtien == 0) {
                    thongbaoloi("Vui lòng kiểm tra lại thông tin, có sự sai sót. (Đơn giá, số lượng phải là số và không có khoảng cách, Tên dịch vụ không được trống)")
                    return false;
                }
              DataService.postData('cmu_post', [
                 {
                    data: [
                        $scope.dvtt,
                        makh,
                        $scope.hoadonle.tenkh,
                        $scope.hoadonle.tendonvi,
                        $scope.hoadonle.masothue,
                        $scope.hoadonle.diachi,
                        $scope.hoadonle.sodienthoai,
                        $scope.hoadonle.dantoc,
                        $scope.hoadonle.gioitinh == 0? "Nũ": "Nam",
                        'HDBL/'+makh,
                        parseDateToString(t),
                        $scope.hoadonle.tendichvu,
                        $scope.hoadonle.thanhtien,
                        $scope.manv,
                        $scope.hoadonle.maquyenbienlai,
                        $scope.hoadonle.hinhthuctt,
                        'CMU_INSERT_HDBANLE'
                    ],
                    param: 'url'
                 }
             ]).then(function() {
                $scope.thongtinbn['load'] = {};
                $scope.thongtinthanhtoan.STT_LANTT =  'HDBL/'+makh;
                $scope.thongtinbn.SOVAOVIEN = '0';
                $scope.thongtinbn.SOPHIEUTHANHTOAN = '';
                $scope.thongtinbn.MA_BENH_NHAN = makh;
                $scope.thongtinbn.TEN_BENH_NHAN = $scope.hoadonle.tenkh;
                $scope.thongtinbn['load']['DIACHI'] = $scope.hoadonle.diachi;
                $scope.thongtinbn['load']['SOBAOHIEMYTE'] = '';
                $scope.thongtinthanhtoan.sotientt = Number($scope.hoadonle.thanhtien);
                $scope.thongtinbn.SOVAOVIEN_NOI = '0';
                $scope.thongtinbn.SOVAOVIEN_DT = '0';
                $scope.thongtinbn.NOITRU = -2;
                $scope.thongtinbn.COBHYT = 0;
                $scope.thongtinbn.LOAIVP = 'HDBL';
                $scope.thongtinbn.TEN_PHONGBAN = ''
                $scope.thongtinbn['load']['SOBAOHIEMYTE'] = ''
                $scope.chitietthanhtoan = [{
                        NGUOI_BENH: $scope.hoadonle.thanhtien,
                        THANH_TIEN: $scope.hoadonle.thanhtien
                }]
                $scope.thongtinbn.GIOI_TINH = $scope.hoadonle.gioitinh;
                $scope.thongtinbn['hinhthucthanhtoan'] = $scope.hoadonle.hinhthuctt;
                DataService.inserthoadon($scope).then(function() {
                    if (!inhd) {
                        thongbaoloi("Tạo hóa đơn thành công!");
                        setTimeout(function(){
                            $mdDialog.hide();
                        },1000)
                        $scope.hoadonle = {
                            maquyenbienlai: '',
                            sobienlai: '0000000',
                            gioitinh: " ",
                            dantoc: "  ",
                            chitietthanhtoan : [
                                {
                                    noidung: "",
                                    thanhtien: "",
                                    dvt: "",
                                    dongia: "",
                                    soluong: ""
                                }

                            ],
                            hinhthuctt:"TM",
                            tendichvu: "",
                            thanhtien: 0,
                            diachi: " "
                        }
                        $scope.showLoading = false;
                    } else {
                         DataService.layidhdt($scope).then(function(IDHDDT) {
                        var data = {
                            data: {
                                ID:IDHDDT,
                                noidung: $scope.hoadonle.tendichvu,
                                dantoc: $scope.hoadonle.dantoc
                            }
                        }
                        DataService.phathanhhoadon($scope, data).then(function(dt) {
                            if (dt == 1) {
                                thongbaoloi("Tài khoản đăng nhập sai hoặc không có quyền!");
                            } else if (dt == 3) {
                                thongbaoloi("Dữ liệu xml đầu vào không đúng quy định!");
                            } else if (dt == 5) {
                                thongbaoloi("Không phát hành được hóa đơn!");
                            } else if (dt == 6) {
                                thongbaoloi("Không đủ hóa đơn trong lô phát hành!");
                            } else if (dt == 7) {
                                thongbaoloi("User name không phù hợp, không tìm thấy company tương ứng cho user!");
                            } else if (dt == 10) {
                                thongbaoloi("Lô có số hóa đơn vượt quá max cho phép!");
                            } else if (dt == 20) {
                                thongbaoloi("Pattern hoặc serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng ký có sử dụng Pattern và serial!");
                            } else {
                                DataService.capnhatsobienlai($scope,$scope.thongtinthanhtoan.STT_LANTT,dt.split("SOBIENLAI")[1],data.data.KEY_HD);
                                DataService.thanhtoanhddt($scope,
                                            {data: {ID: IDHDDT,
                                                MA_BN: $scope.thongtinbn.MA_BENH_NHAN, 
                                                NGAYTHUVIENPHI: moment(t).format('DD/MM/YYYY') ,
                                                KEY_HD: data.data.KEY_HD
                                            }}).then(function() {
                                                DataService.chuyendoihoadon($scope,
                                                    {data: {
                                                        KEY_HD: $scope.thongtinthanhtoan.pattern + ';'+$scope.thongtinthanhtoan.serial+';'+pad(dt.split("SOBIENLAI")[1],7,'0')
                                                    }},$scope.tennhanvien);
                                                    $scope.hoadonle = {
                                                        maquyenbienlai: '',
                                                        sobienlai: '0000000',
                                                        gioitinh: " ",
                                                        dantoc: "  ",
                                                        chitietthanhtoan : [
                                                            {
                                                                noidung: "",
                                                                thanhtien: "",
                                                                dvt: "",
                                                                dongia: "",
                                                                soluong: ""
                                                            }

                                                        ],
                                                        hinhthuctt:"TM",
                                                        tendichvu: "",
                                                        thanhtien: 0,
                                                        diachi: " "
                                                    }

                                            });
    //                                        var url = "taihoadon_invoice?username=" + $scope.thongtinthanhtoan.username + "&password="
    //                                                + $scope.thongtinthanhtoan.password + "&key_hd=" + data.data.KEY_HD + "&url=" + $scope.thongtinthanhtoan.portalservice;
    //                                        $(location).attr('href', url);
                                            thongbaoloi("Phát hành hóa đơn thành công!");
                                            setTimeout(function(){
                                                $mdDialog.hide();
                                            },1000)
                                            $scope.showLoading = false;
                            }
                            })
                        })
                    }
                   
                    
                });   
             })  
            } else {
                thongbaoloi("Tên khách hàng và quyển biên lai không được trống");
            }
             
        }
        function loadchitietthanhtoan(item) {
            $scope.showLoading = true;
            $scope.chitietthanhtoan = [];
            if(item.LOAIVP == 'BHYT') {
                
                var url = "taobangke_truocin?makb=kb_" + item.ID_TIEPNHAN + "&dvtt="+$scope.dvtt+"&sophieu=" + item.SOPHIEUTHANHTOAN;
                $.ajax({
                        url: url
                    }).done(function (data) {
                        var arr_mang = [
                            $scope.dvtt
                            ,item.SOVAOVIEN,
                            '0'
                            ,$scope.trangthaibn,
                            item.ID_TIEPNHAN,
                            parseDateToString($scope.thongtinthanhtoan.ngaythu),
                            "kb_" + item.ID_TIEPNHAN,
                            item.LOAIVP
                            ,'CMU_CHITIET_TT'];
                        var ct = "cmu_getlist?url=" + c_convert_to_string(arr_mang);
                        DataService
                        .getData("/web_his/cmu_getlist",arr_mang).then(function(dt) {
                            $scope.chitietthanhtoan = dt;
                            $scope.thongtinthanhtoan.sotientt = sumData(dt,'NGUOI_BENH')
                            $scope.thongtinthanhtoan.tientamung = 0;
                             $scope.showLoading = false;
                        })
                        
                    });
            } else if (item.LOAIVP == 'THUPHI') {
                var arr_mang = [
                            $scope.dvtt
                            ,item.SOVAOVIEN,
                            '0'
                            ,$scope.trangthaibn,
                            item.ID_TIEPNHAN,
                            parseDateToString($scope.thongtinthanhtoan.ngaythu),
                            "kb_" + item.ID_TIEPNHAN,
                            item.LOAIVP
                            ,'CMU_CHITIET_TT'];
                        var ct = "cmu_getlist?url=" + c_convert_to_string(arr_mang);
                        DataService
                        .getData("/web_his/cmu_getlist",arr_mang).then(function(dt) {
                            $scope.chitietthanhtoan = dt;
                            $scope.thongtinthanhtoan.sotientt = sumData(dt,'NGUOI_BENH')
                            $scope.thongtinthanhtoan.tientamung = 0;
                            if($scope.listtamung.length > 0) {
                                $scope.thongtinthanhtoan.tientamung = sumData($scope.listtamung,'SOTIENTAMUNG')
                            }
                            $scope.showLoading = false;
                            DataService
                            .postData("/web_his/cmu_post",
                                        [   
                                            {
                                                data:[
                                                    $scope.dvtt,
                                                    item.SOVAOVIEN,
                                                    'CMU_LAYTT_TAMUNG_NGOAITRU'
                                                ],
                                                param: 'url'
                                            }
                                        ]
                                    )
                            .then(function(data){  
                                $scope.thongtinthanhtoan.trutamung = data;

                                if($scope.thongtinthanhtoan.hoantatkham < 3)     {
                                   $scope.thongtinthanhtoan.trutamung = 1; 
                                }
                                console.log("trutamung", $scope.thongtinthanhtoan.trutamung,$scope.thongtinthanhtoan.hoantatkham) 
                            });  
                        })
                        kiemtrabnhoantatkham();
                        
            } 
            else if (item.LOAIVP == 'NTDICHVU') {
                DataService
                        .getData("/web_his/cmu_getlist",[
                            $scope.dvtt
                            ,item.SOVAOVIEN,
                            item.STT_LANTT,
                            $scope.trangthaibn
                            ,'CMU_CHITIET_TT_DICHVU'])
                        .then(function(dt){  
                            $scope.chitietthanhtoan = dt;
                            $scope.thongtinthanhtoan.tientamung = 0;
                            $scope.thongtinthanhtoan.sotientt = sumData(dt,'NGUOI_BENH')
                            $scope.showLoading = false; 
                       
                        });
            }
            else{
                
                DataService
                    .postData("/web_his/noitru_taobangke",
                            [   
                                {
                                    data:[
                                        $scope.dvtt,item.STT_DOTDIEUTRI
                                        ,item.STT_BENHAN,
                                        item.SOPHIEUTHANHTOAN
                                        ,item.MA_BENH_NHAN
                                    ],
                                    param: 'url'
                                }
                            ])
                    .then(function(data){  
                        DataService
                        .getData("/web_his/cmu_getlist",[
                            $scope.dvtt
                            ,item.SOVAOVIEN,
                            item.SOVAOVIEN_DT
                            ,$scope.trangthaibn,
                            ' ',
                            parseDateToString($scope.thongtinthanhtoan.ngaythu),
                            " ",
                            item.LOAIVP
                            ,'CMU_CHITIET_TT'])
                        .then(function(dt){  
                            $scope.chitietthanhtoan = dt;
                            $scope.thongtinthanhtoan.sotientt = sumData(dt,'NGUOI_BENH')
                            $scope.showLoading = false;
                        });
                    });
                DataService
                        .postData("/web_his/cmu_post",
                                    [   
                                        {
                                            data:[
                                                $scope.dvtt,
                                                item.STT_BENHAN
                                                ,item.STT_DOTDIEUTRI
                                                ,item.SOVAOVIEN,
                                                item.SOVAOVIEN_DT,
                                                'CMU_LAYTT_TAMUNG'
                                            ],
                                            param: 'url'
                                        }
                                    ]
                                )
                        .then(function(data){  
                            $scope.thongtinthanhtoan.trutamung = data;
                        });    
                DataService
                    .postData("/web_his/noitru_tamung_tongtien_svv",
                            [   
                                {
                                    data:$scope.dvtt,
                                    param: 'dvtt'
                                },
                                {
                                    data:item.STT_DOTDIEUTRI,
                                    param: 'stt_dotdieutri'
                                },
                                {
                                    data:item.STT_BENHAN,
                                    param: 'stt_benhan'
                                },
                                {
                                    data:item.SOVAOVIEN,
                                    param: 'sovaovien'
                                },
                                {
                                    data:item.SOVAOVIEN_DT,
                                    param: 'sovaovien_dt'
                                }
                            ])
                    .then(function(data){  
                        console.log("tientamung",data);
                        $scope.thongtinthanhtoan.tientamung = data;
                    });   
            } 
        }
        
        function laydsquyenbienlai(){
            DataService
                    .postData("/web_his/quyenbienlai_lay_danhsach",
                                [   
                                    {
                                        data:$scope.dvtt,
                                        param: 'dvtt'
                                    },
                                    {
                                        data:0,
                                        param: 'all'
                                    }
                                ]
                            )
                    .then(function(data){
                        $scope.dsqbl = data;
                    })
        }
        
        $scope.showAdvanced = function(ev,hoadonthaythe) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $scope.thongtinthanhtoan.maquyenbienlai = '';
            $scope.thongtinthanhtoan.sobienlai = '';
            $scope.thongtinthanhtoan.key_hd = '';
            DataService
                    .postData("/web_his/quyenbienlai_lay_danhsach",
                                [   
                                    {
                                        data:$scope.dvtt,
                                        param: 'dvtt'
                                    },
                                    {
                                        data:0,
                                        param: 'all'
                                    }
                                ]
                            )
                    .then(function(data){
                        $scope.hoadonphathanh = [];
                         DataService
                            .getData("cmu_getlist",[
                                $scope.dvtt,$scope.thongtinbn.SOVAOVIEN, $scope.thongtinbn.LOAIVP,'CMU_TIMHD_HUY'
                            ]).then(function(hdph) {
                                $scope.hoadonphathanh = hdph;
                                if($scope.thongtinbn.LOAIVP == 'BHYT' || $scope.thongtinbn.LOAIVP == 'THUPHI') {
                                    kiemtrabnhoantatkham();
                                }
                                if(hdph.length == 0) {
                                     DataService
                                        .postData("cmu_post",
                                                    [   
                                                        {
                                                            data:[$scope.dvtt,$scope.loaivienphi,'CMU_QBL_MACDINH'],
                                                            param: 'url'
                                                        }
                                                    ]
                                                ).then(function(qbl) {
                                                    $scope.thongtinthanhtoan.maquyenbienlai = qbl;
                                                    
                                                    DataService.getPattern($scope.thongtinthanhtoan.dvtt,$scope.thongtinthanhtoan.maquyenbienlai).then(function(pattern) {
                                                        if (pattern.length > 0) {
                                                            $scope.thongtinthanhtoan.pattern = pattern[0].PATTERN;
                                                            $scope.thongtinthanhtoan.serial = pattern[0].SERIAL;
                                                            $scope.thongtinthanhtoan.serialbhyt = pattern[0].SERIALBHYT;
                                                            $scope.thongtinthanhtoan.vat = pattern[0].VAT;
                                                        }
                                                        
                                                    })
                                                })
                                        
                                }
                                $scope.thongtinthanhtoan.xemct = false;
                                $scope.dsqbl = data;
                                $mdDialog.show({
                                     multiple: true,
                                     skipHide: true,
                                    controller: DialogController,
                                    templateUrl: 'dialog.html',
                                    parent: angular.element(document.body),
                                    targetEvent: ev,
                                    clickOutsideToClose:true,
                                    locals: {
                                        thongtinbn: $scope.thongtinbn,
                                        thongtinthanhtoan: $scope.thongtinthanhtoan,
                                        chitietthanhtoan: $scope.chitietthanhtoan,
                                        dsqbl: $scope.dsqbl,
                                        hoadonphathanh: $scope.hoadonphathanh,
                                        laphoadonthaythe: hoadonthaythe,
                                        dsyeucauhuyhd: $scope.dsyeucauhuyhd,
                                        loaivienphi: $scope.loaivienphi
                                    },
                                    fullscreen: useFullScreen
                                  }).then(function(answer) {

                                      }, function() {

                                      });
                                      $scope.$watch(function() {
                                        return $mdMedia('xs') || $mdMedia('sm');
                                      }, function(wantsFullScreen) {
                                        $scope.customFullscreen = (wantsFullScreen === true);
                                      });
                        })
                    }); 
            
        };
        $scope.$on("selectitem.listbn", function(event,item) {
            $scope.thongtinbn = item;
            $scope.selectedbn = true;
            console.log('$scope.thongtinbn', $scope.thongtinbn)
            loadthongtinbn(item)
        });
        $scope.lanttselected = {};
        $scope.$on('selectitem.listlanthanhtoan',function(event,item) {
            $scope.lanttselected = item;
        })
        
        function loadctlantt(data) {
            console.log("data", data);
            $scope.thongtinthanhtoan.xemct = true;
            $scope.thongtinthanhtoan.kyhieubienlai = '';
            $scope.thongtinthanhtoan.sobienlai = '';
            $scope.thongtinthanhtoan['ngaybntt'] = data.data.NGAYTHUVIENPHI;
            $scope.thongtinthanhtoan.sotientt = data.data.THANHTHIEN_CHITRA;
            $scope.thongtinthanhtoan.sotienbntra = data.data.THANHTHIEN_CHITRA;
            $scope.thongtinthanhtoan.tienmiengiam = 0;
            $scope.thongtinthanhtoan.sotienthoilai = 0;
            $scope.thongtinbn.MA_BENH_NHAN = data.data.MA_BN;    
            $scope.thongtinbn.SOPHIEUTHANHTOAN = data.data.MA_LK;
            $scope.thongtinbn.TEN_BENH_NHAN = data.data.HO_TEN;
            if ($scope.thongtinbn['load'] == undefined ){
                $scope.thongtinbn['load'] = {};
            }
            $scope.thongtinbn['load']['SOBAOHIEMYTE'] = data.data.MA_THE;
            $scope.thongtinbn['load']['TYLEBAOHIEM'] = data.data.TYLE_BHYT;
            $scope.thongtinbn.NGAY_BATDAU = data.data.GT_THE_TU;
            $scope.thongtinbn.NGAY_HETHAN = data.data.GT_THE_DEN;
            $scope.thongtinbn['load']['DIACHI'] = data.data.DIACHI;
            $scope.thongtinbn.LOAIVP = data.data.NOITRU == 1? 'NOITRU': 'BHYT';
            if (data.data.MA_LAN_TT.indexOf("STT/") > -1) {
                $scope.thongtinbn.LOAIVP = 'NTDICHVU'
                return DataService
                        .getData("/web_his/cmu_getlist",[
                            $scope.dvtt
                            ,data.data.SOVAOVIEN == 0?data.data.SOVAOVIEN_NOI: data.data.SOVAOVIEN,
                            data.data.MA_LAN_TT,
                            1
                            ,'CMU_CHITIET_TT_DICHVU'])
                        ;
            }
            if (data.data.MA_LAN_TT.indexOf("HDBL/") > -1) {
                $scope.thongtinbn.LOAIVP = 'HDBL'
                return DataService
                        .getData("/web_his/cmu_getlist",[
                            $scope.dvtt,
                            data.data.MA_LAN_TT
                            ,'CMU_CHITIET_TT_HDBL'])
                        ;
            }
            
            return DataService
                .getData("/web_his/cmu_getlist",[
                        data.data.MA_LAN_TT.replace(/_([^_]*)$/,''),
                        $scope.dvtt,
                        data.data.MA_LAN_TT,
                        data.data.SOVAOVIEN == 0?data.data.SOVAOVIEN_NOI: data.data.SOVAOVIEN,
                        data.data.STT_BENHAN == undefined? "":data.data.STT_BENHAN,
                        data.data.STT_DOTDIEUTRI == undefined? "": data.data.STT_DOTDIEUTRI,
                        data.data.SOVAOVIEN_DT,
                        data.data.NOITRU == 1? 'NOITRU': 'BHYT',
                        'CMU_CHITIET_LANTT'])
                    
        }
        
        function laydstamungngoaitru(item) {
            DataService
                    .getData("/web_his/cmu_getlist",
                                [   
                                    item.SOVAOVIEN,
                                    item.ID_TIEPNHAN,
                                    $scope.dvtt,
                                    'CMU_DSTU_NGOAITRU'
                                ]
                            )
                    .then(function(data){
                        $scope.listtamung = data;
                    })
        }
        
        function loadthongtinbn(item) {
            $scope.listtamung = [];
            var arraynoitru = ['NOITRU','BANT','NTDICHVU'];
            $scope.trangthaihuyhoadon = false;
            DataService
                        .getData("/web_his/cmu_getlist",[
                            $scope.dvtt
                            ,item.SOVAOVIEN
                            ,'CMU_KIEMTRAHDTHAYTHE'])
                        .then(function(dt){  
                            $scope.dsyeucauhuyhd = dt;
                            if(dt.length > 0) {
                               $scope.trangthaihuyhoadon = true
                            }    
                            
                        });
            DataService
                    .getData("/web_his/cmu_getlist",[
                            $scope.dvtt
                            ,arraynoitru.indexOf(item.LOAIVP) > -1 ? item.STT_BENHAN: '',
                            arraynoitru.indexOf(item.LOAIVP) > -1 ? item.STT_DOTDIEUTRI: ''
                            ,item.MA_BENH_NHAN ,'1',
                            arraynoitru.indexOf(item.LOAIVP) > -1 ? '':item.ID_TIEPNHAN
                            ,item.SOVAOVIEN,item.LOAIVP
                            ,'CMU_THONGTIN_BN'])
                    .then(function(data){  
                        $scope.thongtinbn['load'] = data[0];
                        if (item.LOAIVP == 'BHYT' || item.LOAIVP == 'THUPHI') {
                            laydstamungngoaitru(item);
                            $scope.thongtinbn['TEN_PHONGBAN'] = gettenphongban(item.MA_KHOA_TT);
                            $scope.thongtinbn['HINHTHUCRAVIEN'] = trangthaibn(item.LOAIVP,item.TRANG_THAI)
                        } else {
                            laydstamung(item);
                            $scope.thongtinbn['HINHTHUCRAVIEN'] = trangthaibn(item.LOAIVP,item.HINHTHUCKETTHUC == undefined?data[0].HINHTHUCKETTHUC:item.HINHTHUCKETTHUC)
                        }
                        var sovaoviendt = item.SOVAOVIEN_DT != undefined? item.SOVAOVIEN_DT: '0'
                        if(item.LOAIVP == 'NTDICHVU') {
                            sovaoviendt = item.STT_LANTT
                        }
                        DataService
                        .getData("/web_his/cmu_getlist",[
                            $scope.dvtt
                            ,item.STT_BENHAN != undefined? item.STT_BENHAN: '0',
                            item.STT_DOTDIEUTRI != undefined? item.STT_DOTDIEUTRI: '0'
                            ,item.SOVAOVIEN,
                            sovaoviendt,
                            $scope.trangthaibn,
                            item.LOAIVP
                            ,'CMU_DS_TT'])
                        .then(function(dt){  
                            $scope.listthanhtoan = dt;
                            
                        });
                        loadchitietthanhtoan(item);
            });
        }
        $scope.$watch('chitietthanhtoan', function () {
            showtt_thanhtoan();
        }, true);
        $scope.$watch('thongtinthanhtoan.tmiengiam', function () {
            showtt_thanhtoan();
            $rootScope.$broadcast('thumiengiam', { data: $scope.thongtinthanhtoan.tmiengiam });
            if($scope.thongtinthanhtoan.tmiengiam == true) {
                $scope.chitietthanhtoan.map(function(_obj) {
                    _obj.selected = true;
                    return _obj;
                })
            }
        }, true);
        function showtt_thanhtoan() {
            $scope.thongtinthanhtoan.sotientt = sumData($scope.chitietthanhtoan,'NGUOI_BENH','selected')
            if ($scope.thongtinthanhtoan.trutamung == 0) {
                $scope.thongtinthanhtoan.sotienbntra = $scope.thongtinthanhtoan.sotientt - $scope.thongtinthanhtoan.tientamung
            } else {
                $scope.thongtinthanhtoan.sotienbntra = $scope.thongtinthanhtoan.sotientt
            }
            if ($scope.thongtinthanhtoan.sotienbntra < 0) {
                $scope.thongtinthanhtoan.sotienthoilai = -1*$scope.thongtinthanhtoan.sotienbntra 
                $scope.thongtinthanhtoan.sotienbntra  = 0
            } else {
                $scope.thongtinthanhtoan.sotienthoilai = 0
            }
            $scope.thongtinthanhtoan.tienmiengiam = 0
        }
        
        $scope.chonbienlaihoadon = function() {
            $scope.showLoading = true;
            DataService.getPattern($scope.thongtinthanhtoan.dvtt,$scope.hoadonle.maquyenbienlai).then(function(pattern) {
                            console.log("$scope.hoadonle.maquyenbienlai",$scope.hoadonle.maquyenbienlai)
                             $scope.thongtinthanhtoan.pattern = pattern[0].PATTERN;
                             $scope.thongtinthanhtoan.serial = pattern[0].SERIAL;
                             $scope.thongtinthanhtoan.serialbhyt = pattern[0].SERIALBHYT;
                             $scope.thongtinthanhtoan.vat = pattern[0].VAT;
                             $scope.showLoading = false;
                        })
        }
        
        
        function xoahoadon(data) {
            DataService.huythanhtoanhddt($scope,data).then(function(res) {
                if (res == '0') {
                     DataService.huyphathanhhoad($scope,data).then(function(dt) {
                        if (dt == '0') {
                            thongbaoloi("Hủy thành công!", data.event);
                        } else if (dt == 1) {
                            thongbaoloi("Tài khoản đăng nhập sai hoặc không có quyền!", data.event);
                        } else if (dt == 2) {
                            thongbaoloi("Không tồn tại hóa đơn cần hủy!", data.event);
                        } else if (dt == 8) {
                            thongbaoloi("Hóa đơn đã được thay thế rồi, hủy rồi!", data.event);
                        } else if (dt == 9) {
                            thongbaoloi("Trạng thái hóa đơn không được hủy!", data.event);
                        }
                        $scope.showLoading = false;
                    })
                } else if (res == 1) {
                    $scope.showLoading = false;
                    thongbaoloi("Tài khoản đăng nhập sai hoặc không có quyền!", data.event);
                } else if (res == 6) {
                    $scope.showLoading = false;
                    thongbaoloi("Không tìm thấy hóa đơn tương ứng!", data.event);
                } else if (res == 7) {
                    $scope.showLoading = false;
                    thongbaoloi("Không gạch nợ được!", data.event);
                } else if (res == 13) {
                    $scope.showLoading = false;
                    thongbaoloi("Hóa đơn đã được gạch nợ!", data.event);
                }
           })
        }
        

        $scope.simulateQuery = false;
        $scope.isDisabled    = false;

        $scope.repos         = [];
        $scope.querySearch   = querySearch;
        $scope.selectedItemChange = selectedItemChange;
        $scope.searchTextChange   = searchTextChange;

        // ******************************
        // Internal methods
        // ******************************

        /**
         * Search for repos... use $timeout to simulate
         * remote dataservice call.
         */
        function querySearch (query) {
          var results = query ? $scope.repos.filter( createFilterFor(query) ) : $scope.repos,
              deferred;
          if ($scope.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
            return deferred.promise;
          } else {
            return results;
          }
        }

        function searchTextChange(text,$index) {
            $scope.hoadonle.chitietthanhtoan[$index].noidung = text;
        }

        function selectedItemChange(item,$index) {
            if(item != undefined) {
                $scope.hoadonle.chitietthanhtoan[$index].thanhtien = item.THANHTIEN;
                $scope.hoadonle.chitietthanhtoan[$index].dongia = item.THANHTIEN;
                $scope.hoadonle.chitietthanhtoan[$index].noidung = item.TENDICHVU;
                $scope.hoadonle.chitietthanhtoan[$index].soluong = 1;
                $scope.hoadonle.chitietthanhtoan[$index].dvt = 'Lần';
            }

        }

        /**
         * Build `components` list of key/value pairs
         */
        function loadAll() {
            DataService
                .getData("/web_his/cmu_getlist",[$scope.dvtt,'CMU_LAYDMHANGHOA'])
                .then(function(data){   
                    $scope.repos = data.map( function (repo) {
                        repo.value = repo.TENDICHVU.toLowerCase();
                        return repo;
                    });
            });
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);

          return function filterFn(item) {
            return (item.value.indexOf(lowercaseQuery) === 0);
          };

        }
        
        $scope.hoanungbenhnhan = function($event) {
            $.get("hgi_chitiethoanungnoitru?dvtt="+$scope.thongtinthanhtoan.dvtt
                    +"&stt_dotdieutri=" + $scope.thongtinbn.STT_DOTDIEUTRI + 
                    "&stt_benhan=" + $scope.thongtinbn.STT_BENHAN+ "&mabenhnhan=" + $scope.thongtinbn.MA_BENH_NHAN, 
                function(data){
                    console.log("data",data);
                    $mdDialog.show({
                    multiple: true,
                    skipHide: true,
                    controller: HoanungbenhnhanController,
                    templateUrl: 'dialog_hoanung.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    locals: {
                        thongtinbn: $scope.thongtinbn,
                        lanthanhtoan: data,
                        dvtt: $scope.thongtinthanhtoan.dvtt,
                        manv: $scope.thongtinthanhtoan.manv
                    },
                    fullscreen: true
                    }).then(function(answer) {
                    }, function() {
                    });
                })
            
        }
        $scope.addnewrow = function($event,$index) {
            if($event.keyCode === 13) {
                $scope.hoadonle.chitietthanhtoan.push(
                        {
                            noidung: "",
                            thanhtien: "",
                            dvt: "Lần",
                            dongia: "",
                            soluong: ""
                        }
                );
            }
            if ($event.keyCode == 46 && $scope.hoadonle.chitietthanhtoan.length > 2) {
                $scope.hoadonle.chitietthanhtoan.splice($index,1);
            }
        }
        $scope.thaydoigiatri = function($index) {
            $scope.hoadonle.chitietthanhtoan[$index].thanhtien = Number($scope.hoadonle.chitietthanhtoan[$index].soluong)*Number($scope.hoadonle.chitietthanhtoan[$index].dongia)
            if(isNaN($scope.hoadonle.chitietthanhtoan[$index].thanhtien)) {
                thongbaoloi("Bạn đã nhập sai thông tin sản phẩm, vui lòng nhập lại. (Đơn giá, số lượng phải là số và không có khoảng cách)")
            }
        }
    });

function DialogController($scope,$rootScope, $mdDialog, DataService, thongtinbn,thongtinthanhtoan,
        chitietthanhtoan,dsqbl, hoadonphathanh,laphoadonthaythe,
        dsyeucauhuyhd,loaivienphi) {
    $scope.thongtinbn = thongtinbn;
    $scope.loaivienphi = loaivienphi;
    $scope.thongtinthanhtoan = thongtinthanhtoan;
    $scope.chitietthanhtoan = chitietthanhtoan;
    $scope.hoadonphathanh = hoadonphathanh;
    $scope.dsyeucauhuyhd = dsyeucauhuyhd;
    $scope.laphoadonthaythe = laphoadonthaythe;
    $scope.sophieuthu = [];
    $scope.dsphieuthanhtoan = [];
    $scope.dsbienlaimacdinh = [];
    $scope.dsqbl = dsqbl;
    var dichvumacdinh = [];
    $scope.thongtinhoadonsai = {};
    if(laphoadonthaythe == true) {
        $scope.hdsaicanthaythe =  $scope.dsyeucauhuyhd[0].STT_LANTT
        console.log("abc d",$scope.dsyeucauhuyhd[0]);
        DataService.getData("/web_his/cmu_getlist",[
            $scope.thongtinthanhtoan.dvtt
            ,$scope.dsyeucauhuyhd[0].MABENHNHAN,
            $scope.dsyeucauhuyhd[0].STT_LANTT
            ,'CMU_GETHDDTTHAYTHE'])
        .then(function(dt){  
           $scope.thongtinhoadonsai = dt[0]    
        });
    }
    
    $scope.chonsophieuthu = function() {
        if(($scope.thongtinbn.LOAIVP == 'NOITRU' || $scope.thongtinbn.LOAIVP == 'NTDICHVU') && $scope.dsphieuthanhtoan.length > 0) {
            $scope.chitietthanhtoan.forEach(function(_obj,index) {
                if($scope.sophieuthu.indexOf(_obj.SOPHIEUTHANHTOAN) > -1) {
                        $scope.chitietthanhtoan[index].selected = true;
                    }

            })       
        }
        kiemtradvmacdinh();
        kiemtraphieu();
    }
    if($scope.thongtinbn.LOAIVP == 'NOITRU' || $scope.thongtinbn.LOAIVP == 'NTDICHVU') {
        $scope.chitietthanhtoan.forEach(function(_obj) {
            if(!!_obj.SOPHIEUTHANHTOAN && $scope.dsphieuthanhtoan.indexOf(_obj.SOPHIEUTHANHTOAN) == -1) {
                $scope.dsphieuthanhtoan.push(_obj.SOPHIEUTHANHTOAN)
            }
        })
    }
    function kiemtradvmacdinh() {
        var flag = false;
        $scope.dsbienlaimacdinh.forEach(function(macdinh) {
            if(macdinh.MAQUYENBIENLAI == $scope.thongtinthanhtoan.maquyenbienlai) {
                flag = true;
                $scope.chitietthanhtoan.forEach(function(_obj,index) {
                    var split = _obj.SOPHIEU_MADV.split('--')

                    if((_obj.SOPHIEU_MADV.toLowerCase().indexOf(macdinh.LOAIDV.toLowerCase()) > -1 && split.length > 1 &&
                            split[1] == macdinh.MADICHVU) || ((macdinh.LOAIDV == 'GB' ||macdinh.LOAIDV == 'STT') && _obj.SOPHIEU_MADV.toLowerCase().indexOf(macdinh.LOAIDV.toLowerCase()) > -1)
                       ) {
                        $scope.chitietthanhtoan[index].selected = true;  

                    }
                })
            }

        })
        if(!flag && $scope.dsbienlaimacdinh.length > 0) {
            $scope.chitietthanhtoan.forEach(function(_obj,index) {
                $scope.chitietthanhtoan[index].selected = true;
            })
           $scope.dsbienlaimacdinh.forEach(function(macdinh) {
                $scope.chitietthanhtoan.forEach(function(_obj,index) {
                    var split = _obj.SOPHIEU_MADV.split('--')
                    if((_obj.SOPHIEU_MADV.toLowerCase().indexOf(macdinh.LOAIDV.toLowerCase()) > -1 && split.length > 1 &&
                            split[1] == macdinh.MADICHVU) || ((macdinh.LOAIDV == 'GB' ||macdinh.LOAIDV == 'STT') && _obj.SOPHIEU_MADV.toLowerCase().indexOf(macdinh.LOAIDV.toLowerCase()) > -1)
                       ) {
                        $scope.chitietthanhtoan[index].selected = false;  
                    }
                })
            }) 
        }
    }
    function kiemtraphieu() {
        
        if(($scope.thongtinbn.LOAIVP == 'NOITRU' || $scope.thongtinbn.LOAIVP == 'NTDICHVU') && $scope.dsphieuthanhtoan.length > 0) {
           
            $scope.chitietthanhtoan.forEach(function(_obj,index) {
                if(_obj.selected == true) {
                    if($scope.sophieuthu.indexOf(_obj.SOPHIEUTHANHTOAN) == -1) {
                        $scope.chitietthanhtoan[index].selected = false;
                    }
                }

            })       
        }
    }
    $scope.stopkeydown = function(ev) {
        ev.stopPropagation();
        ev.stopImmediatePropagation();
    }  
    
    if($scope.thongtinthanhtoan.hoantatkham < 3 && $scope.thongtinbn.LOAIVP == 'THUPHI')     {
        $scope.thongtinthanhtoan.trutamung = 1; 
   }
    $scope.listctConfig = [
            {
                name: "STT",
                flex: 5,
                field: "DVTT",
                display: !$scope.thongtinthanhtoan.xemct,
                filter: false,
                checkbox: true
            },
            {
                name: "Nội dung",
                flex: 30 + ($scope.thongtinthanhtoan.xemct? 15:0),
                field: "NOIDUNG",
                display: true,
                filter: false
            },
            {
                name: "SL",
                flex: 10,
                field: "SO_LUONG",
                display: true,
                filter: false
            },
            {
                name: "Đơn giá",
                flex: 15,
                field: "DON_GIA",
                display: true,
                filter: false
            },
            {
                name: "Thành tiền",
                flex: 15,
                field: "THANH_TIEN",
                display: true,
                filter: false
            },
            {
                name: "Thanh toán",
                flex: 15,
                field: "NGUOI_BENH",
                display: true,
                filter: false
            },
            {
                name: "Loại",
                flex: 10,
                field: "NGOAI_DANH_MUC",
                display:  !$scope.thongtinthanhtoan.xemct,
                filter: false,
                convert: true
            }
    ];
    
    $scope.fctthanhtoan =  [
            {
                flex: 60 + ($scope.thongtinthanhtoan.xemct? 10:0),
                type: "",
                text: " "
                
            },
            {
                flex: 15,
                type: "SUM",
                text: "",
                fieldSUM: 'THANH_TIEN',
                option: 'selected',
                minus: 0
            },
            {
                flex: 15,
                type: "SUM",
                text: " ",
                fieldSUM: 'NGUOI_BENH',
                option: 'selected',
                minus: 0
                
            },
            {
                flex: (!$scope.thongtinthanhtoan.xemct? 10:0),
                type: "",
                text: " ",
                
               
            }
        ];
    function getDVMACDINH() {
        if ($scope.thongtinthanhtoan.maquyenbienlai != "") {
            $scope.dsbienlaimacdinh = [];
            $rootScope.$broadcast('SHOWLOADING');
            DataService
            .getData("/web_his/cmu_getlist",[
                $scope.thongtinthanhtoan.dvtt,
                $scope.thongtinthanhtoan.maquyenbienlai
                ,'CMU_GETDVMACDINH']).then(function(_dvmacdinh) {
                    if(_dvmacdinh.length > 0) {
                        $scope.dsbienlaimacdinh = _dvmacdinh;
                        $scope.chitietthanhtoan.forEach(function(_obj) {
                            _obj.selected = false;  
                        })
                        kiemtradvmacdinh();
                        kiemtraphieu();
                        console.log("$scope.chitietthanhtoan",$scope.chitietthanhtoan)
                        

                    }
                    $rootScope.$broadcast('HIDELOADING');
                }) 
        }  
         
    }    
    getDVMACDINH();
    $scope.changestbntra = function() {
        $scope.thongtinthanhtoan.tienmiengiam = $scope.thongtinthanhtoan.sotientt - $scope.thongtinthanhtoan.sotienbntra        
    }
    $scope.selectChanged = function() { 
        DataService.getPattern($scope.thongtinthanhtoan.dvtt,$scope.thongtinthanhtoan.maquyenbienlai).then(function(pattern) {
                         $scope.thongtinthanhtoan.pattern = pattern[0].PATTERN;
                         $scope.thongtinthanhtoan.serial = pattern[0].SERIAL;
                         $scope.thongtinthanhtoan.serialbhyt = pattern[0].SERIALBHYT;
                         $scope.thongtinthanhtoan.vat = pattern[0].VAT;
                        getDVMACDINH();
                    })
    }
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    function thanhtoanall() {
        var t = 1;
        $scope.chitietthanhtoan.forEach(function(_obj) {
            if(_obj.selected != true) t = 0;
        })
        if($scope.loaivienphi == 'NOITRUTAMUNG') {
            return 0;
        }
        return t;
    }
    $scope.laphoadontt = function(ev) {
        if(laysophieu().length == 0) return false;  
        var confirm = $mdDialog.confirm({multiple:true,skipHide: true})
          .title('Thông báo')
          .textContent('Bạn có chắc thay thế hóa đơn này ?')
          .ariaLabel('Lucky day')
          .ok('Đồng ý')
          .cancel('Hủy');
        if ($scope.thongtinthanhtoan.maquyenbienlai == '') {
            thongbaoloi('Bạn chưa chọn quyển lai.')
            } else {
                $rootScope.$broadcast('SHOWLOADING');
                $mdDialog.hide();
                DataService.thanhtoan($scope,laysophieu().join("!!!"),$scope.thongtinhoadonsai,callbackafterthaythehoadon)
        }     
    } 
    $scope.thanhtoan = function(ev,inhd) {
        kiemtraphieu();    
        if(laysophieu().length == 0) return false;  
        
        var confirm = $mdDialog.confirm({multiple:true,skipHide: true})
          .title('Thông báo')
          .textContent('Bạn có chắc phát hành hóa đơn này?')
          .ariaLabel('Lucky day')
          .ok('Đồng ý')
          .cancel('Hủy');
        if (($scope.thongtinthanhtoan.maquyenbienlai == '' && $scope.hoadonphathanh.length == 0) 
              || ($scope.hoadonphathanh.length > 0 && $scope.thongtinthanhtoan.key_hd == '')) {
            thongbaoloi('Bạn chưa chọn quyển lai.')
            } else {
                if(inhd) {
                    $mdDialog.show(confirm).then(function() {
                        $rootScope.$broadcast('SHOWLOADING');
                        $mdDialog.hide();

                        DataService.thanhtoan($scope,laysophieu().join("!!!"),inhd,callbackafterthanhtoan)
                    }, function() {

                    });
                } else {
                    $rootScope.$broadcast('SHOWLOADING');
                    $mdDialog.hide();

                    DataService.thanhtoan($scope,laysophieu().join("!!!"),inhd,callbackafterthanhtoan)
                }
            }  
    };
    
    function callbackafterthaythehoadon(thongtinhoadonsai,stt_lantt,error) {
        if(error != undefined) {
            thongbaoloi(error.message)
            return false;
        }
        $scope.thongtinthanhtoan['STT_LANTT'] = stt_lantt
        DataService.postData('cmu_post',[ {
                param: 'url',
                data: [
                    $scope.thongtinthanhtoan.dvtt,
                    stt_lantt,
                    $scope.thongtinbn.SOVAOVIEN,
                    $scope.thongtinthanhtoan.nguoimiengiam,
                    $scope.thongtinbn.LOAIVP,
                    'CMU_UPDATENGUOIMIENGIAM'
                ]
            }
        ])
        console.log("thongtinhoadonsai",thongtinhoadonsai);
        DataService.inserthoadon($scope).done(function() {
            DataService.layidhdt($scope).then(function(IDHDDT) {
                var data = {data: {ID: IDHDDT}}
                $scope.chitietthanhtoan = $scope.chitietthanhtoan.filter(function(_obj) {
                    return _obj.selected == true;
                })
                if ( $scope.thongtinthanhtoan.pattern != $scope.dsyeucauhuyhd[0].MAUSO || $scope.thongtinthanhtoan.serial != $scope.dsyeucauhuyhd[0].KYHIEU
                        ) {
                    DataService.huythanhtoanhddt($scope, {data:thongtinhoadonsai}).done(function(datahuy) {
                        DataService.huyphathanhhoad($scope, {data:thongtinhoadonsai}).done(function() {
                            DataService.phathanhhoadon($scope,data).done(function (dt) {
                            if(dt.indexOf("SOBIENLAI") == -1)  {
                                $rootScope.$broadcast('HIDELOADING');
                            }
                            if (dt == 1) {
                                thongbaoloi("Tài khoản đăng nhập sai hoặc không có quyền!");
                            } else if (dt == 3) {
                                thongbaoloi("Dữ liệu xml đầu vào không đúng quy định!");
                            } else if (dt == 5) {
                                thongbaoloi("Không phát hành được hóa đơn!");
                            } else if (dt == 6) {
                                thongbaoloi("Không đủ hóa đơn trong lô phát hành!");
                            } else if (dt == 7) {
                                thongbaoloi("User name không phù hợp, không tìm thấy company tương ứng cho user!");
                            } else if (dt == 10) {
                                thongbaoloi("Lô có số hóa đơn vượt quá max cho phép!");
                            } else if (dt == 20) {
                                thongbaoloi("Pattern hoặc serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng ký có sử dụng Pattern và serial!");
                            } else {
                                DataService.capnhatsobienlai($scope,stt_lantt,dt.split("SOBIENLAI")[1],data.data.KEY_HD);
                                DataService.thanhtoanhddt($scope,
                                        {data: {ID: IDHDDT,
                                            MA_BN: $scope.thongtinbn.MA_BENH_NHAN, 
                                            NGAYTHUVIENPHI: moment($scope.thongtinthanhtoan.ngaythu).format('DD/MM/YYYY') ,
                                            KEY_HD: data.data.KEY_HD
                                        }}).then(function() {
                                            DataService.chuyendoihoadon($scope,
                                                {data: {
                                                    KEY_HD: $scope.thongtinthanhtoan.pattern + ';'+$scope.thongtinthanhtoan.serial+';'+pad(dt.split("SOBIENLAI")[1],7,'0')
                                                }},$scope.thongtinthanhtoan.tennhanvien);
                                            
                                        });
                                        DataService.postData('cmu_post',[ {
                                                param: 'url',
                                                data: [
                                                    $scope.thongtinthanhtoan.dvtt,
                                                    thongtinhoadonsai.KEY_HD,
                                                    data.data.KEY_HD,
                                                    $scope.dsyeucauhuyhd[0].MAUSO,
                                                    $scope.thongtinthanhtoan.pattern,
                                                    $scope.dsyeucauhuyhd[0].KYHIEU,
                                                    $scope.thongtinthanhtoan.serial,
                                                    'CMU_UPDATEHOADONSAI'
                                                ]
                                            }
                                        ]);
                                        $rootScope.$broadcast('HIDELOADING');
                                        thongbaoloi("Phát hành hóa đơn thành công!");
                                        setTimeout(function(){
                                            $mdDialog.hide();
                                        },1000)
                                        
                                
                                }
                                $rootScope.$broadcast('LOADDSBNSAUTT');
                            }); 
                        })
                        
                    })
                } else {
                    DataService.laphoadonthaythe($scope,data,thongtinhoadonsai.KEY_HD).done(function (dt) {
                        if(dt.indexOf("SOBIENLAI") == -1)  {
                            $rootScope.$broadcast('HIDELOADING');
                        }
                        if (dt == 1) {
                            thongbaoloi("Tài khoản đăng nhập sai hoặc không có quyền!");
                        } else if (dt == 3) {
                            thongbaoloi("Dữ liệu xml đầu vào không đúng quy định!");
                        } else if (dt == 5) {
                            thongbaoloi("Có lỗi trong quá trình thay thế hóa đơn");
                        } else if (dt == 6) {
                            thongbaoloi("Dải hóa đơn cũ đã hết");
                        } else if (dt == 7) {
                            thongbaoloi("User name không phù hợp, không tìm thấy company tương ứng cho user!");
                        } else if (dt == 8) {
                            thongbaoloi("Hóa đơn đã được thay thế rồi. Không thể thay thế nữa");    
                        } else if (dt == 9) {
                            thongbaoloi("Trạng thái hóa đơn không được thay thế");
                        } else if (dt == 20) {
                            thongbaoloi("Pattern hoặc serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng ký có sử dụng Pattern và serial!");
                        } else {
                            DataService.capnhatsobienlai($scope,stt_lantt,dt.split("SOBIENLAI")[1],data.data.KEY_HD);
                            console.log("$scope.dsyeucauhuyhd",$scope.dsyeucauhuyhd);
                            DataService.postData('cmu_post',[ {
                                                param: 'url',
                                                data: [
                                                    $scope.thongtinthanhtoan.dvtt,
                                                    thongtinhoadonsai.KEY_HD,
                                                    data.data.KEY_HD,
                                                    $scope.dsyeucauhuyhd[0].MAUSO,
                                                    $scope.thongtinthanhtoan.pattern,
                                                    $scope.dsyeucauhuyhd[0].KYHIEU,
                                                    $scope.thongtinthanhtoan.serial,
                                                    'CMU_UPDATEHOADONSAI'
                                                ]
                                            }
                                        ])
                            DataService.chuyendoihoadon($scope,
                                            {data: {
                                                KEY_HD: $scope.thongtinthanhtoan.pattern + ';'+$scope.thongtinthanhtoan.serial+';'+pad(dt.split("SOBIENLAI")[1],7,'0')
                                            }},$scope.thongtinthanhtoan.tennhanvien);
                            $rootScope.$broadcast('HIDELOADING');
                                    thongbaoloi("Lập hóa đơn thay thế thành công!");
                                    setTimeout(function(){
                                        $mdDialog.hide();
                                    },1000)  
                        }
                        $rootScope.$broadcast('LOADDSBNSAUTT');
                    });  
                }
                  
            })
                
            })
    }
    
    function callbackafterthanhtoan(inhd,stt_lantt,error) {
        
        if(error != undefined) {
            thongbaoloi(error.message)
            return false;
        }
        $scope.thongtinthanhtoan['STT_LANTT'] = stt_lantt
        DataService.postData('cmu_post',[ {
                param: 'url',
                data: [
                    $scope.thongtinthanhtoan.dvtt,
                    stt_lantt,
                    $scope.thongtinbn.SOVAOVIEN,
                    $scope.thongtinthanhtoan.nguoimiengiam,
                    $scope.thongtinbn.LOAIVP,
                    'CMU_UPDATENGUOIMIENGIAM'
                ]
            }
        ])
        if ($scope.hoadonphathanh.length > 0) {
            
            DataService.capnhathoadonphathanh($scope).then(function() {
                DataService.capnhatsobienlai($scope,stt_lantt,$scope.thongtinthanhtoan.sobienlai,$scope.thongtinthanhtoan.key_hd);
                $rootScope.$broadcast('LOADDSBNSAUTT');
                $rootScope.$broadcast('HIDELOADING');
            });
        }
        var sotienthanhtoan = $scope.thongtinthanhtoan.sotientt;
        if($scope.hoadonphathanh.length == 0) {
            if($scope.thongtinthanhtoan.sotienthoilai > 0) {
                DataService.inphieuhoanung($scope,stt_lantt);
            }
            
            DataService.inserthoadon($scope).done(function() {
                if (inhd) {
                    
                    DataService.layidhdt($scope).then(function(IDHDDT) {
                        var data = {data: {ID: IDHDDT}}
                        $scope.chitietthanhtoan = $scope.chitietthanhtoan.filter(function(_obj) {
                            return _obj.selected == true;
                        })
                        
                        DataService.phathanhhoadon($scope,data).done(function (dt) {
                            if(dt.indexOf("SOBIENLAI") == -1)  {
                                $rootScope.$broadcast('HIDELOADING');
                            }
                            if (dt == 1) {
                                thongbaoloi("Tài khoản đăng nhập sai hoặc không có quyền!");
                            } else if (dt == 3) {
                                thongbaoloi("Dữ liệu xml đầu vào không đúng quy định!");
                            } else if (dt == 5) {
                                thongbaoloi("Không phát hành được hóa đơn!");
                            } else if (dt == 6) {
                                thongbaoloi("Không đủ hóa đơn trong lô phát hành!");
                            } else if (dt == 7) {
                                thongbaoloi("User name không phù hợp, không tìm thấy company tương ứng cho user!");
                            } else if (dt == 10) {
                                thongbaoloi("Lô có số hóa đơn vượt quá max cho phép!");
                            } else if (dt == 20) {
                                thongbaoloi("Pattern hoặc serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng ký có sử dụng Pattern và serial!");
                            } else {
                                DataService.capnhatsobienlai($scope,stt_lantt,dt.split("SOBIENLAI")[1],data.data.KEY_HD);
                                DataService.thanhtoanhddt($scope,
                                        {data: {ID: IDHDDT,
                                            MA_BN: $scope.thongtinbn.MA_BENH_NHAN, 
                                            NGAYTHUVIENPHI: moment($scope.thongtinthanhtoan.ngaythu).format('DD/MM/YYYY') ,
                                            KEY_HD: data.data.KEY_HD
                                        }}).then(function() {
                                            DataService.postData('cmu_post',
                                            [   {
                                                    param: 'url',
                                                    data: [
                                                    $scope.thongtinthanhtoan.dvtt,
                                                    $scope.thongtinbn.SOVAOVIEN,
                                                    $scope.thongtinbn.SOVAOVIEN_DT == null || $scope.thongtinbn.SOVAOVIEN_DT == undefined? 0:$scope.thongtinbn.SOVAOVIEN_DT,
                                                    stt_lantt
                                                    ,data.data.KEY_HD,
                                                    $scope.thongtinbn.LOAIVP
                                                    ,'CMU_KIEMTRAHDSAISOT']
                                                }
                                            ]).then(function(_sohoadon){
                                                DataService.chuyendoihoadon($scope,
                                                {data: {
                                                    KEY_HD: $scope.thongtinthanhtoan.pattern + ';'+$scope.thongtinthanhtoan.serial+';'+pad(_sohoadon,7,'0')
                                                }},$scope.thongtinthanhtoan.tennhanvien);
                                                if($("#cmu_inappagg").val() == 1) {
                                                    DataService.inapphoadon($scope,$scope.chitietthanhtoan,data,$scope.thongtinthanhtoan.ngaythu,pad(_sohoadon,7,'0'));
                                                }
                                            })
                                            
                                            
                                        });
                                        $rootScope.$broadcast('HIDELOADING');
                                        thongbaoloi("Phát hành hóa đơn thành công!");
                                        setTimeout(function(){
                                            $mdDialog.hide();
                                        },1000)
                                        
                                
                            }
                            $rootScope.$broadcast('LOADDSBNSAUTT');
                        });    
                    })
                } else {
                    if($scope.thongtinbn.LOAIVP == 'NTDICHVU') {
                        var arr = [$scope.thongtinthanhtoan.dvtt, 
                                    $scope.thongtinbn.STT_BENHAN,
                                    stt_lantt,
                                    sotienthanhtoan, 
                                    $scope.thongtinbn.STT_DOTDIEUTRI, 
                                    new Intl.NumberFormat("en-US").format(sotienthanhtoan),
                                    $scope.thongtinthanhtoan.tennhanvien, "NOP",'0','0'];
                        var url = "noitru_inphieuthutien?url=" + c_convert_to_string(arr);
                        $(location).attr('href', url);
                    }
                    $rootScope.$broadcast('HIDELOADING');
                }
                
            })
        }
        $mdDialog.hide();
        if(!inhd && $scope.hoadonphathanh.length == 0) {
            $rootScope.$broadcast('LOADDSBNSAUTT');
        }
        
    }
    
    function thongbaoloi(message) {
        $mdDialog.show(
                            $mdDialog.alert({multiple:true,skipHide: true})
                              .parent(angular.element(document.getElementsByTagName('body')))
                              .clickOutsideToClose(true)
                              .title('Thông báo')
                              .textContent(message)
                              .ok('ĐÓNG')

                          );
    }
    function laytenqbl(id) {
        var t = '';
        $scope.dsqbl.forEach(function(_obj) {
            if(_obj.MA_QUYEN_BIENLAI == id) {
                t = _obj.KYHIEU_QUYEN_BIENLAI
            }
        })
        return t;
    }
    function laysophieu() {
        var tmp = []
        $scope.chitietthanhtoan.forEach(function(_obj) {
                if(_obj.selected == true) {
                     tmp.push(_obj.SOPHIEU_MADV)   
                }
        })
        return tmp;
    }
    
    $scope.searchTerm = '';
    $scope.clearSearchTerm = function() {
        $scope.searchTerm = '';
    };
    function reset() {
        $scope.thongtinthanhtoan.maquyenbienlai = '';
        $scope.thongtinthanhtoan.sobienlai = ''
    }
    $scope.changehoadphathanh = function() {
        $scope.hoadonphathanh.forEach(function(_obj) {
            if(_obj['KEY_HD'] == $scope.thongtinthanhtoan.key_hd) {
                $scope.thongtinthanhtoan.maquyenbienlai = _obj.MA_QUYEN_BIENLAI;
                $scope.thongtinthanhtoan.sobienlai = _obj.SO_BIEN_LAI;
            } 
        })
    }
    $scope.selectedOption = function(data,key,assign,option) {
        var text = ''
        data.forEach(function(_obj) {
            if(_obj[key] == $scope.thongtinthanhtoan[assign]) {
                text = _obj.KYHIEU_QUYEN_BIENLAI
                $scope.thongtinthanhtoan.kyhieu_quyenbienlai = _obj.KYHIEU_QUYEN_BIENLAI;
                if (_obj[option] != undefined) {
                    text += ' - ' + _obj[option]
                }
            } 
        })
        return text;
    }
    $scope.changehoadonsai = function() {
        
    }
    $scope.laphoadonthanhtoan = function(ev,inhd) {
        kiemtraphieu();    
        if(laysophieu().length == 0) return false;  
        if($scope.thongtinthanhtoan.sotienchihoantra > $scope.thongtinthanhtoan.tientamung) {
            thongbaoloi('Số tiền chi hoàn trả lớn hơn số tiền tạm ứng.')
            return false; 
        }
        var confirm = $mdDialog.confirm({multiple:true,skipHide: true})
          .title('Thông báo')
          .textContent('Bạn có chắc lập hóa đơn này?')
          .ariaLabel('Lucky day')
          .ok('Đồng ý')
          .cancel('Hủy');
        if (($scope.thongtinthanhtoan.maquyenbienlai == '' && $scope.hoadonphathanh.length == 0) 
              || ($scope.hoadonphathanh.length > 0 && $scope.thongtinthanhtoan.key_hd == '')) {
            thongbaoloi('Bạn chưa chọn quyển lai.')
            } else {
                $mdDialog.show(confirm).then(function() {
                    $rootScope.$broadcast('SHOWLOADING');
                    $mdDialog.hide();

                    DataService.thanhtoan($scope,laysophieu().join("!!!"),inhd,laphoadonchuaphathanh, false)
                }, function() {

                });
            }  
    };
    function laphoadonchuaphathanh(inhd,stt_lantt,error) {
        if(error != undefined) {
            thongbaoloi(error.message)
            return false;
        }
        $scope.thongtinthanhtoan['STT_LANTT'] = stt_lantt
        DataService.postData('cmu_post',[ {
                param: 'url',
                data: [
                    $scope.thongtinthanhtoan.dvtt,
                    stt_lantt,
                    $scope.thongtinbn.SOVAOVIEN,
                    $scope.thongtinthanhtoan.nguoimiengiam,
                    $scope.thongtinbn.LOAIVP,
                    'CMU_UPDATENGUOIMIENGIAM'
                ]
            }
        ])
        if ($scope.hoadonphathanh.length > 0) {
            
            DataService.capnhathoadonphathanh($scope).then(function() {
                DataService.capnhatsobienlai($scope,stt_lantt,$scope.thongtinthanhtoan.sobienlai,$scope.thongtinthanhtoan.key_hd);
                $rootScope.$broadcast('LOADDSBNSAUTT');
                $rootScope.$broadcast('HIDELOADING');
            });
        }
        var sotienthanhtoan = $scope.thongtinthanhtoan.sotientt;
        if($scope.hoadonphathanh.length == 0) {
            if($scope.thongtinthanhtoan.sotienthoilai > 0) {
                DataService.inphieuhoanung($scope,stt_lantt);
            }
            
            DataService.inserthoadon($scope).done(function() {
                DataService.layidhdt($scope).then(function(IDHDDT) {
                    var data = {data: {ID: IDHDDT}}
                    $scope.chitietthanhtoan = $scope.chitietthanhtoan.filter(function(_obj) {
                        return _obj.selected == true;
                    })

                    DataService.laphoadon($scope,data).done(function (dt) {
                        
                        if (dt == 1) {
                            thongbaoloi("Tài khoản đăng nhập sai hoặc không có quyền!");
                        } else if (dt == 3) {
                            thongbaoloi("Dữ liệu xml đầu vào không đúng quy định!");
                        } else if (dt == 5) {
                            thongbaoloi("Không phát hành được hóa đơn!");
                        } else if (dt == 6) {
                            thongbaoloi("Không đủ hóa đơn trong lô phát hành!");
                        } else if (dt == 7) {
                            thongbaoloi("User name không phù hợp, không tìm thấy company tương ứng cho user!");
                        } else if (dt == 10) {
                            thongbaoloi("Lô có số hóa đơn vượt quá max cho phép!");
                        } else if (dt == 20) {
                            thongbaoloi("Pattern hoặc serial không phù hợp, hoặc không tồn tại hóa đơn đã đăng ký có sử dụng Pattern và serial!");
                        } else {
                            $rootScope.$broadcast('HIDELOADING');
                                    thongbaoloi("Lập hóa đơn thành công!");
                                    setTimeout(function(){
                                        $mdDialog.hide();
                                    },1000)
                        }
                        $rootScope.$broadcast('LOADDSBNSAUTT');
                    });    
                })

                if($scope.thongtinbn.LOAIVP == 'NTDICHVU') {
                    var arr = [$scope.thongtinthanhtoan.dvtt, 
                                $scope.thongtinbn.STT_BENHAN,
                                stt_lantt,
                                sotienthanhtoan, 
                                $scope.thongtinbn.STT_DOTDIEUTRI, 
                                new Intl.NumberFormat("en-US").format(sotienthanhtoan),
                                $scope.thongtinthanhtoan.tennhanvien, "NOP",'0','0'];
                    var url = "noitru_inphieuthutien?url=" + c_convert_to_string(arr);
                    $(location).attr('href', url);
                }
                $rootScope.$broadcast('HIDELOADING');
                
                
            })
        }
        $mdDialog.hide();
    }
}

