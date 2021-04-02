<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&display=swap"
            rel="stylesheet"
    />
    <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl"
            crossorigin="anonymous"
    />
    <link
            rel="stylesheet"
            href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
            integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
            crossorigin="anonymous"
    />
    <script src="http://code.jquery.com/jquery-1.12.0.min.js"></script>
    <link rel="stylesheet" href="../template.css" />
    <title>Thêm Khóa Học</title>
</head>
<style>
    *,
    html {
        padding: 0;
        margin: 0;
    }

    .cContainerFluid .cRow {
        height: 100vh;
        width: 100vw;
    }
    .cContainerFluid .cRow .cColNavbarLeft {
        border-right: 1px solid #0078dc;
    }
    .cContainerFluid .cRow .cColNavbarLeft__panelTitle {
        height: 50px;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        text-decoration: none;
    }
    .cContainerFluid .cRow .cColNavbarLeft__panelTitle .title {
        padding: 20px;
        text-decoration: none;
        font-family: "Noto Sans JP", sans-serif;
        font-size: 20px;
        font-weight: 500;
    }
    .cContainerFluid .cRow .cColNavbarLeft__panelTitle .title a {
        text-decoration: none;
        color: black;
    }
    .cContainerFluid .cRow .cColNavbarLeft__panelUser {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
    }
    .cContainerFluid .cRow .cColNavbarLeft__panelUser .avartar {
        height: 100px;
        width: 100px;
        border-radius: 50%;
        margin-right: 10px;
    }
    .cContainerFluid .cRow .cColNavbarLeft__panelUser .info {
        height: auto;
        width: auto;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-evenly;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .cContainerFluid .cRow .cColNavbarLeft__panelUser .info__item {
        height: 30px;
    }
    .cContainerFluid .cRow .cColNavbarLeft__panelUser .info__logout {
        height: 35px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        font-family: "Noto Sans JP", sans-serif;
        font-size: 16;
        font-weight: 400;
        color: whitesmoke;
        text-decoration: none;
        background-color: #0078dc;
        border-radius: 5px;
    }
    .cContainerFluid .cRow .cColNavbarLeft__panelMenu {
        height: auto;
        width: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        overflow-y: auto;
    }
    .cContainerFluid .cRow .cColNavbarLeft__panelMenu .menu-item {
        height: 40px;
        width: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        background-color: #0078dc;
        color: whitesmoke;
        text-decoration: none;
    }
    .cContainerFluid .cRow .cColContent .theCourse .title {
        height: 70px;
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        font-family: "Noto Sans JP", sans-serif;
        font-size: 40px;
        font-weight: 500;
    }
    .cContainerFluid .cRow .cColContent .theCourse .boxBorder {
        height: auto;
        width: 100%;
        display: block;
        border: 1px solid #0078dc;
        border-radius: 5px;
        padding: 10px;
        margin: 10px 0;
        overflow: auto;
    }
    .cContainerFluid .cRow .cColContent .theCourse .boxFunction {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
    }
    .cContainerFluid .cRow .cColContent .theCourse .boxFunction .boxSearch {
        height: 100%;
        width: auto;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
    }
    .cContainerFluid .cRow .cColContent .theCourse .boxFunction .boxSearch__input {
        margin-right: 10px;
    }
    .cContainerFluid .cRow .cColContent .theCourse .boxFunction .boxSearch__button {
        height: 40px;
        width: 150px;
    }


</style>
<body>
<div class="container-fluid cContainerFluid">
    <div class="row cRow">
        <div class="col-md-3 cColNavbarLeft">
            <!-- Tiêu đề của navbar left -->
            <div class="cColNavbarLeft__panelTitle">
                <span class="title"><a href="khoa-hoc">Quản lý đào tạo cán bộ</a></span>
            </div>
            <hr />
            <div class="cColNavbarLeft__panelUser">
                <img
                        src="https://via.placeholder.com/100x100   "
                        alt=""
                        class="avartar"
                />
                <!-- Hiển thị thông tin người dùng đăng nhập -->
                <div class="info">
                    <div class="info__item info__fullName">
                        <i class="fas fa-user"></i>
                        <span>Trần Hoài Đức</span>
                    </div>
                    <div class="info__item info__email">
                        <i class="fas fa-envelope"></i>
                        <span>ntnoc229@gmail.com</span>
                    </div>
                    <div class="info__item info__position">
                        <i class="fas fa-id-card"></i>
                        <span>Giám đốc</span>
                    </div>
                    <a href="" class="info__item info__logout">Đăng xuất</a>
                </div>
            </div>
            <hr />
            <!-- Danh sách menu -->
            <div class="cColNavbarLeft__panelMenu">
                <div class="list-group" style="width:100%;text-align: center;">
                    <button type="button" class="list-group-item list-group-item-action active" >
                        <a href="khoa-hoc" style="text-decoration: none;color: white;">Kế Hoạch Đào Tạo</a>
                    </button>
                    <button type="button" class="list-group-item list-group-item-action ">
                        <a href="can-bo" style="text-decoration: none;color: black;">Cán Bộ</a>
                    </button>
                    <button type="button" class="list-group-item list-group-item-action">
                        <a href="lop-hoc-vien" style="text-decoration: none;color: black;">Lớp Học Viên</a>
                    </button>
                    <button type="button" class="list-group-item list-group-item-action ">
                        <a href="ket-qua-khoa-hoc" style="text-decoration: none;color: black;">
                            Kết Quả Khóa Học</a>
                    </button>
                </div>
            </div>
        </div>
        <div class="col-md-8 cColContent">
            <div class="theCourse">
                <!-- Tiêu đề của main content -->
                <span class="title">Thêm Khóa Học</span>
                <div class="boxBorder boxFunction">
                    <div class="btn btn-primary"><a href="khoa-hoc"><i class="fa fa-angle-double-left" style="font-size:18px ; color: aliceblue;">Trở Lại</i></a></div>
                    <div class="boxSearch">
                        <input
                                type="email"
                                placeholder="Tìm kiếm"
                                class="form-control boxSearch__input"
                                id="exampleInputEmail1"
                                aria-describedby="emailHelp"
                        />
                        <button type="button" class="btn btn-primary boxSearch__button">
                            Tìm kiếm
                        </button>
                    </div>
                </div>
                <!-- khoa hoc -->
                <form action="/" id="form-them-khoahoc">
                    <div class="boxBorder">
                        <div class="form-group">
                            <label for="">Tên Khóa Học</label>
                            <input type="text"
                                   class="form-control" name="ten-khoahoc" id="" aria-describedby="helpId" placeholder="điền tên khóa học">

                            <label for="">Thời Gian Bắt Đầu</label>
                            <input type="datetime-local"
                                   class="form-control" name="thoi-gian-bat-dau" id="" aria-describedby="helpId" placeholder="chọn thời gian bắt đầu">

                            <label for="">Thời Gian Kết Thúc</label>
                            <input type="datetime-local"
                                   class="form-control" name="thoi-gian-ket-thuc" id="" aria-describedby="helpId" placeholder="chọn thời gian kết thúc">

                            <label for="">Địa Điểm</label>
                            <input type="text"
                                   class="form-control" name="dia-diem" id="" aria-describedby="helpId" placeholder="điền địa điểm">

                            <label for="">Dự Toán</label>
                            <input type="text"
                                   class="form-control" name="du-toan" id="" aria-describedby="helpId" placeholder="điền số tiền dự toán">
                        </div>

                    </div>
                    <div class="box-button">
                        <div class="btn btn-primary">Đồng Ý</div>
                    </div>
                </form>

            </div>
        </div>
    </div>
</div>

<script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0"
        crossorigin="anonymous">
    $(document).ready(function()
    {
        //khai báo biến submit form lấy đối tượng nút submit
        var submit = $("button[type='submit']");

        //khi nút submit được click
        submit.click(function()
        {
            //khai báo các biến dữ liệu gửi lên server
            var tenkhoahoc = $("input[name='ten-khoahoc']").val(); //lấy giá trị trong input user
            var thoigianbatdau = $("input[name='thoi-gian-bat-dau']").val();
            var thoigianketthuc = $("input[name='thoi-gian-ket-thuc']").val();
            var diadiem = $("input[name='dia-diem']").val();
            var dutoan = $("input[name='du-toan']").val();
            //Kiểm tra xem trường đã được nhập hay chưa
            if(tenkhoahoc == ''){
                alert('Vui lòng nhập Tên khóa học');
                return false;
            }
            if(thoigianbatdau == ''){
                alert('Vui lòng nhập thời gian bắt đầu');
                return false;
            }
            if(thoigianketthuc == ''){
                alert('Vui lòng nhập thời gian kết thúc');
                return false;
            }if(diadiem == ''){
                alert('Vui lòng nhập địa điểm');
                return false;
            }if(dutoan == ''){
                alert('Vui lòng nhập dự toán');
                return false;
            }

            //Lấy toàn bộ dữ liệu trong Form
            var data = $('form-them-khoahoc').serialize();
            $("form").on('submit', function (e) {
                e.preventDefault();
                //ajax call here
                $.ajax({
                    type : 'POST', //Sử dụng kiểu gửi dữ liệu POST
                    url : 'data.php', //gửi dữ liệu sang trang data.php
                    data : JSON.stringify({
                        tenkhoahoc:tenkhoahoc,
                        thoigianbatdau:thoigianbatdau,
                        thoigianketthuc:thoigianketthuc,
                        diadiem:diadiem,
                        dutoan:dutoan
                    }), //dữ liệu sẽ được gửi
                    success : function(data)  // Hàm thực thi khi nhận dữ liệu được từ server
                    {
                        if(data == 'false')
                        {
                            alert('thêm khóa học không thành công');
                        }else{
                            alert('thêm khóa học thành công');
                            //$('#content').html(data);// dữ liệu HTML trả về sẽ được chèn vào trong thẻ có id content
                        }
                    }
                });
                //stop form submission

            });
            //Sử dụng phương thức Ajax.

            return false;
        });
    });
</script>
</body>
</html>