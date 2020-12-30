$(function () {
    /**
     * 处理html font-size
     */
    var rem = 10;

    function setRem() {
        var clientWidth = $(window).width();
        rem = clientWidth / 1920 * 15;
        $('html').css('font-size', parseInt(rem) + 'px');
    }

    setRem();
    var setRemTimer;
    $(window).bind('resize', function () {
        clearTimeout(setRemTimer);
        setRemTimer = setTimeout(function () {
            setRem();
        }, 100);
    });

    /**
     * 点击时间切换页面
     */
    $('.datetime').click(function () {
        //清空搜索栏
        $('#search').val('').css({
            width: '30rem',
            opacity: "0.8"
        });
        //移除选中搜索框的样式
        $('#bgimg').removeClass('bgimgSelect');
        //隐藏搜索结果补全
        $('#languageList').html('');
        //每日一言隐藏
        $('.hitokoto').hide();

        //背景加/去模糊
        $('#bgimg').toggle();
        $('#bgimg2').toggle();
        //隐藏当前页 显示另一个页面
        $('.time_unclick').slideToggle('100');
        $('.time_click').slideToggle('100', function () {
            //placeholder="Search"
            $('#search').attr("placeholder", "Search");
        });
    })

    /**
     * 点击加号弹出添加界面
     */
        //点击的+号所在父级的index 用来处理点击同一个+号两次关闭添加界面
    var clickedIndex = -1;
    $('#urls_img').on('click', '.url-img', function (e) {
        //判断是否为+
        if ($(this).html().trim() == '+') {
            //判断用户是否登陆 --> 登陆后才可以保存
            if ($("#checkLoginInput").text() == "") {
                $("#message-modal .h-msg").text("登陆后方可保存");
                $("#message-modal .p-msg").text("2秒后前往登陆页面")
                $("#message-modal").modal('show');
                setTimeout(function () {
                    //隐藏注册成功弹窗
                    $("#message-modal").modal('hide');
                    //弹出登陆框
                    $("#login").modal('show');
                }, 2000)
                return;
            }
            //若点击同一个两次,向上隐藏
            if (clickedIndex == $(this).index()) {
                $('.add_url').slideUp(100);
                clickedIndex = -1;
                return;
            }
            clickedIndex = $(this).index();
            //判断是否点击同一个两次
            //设置弹出界面的top和left
            var topLength = e.clientY - 17 * rem;
            var leftLength = e.clientX - 12.6 * rem;
            $('.add_url').css({
                top: topLength + 'px',
                left: leftLength + 'px'
            }).slideDown(100, function () {
                //清空input内容
                $('.add_url .inputCustom').val('');
            });
        }
    })
    /**
     * 点击添加界面右上角的x关闭
     */
    $('.add_url #btnCloseFrmCusNav').click(function () {
        $('.add_url').slideUp(100);
        clickedIndex = -1;
    })
    /**
     * 添加界面中的input获取焦点时自动输入http://
     */
    $('.add_url #inputCustomUrl').focus(function () {
        if ($(this).val().trim() == '') {
            $(this).val('http://');
        }
    })

    // $("#urls_img img").one("error",function(){
    //     $(this).attr("src", "/favicon.ico");
    // })
    /**
     * 点击添加界面中的添加按钮
     */
    $('.add_url #btnAddCusNav').click(function () {
        var url = $('#inputCustomUrl').val();
        var imgUrl = url + "/favicon.ico";
        // 判断该路径下是否存在favicon.icon
        var hasIco = false;
        var ImgObj = new Image();
        ImgObj.src = imgUrl;
        ImgObj.onload=function(){
            //判断图片是否存在
            if (ImgObj.width != 0 && ImgObj.height != 0) {
                hasIco = true;
            }
        }
        // Image对象的onload执行完需要一段时间,若不设置计时器,hasIco则永远为false
        setTimeout(function(){
            if(!hasIco){
                imgUrl="/favicon.ico"
            }
            var title = $('#inputCustomTitle').val();
            //保存入数据库
            $.post("urls/addUrl", "url=" + url + "&title=" + title + "&img=" + imgUrl + "&userId=" + $("#checkLoginInput").text(), function (data) {
                if (data.toString() != "-1") {
                    //jQuery方式添加结构
                    var $div = $('#urls_img .row .url-img:eq(' + clickedIndex + ')');
                    $div.html("<a href='" + url + "'><img src='" + imgUrl + "' title='" + title + "' alt='" + title +
                        "'></a><span class='remove_url'>×</span>").attr("id", data);
                } else {
                    alert("服务器出现问题,暂时无法保存,请联系管理员!")
                }
            })
            $('.add_url').hide();
        },1000)
    })

    /**
     * 点击url-img右上角的x删除
     */
    $('#urls_img').on('click', '.remove_url', function () {
        var $url_img = $(this).parents('.url-img');
        $.post("urls/deleteUrl", "id=" + $url_img.attr("id"), function (data) {
            if (data.toString() != "true") {
                alert("服务器出现问题,暂时无法删除,请联系管理员!")
            } else {
                //删除当前块,在最后补一块
                $url_img.remove();
                $('#urls_img .row').append("<div class='col-3 col-md-1 url-img'>+</div>");
            }
        })
    })

    /**
     * 点击switch_button切换文字链接/便笺
     */
    //第一个按钮 显示文字链接
    $('#switch_buttons span:first-of-type').click(function () {
        //处理按钮样式
        $('#switch_buttons span').removeClass('active');
        $(this).addClass('active');
        //显示链接 隐藏便笺
        $('#urls_word').show(300);
        $('#note_div').hide(300);
    })
    //第二个按钮 显示便笺
    $('#switch_buttons span:last-of-type').click(function () {
        //判断便笺需要的形态
        checkNote();
        //处理按钮样式
        $('#switch_buttons span').removeClass('active');
        $(this).addClass('active');
        //显示便笺 隐藏链接
        $('#urls_word').hide(300);
        $('#note_div').show(300);
    })

    /**
     * 点击新便笺
     */
    $('#note_div .note_history').on("click", ".create_new", function () {
        //判断是否还有空余位置
        //判断index为4的li.html()是否为空
        if (typeof ($(".note_history li").eq(4).html()) != 'undefined') {
            //禁用
            return;
        }
        //清空textarea并取消.active
        $('.note').val('');
        $('#note_div .note_history li').removeClass('active');
        $('.note').focus();
    })
    /**
     * 点击便笺列表中的便笺(不包括创建新便笺)
     */
    $('body').on('click', '#note_div .note_history>li:not(.create_new)', function () {
        //该li添加.active样式
        $('#note_div .note_history li').removeClass('active');
        $(this).addClass('active');
        //将便笺内容显示在右侧文本域中
        $('.note').val($(this).find('.content').text().trim());
        $('.note').focus();
    })
    /**
     * 便签文本域文本改变事件
     */
    $(".note").bind('input',function () {
        //判断用户是否登陆 --> 登陆后才可以使用便笺
        if ($("#checkLoginInput").text() == "") {
            $(this).val("");//清空val值
            $("#message-modal .h-msg").text("登陆后方可使用便笺");
            $("#message-modal .p-msg").text("2秒后前往登陆页面")
            $("#message-modal").modal('show');
            setTimeout(function () {
                $("#message-modal").modal('hide');
                //弹出登陆框
                $("#login").modal('show');
            }, 2000)
            return;
        }
        //获取文本值
        var noteVal = $(this).val().trim();
        //若文本值不为空,改变便笺样式
        if (noteVal != '') {
            $(this).removeClass('unwrite').addClass('write');
            //显示便笺历史
            $('.note_history').show();
            //显示小图标
            $('.note_icons').show();
        }
        //若文本值为空,删除.active
        if (noteVal == '') {
            var $active = $('.note_history .active');
            if($active.hasClass('top_one_note')){ // 若为置顶便笺 则删除置顶便笺内容并隐藏
                $('.top_note').hide(100, function () {
                    $('.top_note').find('p').text('');
                });
            }
            //异步删除便笺
            $.post("memo/deleteMemo", "id=" + $active.attr("id"), function (data) {
                if (data.toString() == "true") {
                    $active.remove();
                } else {
                    alert("服务器出现问题,暂时无法使用便笺,请联系管理员!")
                }
            })
            return;
        }
        //判断是否存在.active 若不存在,则为创建新便笺
        if ($('.note_history .active').text() == '' && noteVal!="") {
            //获取系统时间
            var myDate = new Date();
            var now = myDate.getFullYear() + '-' + getNow(myDate.getMonth() + 1) + "-" + getNow(myDate.getDate()) + " " +
                getNow(myDate.getHours()) + ':' + getNow(myDate.getMinutes());

            //异步添加便笺
            $.post("memo/addMemo", "userId=" + $("#checkLoginInput").text() + "&content=" + noteVal, function (data) {
                if (data.toString() != "-1") {
                    //创建新便笺 .active
                    $('.note_history').append("<li class='active' id='" + data + "'><p class='content'>" + noteVal + "</p><p class='note_date'>" + now + "</p></li>")
                } else {
                    alert("服务器出现问题,暂时无法使用便笺,请联系管理员!")
                }
            });
            return;
        }

        //异步修改便笺内容
        $.post("memo/modifyMemoContent", "id=" + $('.note_history .active').attr("id") + "&content=" + noteVal, function (data) {
            if (data.toString() == "true") {
                //文本值与有.active类的便笺内容保持一致
                $('.note_history .active .content').text(noteVal);
                //若为置顶便签,则保持值与文本域保持一致
                if ($('.note_history .active').hasClass('top_one_note')) {
                    $('.top_note').find('.content').text(noteVal);
                }
            } else {
                alert("服务器出现问题,暂时无法使用便笺,请联系管理员!")
            }
        })
    })
    //失去焦点/判断是否不存在便签,若不存在,返回原样
        .blur(function () {
            //判断index为1的li.html()是否为空
            if (typeof ($(".note_history li").eq(1).html()) == 'undefined') {
                $(this).removeClass('write').addClass('unwrite');
                //隐藏便笺历史
                $('.note_history').hide();
                //隐藏小图标
                $('.note_icons').hide();
            }
        })
    /**
     * 删除便笺按钮
     */
    $('.note_icons .trash').click(function () {
        //判断是否为top_one_note 若是,置顶便笺删除
        if ($('.note_history .active').hasClass('top_one_note')) {
            $('.top_note').hide(100, function () {
                $('.top_note').find('p').text('');
            });
        }
        //异步删除便笺
        $.post("memo/deleteMemo", "id=" + $('.note_history .active').attr("id"), function (data) {
            if (data.toString() == "true") {
                $('.note_history .active').remove();
            } else {
                alert("服务器出现问题,暂时无法使用便笺,请联系管理员!")
            }
        })
        $('.note').val('');
        $('.note').focus();
    })
    /**
     * 置顶便笺按钮
     */
    $('.note_icons .bell').click(function () {
        //将内容和时间赋值到置顶便笺中
        var $topNote = $('.top_note');
        var $active = $('.note_history .active');
        //判断active是否为空
        if (typeof ($active.html()) == 'undefined') {
            return;
        }
        //若置顶便笺中的内容和时间与.active一致,则取消$topNote.hide
        if ($topNote.find('.content').text().trim() == $active.find('.content').text().trim() && $topNote.find(
            '.note_date').text().trim() == $active.find('.note_date').text().trim()) {
            return;
        }
        //判断置顶便笺本来是否有内容
        if ($topNote.find('.content').text().trim() != '') {
            $topNote.hide(100);
        }
        //异步修改数据库的便笺置顶属性
        $.post("memo/modifyMemoIsTop", "userId=" + $("#checkLoginInput").text() + "&id=" + $('.note_history .active').attr("id"), function (data) {
            if (data.toString() == "true") {
                //置顶的便笺添加.top_one_note
                $active.addClass('top_one_note');
                $topNote.find('.content').text($active.find('.content').text().trim());
                $topNote.find('.note_date').text($active.find('.note_date').text().trim());
                $topNote.show(100);
            } else {
                alert("服务器出现问题,暂时无法使用便笺,请联系管理员!")
            }
        })
    })
    /**
     * 置顶便笺右上角关闭
     */
    $('.top_note span').click(function () {
        var $topNote = $(this).parents('.top_note');
        $.post("memo/cleanTop", "userId="+$("#checkLoginInput").text(),function(){
            $topNote.hide(100, function () {
                $topNote.find('p').text('');
            });
        })
    })

    /**
     * 判断日期前面是否需要加0
     * @param {Object}
     */
    function getNow(s) {
        return s < 10 ? '0' + s : s;
    }

    //判断便笺是否有内容
    function checkNote() {
        //判断index为1的li.html()是否为空
        if (typeof ($(".note_history li").eq(1).html()) == 'undefined') {
            $(".note").removeClass('write').addClass('unwrite');
            //隐藏便笺历史
            $('.note_history').hide();
            //隐藏小图标
            $('.note_icons').hide();
        } else {
            $(".note").removeClass('unwrite').addClass('write');
            //隐藏便笺历史
            $('.note_history').show();
            //隐藏小图标
            $('.note_icons').show();
        }
    }
    //判断链接是否为一张图片
    function validateImage(pathImg) {
        var ImgObj = new Image();
        ImgObj.src = pathImg;
        ImgObj.onload=function(){
            if (ImgObj.width > 0 && ImgObj.height > 0) {
                return true;
            } else {
                return false;
            }
        }
    }
})
