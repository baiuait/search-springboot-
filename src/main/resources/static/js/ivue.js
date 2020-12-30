$(function(){
	var app = new Vue({
		el: '#app',
		data:{
			timer: '', //定时器变量<用于刷新页面上显示的系统时间>
			currentTime: "" ,//获取当前时间
			searchId: "search"
		},
		methods:{
			/**
			 * 过滤时间格式,若时间小于10,在之前加上0 <9-->09>
			 */
			appendZero: function(obj){
				if(obj < 10){
					return "0"+obj;
				}
				return obj;
			}
		},
		// //created生命周期钩子
		created() {
		// 	//声明一个变量指向Vue实例this,确保作用域一致
			var _this = this;
		// 	/**
		// 	 * 键盘绑定Enter提交form表单
		// 	 */
		// 	// document.onkeyup = function(e){
		// 	// 	//获取按下键盘的keyCode
		// 	// 	var key = window.event.keyCode;
		// 	// 	//判断keyCode是否为13(Enter)
		// 	// 	if(key == 13){
		// 	// 		// 表单提交
		// 	// 		$('#baidu').submit();
		// 	// 	}
		// 	}
			
			/**
			 * 刷新时间计时器
			 * 1s刷新一次 时间格式为<HH:mm:dd>
			 */
			var date = new Date();
			_this.currentTime = _this.appendZero(date.getHours())+":"+_this.appendZero(date.getMinutes())+":"+_this.appendZero(date.getSeconds());
			_this.timer = setInterval(function(){
				//修改数据Date
				date = new Date();
				//当前时间赋值
				_this.currentTime = _this.appendZero(date.getHours())+":"
									+_this.appendZero(date.getMinutes())+":"
									+_this.appendZero(date.getSeconds());
			},1000)
		}
	});
})