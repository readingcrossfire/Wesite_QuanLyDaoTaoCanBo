<%--
  Created by IntelliJ IDEA.
  User: Jerry
  Date: 4/5/14
  Time: 10:41 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Trang Chủ</title>
</head>
<style>
    body{
        margin: 0;
        padding: 0;
        background: rgb(2,0,36);
        background: linear-gradient(42deg, rgba(2,0,36,1) 0%, rgba(103,9,121,0.8158613787311799) 0%, rgba(0,185,255,1) 100%);
    }
    .header
    {
        font-size: 2rem;
        text-align: center;
        font-weight: 600;
        color: white;
    }
    .container{
        width: 100%;
        height: auto;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
    }

    .box{
        height: 50vh;
        width: 60vw;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-evenly;
        align-items: center;
    }

    a{
        text-decoration: none;
        color: #000;
    }
    .btn{
        width: 160px;
        height: 50px;
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        align-items: center;
        color: White;
        font-family: Verdana;
        font-size: 14px;
        font-weight: 600;
        padding: 5px 5px;
        border-radius: 5px;
    }
    .btn-primary{
        background-color: rgba(0,120,220, 0.5);
    }

</style>
<body>
<h1>
    <div class="header">
        <h1>Trang Chủ</h1>
    </div>

    <div class="container">
        <div class="box">
            <a href="/can-bo"><div class="btn btn-primary">Cán Bộ</div></a>
            <a href="/khoa-hoc"><div class="btn btn-primary">Khoá Học</div></a>
            <a href="/lop-hoc-vien"><div class="btn btn-primary">Lớp Học Viên</div></a>
            <a href="/ket-qua-khoa-hoc"><div class="btn btn-primary">Kết Quả Khoá Học</div></a>
        </div>
    </div>
</h1>
</body>
</html>
