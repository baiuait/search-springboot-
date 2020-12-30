$(function(){
	/**
	 * 处理搜索框下方ul中的li
	 */
	var li_index = -1; //选中的结果的下标
	// 监听搜索结果的li 鼠标移上事件
	$('body').on('mouseenter','#languageList li',function(){
		li_index = Number($(this).attr('index'));
		//为该添加class样式,清除其他liclass样式
		$(this).addClass("liSelect");
		$(this).siblings().removeClass("liSelect");
	})
	//点击事件
	.on('click','#languageList li',function(){
		// 判断第一项是否为翻译
		if(typeof($(this).find(".translate").html()) != "undefined" && $(this).attr("index")==0){
			location.href = "https://fanyi.baidu.com/translate?aldtype=16047&query="+$('#search').val()+
				"&keyfrom=baidu&smartresult=dict&lang=auto2zh#en/zh/"+$('#search').val();
			return false;
		}else{
			$('#search').val($(this).text());
			$('#baidu').submit();
		}
	})
	/*设置监听事件，向输入框中输入内容，当键盘按键弹起的时候，将输入的内容作为参数传入到函数info中*/
	$("#search").bind("keyup",function(event){  
		//判断搜索框是否为空 || 是否按下Esc键
		if($('#search').val()=='' || event.keyCode == 27){
			//清空搜索结果集(ul)
			$('#languageList').html("");
			li_index = -1;
			return false;
		}
		// 按Enter键时
		if(event.keyCode == 13){ 
			// 判断是否选中搜索结果
			if($('#languageList .liSelect').text()!=''){
				// 判断第一项是否为翻译
				if(typeof($('#languageList .liSelect').find(".translate").html()) != "undefined" && $('#languageList .liSelect').attr("index")==0){
					//直接跳转至翻译页面
					location.href = "https://fanyi.baidu.com/translate?aldtype=16047&query="+$(this).val()+
						"&keyfrom=baidu&smartresult=dict&lang=auto2zh#en/zh/"+$(this).val();
					return false;
				}
				$(this).val($('#languageList .liSelect').text());
				$('#baidu').submit();
			}
		}
		
		/**
		 * 上下键选取结果集
		 */
		if(event.keyCode == 38){ //按上键时
			// li_index = li_index-1;
			if(li_index == 0){
				$('#languageList li').removeClass('liSelect');
				li_index = -1;
				return false;
			}
			if(li_index == -1){ //判断是否到顶
				li_index = Number($('#languageList li:last-of-type').attr('index'))+1;
				// return false;
			}
			li_index = li_index-1;
			$('#languageList').find("li:eq("+li_index+")").addClass("liSelect");
			$('#languageList').find("li:eq("+li_index+")").siblings().removeClass("liSelect");
			return false;  
		}
		if(event.keyCode == 40){ //按下键时
			if(li_index == $('#languageList li:last-of-type').attr('index')){//判断是否到底
				$('#languageList li').removeClass('liSelect');
				li_index = -1;
				return false;
			}
			li_index = li_index+1;
			$('#languageList').find("li:eq("+li_index+")").addClass("liSelect");
			$('#languageList').find("li:eq("+li_index+")").siblings().removeClass("liSelect");
			return false;  
		}
		//执行查询结果集方法
	    var value = $("#search").val();  
	    info(value);  
	})
	// 使用keydown来阻止光标移动,keydown执行顺序比keyup要快
	.bind("keydown",function(){
		/*当键盘按下上下键的时候，不进行监听，阻止光标移动*/
		if(event.keyCode == 38 || event.keyCode == 40){
			event.preventDefault();
		}
	})
	/*将ajax封装到函数中*/  
	function info(value){  
	    /*百度搜索框智能提示的接口*/  
	    var url = "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su";  
	    /*需要传入的参数，cb是callback的缩写*/  
	    var data = {  
	        wd : value,  
	        cb : "helloword"  
	    }  
	    /*因为涉及跨域，这里使用jsonp*/  
	    $.ajax({  
	        url : url,  
	        data : data,  
	        type : "GET",  
	        dataType : "jsonp",  
	        jsonpCallback : "helloword",  
	        /*跨域成功的时候返回的数据*/  
	        success : function (result){
	            /*将获取的数据整理后返回到页面*/  
	            var a = result.s;
				var list = "";
				/*判断是否全英文:添加翻译功能*/
				var r=/^([a-zA-Z,. ]+)$/;
				if(r.test(value)){
					//翻译的url路径
					list = "<li index='0'><a href='javascript:;' class='translate'>翻译: "+value+"</a></li>";
					for(var i in a ){
					    var l = a[i];
						if(l.length > 39){
							l = l.substring(0, 38) + "...";
						}
						if(i < 6){
							list += "<li index='"+(Number(i)+1)+"'>"+l+"</li>"; 
						}
					}  
				}
				/*全中文或中英文混合*/
				else{
					for(var i in a ){
					    var l = a[i];
						if(l.replace(/[^\x00-\xff]/g, "01").length > 28){
							l = l.substring(0, 24) + "...";
						}
						if(i < 6){
							list += "<li index='"+i+"'>"+l+"</li>"; 
						}
					}  
				}
	            $("#languageList").html(list);  
	        },  
	        /*跨域失败的时候返回的数据*/  
	        error : function(){  
	            console.log("error");  
	        }  
	    })  
	}  
	/**
	 * 搜索框获取焦点
	 */
	$('#search').focus(function(){
		// 添加获取焦点图片动画的class,并移除去除焦点图片动画的class
		$('#bgimg').removeClass('bgimgLeave');
		$('#bgimg').addClass('bgimgSelect');
		
		//placeholder=""
		$(this).attr("placeholder","");
		// 搜索框拉长
		$(this).animate({width:'50rem',opacity:"1"},300);
		//显示每日一言
		$('.hitokoto').show();
	})
	/**
	 * 搜索框失去焦点
	 */
	$('#search').blur(function(){
		// 判断值是否为空.值为空才收缩,否则input与下方ul宽度不匹配
		if($(this).val()==''){
			// 添加失去焦点图片动画的class,并移除获取焦点图片动画的class
			$('#bgimg').removeClass('bgimgSelect');
			$('#bgimg').addClass('bgimgLeave');
			
			//placeholder="Search"
			$(this).attr("placeholder","Search");
			// 搜索框放窄
			$(this).animate({width:'30rem',opacity:"0.8"},300);
			//隐藏每日一言
			$('.hitokoto').hide();
		}
	})
	/**
	 * 搜索框点击事件
	 */
	$('#search').click(function(){
		li_index = -1;
		$('#languageList li').removeClass('liSelect');
	})
})