 function getOs()
{
	var OsObject = "";
	if(navigator.userAgent.indexOf("MSIE")>0)
	{
		return "MSIE";
	}
	if(isFirefox=navigator.userAgent.indexOf("Firefox")>0)
	{
		return "Firefox";
	}
	if(isSafari=navigator.userAgent.indexOf("Safari")>0)
	{
		return "Safari";
	}
	if(isCamino=navigator.userAgent.indexOf("Camino")>0)
	{
		return "Camino";
	}
	if(isMozilla=navigator.userAgent.indexOf("Gecko/")>0)
	{
		return "Gecko";
	}

}

function set_select( name , value )
{
	var sel = document.getElementsByName(name)[0];
	var ops = sel.options;
	for( var i = 0 ; i < ops.length ; i++ )
	{
		if( ops[i].value == value  )
		{
			try
			{
				if( i != ops.selectedIndex )
				{
					ops.selectedIndex = i;
					ops[i].selected = true;
				}

			}
			catch( e )
			{
			}


		}
	}
}

function ini_select( name , Karray , N  )
{
	var selone = document.getElementsByName(name)[0];

	for( key in Karray )
	{

		if (key == 0 && N == 1)
		{
			continue;
		}
		if (Karray[key].toString().indexOf('(object)')==-1)
		{
			selone.options[selone.length]=new Option( Karray[key] , key );
		}
	}
}

function add_option( name , texts , value )
{
	var selObj = document.getElementsByName( name )[0];
	selObj.options[selObj.length]=new Option( texts , value );
}

function adjust_select( name1 , name2 , array2 , N )
{
	var obj1 = document.getElementsByName( name1 )[0];

	var obj2 = document.getElementsByName( name2 )[0];

	var str = parseInt( obj1.options[obj1.selectedIndex].value );
	if( str != NaN )
	{
		obj2.innerHTML="";
		ini_select( name2 , array2[str] , N );
	}
	else
	{
		obj2.innerHTML="";
	}
}

function add_event( name , event , func )
{
	var el = document.getElementsByName( name )[0];
	if( getOs() == "MSIE" )
	{
		// IE
		el.attachEvent( "on" + event , func );
	}
	else
	{
		//other
		el.addEventListener( event , func , false);
	}
}

function dselect_set_ini( name1 , array1 , name2 , array2 , N  )
{
	ini_select( name1 , array1 , N );
	add_event( name1 , "change" , function(){ adjust_select( name1 , name2 , array2 ) } );
}

function set_select_by_2( name1 , name2 , array2 , value2 )
{
	value2 = value2 + '';
	var pcode = value2.substr( 0 , 2 );
	set_select( name1 , pcode );
	adjust_select( name1 , name2 , array2 );
	set_select( name2 , value2 );
}

function dselect_set_back( name1 , array1 , name2 , array2 , value2 , N )
{
	dselect_set_ini( name1 , array1 , name2 , array2 , N );
	if( value2 != '' )
	{
		set_select_by_2( name1 , name2 , array2 , value2  );
	}
}

var tooltip=function(){
	var id = 'tt';
	var top = 3;
	var left = 3;
	var maxw = 300;
	var speed = 10;
	var timer = 20;
	var endalpha = 95;
	var alpha = 0;
	var tt,t,c,b,h;
	var ie = document.all ? true : false;
	return{
		show:function(v,w){
			if(tt == null){
				tt = document.createElement('div');
				tt.setAttribute('id',id);
				t = document.createElement('div');
				t.setAttribute('id',id + 'top');
				c = document.createElement('div');
				c.setAttribute('id',id + 'cont');
				b = document.createElement('div');
				b.setAttribute('id',id + 'bot');
				tt.appendChild(t);
				tt.appendChild(c);
				tt.appendChild(b);
				document.body.appendChild(tt);
				tt.style.opacity = 0;
				tt.style.filter = 'alpha(opacity=0)';
				document.onmousemove = this.pos;
			}
			tt.style.display = 'block';
			c.innerHTML = v;
			tt.style.width = w ? w + 'px' : 'auto';
			if(!w && ie){
				t.style.display = 'none';
				b.style.display = 'none';
				tt.style.width = tt.offsetWidth;
				t.style.display = 'block';
				b.style.display = 'block';
			}
			if(tt.offsetWidth > maxw){tt.style.width = maxw + 'px'}
			h = parseInt(tt.offsetHeight) + top;
			clearInterval(tt.timer);
			tt.timer = setInterval(function(){tooltip.fade(1)},timer);
		},
		pos:function(e){
			var u = ie ? event.clientY + document.documentElement.scrollTop : e.pageY;
			var l = ie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
			tt.style.top = (u - h) + 'px';
			tt.style.left = (l + left) + 'px';
		},
		fade:function(d){
			var a = alpha;
			if((a != endalpha && d == 1) || (a != 0 && d == -1)){
				var i = speed;
				if(endalpha - a < speed && d == 1){
					i = endalpha - a;
				}else if(alpha < speed && d == -1){
					i = a;
				}
				alpha = a + (i * d);
				tt.style.opacity = alpha * .01;
				tt.style.filter = 'alpha(opacity=' + alpha + ')';
			}else{
				clearInterval(tt.timer);
				if(d == -1){tt.style.display = 'none'}
			}
		},
		hide:function(){
			clearInterval(tt.timer);
			tt.timer = setInterval(function(){tooltip.fade(-1)},timer);
		}
	};
}();

var ProvinceClass = {
	province: "",
	city: "",
	pAry: null,
	cAry: null,
	_init: function(){
		var oThis = ProvinceClass;
		oThis._setProvince();
	},
	init: function(province,pAry,city,cAry){
		var oThis = ProvinceClass;
		oThis.province = province;
		oThis.pAry = pAry;
		oThis.city = city;
		oThis.cAry = cAry;
		$(document).ready(function(){
			ProvinceClass._init();
		});
	},
	_setProvince: function(){
		var oThis = ProvinceClass;
		var sel = document.getElementById(oThis.province);
		var ary = oThis.pAry;
		sel.options.length = 1;
		for(var key in ary){
			var opt = document.createElement("option");
			opt.value = key;
			opt.text = ary[key];
			sel.options.add(opt);
		}
		//sel.onchange = ProvinceClass.setCity;
	},
	setCity: function(event){
		var oThis = ProvinceClass;
		var province = document.getElementById(oThis.province);
		var city = document.getElementById(oThis.city);
		var p = province.options[province.selectedIndex].value;
		var ary = oThis.cAry[p];
		city.options.length = 1;
		for(var key in ary){
			var opt = document.createElement("option");
			opt.value = key;
			opt.text = ary[key];
			city.options.add(opt);
		}
	},
	onchange: function(){
		ProvinceClass.setCity();
	}
}