<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&display=swap"
            rel="stylesheet"/>
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
    <link rel="stylesheet" href="../template.css" />
    <title>Home</title>
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
        font-size: 16px;
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
                <span class="title"><a href="./trangchu.jsp">Quản lý đào tạo cán bộ</a></span>
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
        <div class="col-md-9 cColContent">
            <div class="theCourse">
                <!-- Tiêu đề của main content -->
                <span class="title">Quản lý khoá học</span>
                <div class="boxBorder boxFunction">
                    <button type="button" class="btn btn-primary">
                        <a href="them-khoa-hoc" style="text-decoration: none;color: white;">Thêm Khóa Học</a>
                    </button>
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
                <div class="boxBorder">
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên Khoá học</th>
                            <th scope="col">Thời gian bắt đầu</th>
                            <th scope="col">Thời gian kết thúc</th>
                            <th scope="col">Địa điểm</th>
                            <th scope="col">Dự toán</th>
                            <th scope="col">Duyệt</th>
                            <th scope="col">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody id="table-danh-sach-khoa-hoc">
                        <tbody>
                        <c:forEach var="itemResult" items="${ListResult}">
                            <tr>
                                <th scope="row">1</th>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>

                                    <div class="form-check">
                                        <label class="form-check-label">
                                            <input type="checkbox" class="form-check-input" value="">
                                        </label>
                                    </div>

                                </td>
                                <td>
                                    <div
                                            style="
                          display: flex;
                          flex-flow: row nowrap;
                          justify-content: space-evenly;
                          align-items: center;
                        "
                                    >
                                        <button>
                                            <a href="chi-tiet-khoa-hoc" style="color: black;"><i class="fas fa-align-justify fa-lg"></i></a>
                                        </button>
                                        <button >
                                            <a style="color: black;" href="cap-nhat-khoa-hoc"><i class="fas fa-pen-alt fa-lg"></i></a>
                                        </button>
                                        <button>
                                            <i class="fas fa-trash-alt fa-lg"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </c:forEach>
<%--                        <tr>--%>
<%--                            <th scope="row">1</th>--%>
<%--                            <td>Hồi Sức</td>--%>
<%--                            <td>2 tháng</td>--%>
<%--                            <td>Phòng 1 Khu A</td>--%>
<%--                            <td>2,000,000</td>--%>
<%--                            <td>--%>

<%--                                <div class="form-check">--%>
<%--                                    <label class="form-check-label">--%>
<%--                                        <input type="checkbox" class="form-check-input" value="">--%>
<%--                                    </label>--%>
<%--                                </div>--%>

<%--                            </td>--%>
<%--                            <td>--%>
<%--                                <div--%>
<%--                                        style="--%>
<%--                          display: flex;--%>
<%--                          flex-flow: row nowrap;--%>
<%--                          justify-content: space-evenly;--%>
<%--                          align-items: center;--%>
<%--                        "--%>
<%--                                >--%>
<%--                                    <button>--%>
<%--                                        <a href="./ChiTiet_Khoahoc.html" style="color: black;"><i class="fas fa-align-justify fa-lg"></i></a>--%>
<%--                                    </button>--%>
<%--                                    <button >--%>
<%--                                        <a style="color: black;" href="./Sua_KhoaHoc.html"><i class="fas fa-pen-alt fa-lg"></i></a>--%>
<%--                                    </button>--%>
<%--                                    <button>--%>
<%--                                        <i class="fas fa-trash-alt fa-lg"></i>--%>
<%--                                    </button>--%>
<%--                                </div>--%>
<%--                            </td>--%>
<%--                        </tr>--%>
<%--                        <tr>--%>
<%--                            <th scope="row">2</th>--%>
<%--                            <td>Gây Mê</td>--%>
<%--                            <td>2 tháng</td>--%>
<%--                            <td>Phòng 2 Khu A</td>--%>
<%--                            <td>3,000,000</td>--%>
<%--                            <td>--%>
<%--                                <div class="form-check">--%>
<%--                                    <label class="form-check-label">--%>
<%--                                        <input type="checkbox" class="form-check-input" value="">--%>
<%--                                    </label>--%>
<%--                                </div>--%>
<%--                            </td>--%>
<%--                            <td>--%>
<%--                                <div--%>
<%--                                        style="--%>
<%--                          display: flex;--%>
<%--                          flex-flow: row nowrap;--%>
<%--                          justify-content: space-evenly;--%>
<%--                          align-items: center;--%>
<%--                        "--%>
<%--                                >--%>
<%--                                    <button>--%>
<%--                                        <i class="fas fa-align-justify fa-lg"></i>--%>
<%--                                    </button>--%>
<%--                                    <button>--%>
<%--                                        <i class="fas fa-pen-alt fa-lg"></i>--%>
<%--                                    </button>--%>
<%--                                    <button>--%>
<%--                                        <i class="fas fa-trash-alt fa-lg"></i>--%>
<%--                                    </button>--%>
<%--                                </div>--%>
<%--                            </td>--%>
<%--                        </tr>--%>
<%--                        <tr>--%>
<%--                            <th scope="row">3</th>--%>
<%--                            <td>Gây Tê</td>--%>
<%--                            <td>2 tháng</td>--%>
<%--                            <td>Phòng 3 Khu A</td>--%>
<%--                            <td>3,000,000</td>--%>
<%--                            <td>--%>
<%--                                <div class="form-check">--%>
<%--                                    <label class="form-check-label">--%>
<%--                                        <input type="checkbox" class="form-check-input" value="">--%>
<%--                                    </label>--%>
<%--                                </div>--%>
<%--                            </td>--%>
<%--                            <td>--%>
<%--                                <div--%>
<%--                                        style="--%>
<%--                          display: flex;--%>
<%--                          flex-flow: row nowrap;--%>
<%--                          justify-content: space-evenly;--%>
<%--                          align-items: center;--%>
<%--                        "--%>
<%--                                >--%>
<%--                                    <button>--%>
<%--                                        <i class="fas fa-align-justify fa-lg"></i>--%>
<%--                                    </button>--%>
<%--                                    <button>--%>
<%--                                        <i class="fas fa-pen-alt fa-lg"></i>--%>
<%--                                    </button>--%>
<%--                                    <button>--%>
<%--                                        <i class="fas fa-trash-alt fa-lg"></i>--%>
<%--                                    </button>--%>
<%--                                </div>--%>
<%--                            </td>--%>
<%--                        </tr>--%>
<%--                        <tr>--%>
<%--                            <th scope="row">4</th>--%>
<%--                            <td>Băng Bó</td>--%>
<%--                            <td>2 tháng</td>--%>
<%--                            <td>Phòng 4 Khu A</td>--%>
<%--                            <td>3,000,000</td>--%>
<%--                            <td>--%>
<%--                                <div class="form-check">--%>
<%--                                    <label class="form-check-label">--%>
<%--                                        <input type="checkbox" class="form-check-input" value="">--%>
<%--                                    </label>--%>
<%--                                </div>--%>
<%--                            </td>--%>
<%--                            <td>--%>
<%--                                <div--%>
<%--                                        style="--%>
<%--                          display: flex;--%>
<%--                          flex-flow: row nowrap;--%>
<%--                          justify-content: space-evenly;--%>
<%--                          align-items: center;--%>
<%--                        "--%>
<%--                                >--%>
<%--                                    <button>--%>
<%--                                        <i class="fas fa-align-justify fa-lg"></i>--%>
<%--                                    </button>--%>
<%--                                    <button>--%>
<%--                                        <i class="fas fa-pen-alt fa-lg"></i>--%>
<%--                                    </button>--%>
<%--                                    <button>--%>
<%--                                        <i class="fas fa-trash-alt fa-lg"></i>--%>
<%--                                    </button>--%>
<%--                                </div>--%>
<%--                            </td>--%>
<%--                        </tr>--%>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<script

        src="https://code.jquery.com/jquery-3.6.0.js"
        integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk="
        crossorigin="anonymous"></script>
<script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-b5kHyXgcpbZJO/tY9Ul7kGkf1S0CWuKcCD38l8YkeH8z8QjE0GmW1gYU5S9FOnJ0"
        crossorigin="anonymous"
></script>

<script>
    $(document).ready(()=>{
        $.ajax({
            url:'danh-sach-khoa-hoc',
            method: 'GET',
        }).done((response)=>{
            console.log(response);
        });


        const tableDanhSachKhoaHoc=$("#table-danh-sach-khoa-hoc");

    })
    jAlert("${ListResult}");
</script>
</body>
</html>
