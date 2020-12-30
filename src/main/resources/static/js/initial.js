/**
 * 该js执行页面初始化操作
 */
$(function () {
    var userId = $("#checkLoginInput").text();
    /**
     * 判断session是否存储user,若无,则去cookie中查找登陆信息
     */
    if (userId == "" || userId == null) {
        console.log("userId="+userId)
        //查看cookie中是否存在登陆信息
        $.get("user/cookie", function (data) {
            //若存在
            console.log("userId="+userId)
            if (data.toString() == "true") {
                //刷新页面
                location.reload();
            }
        });
    }

    /**
     * 判断session中是否存储user,若有,查询urls&note
     */
    if (userId != null && userId != '') {
        //查询urls
        $.getJSON("urls/getUrls", "userId=" + userId, function (data) {
            // var dataObj = eval("("+data.json+")");
            var $row = $("#urls_img .row"); //将数据放在该结构中
            $row.html("");
            for (var i = 0; i < 7; i++) {
                if (data[i] != null) {
                    $row.append("<div class='col-3 col-md-1 url-img' id='" + data[i].id + "'>\n" +
                        "<a href='" + data[i].url + "'>\n" +
                        "<img src='" + data[i].img + "' title='" + data[i].title + "'>\n" +
                        "</a>\n" +
                        "<span class='remove_url'>×</span>\n" +
                        "</div>")
                } else {
                    $row.append("<div class='col-3 col-md-1 url-img'>+</div>")
                }
            }
        })

        //查询note
        $.getJSON("memo/getMemos", "userId=" + userId, function (data) {
            var $history = $("#note_div .note_history"); //将数据放在该结构中
            $history.html("<li class='create_new'><i class='fa fa-plus'></i>新便笺</li>");
            for (var i = 0; i < data.length; i++) {
                var isTop = data[i].isTop == 1 ? "top_one_note" : "";
                $history.append("<li id='" + data[i].id + "' class='" + isTop + "'><p class='content'>" + data[i].content + "</p><p class='note_date'>" + changeDateFormat(data[i].createdTime) + "</p></li>");
            }
            //查询置顶便笺
            if(typeof ($(".note_history .top_one_note").html())!="undefined"){
                var $topNote = $('.top_note');
                var $active = $('.note_history .top_one_note');
                $topNote.find('.content').text($active.find('.content').text().trim());
                $topNote.find('.note_date').text($active.find('.note_date').text().trim());
                $topNote.show(100);
            }
        })
    }

    //Date(1528873289000)/格式化
    function changeDateFormat(val) {
        if (val != null) {
            var myDate = new Date(val);
            var now = myDate.getFullYear() + '-' + getNow(myDate.getMonth() + 1) + "-" + getNow(myDate.getDate()) + " " +
                getNow(myDate.getHours()) + ':' + getNow(myDate.getMinutes());
            return now;
        }
    }

    function getNow(s) {
        return s < 10 ? '0' + s : s;
    }
})