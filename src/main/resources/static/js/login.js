$(function () {
    /**
     * 登陆与注册
     */
    //验证注册用户名是否重复/为空/小于4位
    $('.register-body .username').blur(function () {
        var username = $(this).val();
        var $message = $(this).next('.message');
        var nameReg = /^[\da-zA-Z]{6,}$/;
        //添加验证失败样式
        invalid($(this));
        //验证为空
        if (username.trim().length == 0) {
            $message.text('用户名不能为空');
        }
        //验证格式是否有误
        else if (!nameReg.test(username)) {
            $message.text('用户名由英文与数字组成且不小于6位');
        }
        //格式无误
        else {
            //异步验证是否存在同一用户名
            $.get('user/checkUserNameRepeat', 'username=' + username, function (data) {
                //可以使用
                if (data.toString() == "true") {
                    //添加验证成功样式
                    valid($(".register-body .username"));
                    $message.text('');
                } else {
                    $message.text('该用户名已存在');
                }
            })
        }
    })


    //验证注册密码是否为空或小于六位
    $('.register-body .password').blur(function () {
        var pwd = $(this).val();
        var $message = $(this).next('.message');
        //添加验证失败样式
        invalid($(this));
        //验证密码是否为空
        if (pwd.length == 0) {
            $message.text('密码不能为空');
        }
        //验证密码是否小于六位
        else if (pwd.length < 6) {
            $message.text('密码不能小于6位');
        }
        //验证成功
        else {
            valid($(this));
            $message.text('');
        }
    })
    //验证注册确认密码是否与密码一致
    $('.register-body .repwd').blur(function () {
        var pwd = $(this).val();
        var $message = $(this).next('.message');
        invalid($(this));
        //验证为空
        if (pwd.length == 0) {
            $message.text('确认密码不能为空');
        }
        //验证是否一致
        else if (pwd != $('.register-body .password').val()) {
            $message.text('两次密码输入不一致');
        }
        //验证成功
        else {
            valid($(this));
            $message.text('');
        }
    })

    //注册按钮事件
    $('.register-body .enter-button').click(function () {
        var register = false;
        //判断三个input样式是否都为.is-valid
        if ($(this).parents('.modal-body').find('.is-valid').length == 3) {
            register = true;
        }
        if (register) {
            //执行注册操作
            $.get("user/registerUser", "username=" + $(".register-body .username").val() +
                "&password=" + $(".register-body .password").val(), function (data) {
                if (data.toString() == "true") {
                    //注册成功
                    $("#register").modal('hide');

                    //显示注册成功弹窗
                    $("#message-modal .h-msg").text("注册成功");
                    $("#message-modal .p-msg").text("2秒后自动跳转至登录页")
                    $("#message-modal").modal('show');
                    setTimeout(function () {
                        //清除注册弹窗中的input
                        cleanInput();
                        //隐藏注册成功弹窗
                        $("#message-modal").modal('hide');
                        //显示登陆弹窗
                        $("#login").modal("show");
                    }, 2000)
                }
            })
        }
    })
    //取消按钮事件(登陆注册)
    $('.modal .cancel').click(function () {
        cleanInput();
    })

    function cleanInput() {
        //清空文本框样式与下方message
        $('.modal-body').find('input').removeClass('is-valid');
        $('.modal-body').find('input').removeClass('is-invalid');
        $('.modal-body').find('input').val('');
        $('.modal-body').find('.message').text('');
    }

    //验证登陆用户名为空/小于六位
    $('.login-body .username').blur(function () {
        var username = $(this).val();
        var $message = $(this).next('.message');
        var nameReg = /^[\da-zA-Z]{6,}$/;
        //添加验证失败样式
        invalid($(this));
        //验证为空
        if (username.trim().length == 0) {
            $message.text('用户名不能为空');
        }
        //验证格式是否有误
        else if (!nameReg.test(username)) {
            $message.text('用户名由英文与数字组成且不小于6位');
        }
        //格式无误
        else {
            //添加验证成功样式
            valid($(this));
            $message.text('');
        }
    })
    //验证登陆密码为空/小于六位
    $('.login-body .password').blur(function () {
        var pwd = $(this).val();
        var $message = $(this).next('.message');
        //添加验证失败样式
        invalid($(this));
        //验证密码是否为空
        if (pwd.length == 0) {
            $message.text('密码不能为空');
        }
        //验证密码是否小于六位
        else if (pwd.length < 6) {
            $message.text('密码不能小于6位');
        }
        //验证成功
        else {
            valid($(this));
            $message.text('');
        }
    })
    //登陆按钮事件
    $('.login-body .enter-button').click(function () {
        var login = false;
        //判断两个个input样式是否都为.is-valid
        if ($(this).parents('.modal-body').find('.is-valid').length == 2) {
            login = true;
        }
        if (login) {
            //执行登陆操作
            $.get("user/login", "username=" + $(".login-body .username").val() +
                "&password=" + $(".login-body .password").val(), function (data) {
                if (data.toString() == "1") {
                    //登陆成功
                    $("#login").modal('hide');
                    //显示登陆成功弹窗
                    $("#message-modal .h-msg").text("登陆成功");
                    $("#message-modal .p-msg").text("2秒后将刷新本页面")
                    $("#message-modal").modal('show');
                    setTimeout(function () {
                        //清除注册弹窗中的input
                        cleanInput();
                        //隐藏注册成功弹窗
                        $("#message-modal").modal('hide');
                        location.reload();
                    }, 2000)
                    return;
                }
                //保留用户名input value 清除密码input value
                $(".login-body .password").val("");
                if (data.toString() == "-1") {
                    //用户名不存在
                    invalid($(".login-body .username"));
                    $(".login-body .password").removeClass('is-valid');
                    $(".login-body .username").focus().next(".message").text("用户名不存在");
                }
                if (data.toString() == "0") {
                    //密码错误
                    invalid($(".login-body .password"));
                    $(".login-body .password").focus().next(".message").text("密码错误");
                }
            })
        }
    })

    /**
     * 登陆成功后点击用户名显示/隐藏user option
     */
    $(".login-user button").on("click", function () {
        $(".login-user .user-option").slideToggle(100);
    })

    //登出
    $(".login-user .user-option .logout").on("click", function () {
        $.get("user/logout", function () {
            //显示注销成功弹窗
            $("#message-modal .h-msg").text("注销成功");
            $("#message-modal .p-msg").text("2秒后将刷新本页面")
            $("#message-modal").modal('show');
            setTimeout(function () {
                //隐藏注册成功弹窗
                $("#message-modal").modal('hide');
                location.reload();
            }, 1500)
            return;
        })
    })

    //input添加验证成功样式
    function valid($selector) {
        $selector.removeClass('is-invalid');
        $selector.addClass('is-valid');
    }

    //input添加验证失败样式
    function invalid($selector) {
        $selector.removeClass('is-valid');
        $selector.addClass('is-invalid');
    }
})
