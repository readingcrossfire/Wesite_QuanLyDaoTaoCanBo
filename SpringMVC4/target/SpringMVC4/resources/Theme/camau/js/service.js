myapp.service('DataService', function($http, $q) {
    
    this.getData = function (url,data) {
         var defered = $q.defer();
        $http({
            method : "GET",
            url : url+"?url="+convertArray(data)
        }).then(function mySuccess(response) {
            defered.resolve(response.data); 
        }, function myError(response) {
             defered.reject(response);
        });
        return defered.promise;
    }
    this.postData = function (url,dt) {
         var defered = $q.defer();
        var t = "";
        dt.forEach(function(_o,index) {
            if(Array.isArray(_o.data)) {
                console.log("v",_o.data);
                t+=_o.param+'='+convertArray(_o.data);
            } else {
                t+=_o.param+'='+_o.data;
            }
            if(index < dt.length - 1) {
                t+= '&';
            }
        })
        $http({
            method : "POST",
            url : url+'?'+t,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
            
                    
        }).then(function mySuccess(response) {
             defered.resolve(response.data); 
            
        }, function myError(response) {
            defered.reject(response);
        });
        return defered.promise;
    }
    function convertArray(arr) {
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
    
    this.thanhtoanall = function ($scope) {
        var t = 1;
        $scope.chitietthanhtoan.forEach(function(_obj) {
            if(_obj.selected != true) t = 0;
        })
        if($scope.loaivienphi == 'NOITRUTAMUNG') {
            return 0
        }
        return t;
    }
    
    this.thanhtoan = function(objData,sophieu,inhd,callback) {
        if(objData.thongtinbn.LOAIVP == 'BHYT') {
            this.thanhtoanbhyt(objData,sophieu,inhd,callback);
        } else if (objData.thongtinbn.LOAIVP == 'THUPHI') {
            this.thanhtoanthuphi(objData,sophieu,inhd,callback);
        } else if (objData.thongtinbn.LOAIVP == 'NTDICHVU') {
            this.thanhtoandichvu(objData,sophieu,inhd,callback);
        } else {
            this.thanhtoantienbenhnhan(objData,sophieu,inhd,callback);
        }
    }
    
    
    this.thanhtoanbhyt = function($scope,sophieu,inhd,callback) {
        var self = this;
        var arr = [
                    $scope.thongtinbn.SOPHIEUTHANHTOAN,
                    $scope.thongtinthanhtoan.manv, 
                    $scope.thongtinthanhtoan.sotientt, 
                    $scope.thongtinthanhtoan.sotienbntra,
                    $scope.thongtinthanhtoan.sotienthoilai, 
                    "false", 
                    0, //SO BIEN LAI 0
                    $scope.thongtinthanhtoan.ghichu == undefined? " ": $scope.thongtinthanhtoan.ghichu, 
                    $scope.thongtinthanhtoan.dvtt,
                    $scope.thongtinthanhtoan.sotientt, 
                    parseDateToString($scope.thongtinthanhtoan.ngaythu),
                    this.thanhtoanall($scope), 
                    $scope.thongtinthanhtoan.maquyenbienlai, 
                    $scope.thongtinbn.TEN_BENH_NHAN,0];
         $.post('themlantt_cobhyt_giamtai_svv_moi_miengiam', 
                {
                    sovaovien: $scope.thongtinbn.SOVAOVIEN, 
                    url: c_convert_to_string(arr),
                    sotienphaitra: $scope.thongtinthanhtoan.sotientt, 
                    sotienthanhtoan: $scope.thongtinthanhtoan.sotienbntra,
                    sotienphaitt: $scope.thongtinthanhtoan.sotientt, 
                    sophieu: sophieu,
                    sotienmiengiam: $scope.thongtinthanhtoan.tienmiengiam, 
                    sotiensaumiengiam: $scope.thongtinthanhtoan.sotienbntra
                }).done(function (data) {
                    if (data == "5") {
                        return callback(inhd,data,{message: "Trong quá trình thanh toán, có phát sinh vấn đề. Vui lòng xem lại thông tin để thanh toán lại"});
                    }
                    if (data != "") {
                        self.lockbienlai($scope,data,$scope.thongtinthanhtoan.maquyenbienlai,0,0,0);
                        $scope.thongtinbn['SOVAOVIEN_NOI'] = 0;
                        $scope.thongtinbn['SOVAOVIEN_DT'] = 0;
                        $scope.thongtinbn['NOITRU'] = 0;
                        $scope.thongtinbn['COBHYT'] = 1;
                                var arr = [$scope.thongtinthanhtoan.dvtt, 
                        "kb_" + $scope.thongtinbn.ID_TIEPNHAN,
                        $scope.thongtinbn.SOPHIEUTHANHTOAN,
                        parseDateToString($scope.thongtinthanhtoan.ngaythu), $scope.thongtinbn.SOVAOVIEN];
                        $.post("update_trangthai_xacnhanthanhtoan_svv", {url: c_convert_to_string(arr)})
                                .done(function (data) {
                        });
                        callback(inhd,data)
                        
                    }
        }); 
    }
    
    this.thanhtoanthuphi = function($scope,sophieu,inhd,callback) {
        var self = this;
      
       
        if ($scope.thongtinthanhtoan.hoantatkham > 2 ) {
            if ($scope.thongtinthanhtoan.trutamung == 0) {
                $scope.thongtinthanhtoan.trutamung = 1;
            } else {
                $scope.thongtinthanhtoan.trutamung = 0;
            }
            
        }
        console.log("$scope.thongtinthanhtoan.trutamung = 1;", $scope.thongtinthanhtoan.trutamung)
        var arr = [
                $scope.thongtinbn.ID_TIEPNHAN, 
                $scope.thongtinthanhtoan.manv, 
                $scope.thongtinthanhtoan.sotientt,
                $scope.thongtinthanhtoan.sotienbntra,
                $scope.thongtinthanhtoan.sotienthoilai,
                "false",
                $scope.thongtinthanhtoan.sobienlai,
                $scope.thongtinthanhtoan.ghichu == undefined? " ": $scope.thongtinthanhtoan.ghichu, 
                $scope.thongtinthanhtoan.dvtt,
                parseDateToString($scope.thongtinthanhtoan.ngaythu), 
                $scope.thongtinbn.SOVAOVIEN, 
                this.thanhtoanall($scope), 
                $scope.thongtinthanhtoan.maquyenbienlai,
                $scope.thongtinbn.TEN_BENH_NHAN,
                $scope.thongtinthanhtoan.hoantatkham > 2 ? $scope.thongtinthanhtoan.trutamung : 0,
                0
            ];
        $.post('themlantt_khongbhyt_svv_moi_miengiam', {
                    url: c_convert_to_string(arr),
                    sophieu: sophieu,
                    sotienmiengiam: $scope.thongtinthanhtoan.tienmiengiam,
                    sotiensaumiengiam: $scope.thongtinthanhtoan.sotienbntra
                }).done(function (data) {
                    if (data == "5") {
                        return callback(inhd,data,{message: "Trong quá trình thanh toán, có phát sinh vấn đề. Vui lòng xem lại thông tin để thanh toán lại"});
                    }
                    if (data != "") {
                        self.lockbienlai($scope,data,$scope.thongtinthanhtoan.maquyenbienlai,0,0,0);
                        $scope.thongtinbn['SOVAOVIEN_NOI'] = 0;
                        $scope.thongtinbn['SOVAOVIEN_DT'] = 0;
                        $scope.thongtinbn['NOITRU'] = 0;
                        $scope.thongtinbn['COBHYT'] = 0;
                        callback(inhd,data);
                    }
                });    
    }
    
    this.thanhtoandichvu = function($scope,sophieu,inhd,callback) {
        var self = this;
        this.postData("cmu_post",
                                [   
                                    {
                                        data:[
                                            $scope.thongtinthanhtoan.dvtt,
                                            $scope.thongtinbn.STT_LANTT,
                                            $scope.thongtinbn.SOPHIEUTHANHTOAN,
                                            $scope.thongtinthanhtoan.manv,
                                            $scope.thongtinthanhtoan.sotientt,
                                            $scope.thongtinthanhtoan.sotienbntra,
                                            $scope.thongtinthanhtoan.sotienthoilai,
                                            0,
                                            $scope.thongtinthanhtoan.sobienlai =="" ? 0 : $scope.thongtinthanhtoan.sobienlai,
                                            '',
                                            parseDateToString($scope.thongtinthanhtoan.ngaythu),
                                            $scope.thongtinbn.STT_BENHAN,
                                            $scope.thongtinbn.STT_DOTDIEUTRI,
                                            $scope.thongtinbn.MA_BENH_NHAN,
                                            0,
                                            $scope.thongtinbn.load.SOBAOHIEMYTE,
                                            $scope.thongtinthanhtoan.sotientt,
                                            $scope.thongtinthanhtoan.sobienlai =="" ? 0 : $scope.thongtinthanhtoan.sobienlai,
                                            $scope.thongtinthanhtoan.kyhieu_quyenbienlai,
                                            $scope.thongtinthanhtoan.maquyenbienlai,
                                            $scope.thongtinbn.SOVAOVIEN,
                                            $scope.thongtinbn.SOVAOVIEN_DT,
                                            "!!!"+sophieu+"!!!",
                                            0,
                                            0,
                                            0,
                                            parseDateToString($scope.thongtinthanhtoan.ngaythu),
                                            $scope.thongtinthanhtoan.sotienbntra,
                                            0,
                                            'CMU_LTT_DICHVU_INSERT'
                                            
                                        ],
                                        param: 'url'
                                    }
                                ]
                            )
                    .then(function(dt){ 
                        if (data == "5") {
                            return callback(inhd,data,{message: "Trong quá trình thanh toán, có phát sinh vấn đề. Vui lòng xem lại thông tin để thanh toán lại"});
                        }
                        if(dt != "") {
                            $scope.thongtinbn.STT_LANTT = $scope.thongtinbn.STT_LANTT.replace(/_\d/g,'') + "_"+dt
                            var data = $scope.thongtinbn.STT_LANTT;
                            self.lockbienlai($scope,data,$scope.thongtinthanhtoan.maquyenbienlai,0,0,0);
                            $scope.thongtinbn['SOVAOVIEN_NOI'] = $scope.thongtinbn.SOVAOVIEN;
                            $scope.thongtinbn['SOVAOVIEN_DT'] = $scope.thongtinbn.SOVAOVIEN_DT;
                            $scope.thongtinbn['NOITRU'] = -1;
                            $scope.thongtinbn['COBHYT'] = $scope.thongtinbn.SOBAOHIEMYTE != ""? 1:0;
                            callback(inhd,data);
                        }
                    })
    }
    
    this.thanhtoantienbenhnhan = function($scope,sophieu,inhd,callback) {
        var self = this;
        console.log("$scope.thongtinthanhtoan.sotienbntra", $scope.thongtinthanhtoan.sotienbntra)
        $.post('noitru_lantt_insert_svv_moi_miengiam',{
            url: c_convert_to_string([
                                            $scope.thongtinbn.SOPHIEUTHANHTOAN,
                                            Number($scope.thongtinthanhtoan.sotientt).toFixed(2),
                                            Number($scope.thongtinthanhtoan.sotienbntra).toFixed(2),
                                            Number($scope.thongtinthanhtoan.sotienthoilai).toFixed(2),
                                            0,
                                            parseDateToString($scope.thongtinthanhtoan.ngaythu),
                                            $scope.thongtinbn.STT_BENHAN,
                                            $scope.thongtinbn.STT_DOTDIEUTRI,
                                            $scope.thongtinbn.MA_BENH_NHAN,
                                            Number($scope.thongtinthanhtoan.sotientt).toFixed(2),
                                            0,
                                            $scope.thongtinthanhtoan.kyhieu_quyenbienlai,
                                            $scope.thongtinthanhtoan.maquyenbienlai,
                                            parseDateToString($scope.thongtinthanhtoan.ngaythu),
                                            $scope.thongtinbn.SOVAOVIEN,
                                            $scope.thongtinbn.SOVAOVIEN_DT,
                                            this.thanhtoanall($scope),
                                            $scope.thongtinthanhtoan.trutamung == 0? 1:0,
                                            $scope.thongtinthanhtoan.tienmiengiam > 0? 1: 0,
                                            $scope.thongtinthanhtoan.tienmiengiam,
                                            parseDateToString($scope.thongtinthanhtoan.ngaythu)
                                            ,0,"0",
                                            $scope.thongtinthanhtoan.ghichu == undefined? " ": ($scope.thongtinthanhtoan.ghichu + " ")
                                        ]),
            tongtien:        Number($scope.thongtinthanhtoan.sotientt).toFixed(2),
            sophieu: sophieu,
            tongtiensaumiengiam:  Number($scope.thongtinthanhtoan.sotienbntra).toFixed(2),
            tongtientmaung: $scope.thongtinthanhtoan.tientamung == "" || $scope.thongtinthanhtoan.trutamung == 1 ? 0: $scope.thongtinthanhtoan.tientamung,
            ghichu: $scope.thongtinthanhtoan.ghichu == undefined? " ": $scope.thongtinthanhtoan.ghichu
                                        
        }).done(function(data) {
            if (data == "-1") {
                callback(inhd,data,{message: "Còn cận lâm sàng chưa thực hiện"})
            } else if (data == "5") {
                callback(inhd,data,{message: "Trong quá trình thanh toán, có phát sinh vấn đề. Vui lòng xem lại thông tin để thanh toán lại"});
            } else if (data != "") {
                self.lockbienlai($scope,data,$scope.thongtinthanhtoan.maquyenbienlai,0,0,0);
                $scope.thongtinbn['SOVAOVIEN_NOI'] = $scope.thongtinbn.SOVAOVIEN;
                $scope.thongtinbn['SOVAOVIEN_DT'] = $scope.thongtinbn.SOVAOVIEN_DT;
                $scope.thongtinbn['NOITRU'] = 1;
                $scope.thongtinbn['COBHYT'] = $scope.thongtinbn.SOBAOHIEMYTE != ""? 1:0;
                callback(inhd,data);           
            }
        })
    }
    
    this.inserthoadon = function($scope) {
        if ($scope.thongtinbn.load == undefined) {
           $scope.thongtinbn.load = {
               DIACHI: "",
               SOBAOHIEMYTE: ""
           };
        
        }
        return $.post("insert_hoadon_kb", {
            stt_lantt: $scope.thongtinthanhtoan.STT_LANTT,
            sovaovien: $scope.thongtinbn.SOVAOVIEN,
            ma_lan_kham: $scope.thongtinbn.SOPHIEUTHANHTOAN,
            ma_bn: $scope.thongtinbn.MA_BENH_NHAN,
            ho_ten: $scope.thongtinbn.TEN_BENH_NHAN,
            diachi: $scope.thongtinbn.load.DIACHI,
            ma_the: $scope.thongtinbn.load.SOBAOHIEMYTE == undefined?'':$scope.thongtinbn.load.SOBAOHIEMYTE,
            thanhthien_chitra:$scope.thongtinthanhtoan.tmiengiam == true ? Number($scope.thongtinthanhtoan.sotienbntra):Number($scope.thongtinthanhtoan.sotientt).toFixed(),
            ma_lk: $scope.thongtinbn.SOPHIEUTHANHTOAN,
            sovaovien_noi: $scope.thongtinbn.SOVAOVIEN_NOI,
            sovaovien_dt: $scope.thongtinbn.SOVAOVIEN_DT,
            noitru: $scope.thongtinbn.NOITRU,
            cobhyt: $scope.thongtinbn.COBHYT
            }); 
    }
    
    this.lockbienlai = function($scope,data,maquyenbienlai,sobienlai,trangthai,huy) {
        return $.post("unlock_xoa_bienlai", {
                                dvtt: $scope.thongtinthanhtoan.dvtt,
                                nhanvienthu: $scope.thongtinthanhtoan.manv,
                                maquyenbienlai: maquyenbienlai,
                                sobienlai: sobienlai,
                                trangthai: trangthai,
                                keyQL: data + "-" +$scope.thongtinthanhtoan.manv,
                                huy: huy,
                                log: ""
                        });
    }
    
    this.laphoadonthaythe = function($scope,data,fkey) {
        var nguoibenh = $("#cmu_ctlaynguoibenh").val()
        var nd_all = '';
        var sl_all = '';
        var dg_all = '';
        var tt_all = '';
        var arr = [];
        var noitru = "";
        var tilebhyt = $scope.thongtinbn.load.TYLEBAOHIEM;
        var baohiemchi = 0;
        var tongtienbn = 0;
        
        if ($scope.thongtinbn.LOAIVP == 'BHYT' || $scope.thongtinbn.LOAIVP == 'THUPHI') {
            
            if($scope.thongtinthanhtoan.hoadonchitiet == 1 &&  $scope.thongtinbn.LOAIVP == 'THUPHI') {
                $scope.chitietthanhtoan.forEach(function(_obj,_index) {
                    nd_all += escapeXml(_obj.NOIDUNG);
                    sl_all += '0';
                    dg_all += '0';
                    tt_all += _obj.THANH_TIEN.toFixed(2);
                    tongtienbn+=  _obj.THANH_TIEN;
                    if (_index < $scope.chitietthanhtoan.length - 1) {
                        sl_all +=';';
                        dg_all += ';';
                        nd_all += ';';
                        tt_all += ';';

                    }
                })
                if ($scope.thongtinthanhtoan.dvtt != 96977 && $scope.chitietthanhtoan.length > 5) {
                    nd_all = '';
                    sl_all = '';
                    dg_all = '';
                    tt_all = '';
                    tongtienbn = 0;
                    $scope.chitietthanhtoan.forEach(function(_obj) {
                        switch(_obj.GHI_CHU) {
                            case 'CONGKHAM':
                                arr[0] = (arr[0] == undefined? 0: arr[0]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                                break;
                            case 'XETNGHIEM':
                                arr[1] = (arr[1] == undefined? 0: arr[1]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                                break;
                            case 'CHANDOANHINHANH':
                                arr[2] = (arr[2] == undefined? 0: arr[2]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                                break;
                            case 'THUTHUATPHAUTHUAT':
                                arr[3] = (arr[3] == undefined? 0: arr[3]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                                break;
                            default:
                                arr[4] = (arr[4] == undefined? 0: arr[4]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                                break;    
                        }
                        tongtienbn+=  Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN);
                        })
                }
            } else {
                $scope.chitietthanhtoan.forEach(function(_obj) {
                switch(_obj.GHI_CHU) {
                    case 'CONGKHAM':
                        arr[0] = (arr[0] == undefined? 0: arr[0]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                        break;
                    case 'XETNGHIEM':
                        arr[1] = (arr[1] == undefined? 0: arr[1]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                        break;
                    case 'CHANDOANHINHANH':
                        arr[2] = (arr[2] == undefined? 0: arr[2]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                        break;
                    case 'THUTHUATPHAUTHUAT':
                        arr[3] = (arr[3] == undefined? 0: arr[3]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                        break;
                    default:
                        arr[4] = (arr[4] == undefined? 0: arr[4]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                        break;    
                }
                tongtienbn+=  Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN);
                })
            }        
            
            baohiemchi = nguoibenh == 1?0:sumData($scope.chitietthanhtoan, 'THANH_TIEN') - $scope.thongtinthanhtoan.sotientt;
        } else if($scope.thongtinbn.LOAIVP == 'NTDICHVU')
        {
            nd_all = "Thu tiền dịch vụ";
            tt_all = 0;
            $scope.chitietthanhtoan.forEach(function(_obj) {
                tt_all += Number(_obj.NGUOI_BENH);
                tongtienbn+=  _obj.THANH_TIEN;
            })
            baohiemchi = 0;
            tilebhyt = 0;
        } else if ($scope.thongtinbn.LOAIVP == 'HDBL') {
            nd_all = data.data.noidung;
            $scope.chitietthanhtoan.forEach(function(_obj) {
                tt_all += Number(_obj.NGUOI_BENH);
                tongtienbn+=  Number(_obj.THANH_TIEN);
            })
            baohiemchi = 0;
            tilebhyt = 0;
        } else {
            noitru = " và ngày giường"
            $scope.chitietthanhtoan.forEach(function(_obj) {
                switch(_obj.UU_TIEN_IN) {
                    case 1:
                        arr[0] = (arr[0] == undefined? 0: arr[0]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                        break;
                    case 2:
                        arr[1] = (arr[1] == undefined? 0: arr[1]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                        break;
                    case 3:
                        arr[2] = (arr[2] == undefined? 0: arr[2]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                        break;
                    case 4:
                        arr[3] = (arr[3] == undefined? 0: arr[3]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                        break;
                    default:
                        arr[4] = (arr[4] == undefined? 0: arr[4]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                        break;    
                }
                tongtienbn+=  Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN);
            })
            baohiemchi = nguoibenh == 1?0:sumData($scope.chitietthanhtoan, 'THANH_TIEN') - $scope.thongtinthanhtoan.sotientt;
        }
        if ($scope.thongtinthanhtoan.hoadonchitiet != 1 
                || ($scope.thongtinthanhtoan.hoadonchitiet == 1 &&  $scope.thongtinbn.LOAIVP != 'THUPHI')
                || ($scope.thongtinthanhtoan.hoadonchitiet == 1 &&  $scope.thongtinbn.LOAIVP == 'THUPHI'
                    && $scope.thongtinthanhtoan.dvtt != 96977 && $scope.chitietthanhtoan.length > 5)
                ) {
            var temp = 1;   
            for (var i = 0; i < arr.length; i++) {
               switch(i) {
                   case 0:
                       if(arr[0] != undefined) {
                           nd_all += escapeXml("Công khám" + noitru);
                           sl_all += '0';
                           dg_all += '0';
                           tt_all += arr[0].toFixed(2);
                           temp++;
                       }

                       break;
                   case 1:
                       if (arr[1] != undefined) {
                           tt_all += arr[1].toFixed(2);
                           nd_all += escapeXml("Xét Nghiệm");
                           sl_all += '0';
                           dg_all += '0';
                           temp++;
                       }

                       break;
                   case 2:
                       if (arr[2] != undefined) {
                           tt_all += arr[2].toFixed(2);
                           nd_all += escapeXml("Chẩn đoán hình ảnh và TDCN");
                           sl_all += '0';
                           dg_all += '0';
                           temp++;
                       }

                       break;
                   case 3:
                       if (arr[3] != undefined) {
                           tt_all += arr[3].toFixed(2);
                           nd_all += escapeXml("Thủ thuật phẫu thuật");
                           sl_all += '0';
                           dg_all += '0';
                           temp++;
                       }

                       break;
                   case 4:
                       if (arr[4] != undefined) {
                           tt_all += arr[4].toFixed(2);
                           nd_all += escapeXml("Thuốc, vật tư và chi phí khác");
                           sl_all += '0';
                           dg_all += '0';
                       }

                       break;    
               }
               if (i < arr.length - 1) {
                   if (arr[i] != undefined) {
                       sl_all +=';';
                   dg_all += ';';
                   nd_all += ';';
                   tt_all += ';';
                   }

               }
           }
       }

        var d = new Date();
        var n = d.getTime();
        var arisingdate = parseDateToString($scope.thongtinthanhtoan.ngaythu);
        var key =  $scope.thongtinthanhtoan.dvtt+"-"+n + "-" + arisingdate.replace("-","") + "-" + $scope.thongtinbn.MA_BENH_NHAN + "-" + $scope.thongtinbn.SOVAOVIEN;

        var url = "cmu_thaythe_invoice";   
        data.data['KEY_HD'] = key; 
        var dt = data.data.dantoc == undefined? 'Kinh': data.data.dantoc;
        if($scope.thongtinthanhtoan.hoadonchitiet == 1 && $scope.thongtinthanhtoan.dvtt == 96977) {
            if($scope.thongtinbn.LOAIVP == 'HDBL') {
                dt = ' ';
            } else {
                if($scope.thongtinbn.LOAIVP == 'NOITRU') {
                    var d = new Date();
                    var n = d.getFullYear();
                    dt =n - $scope.thongtinbn.NAMSINH
                } else {
                    dt = $scope.thongtinbn['load'].TUOI
                }
            }
            
        }
        if(tongtienbn.toFixed() == 0) {
            alert("Số tiền thanh toán phải lớn hơn 0");
            return;
        }
        if ($scope.thongtinthanhtoan.tmiengiam == true) {
            tongtienbn = Number($scope.thongtinthanhtoan.sotienbntra);
        }
        return $.post(url, {
            id: data.data.ID,
            key: key,
             username: $scope.thongtinthanhtoan.account,
            password: $scope.thongtinthanhtoan.acpass,
            account: $scope.thongtinthanhtoan.username,
             acpass: $scope.thongtinthanhtoan.password,
            publishservice: $scope.thongtinthanhtoan.businessservice,
            pattern: $scope.thongtinthanhtoan.pattern,
            serial: $scope.thongtinthanhtoan.serial,

            ma_bn: escapeXml($scope.thongtinbn.MA_BENH_NHAN + ''),
            ten_bn: escapeXml($scope.thongtinbn.TEN_BENH_NHAN+''),
            diachi: escapeXml($scope.thongtinbn.load.DIACHI+''),
            paymethod: "Tiền mặt",

            nd_all: nd_all,
            sl_all: sl_all,
            dg_all: dg_all,
            tt_all: tt_all,

            total:  Number($scope.thongtinthanhtoan.sotientt).toFixed(),
            arisingdate: arisingdate,
            dantoc: dt,
            gioitinh: $scope.thongtinbn.GIOI_TINH == 0 || $scope.thongtinbn.load.GIOITINH == 0? "Nữ": "Nam",
            tenKhoa: $scope.thongtinbn.TEN_PHONGBAN,
            thebhyt: $scope.thongtinbn.load.SOBAOHIEMYTE,
            tilebhyt: tilebhyt,
            baohiemchi: baohiemchi.toFixed(),
            tongtienbn: tongtienbn.toFixed(),
            fkey: fkey

        });
    }
    
    this.capnhathoadonsai = function() {
        
    }
    
    this.laphoadon = function($scope, data) {
        var nguoibenh = $("#cmu_ctlaynguoibenh").val()
        var nd_all = '';
        var sl_all = '';
        var dg_all = '';
        var tt_all = '';
        var arr = [];
        var noitru = "";
        var tilebhyt = $scope.thongtinbn.load.TYLEBAOHIEM;
        var baohiemchi = 0;
        var tongtienbn = 0;
        var paymentmethod = "Tiền Mặt";
        var tendonvi = "";
        var masothue  = "";
        var sodienthoai = "";
        var vat = "0";
        var vatAmount = "0";
        if ($scope.thongtinbn.LOAIVP == 'BHYT' || $scope.thongtinbn.LOAIVP == 'THUPHI') {
            
            if($scope.thongtinthanhtoan.hoadonchitiet == 1 &&  $scope.thongtinbn.LOAIVP == 'THUPHI') {
                $scope.chitietthanhtoan.forEach(function(_obj,_index) {
                    nd_all += escapeXml(_obj.NOIDUNG);
                    sl_all += '0';
                    dg_all += '0';
                    tt_all += _obj.THANH_TIEN.toFixed(2);
                    tongtienbn+=  _obj.THANH_TIEN;
                    if (_index < $scope.chitietthanhtoan.length - 1) {
                        sl_all +=';';
                        dg_all += ';';
                        nd_all += ';';
                        tt_all += ';';

                    }
                })
                if ($scope.thongtinthanhtoan.dvtt != 96977 && $scope.chitietthanhtoan.length > 5) {
                    nd_all = '';
                    sl_all = '';
                    dg_all = '';
                    tt_all = '';
                    tongtienbn = 0;
                    $scope.chitietthanhtoan.forEach(function(_obj) {
                        switch(_obj.GHI_CHU) {
                            case 'CONGKHAM':
                                arr[0] = (arr[0] == undefined? 0: arr[0]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                                break;
                            case 'XETNGHIEM':
                                arr[1] = (arr[1] == undefined? 0: arr[1]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                                break;
                            case 'CHANDOANHINHANH':
                                arr[2] = (arr[2] == undefined? 0: arr[2]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                                break;
                            case 'THUTHUATPHAUTHUAT':
                                arr[3] = (arr[3] == undefined? 0: arr[3]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                                break;
                            default:
                                arr[4] = (arr[4] == undefined? 0: arr[4]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                                break;    
                        }
                        tongtienbn+=  Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN);
                        })
                }
            } else {
                $scope.chitietthanhtoan.forEach(function(_obj) {
                switch(_obj.GHI_CHU) {
                    case 'CONGKHAM':
                        arr[0] = (arr[0] == undefined? 0: arr[0]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 'XETNGHIEM':
                        arr[1] = (arr[1] == undefined? 0: arr[1]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 'CHANDOANHINHANH':
                        arr[2] = (arr[2] == undefined? 0: arr[2]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 'THUTHUATPHAUTHUAT':
                        arr[3] = (arr[3] == undefined? 0: arr[3]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    default:
                        arr[4] = (arr[4] == undefined? 0: arr[4]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;    
                }
                tongtienbn+=  nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN;
                console.log("tongtienbn",tongtienbn,_obj)
                })
            }
            
            console.log("nguoibenh",nguoibenh)
            console.log("tongtienbn",tongtienbn)
            baohiemchi = sumData($scope.chitietthanhtoan, 'THANH_TIEN') - $scope.thongtinthanhtoan.sotientt;
        } else if($scope.thongtinbn.LOAIVP == 'NTDICHVU')
        {
            nd_all = "Thu tiền dịch vụ";
            tt_all = 0;
            $scope.chitietthanhtoan.forEach(function(_obj) {
                tt_all += Number(_obj.NGUOI_BENH);
                tongtienbn+=  _obj.THANH_TIEN;
            })
            baohiemchi = 0;
            tilebhyt = 0;
        } else if ($scope.thongtinbn.LOAIVP == 'HDBL') {
            nd_all = data.data.noidung;
            $scope.chitietthanhtoan.forEach(function(_obj) {
                tt_all += Number(_obj.NGUOI_BENH);
                tongtienbn+=  Number(_obj.THANH_TIEN);
            })
            baohiemchi = 0;
            tilebhyt = 0;
            $scope.thongtinbn['load']['TEN_DANTOC'] = 'Kinh';
            tendonvi = $scope.hoadonle.tendonvi;
            masothue = $scope.hoadonle.masothue;
            sodienthoai = $scope.hoadonle.sodienthoai;
            if($scope.hoadonle.dantoc != undefined) {
                paymentmethod = $scope.hoadonle.hinhthuctt;
                $scope.thongtinbn['load']['TEN_DANTOC'] = $scope.hoadonle.dantoc.trim() == ''? 'Kinh': $scope.hoadonle.dantoc; 
            } 
            
        } else {
            noitru = " và ngày giường"
            $scope.chitietthanhtoan.forEach(function(_obj) {
                switch(_obj.UU_TIEN_IN) {
                    case 1:
                        arr[0] = (arr[0] == undefined? 0: arr[0]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 2:
                        arr[1] = (arr[1] == undefined? 0: arr[1]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 3:
                        arr[2] = (arr[2] == undefined? 0: arr[2]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 4:
                        arr[3] = (arr[3] == undefined? 0: arr[3]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    default:
                        arr[4] = (arr[4] == undefined? 0: arr[4]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;    
                }
                tongtienbn+=  nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN;
            })
            baohiemchi = nguoibenh == 1?0:sumData($scope.chitietthanhtoan, 'THANH_TIEN') - $scope.thongtinthanhtoan.sotientt;
        }
        if ($scope.thongtinthanhtoan.hoadonchitiet != 1 || 
                ($scope.thongtinthanhtoan.hoadonchitiet == 1 &&  $scope.thongtinbn.LOAIVP != 'THUPHI')
                ||  ($scope.thongtinthanhtoan.hoadonchitiet == 1 &&  $scope.thongtinbn.LOAIVP == 'THUPHI'
                    && $scope.thongtinthanhtoan.dvtt != 96977 && $scope.chitietthanhtoan.length > 5)
                ) {
            var temp = 1;   
            for (var i = 0; i < arr.length; i++) {
               switch(i) {
                   case 0:
                       if(arr[0] != undefined) {
                           nd_all += escapeXml("Công khám" + noitru);
                           sl_all += '0';
                           dg_all += '0';
                           tt_all += arr[0].toFixed(2);
                           temp++;
                       }

                       break;
                   case 1:
                       if (arr[1] != undefined) {
                           tt_all += arr[1].toFixed(2);
                           nd_all += escapeXml("Xét Nghiệm");
                           sl_all += '0';
                           dg_all += '0';
                           temp++;
                       }

                       break;
                   case 2:
                       if (arr[2] != undefined) {
                           tt_all += arr[2].toFixed(2);
                           nd_all += escapeXml("Chẩn đoán hình ảnh và TDCN");
                           sl_all += '0';
                           dg_all += '0';
                           temp++;
                       }

                       break;
                   case 3:
                       if (arr[3] != undefined) {
                           tt_all += arr[3].toFixed(2);
                           nd_all += escapeXml("Thủ thuật phẫu thuật");
                           sl_all += '0';
                           dg_all += '0';
                           temp++;
                       }

                       break;
                   case 4:
                       if (arr[4] != undefined) {
                           tt_all += arr[4].toFixed(2);
                           nd_all += escapeXml("Thuốc, vật tư và chi phí khác");
                           sl_all += '0';
                           dg_all += '0';
                       }

                       break;    
               }
               if (i < arr.length - 1) {
                   if (arr[i] != undefined) {
                       sl_all +=';';
                   dg_all += ';';
                   nd_all += ';';
                   tt_all += ';';
                   }

               }
           }
       }

        var d = new Date();
        var n = d.getTime();
        var arisingdate = parseDateToString($scope.thongtinthanhtoan.ngaythu);
        var key =  $scope.thongtinthanhtoan.dvtt+"-"+n + "-" + arisingdate.replace("-","") + "-" + $scope.thongtinbn.MA_BENH_NHAN + "-" + $scope.thongtinbn.SOVAOVIEN;

        var url = "cmu_laphoadon_invoice";   
        data.data['KEY_HD'] = key; 
        var dt =  $scope.thongtinbn['load'].TEN_DANTOC == undefined? 'Kinh': $scope.thongtinbn['load'].TEN_DANTOC;
        if($scope.thongtinthanhtoan.hoadonchitiet == 1 && $scope.thongtinthanhtoan.dvtt == 96977) {
            if($scope.thongtinbn.LOAIVP == 'HDBL') {
                dt = ' ';
            } else {
                if($scope.thongtinbn.LOAIVP == 'NOITRU') {
                    var d = new Date();
                    var n = d.getFullYear();
                    dt =n - $scope.thongtinbn.NAMSINH
                } else {
                    dt = $scope.thongtinbn['load'].TUOI
                }
                
            }
            
        }
        console.log("tongtienbn",tongtienbn,$scope.thongtinthanhtoan.sotientt)
        if(tongtienbn.toFixed() == 0 || $scope.thongtinthanhtoan.sotientt.toFixed() == 0) {
            alert("Không được phát hành hóa đơn số tiền bằng không, Nếu có lỗi xảy ra vui lòng phát hành lại.")
            return false;
	}
        if ($scope.thongtinthanhtoan.tmiengiam == true) {
            tongtienbn = Number($scope.thongtinthanhtoan.sotienbntra);
        }
        return $.post(url, {
                    id: data.data.ID,
                    key: key,
                    account: $scope.thongtinthanhtoan.account,
                    acpass: $scope.thongtinthanhtoan.acpass,
                    username: $scope.thongtinthanhtoan.username,
                    password: $scope.thongtinthanhtoan.password,
                    publishservice: $scope.thongtinthanhtoan.publishservice,
                    pattern: $scope.thongtinthanhtoan.pattern,
                    serial: $scope.thongtinthanhtoan.serial,

                    ma_bn: escapeXml($scope.thongtinbn.MA_BENH_NHAN + ''),
                    ten_bn: escapeXml($scope.thongtinbn.TEN_BENH_NHAN+''),
                    diachi: escapeXml($scope.thongtinbn.load.DIACHI+''),
                    paymethod: paymentmethod,

                    nd_all: nd_all,
                    sl_all: sl_all,
                    dg_all: dg_all,
                    tt_all: tt_all,

                    total: $scope.thongtinthanhtoan.sotientt.toFixed(),
                    arisingdate: arisingdate,
                    dantoc: dt,
                    gioitinh: $scope.thongtinbn.GIOI_TINH == 0 || $scope.thongtinbn.load.GIOITINH == 0? "Nữ": "Nam",
                    tenKhoa: $scope.thongtinbn.TEN_PHONGBAN,
                    thebhyt: $scope.thongtinbn.load.SOBAOHIEMYTE,
                    tilebhyt: tilebhyt,
                    baohiemchi: baohiemchi.toFixed(),
                    tongtienbn: tongtienbn.toFixed(),
                    tendonvi: tendonvi,
                    masothue: masothue,
                    sodienthoai: sodienthoai,
                    vat: vat,
                    vatAmount: vatAmount

                });
        
    }
    
    this.phathanhhoadon = function($scope, data) {
        var nguoibenh = $("#cmu_ctlaynguoibenh").val()
        var nd_all = '';
        var sl_all = '';
        var dg_all = '';
        var tt_all = '';
        var dvt_all = '';   
        var arr = [];
        var noitru = "";
        var tilebhyt = $scope.thongtinbn.load.TYLEBAOHIEM;
        var baohiemchi = 0;
        var tongtienbn = 0;
        var paymentmethod =  $scope.thongtinthanhtoan.hinhthucthanhtoan;
        var tendonvi = $scope.thongtinthanhtoan.tendonvi == undefined? "":$scope.thongtinthanhtoan.tendonvi;
        var masothue  = $scope.thongtinthanhtoan.masothue == undefined? "":$scope.thongtinthanhtoan.masothue;
        var sodienthoai = "";
        var vat = $scope.thongtinthanhtoan.vat;
        var vatAmount = "0";
        if ($scope.thongtinbn.LOAIVP == 'BHYT' || $scope.thongtinbn.LOAIVP == 'THUPHI') {
            
            if($scope.thongtinthanhtoan.hoadonchitiet == 1 &&  ($scope.thongtinbn.LOAIVP == 'THUPHI' || ($scope.thongtinbn.LOAIVP == 'BHYT' && $scope.chitietthanhtoan.length < 6))) {
                if ($scope.thongtinbn.LOAIVP == 'BHYT') {
                $scope.chitietthanhtoan.forEach(function(_obj,_index) {
                    nd_all += escapeXml(_obj.NOIDUNG);
                    if ($scope.thongtinthanhtoan.hienthistg==1) {
                        sl_all += '1';
                        dg_all += _obj.THANH_TIEN.toFixed(2);
                        dvt_all += 'Lần';
                    } else {
                    sl_all += '0';
                    dg_all += '0';
                        dvt_all += ' ';
                    }
                    
                    tt_all += _obj.THANH_TIEN.toFixed(2);
                        tongtienbn+=  nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN);
                        if (_index < $scope.chitietthanhtoan.length - 1) {
                            sl_all +=';';
                            dg_all += ';';
                            nd_all += ';';
                            tt_all += ';';
                            dvt_all+=';';    
                        }
                    })
                } else  {
                    $scope.chitietthanhtoan.forEach(function(_obj,_index) {
                    nd_all += escapeXml(_obj.NOIDUNG);
                    sl_all += '0';
                    dg_all += '0';
                    tt_all += _obj.THANH_TIEN.toFixed(2);
                    tongtienbn+=  _obj.THANH_TIEN;
                    
                    if (_index < $scope.chitietthanhtoan.length - 1) {
                        sl_all +=';';
                        dg_all += ';';
                        nd_all += ';';
                        tt_all += ';';
                        dvt_all += '; ';
                    } else {
                        if ($scope.thongtinthanhtoan.hienthistg==1) {
                            nd_all+=';Mã khách hàng '+ $scope.thongtinbn.MA_BENH_NHAN
                            sl_all += ';0';
                            dg_all += ';0';
                            dvt_all += '; ';
                    }
                    }
                })
                }
                
                if ($scope.thongtinthanhtoan.dvtt != 96977 && $scope.chitietthanhtoan.length > 5) {
                    nd_all = '';
                    sl_all = '';
                    dg_all = '';
                    tt_all = '';
                    dvt_all = '';
                    tongtienbn = 0;
                    $scope.chitietthanhtoan.forEach(function(_obj) {
                        switch(_obj.GHI_CHU) {
                            case 'CONGKHAM':
                                arr[0] = (arr[0] == undefined? 0: arr[0]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                                break;
                            case 'XETNGHIEM':
                                arr[1] = (arr[1] == undefined? 0: arr[1]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                                break;
                            case 'CHANDOANHINHANH':
                                arr[2] = (arr[2] == undefined? 0: arr[2]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                                break;
                            case 'THUTHUATPHAUTHUAT':
                                arr[3] = (arr[3] == undefined? 0: arr[3]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                                break;
                            default:
                                arr[4] = (arr[4] == undefined? 0: arr[4]) + (Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN));
                                break;    
                        }
                        tongtienbn+=  Number(nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN);
                        })
                }
            } else {
                $scope.chitietthanhtoan.forEach(function(_obj) {
                switch(_obj.GHI_CHU) {
                    case 'CONGKHAM':
                        arr[0] = (arr[0] == undefined? 0: arr[0]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 'XETNGHIEM':
                        arr[1] = (arr[1] == undefined? 0: arr[1]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 'CHANDOANHINHANH':
                        arr[2] = (arr[2] == undefined? 0: arr[2]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 'THUTHUATPHAUTHUAT':
                        arr[3] = (arr[3] == undefined? 0: arr[3]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    default:
                        arr[4] = (arr[4] == undefined? 0: arr[4]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;    
                }
                tongtienbn+=  nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN;
                console.log("tongtienbn",tongtienbn,_obj)
                })
            }
            
            console.log("nguoibenh",nguoibenh)
            console.log("tongtienbn",tongtienbn)
            baohiemchi = sumData($scope.chitietthanhtoan, 'THANH_TIEN') - $scope.thongtinthanhtoan.sotientt;
        } else if($scope.thongtinbn.LOAIVP == 'NTDICHVU')
        {
            nd_all = "Thu tiền dịch vụ";
            tt_all = 0;
            $scope.chitietthanhtoan.forEach(function(_obj) {
                tt_all += Number(_obj.NGUOI_BENH);
                tongtienbn+=  _obj.THANH_TIEN;
            })
            baohiemchi = 0;
            tilebhyt = 0;
        } else if ($scope.thongtinbn.LOAIVP == 'HDBL') {
            var temp = data.data.noidung.split(';');
            temp.forEach(function(value,index) {
                var ndsplit = value.split("_!!!_")
                nd_all+=ndsplit[0];
                sl_all += ndsplit[2];
                dg_all += ndsplit[3];
                dvt_all += ndsplit[1];
                tt_all += ndsplit[4];
                if (index < temp.length - 1) {
                    sl_all +=';';
                    dg_all += ';';
                    nd_all += ';';
                    tt_all += ';';
                    dvt_all += ';';
                }

            })
            $scope.chitietthanhtoan.forEach(function(_obj) {
                tongtienbn+=  Number(_obj.THANH_TIEN);
            })
            baohiemchi = 0;
            tilebhyt = 0;
            $scope.thongtinbn['load']['TEN_DANTOC'] = 'Kinh';
            tendonvi = $scope.hoadonle.tendonvi;
            masothue = $scope.hoadonle.masothue;
            sodienthoai = $scope.hoadonle.sodienthoai;
            if($scope.hoadonle.dantoc != undefined) {

                $scope.thongtinbn['load']['TEN_DANTOC'] = $scope.hoadonle.dantoc.trim() == ''? 'Kinh': $scope.hoadonle.dantoc; 
            }
            paymentmethod =  $scope.thongtinbn.hinhthucthanhtoan;
            
        } else {
            if ($scope.thongtinthanhtoan.hienthistg == 1) {
                $scope.chitietthanhtoan.forEach(function(_obj) {
                    switch(_obj.UU_TIEN_IN) {
                        case 1:
                            if(_obj.NOIDUNG == 'Công khám') {
                                arr[0] = (arr[0] == undefined? 0: arr[0]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                            } else {
                                arr[1] = (arr[1] == undefined? 0: arr[1]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                            }
                            
                            break;
                        case 2:
                            arr[2] = (arr[2] == undefined? 0: arr[2]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                            break;
                        case 3:
                            arr[3] = (arr[3] == undefined? 0: arr[3]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                            break;
                        case 4:
                            arr[4] = (arr[4] == undefined? 0: arr[4]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                            break;
                        default:
                            arr[5] = (arr[5] == undefined? 0: arr[5]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                            break;    
                    }
                    tongtienbn+=  nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN;
                })
                baohiemchi = nguoibenh == 1?0:sumData($scope.chitietthanhtoan, 'THANH_TIEN') - $scope.thongtinthanhtoan.sotientt;
            } else {
            noitru = " và ngày giường"
            $scope.chitietthanhtoan.forEach(function(_obj) {
                switch(_obj.UU_TIEN_IN) {
                    case 1:
                        arr[0] = (arr[0] == undefined? 0: arr[0]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 2:
                        arr[1] = (arr[1] == undefined? 0: arr[1]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 3:
                        arr[2] = (arr[2] == undefined? 0: arr[2]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 4:
                        arr[3] = (arr[3] == undefined? 0: arr[3]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    default:
                        arr[4] = (arr[4] == undefined? 0: arr[4]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;    
                }
                tongtienbn+=  nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN;
            })
            baohiemchi = nguoibenh == 1?0:sumData($scope.chitietthanhtoan, 'THANH_TIEN') - $scope.thongtinthanhtoan.sotientt;
        }
        }
        if ($scope.thongtinthanhtoan.hoadonchitiet != 1 || 
                ($scope.thongtinthanhtoan.hoadonchitiet == 1 &&  $scope.thongtinbn.LOAIVP != 'THUPHI')
                ||  ($scope.thongtinthanhtoan.hoadonchitiet == 1 &&  $scope.thongtinbn.LOAIVP == 'THUPHI'
                    && $scope.thongtinthanhtoan.dvtt != 96977 && $scope.chitietthanhtoan.length > 5)
                ) {
            var temp = 1;   
            if($scope.thongtinthanhtoan.hienthistg == 1) {
            for (var i = 0; i < arr.length; i++) {
               switch(i) {
                   case 0:
                       if(arr[0] != undefined) {
                           nd_all += escapeXml("Công khám" + noitru);
                               sl_all += '1';
                               dg_all += arr[0].toFixed(2);
                               dvt_all += 'Lần';
                               tt_all += arr[0].toFixed(2);
                               temp++;
                           }

                           break;
                       case 1:
                           if (arr[1] != undefined) {
                               tt_all += arr[1].toFixed(2);
                               nd_all += escapeXml("Giường bệnh");
                               sl_all += '1';
                               dg_all += arr[1].toFixed(2);
                               dvt_all += 'Lần';
                               temp++;
                           }

                           break;
                       case 2:
                           if (arr[2] != undefined) {
                               tt_all += arr[2].toFixed(2);
                               nd_all += escapeXml("Xét nghiệm");
                               sl_all += '1';
                               dg_all += arr[2].toFixed(2);
                               dvt_all += 'Lần';
                               temp++;
                           }

                           break;
                       case 3:
                           if (arr[3] != undefined) {
                               tt_all += arr[3].toFixed(2);
                               nd_all += escapeXml("Chẩn đoán hình ảnh và TDCN");
                               sl_all += '1';
                               dg_all += arr[3].toFixed(2);
                               dvt_all += 'Lần';
                               temp++;
                           }

                           break;
                       case 4:
                           if (arr[4] != undefined) {
                               tt_all += arr[4].toFixed(2);
                               nd_all += escapeXml("Thủ thuật phẫu thuật");
                               sl_all += '1';
                               dg_all += arr[4].toFixed(2);
                               dvt_all += 'Lần';
                           }

                           break;    
                        case 5:
                           if (arr[5] != undefined) {
                               tt_all += arr[5].toFixed(2);
                               nd_all += escapeXml("Thuốc, vật tư và chi phí khác");
                               sl_all += '1';
                               dg_all += arr[5].toFixed(2);
                               dvt_all += 'Lần';
                           }

                           break;   
                   }
                   if (i < arr.length - 1) {
                       if (arr[i] != undefined) {
                           sl_all +=';';
                            dg_all += ';';
                            nd_all += ';';
                            tt_all += ';';
                            dvt_all += ';';
                       }

                   }else {
                        if ($scope.thongtinbn.LOAIVP == 'NOITRU') {
                            nd_all+=';Mẫu số 02/BV số bệnh án '+ $scope.thongtinbn.SOBENHAN
                            sl_all += ';0';
                            dg_all += ';0';
                            dvt_all += '; ';
                        }
                        if ($scope.thongtinbn.LOAIVP == 'BANT') {
                            nd_all+=';Mã khách hàng '+ $scope.thongtinbn.MA_BENH_NHAN
                            sl_all += ';0';
                            dg_all += ';0';
                            dvt_all += '; ';
                        }
                    }
               }
            } else {
                for (var i = 0; i < arr.length; i++) {
                   switch(i) {
                       case 0:
                           if(arr[0] != undefined) {
                               nd_all += escapeXml("Công khám" + noitru);
                           sl_all += '0';
                           dg_all += '0';
                               dvt_all += ' ';
                           tt_all += arr[0].toFixed(2);
                           temp++;
                       }

                       break;
                   case 1:
                       if (arr[1] != undefined) {
                           tt_all += arr[1].toFixed(2);
                           nd_all += escapeXml("Xét Nghiệm");
                           sl_all += '0';
                           dg_all += '0';
                               dvt_all += ' ';
                           temp++;
                       }

                       break;
                   case 2:
                       if (arr[2] != undefined) {
                           tt_all += arr[2].toFixed(2);
                           nd_all += escapeXml("Chẩn đoán hình ảnh và TDCN");
                           sl_all += '0';
                           dg_all += '0';
                               dvt_all += ' ';
                           temp++;
                       }

                       break;
                   case 3:
                       if (arr[3] != undefined) {
                           tt_all += arr[3].toFixed(2);
                           nd_all += escapeXml("Thủ thuật phẫu thuật");
                           sl_all += '0';
                           dg_all += '0';
                               dvt_all += ' ';
                           temp++;
                       }

                       break;
                   case 4:
                       if (arr[4] != undefined) {
                           tt_all += arr[4].toFixed(2);
                           nd_all += escapeXml("Thuốc, vật tư và chi phí khác");
                           sl_all += '0';
                           dg_all += '0';
                               dvt_all += ' ';
                       }

                       break;    
               }
               if (i < arr.length - 1) {
                   if (arr[i] != undefined) {
                       sl_all +=';';
                   dg_all += ';';
                   nd_all += ';';
                   tt_all += ';';
                           dvt_all += ';';
                   }

               }
           }
       }
                }
        if ( ['NOITRU','BANT'].indexOf($scope.thongtinbn.LOAIVP) == 0 && $scope.chitietthanhtoan.length < 6 && $scope.thongtinthanhtoan.hienthichitietnoitru ==1) {
            nd_all = '';
            sl_all = '';
            dg_all = '';
            tt_all = '';
            dvt_all = '';
            tongtienbn = 0;
            $scope.chitietthanhtoan.forEach(function(_obj,_index) {
                nd_all += escapeXml(_obj.NOIDUNG);
                sl_all += '0';
                dg_all += '0';
                dvt_all+= ' '
                tt_all += _obj.THANH_TIEN.toFixed(2);
                tongtienbn+=  nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN);
                if (_index < $scope.chitietthanhtoan.length - 1) {
                    sl_all +=';';
                    dg_all += ';';
                    nd_all += ';';
                    tt_all += ';';
                    dvt_all +=';';        
                }
            })
        }
        var d = new Date();
        var n = d.getTime();
        var arisingdate = parseDateToString($scope.thongtinthanhtoan.ngaythu);
        var key =  $scope.thongtinthanhtoan.dvtt+"-"+n + "-" + arisingdate.replace("-","") + "-" + $scope.thongtinbn.MA_BENH_NHAN + "-" + $scope.thongtinbn.SOVAOVIEN;

        var url = "cmu_taohoadon_invoice";   
        data.data['KEY_HD'] = key; 
        var dt =  $scope.thongtinbn['load'].TEN_DANTOC == undefined? 'Kinh': $scope.thongtinbn['load'].TEN_DANTOC;
        if($scope.thongtinthanhtoan.hoadonchitiet == 1 && $scope.thongtinthanhtoan.dvtt == 96977) {
            if($scope.thongtinbn.LOAIVP == 'HDBL') {
                dt = ' ';
            } else {
                if($scope.thongtinbn.LOAIVP == 'NOITRU') {
                    var d = new Date();
                    var n = d.getFullYear();
                    dt =n - $scope.thongtinbn.NAMSINH
                } else {
                    dt = $scope.thongtinbn['load'].TUOI
                }
                
            }
            
        }
        if(tongtienbn.toFixed() == 0 || $scope.thongtinthanhtoan.sotientt.toFixed() == 0) {
            alert("Không được phát hành hóa đơn số tiền bằng không, Nếu có lỗi xảy ra vui lòng phát hành lại.")
            return false;
	}
        if ($scope.thongtinthanhtoan.tmiengiam == true) {
            tongtienbn = Number($scope.thongtinthanhtoan.sotienbntra);
        }
        if (vat != '-1') {
            vatAmount = Number(tongtienbn)*Number(vat)/100;
            vatAmount  =vatAmount.toFixed();
        }
        if ($scope.thongtinthanhtoan.hienthistg== 1) {
            if($scope.thongtinbn.LOAIVP == 'BHYT') {
                sl_all ='1';
                dg_all = $scope.thongtinthanhtoan.tmiengiam == true? $scope.thongtinthanhtoan.sotienbntra.toFixed():$scope.thongtinthanhtoan.sotientt.toFixed();
                nd_all = ' Thu '+ (100 - Number($scope.thongtinbn.load.TYLEBAOHIEM)) + "% mẫu số 01/BV mã khách hàng "+$scope.thongtinbn.MA_BENH_NHAN;
                tt_all = $scope.thongtinthanhtoan.tmiengiam == true? $scope.thongtinthanhtoan.sotienbntra.toFixed():$scope.thongtinthanhtoan.sotientt.toFixed();
                dvt_all = 'Lần';
            }
            if ($scope.thongtinbn.LOAIVP == 'BANT' && $scope.thongtinbn.load.TYLEBAOHIEM > 0) {
                sl_all ='1';
                dg_all = $scope.thongtinthanhtoan.tmiengiam == true? $scope.thongtinthanhtoan.sotienbntra.toFixed():$scope.thongtinthanhtoan.sotientt.toFixed();
                nd_all = ' Thu '+ (100 - Number($scope.thongtinbn.load.TYLEBAOHIEM)) + "% mẫu số 01/BV mã khách hàng "+$scope.thongtinbn.MA_BENH_NHAN;
                tt_all = $scope.thongtinthanhtoan.tmiengiam == true? $scope.thongtinthanhtoan.sotienbntra.toFixed():$scope.thongtinthanhtoan.sotientt.toFixed();
                dvt_all = 'Lần';
            }
            if($scope.thongtinbn.LOAIVP == 'NOITRU' && $scope.thongtinbn.load.TYLEBAOHIEM > 0) {
                sl_all ='1';
                dg_all = $scope.thongtinthanhtoan.tmiengiam == true? $scope.thongtinthanhtoan.sotienbntra.toFixed():$scope.thongtinthanhtoan.sotientt.toFixed();
                nd_all = ' Thu '+ (100 - Number($scope.thongtinbn.load.TYLEBAOHIEM)) + "% mẫu số 02/BV số bệnh án "+$scope.thongtinbn.load.SOBENHAN;
                tt_all = $scope.thongtinthanhtoan.tmiengiam == true? $scope.thongtinthanhtoan.sotienbntra.toFixed():$scope.thongtinthanhtoan.sotientt.toFixed();
                dvt_all = 'Lần';
            }
        }
        var diachi = ' ';
        var gioitinh =' ';
        var sothebaohiem = ' ';
        var tuoi =  ' ';
        if($scope.thongtinbn.load !== undefined)  {
            diachi = $scope.thongtinbn.load.DIACHI == undefined? ' ': $scope.thongtinbn.load.DIACHI;
            gioitinh = $scope.thongtinbn.GIOI_TINH == 0 || $scope.thongtinbn.load.GIOITINH == 0? "Nữ": "Nam";
            sothebaohiem = $scope.thongtinbn.load.SOBAOHIEMYTE == undefined? ' ': $scope.thongtinbn.load.SOBAOHIEMYTE
            tuoi = $scope.thongtinbn.load.TUOI == undefined? ' ': $scope.thongtinbn.load.TUOI
        }
        return $.post(url, {
                    id: data.data.ID,
                    key: key,
                    account: $scope.thongtinthanhtoan.account,
                    acpass: $scope.thongtinthanhtoan.acpass,
                    username: $scope.thongtinthanhtoan.username,
                    password: $scope.thongtinthanhtoan.password,
                    publishservice: $scope.thongtinthanhtoan.publishservice,
                    pattern: $scope.thongtinthanhtoan.pattern,
                    serial: $scope.thongtinthanhtoan.serial,

                    ma_bn: escapeXml($scope.thongtinbn.MA_BENH_NHAN + ''),
                    ten_bn: escapeXml($scope.thongtinbn.TEN_BENH_NHAN+''),
                    diachi: escapeXml(diachi+''),
                    paymethod: paymentmethod == undefined? 'Tiền mặt':paymentmethod,

                    nd_all: nd_all,
                    sl_all: sl_all,
                    dg_all: dg_all,
                    tt_all: tt_all,
                    dvt_all: dvt_all,
                    
                    total: $scope.thongtinthanhtoan.sotientt.toFixed(),
                    arisingdate: arisingdate,
                    dantoc: dt,
                    tuoi: tuoi,
                    gioitinh: gioitinh,
                    tenKhoa: $scope.thongtinbn.TEN_PHONGBAN,
                    thebhyt: sothebaohiem,
                    tilebhyt: tilebhyt == undefined? '0':tilebhyt,
                    baohiemchi: baohiemchi.toFixed(),
                    tongtienbn: tongtienbn.toFixed(),
                    tendonvi: tendonvi,
                    masothue: masothue,
                    sodienthoai: sodienthoai,
                    vat: vat,
                    vatAmount: vatAmount

                });
        
    }
    
    this.thanhtoanhddt = function($scope,data) {
        var url = "thanhtoan_invoice";
        return $.post(url, {
            id: data.data.ID,
            ma_bn: data.data.MA_BN,
            account: $scope.thongtinthanhtoan.account,
            acpass: $scope.thongtinthanhtoan.acpass,
            username: $scope.thongtinthanhtoan.username,
            password: $scope.thongtinthanhtoan.password,
            key_hd: data.data.KEY_HD,
            businessservice: $scope.thongtinthanhtoan.businessservice,
            arisingdate: c_string_formatdate(data.data.NGAYTHUVIENPHI)
        });
    }
    
    
    this.capnhatsobienlai = function($scope,stt_lantt,sohoadon,keyhd) {
        return this.postData("cmu_post", [{
                param:'url',
                data: [
                    $scope.thongtinthanhtoan.dvtt,
                    stt_lantt,
                    $scope.thongtinbn.SOVAOVIEN,
                    sohoadon,
                    $scope.thongtinbn.LOAIVP,
                   keyhd,
                    'CMU_UPDATE_SOHOADON'
                ]
            }])
    }
    
    this.capnhathoadonhuy = function(item) {
        console.log("lantt ", item)
        this.postData("cmu_post", [{
                param:'url',
                data: [
                    item.dvtt,
                    item.stt_lantt,
                    item.key_hd,
                    item.sovaovien,
                    'CMU_INSERT_HUYHD'
                ]
            }])
    }
    
    this.layidhdt = function($scope) {
        var noitru = 1;
        if ($scope.thongtinbn.LOAIVP == 'BHYT' || $scope.thongtinbn.LOAIVP == 'THUPHI') {
            noitru = 0
        }
        if ($scope.thongtinbn.LOAIVP == 'HDBL') {
            noitru = -2
        }
        return this.postData("cmu_post", 
            [{
                param:'url',
                data: [
                    $scope.thongtinthanhtoan.dvtt,
                    $scope.thongtinbn.SOVAOVIEN,
                    $scope.thongtinthanhtoan.STT_LANTT,
                    $scope.thongtinbn.SOVAOVIEN,
                    $scope.thongtinbn.SOVAOVIEN_DT == undefined? 0:$scope.thongtinbn.SOVAOVIEN_DT,
                    noitru,
                    'CMU_LAYID_HDDT'
                ]
            }])
    }
    
    this.capnhathoadonphathanh = function($scope) {
        return this.postData("cmu_post", 
            [{
                param:'url',
                data: [
                    $scope.thongtinthanhtoan.dvtt,
                    $scope.thongtinthanhtoan.key_hd,
                    $scope.thongtinthanhtoan.STT_LANTT,
                    'CMU_CAPNHAT_HD_LANTTHUY'
                ]
            }])
    }
    
    
    this.xoahddtchuaphathanh = function($scope) {
        return this.postData("cmu_post", [{
                param:'url',
                data: [
                    $scope.thongtinthanhtoan.dvtt,
                    $scope.thongtinthanhtoan.STT_LANTT,
                    $scope.thongtinbn.SOVAOVIEN,
                    $scope.thongtinbn.SOVAOVIEN_NOI,
                    $scope.thongtinbn.SOVAOVIEN_DT,
                   $scope.thongtinbn.SOPHIEUTHANHTOAN,
                    'CMU_XOAHDDT_CPH'
                ]
            }])
    }
    
    this.getPattern = function(dvtt,maquyenbienlai) {
        return  this.getData("cmu_getlist",
                        [   
                            dvtt,
                            maquyenbienlai,'CMU_LAY_PATTERN'
                        ]
                    )
    }
    
    
    this.huyphathanhhoad = function($scope,data) {
        var url = "huyphathanh_invoice";
        return $.post(url, {
                id: data.data.ID,
                ma_bn: data.data.MA_BN,
                account: $scope.thongtinthanhtoan.account,
                acpass: $scope.thongtinthanhtoan.acpass,
                username: $scope.thongtinthanhtoan.username,
                password: $scope.thongtinthanhtoan.password,
                key_hd: data.data.KEY_HD,
                businessservice: $scope.thongtinthanhtoan.businessservice,
                arisingdate: c_string_formatdate(data.data.NGAYTHUVIENPHI)
            });
    }
    this.huythanhtoanhddt = function($scope,data) {
        var url = "huythanhtoan_invoice";
        return $.post(url, {
            id: data.data.ID,
             ma_bn: data.data.MA_BN,
             account: $scope.thongtinthanhtoan.account,
             pass: $scope.thongtinthanhtoan.password,
             acpass: $scope.thongtinthanhtoan.acpass,
             username: $scope.thongtinthanhtoan.username,
             password: $scope.thongtinthanhtoan.password,
             key_hd: data.data.KEY_HD,
             businessservice: $scope.thongtinthanhtoan.businessservice,
             arisingdate: c_string_formatdate(data.data.NGAYTHUVIENPHI)
        });
    }
    
    this.chuyendoihoadon = function($scope,data,nguoichuyendoi) {
        var url = "cmu_chuyendoihoadon?username=" + $scope.thongtinthanhtoan.username + "&password="
                                                + $scope.thongtinthanhtoan.password + "&key_hd=" 
                                                + data.data.KEY_HD + "&businessservice=" 
                                                + $scope.thongtinthanhtoan.portalservice
                                                + '&nguoichuyendoi='+ nguoichuyendoi   ;
       $(location).attr('href', url);
    }
    
    this.showLoading = function($mdDialog) {
        return $mdDialog.show({
                                     multiple: false,
                                     skipHide: true,
                                    templateUrl: 'loading.html',
                                    parent: angular.element(document.body),
                                    clickOutsideToClose:false
                                  })
    }
    this.hideLoading = function($mdDialog) {
        $mdDialog.hide();
    }
    
    this.inphieuhoanung = function($scope,stt_lantt) {
        var arr = [$scope.thongtinthanhtoan.dvtt, 
                    $scope.thongtinbn.STT_BENHAN,
                    stt_lantt,
                    $scope.thongtinthanhtoan.sotienthoilai, 
                    $scope.thongtinbn.STT_DOTDIEUTRI, 
                    new Intl.NumberFormat("en-US").format($scope.thongtinthanhtoan.sotienthoilai),
                    $scope.thongtinthanhtoan.tennhanvien, "NOP",'0','0'];
        var url = "noitru_inphieuhoanung?url=" + c_convert_to_string(arr);
        $(location).attr('href', url);
    }
    
    this.inapphoadon = function($scope,chitietthanhtoan,ngaythu,data,sohoadon) {
        var nguoibenh = $("#cmu_ctlaynguoibenh").val()
        var nd_all = '';
        var sl_all = '';
        var dg_all = '';
        var tt_all = '';
        var arr = [];
        var noitru = "";
        var tilebhyt = $scope.thongtinbn.load.TYLEBAOHIEM;
        var baohiemchi = 0;
        var tongtienbn = 0;
        var chitiethd = '';
        if ($scope.thongtinbn.LOAIVP == 'BHYT' || $scope.thongtinbn.LOAIVP == 'THUPHI') {
            
            if($scope.thongtinthanhtoan.hoadonchitiet == 1 &&  $scope.thongtinbn.LOAIVP == 'THUPHI') {
                $scope.chitietthanhtoan.forEach(function(_obj,_index) {
                    nd_all += escapeXml(_obj.NOIDUNG);
                    sl_all += '0';
                    dg_all += '0';
                    tt_all += _obj.THANH_TIEN.toFixed(2);
                    tongtienbn+=  _obj.THANH_TIEN;
                    if (_index < $scope.chitietthanhtoan.length - 1) {
                        sl_all +=';';
                        dg_all += ';';
                        nd_all += ';';
                        tt_all += ';';

                    }
                })
            } else {
                chitietthanhtoan.forEach(function(_obj) {
                switch(_obj.GHI_CHU) {
                    case 'CONGKHAM':
                        arr[0] = (arr[0] == undefined? 0: arr[0]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 'XETNGHIEM':
                        arr[1] = (arr[1] == undefined? 0: arr[1]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 'CHANDOANHINHANH':
                        arr[2] = (arr[2] == undefined? 0: arr[2]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 'THUTHUATPHAUTHUAT':
                        arr[3] = (arr[3] == undefined? 0: arr[3]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    default:
                        arr[4] = (arr[4] == undefined? 0: arr[4]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;    
                }
                tongtienbn+=  nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN;
                })
            }        
            
            baohiemchi = sumData($scope.chitietthanhtoan, 'THANH_TIEN') - $scope.thongtinthanhtoan.sotientt;
        } else if($scope.thongtinbn.LOAIVP == 'NTDICHVU')
        {
            nd_all = "Thu tiền dịch vụ";
            tt_all = 0;
            chitietthanhtoan.forEach(function(_obj) {
                tt_all += Number(_obj.NGUOI_BENH);
                tongtienbn+=  _obj.THANH_TIEN;
            })
            baohiemchi = 0;
            tilebhyt = 0;
        } else if ($scope.thongtinbn.LOAIVP == 'HDBL') {
            nd_all = data.data.noidung;
            chitietthanhtoan.forEach(function(_obj) {
                tt_all += Number(_obj.NGUOI_BENH);
                tongtienbn+=  Number(_obj.THANH_TIEN);
            })
            baohiemchi = 0;
            tilebhyt = 0;
        } else {
            noitru = " và ngày giường"
            chitietthanhtoan.forEach(function(_obj) {
                switch(_obj.UU_TIEN_IN) {
                    case 1:
                        arr[0] = (arr[0] == undefined? 0: arr[0]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 2:
                        arr[1] = (arr[1] == undefined? 0: arr[1]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 3:
                        arr[2] = (arr[2] == undefined? 0: arr[2]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    case 4:
                        arr[3] = (arr[3] == undefined? 0: arr[3]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;
                    default:
                        arr[4] = (arr[4] == undefined? 0: arr[4]) + (nguoibenh == 1?Number(_obj.NGUOI_BENH):Number(_obj.THANH_TIEN));
                        break;    
                }
                tongtienbn+=  nguoibenh == 1?_obj.NGUOI_BENH:_obj.THANH_TIEN;
            })
            baohiemchi = nguoibenh == 1?0:sumData($scope.chitietthanhtoan, 'THANH_TIEN') - $scope.thongtinthanhtoan.sotientt;
        }
        if ($scope.thongtinthanhtoan.hoadonchitiet != 1 || ($scope.thongtinthanhtoan.hoadonchitiet == 1 &&  $scope.thongtinbn.LOAIVP != 'THUPHI')) {
            var temp = 1;   
            for (var i = 0; i < arr.length; i++) {
               switch(i) {
                   case 0:
                       if(arr[0] != undefined) {
                           nd_all += escapeXml("Công khám" + noitru);
                           sl_all += '0';
                           dg_all += '0';
                           tt_all += arr[0].toFixed(2);
                           chitiethd="|"+escapeXml("Công khám" + noitru)+"|null|null|null|";
                           chitiethd+=arr[0].toFixed(2);
                           temp++;
                       }

                       break;
                   case 1:
                       if (arr[1] != undefined) {
                           tt_all += arr[1].toFixed(2);
                           nd_all += escapeXml("Xét Nghiệm");
                           sl_all += '0';
                           dg_all += '0';
                           chitiethd="|"+escapeXml("Xét Nghiệm")+"|null|null|null|";
                           chitiethd+=arr[1].toFixed(2);
                           temp++;
                       }

                       break;
                   case 2:
                       if (arr[2] != undefined) {
                           tt_all += arr[2].toFixed(2);
                           nd_all += escapeXml("Chẩn đoán hình ảnh và TDCN");
                           sl_all += '0';
                           dg_all += '0';
                           chitiethd="|"+escapeXml("Chẩn đoán hình ảnh và TDCN")+"|null|null|null|";
                           chitiethd+=arr[2].toFixed(2);
                           temp++;
                       }

                       break;
                   case 3:
                       if (arr[3] != undefined) {
                           tt_all += arr[3].toFixed(2);
                           nd_all += escapeXml("Thủ thuật phẫu thuật");
                           sl_all += '0';
                           dg_all += '0';
                           chitiethd="|"+escapeXml("Thủ thuật phẫu thuật")+"|null|null|null|";
                           chitiethd+=arr[3].toFixed(2);
                           temp++;
                       }

                       break;
                   case 4:
                       if (arr[4] != undefined) {
                           tt_all += arr[4].toFixed(2);
                           nd_all += escapeXml("Thuốc, vật tư và chi phí khác");
                           sl_all += '0';
                           dg_all += '0';
                           chitiethd="|"+escapeXml("Thuốc, vật tư và chi phí khác")+"|null|null|null|";
                           chitiethd+=arr[4].toFixed(2);
                       }

                       break;    
               }
               if (i < arr.length - 1) {
                   if (arr[i] != undefined) {
                   sl_all +=';';
                   dg_all += ';';
                   nd_all += ';';
                   tt_all += ';';
                   }

               }
           }
       }
    var filetxt = 'InHoaDonHDDT|'+$scope.thongtinthanhtoan.pattern+'|'+
                    $scope.thongtinthanhtoan.serial+'|'+$scope.thongtinthanhtoan.manv
                    +"|"+$scope.thongtinthanhtoan.tennhanvien + "|" 
                    + parseDateToString(ngaythu) + "|"
                    + parseDateToString(new Date()) + "|"     
                    +$scope.thongtinbn.load.SOBAOHIEMYTE + "|"
                    + $scope.thongtinbn.TEN_PHONGBAN +"|"+$scope.thongtinbn.MA_BENH_NHAN + "|" 
                    +$scope.thongtinbn.TEN_BENH_NHAN + "|"
                    +$scope.thongtinbn.load.DIACHI + "|"
                    +$scope.thongtinbn.load.TYLEBAOHIEM + "|"
                    +sohoadon+chitiethd;
    console.log("filetxt", filetxt)        
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(filetxt));
    element.setAttribute('download', 'web_app.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    }

    this.kiemtrahoadondatontai = function($scope,data) {
        return $.post('cmu_checkfkey', {
                    id: data.data.ID,
                    key: data.data.KEY_HD,
                    account: $scope.thongtinthanhtoan.username,
                    password: $scope.thongtinthanhtoan.password,
                    publishservice: $scope.thongtinthanhtoan.portalservice,
                   

                });
    }


});

