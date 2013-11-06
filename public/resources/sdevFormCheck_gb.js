/*******************************************
*  表单验证 v1.3
*  作者：sohu sport-dev
*  日期：2009-03-07
\*******************************************
*                 使用方法
\*******************************************
*  实例化：
   var f = new sdevFormCheck(string 'form1',function showErrorInfo);
*  添加校验对象：
   f.add(string 'name',object {notNull:true},string '请输入姓名'); 
*  删除校验对象：
   f.remove(string 'name');
*  返回校验结果：
   bool f.check(); 绑定到 onsubmit="return f.check()"
*  或者用函数封装：
   function formSubmit(form){
 	  	if(f.check()) form.submit();	
   }
*  要限制键盘录入：
   需要在校验的过滤条件中设置为 number或者english 然后在表单项的标签内 写入 onkeydown="return f.allow(this,event)"
   现在只能限制必须输入英文（英文数字_）或者纯数字（不包含小数点） 
\*******************************************/
if(typeof sdevFormCheck == 'undefined'){
	var sdevFormCheck = function(formName,alertFun){
		//参数 formName 表单名称  alertFun 显示提示的函数
		this.formName = formName;
		this.alertFun = alertFun;
		this.elements = {};//存储添加进来的项的配置
	};
	sdevFormCheck.prototype = {
		form: function(){
			//返回注册的表单
			return document.forms[this.formName];
		},
		getValue: function(name){
			//返回表单的值
			var ele = this.getItem(name);
			var value = '';
			switch(ele.tn.tagName){
				case 'input':
					value = this._inputValue(ele);
					break;
				case 'select':
					value = this._selectValue(ele);
					break;
				case 'textarea':
					value = this._textValue(ele);
					break;
			}
			return value;
		},
		getTagName: function(ele){
			var tn = {};
			if(typeof ele.length != 'undefined' && typeof ele.options == 'undefined'){
				tn.tagName = ele[0].tagName.toLowerCase();
				tn.type = ele[0].type.toLowerCase();
				tn.length = ele.length;
			}else{
				tn.tagName = ele.tagName.toLowerCase();
				if(tn.tagName == 'input'){
					tn.type = ele.type.toLowerCase();
				}else{
					tn.type = '';
				}
				tn.length = 1;
			}
			return tn;
		},
		getItem: function(name){
			//返回表单项
			var form = this.form();
			var ele = form.elements[name];
			if(typeof ele.tn == 'undefined'){
				ele.tn = this.getTagName(ele);
			}
			return ele;
		},
		_inputValue: function(ele){
			var value = '';
			switch(ele.tn.type){
				case 'text':
				case 'hidden':
				case 'password':
				case 'file':
					value = this._textValue(ele);
					break;
				case 'checkbox':
					value = this._checkboxValue(ele);
					break;
				case 'radio':
					value = this._radioValue(ele);
					break;
				case 'button':
				case 'submit':
					//do nothing
			}
			return value;
		},
		_selectValue: function(ele){
			var index = ele.selectedIndex;
			return ele.options[index].value;
		},
		_textValue: function(ele){
			return ele.value;
		},
		_radioValue: function(ele){
			//返回raido的值
			var value = '';
			if(typeof ele.length != 'undefined'){
				for(var i=0;i<ele.length;i++){
					if(ele[i].checked == true){
						value = ele[i].value;
						break;
					}
				}	
			}else{
				value = ele.value;	
			}
			return value;
		},
		_checkboxValue: function(ele){
			//返回checkbox的值，是个数组
			var value = '';
			if(typeof ele.length != 'undefined'){
				value = [];
				for(var i=0;i<ele.length;i++){
					if(ele[i].checked == true){
						value.push(ele[i].value);
					}
				}	
			}else{
				value = [];
				value.push(ele.value);	
			}
			return value;
		},
		check: function(){
			return this._checkAll();
		},
		_checkAll: function(){
			//检查所有
			var form = this.form();
			for(var key in this.elements){
				if(!this._checkElement(this.elements[key])){
					return false;	
				}
			}
			return true;
		},
		_checkElement: function(obj){
			var form = this.form();
			var name = obj.name;//名称
			var filter = obj.filter;//过滤条件
			var alt = obj.alt;//提示文字
			var value = this.getValue(name);
			var ele = this.getItem(name);
			var error = false;//没有发生错误
			//首先检验是否为空
			if(filter.notNull){
				if(value == ''){
					error = error || true;
				}
			}
			//检验长度限制
			if(filter.minLength > 0){
				if(typeof value == 'string') vLen = this.charlen(value);
				else vLen = value.length;
				if(vLen < filter.minLength){
					error = error || true;
				}
			}
			if(filter.maxLength > 0){
				if(typeof value == 'string') vLen = this.charlen(value);
				else vLen = value.length;
				if(vLen > filter.maxLength){
					error = error || true;
				}
			}
			//检查字符是否符合标准
			switch(filter.type){
				case 'number':
					if(!this._regNumber(value)){
						error = error || true;
					}
					break;
				case 'english':
					if(!this._regEnglish(value)){
						error = error || true;
					}
					break;
				case 'e-mail':
					if(!this._regEmail(value)){
						error = error || true;
					}
					break;
				case 'custom':
					if(!this._regCustom(value,filter.custom)){
						error = error || true;
					}
					break;
				case 'text':
				default:
			}
			//file类型后缀检测
			if(filter.suffix.length > 0){
				if(!this._regSuffix(value,filter.suffix)){
					error = error || true;
				}
			}
			if(error){
				this._setFocus(ele);
				if(this.alertFun){
					this.alertFun(alt);	
				}else{
					alert(alt);
				}
				return false;
			}else{
				return true;
			}
		},
		_setFocus: function(ele){
			if(ele.tn.length == 1){
				ele.focus();	
			}else if(ele.tn.length > 1){
				ele[0].focus();	
			}
		},
		_regNumber: function(value){
			if(value == '') return true;
			var reg = /^\d+$/;
			return reg.test(value);
		},
		_regEnglish: function(value){
			if(value == '') return true;
			var reg = /^[a-zA-Z0-9_]+$/;
			return reg.test(value);
		},
		_regEmail: function(value){
			if(value == '') return true;
			var reg = /^(\w+\.?)*\w+@(\w+\.)+[A-Za-z]{2,}$/i;
			return reg.test(value);
		},
		_regCustom: function(value,custom){
			if(value == '') return true;
			if(custom == '') return true;
			custom.replace("[","\.[");
			custom.replace("]","\]");
			var reg = new RegExp('^['+custom+']+$');
			return reg.test(value);
		},
		_regSuffix: function(value,suffix){
			if(value == '') return true;
			if(suffix.length == 0) return true;
			var pos = value.lastIndexOf('.');
			var fs = value.substring(pos+1).toLowerCase();
			for(var i=0;i<suffix.length;i++){
				if(fs == suffix[i].toLowerCase()) return true;	
			}
			return false;
		},
		showAllValue: function(){
			//显示所有项的值
			var str = "--------------["+this.formName+"]---------------\n";
			for(var key in this.elements){
				str += "["+key + "]    " + this.getValue(this.elements[key].name) + "\n";
			}
			str += "-----------------------------------\n";
			alert(str);
		},
		add: function(name,filter,alt){
			/**************************************
			* 参数：表单项name，过滤设置对象，错误提示文字
			\**************************************
			* notNull
					true:不能为空
					false:可为空（默认值）
			* type 
					text:文本类型（默认值）
			 		number:限制为纯数字
			 		english:限制为英文，数字，_
			 		custom:自定义字符集，需要设置 custom字段
			 		e-mail:邮件
			* custom 自定义字符集，如 !@#$%^&*
			* minLength 最小长度，针对文本框是字符的数量，针对复选框是选择项的数量
			* maxLength 针对textarea的最大长度测试
			* suffix ['jpg','jpeg','bmp','gif'] 文件后缀
			\**************************************/
			var _filter = {
				notNull: false,//可否为空
				type: 'text',//number,english,custom,e-mail
				custom: '',//自定义字符
				minLength:0,//字符的最小长度，0，表示不限制，> 1后如果长度小于该值则提示
				maxLength:0,//最大长度限制，中文和英文数字都算一个字符
				suffix:[]//如果是file类型，则可判断后缀
			};
			for(var key in filter){
				_filter[key] = filter[key];//
			}
			this.elements[name] = {
				'name': name,
				'filter': _filter,
				'alt': alt
			};
		},
		remove: function(name){
			delete this.elements[name];
		},
		_regKeyNumber: function(key,shiftKey){
			if((key >= 48 && key <= 57 && !shiftKey) || (key >= 96 && key <= 105)){
				return true;	
			}else{
				return false;	
			}
		},
		_regKeyEnglish: function(key,shiftKey){
			if(this._regKeyNumber(key,shiftKey) || (key >= 65 && key <= 90) || (key == 189 && shiftKey) || (key == 109 && shiftKey)){
				return true;	
			}else{
				return false;	
			}
		},
		_keyCheck: function(obj,key,filter,shiftKey){
			var error = false;//没有发生错误
			switch(filter.type){
				case 'number':
					if(!this._regKeyNumber(key,shiftKey)){
						error = error || true;
					}
					break;
				case 'english':
					if(!this._regKeyEnglish(key,shiftKey)){
						error = error || true;
					}
					break;
			}
			if(filter.maxLength > 0){
				if(this.charlen(obj.value) >= filter.maxLength){
					error = error || true;
				}
				
			}
			if(error){
				return false;
			}else{
				return true;
			}
		},
		charlen: function(string){
			//返回字符长度，分单双字节
			var len = 0;
			for(var i=0;i<string.length;i++){
				if(string.charCodeAt(i) > 0 && string.charCodeAt(i) < 128){
					len += 1;	
				}else{
					len += 2;	
				}
			}
			return len;
		},
		subsub: function(string,length){
			//按字符数截字
			var str = '';
			var len = 0;
			for(var i=0;i<string.length;i++){
				var charCode = string.charCodeAt(i);
				var char = string.charAt(i);
				if(charCode > 0 && charCode < 128){
					len += 1;	
				}else{
					len += 2;	
				}
				if(len <= length){
					str += char;
				}else{
					break;	
				}
			}
			return str;
		},
		allow: function(obj,evt){
			var name = obj.name;
			if(typeof this.elements[name] == 'undefined') return true;
			var filter = this.elements[name].filter;
			var key = evt.keyCode;
			if(key == 8 || key == 46 || key == 37 || key == 39) return true;
			return this._keyCheck(obj,key,filter,evt.shiftKey);
		},
		cut: function(obj,evt){
			var name = obj.name;
			if(typeof this.elements[name] == 'undefined') return true;
			var filter = this.elements[name].filter;
			var key = evt.keyCode;
			if(key == 8 || key == 46 || key == 37 || key == 39) return;
			if(filter.maxLength > 0){
				if(this.charlen(obj.value) > filter.maxLength){
					obj.value = this.subsub(obj.value,filter.maxLength);
				}
			}
		}
	};
}