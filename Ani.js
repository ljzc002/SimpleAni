//考虑到更好的兼容性
// export default class Ani{
//     constructor(elem,p){
//         /*let p_default={
//             type:"css_px",
//             id:Ani.randomString(32),//没有必要生成两次
//
//         }*/
//         this.type=p.type||"css_px";
//         this.id=p.id||Ani.randomString(32);
// 		this.arr_key=[];
// 		let len=p.arr_key.length;//每个基础类型属性都要用直接量赋值
// 		for(let i=0;i<len;i++)
// 		{
// 			let key=p.arr_key[i]
// 			this.arr_key.push(
// 				{
// 					ms:key.ms,
// 					value:JSON.parse(JSON.stringify(key.value)),
// 					callback:key.callback,//回调函数可以共用一个
// 				}
// 			)
// 		}
//         //this.arr_key=p.arr_key;
//         this.loop=p.loop;
//         this.elem=elem;
//         this.countms=0;
//         this.arr_pname=p.arr_pname;
//         this.func_ease=p.func_ease||Ani.obj_func_ease.float_line;
//         //this.arr_framecallback=p.arr_framecallback||[];
//         this.endcallback=p.endcallback;
//         this.func_set=p.func_set||Ani.setValue;
//     }
// }
function Ani(elem,p){
    this.type=p.type||"css_px";
    this.id=p.id||Ani.randomString(32);
    this.arr_key=[];
    var len=p.arr_key.length;//每个基础类型属性都要用直接量赋值
    for(var i=0;i<len;i++)
    {
        var key=p.arr_key[i]
        this.arr_key.push(
            {
                ms:key.ms,
                value:JSON.parse(JSON.stringify(key.value)),
                callback:key.callback,//回调函数可以共用一个
            }
        )
    }
    //this.arr_key=p.arr_key;
    this.loop=p.loop;
    this.elem=elem;
    this.countms=0;
    this.arr_pname=p.arr_pname;
    this.func_ease=p.func_ease||Ani.obj_func_ease.float_line;
    //this.arr_framecallback=p.arr_framecallback||[];
    this.endcallback=p.endcallback;
    this.func_set=p.func_set||Ani.setValue;
}
Ani.obj_anis={};
Ani.addAni=function(objs,p_anis)
{
    if(objs.outerHTML)//如果是一个html标签
    {
        objs=[objs];
    }
    var len1=objs.length;
    var len2=p_anis.length;
    for(var i=0;i<len1;i++)
    {
        var obj=objs[i];
        /*if(!obj.arr_ani)//如果以前没有动画数组,dom元素没有易于使用的唯一id，所以不应把动画配置保存再dom元素对象里
        //使用一个全局obj_anis保存所有动画对象
        {
            obj.arr_ani=[];
        }*/
        for(var j=0;j<len2;j++)
        {
            var p_ani=p_anis[j];
            var ani=new Ani(obj,p_ani);
            Ani.obj_anis[ani.id]=ani;
            //let len3=obj.arr_ani;
            /*let flag_canpush=true;
            for(let k=0;k<len3;k++)
            {
                //if(obj.arr_ani[k]===ani)//如果已经添加过这个动画对象
                if(obj.arr_ani[k].id==p_ani.id)
                {
                    flag_canpush=false;
                }
            }
            if(flag_canpush==true)
            {
                obj.arr_ani.push(p_ani);
            }*/
        }

    }
}
Ani.runningAni=false;

//这里的一个问题是dom元素可能没有唯一id，后面很难再找到它的对象-》使用一个公用对象？
Ani.startAni=function()
{
    if(Ani.runningAni==false)
    {
        Ani.lastframe=new Date().getTime();
        //Ani.currentframe=Ani.lastframe;
        window.requestAnimFrame(function(){
            Ani.Frame();
        })
    }
    Ani.runningAni=true;
}
Ani.pauseAni=function()
{
    Ani.runningAni=false;
}

Ani.Frame=function()
{
    Ani.currentframe=new Date().getTime();
    Ani.framems=Ani.currentframe-Ani.lastframe;

	//key_called=null;
    for(var key in Ani.obj_anis)
    {
        var ani=Ani.obj_anis[key];
        ani.countms+=Ani.framems;
        var len=ani.arr_key.length;
        var value=null;
        for(var i=0;i<len-1;i++)
        {
            var key1=ani.arr_key[i];
            var key2=ani.arr_key[i+1];
            if(ani.countms>=key1.ms&&ani.countms<=key2.ms)
            {
                value=ani.func_ease(key1,key2,ani.countms);
                //Ani.setValue(ani.elem,value,ani.type,ani.arr_pname);
				ani.func_set(ani.elem,value,ani.type,ani.arr_pname);
				if(key1.callback&&!key1.called)//如果这个关键帧上有回调函数，并且这个帧没有被调用过
				{
					key1.callback(ani);
					key1.called=true;//多个动画时有多个key1，要分别标记
				}
                break;
            }
        }
		var endKey=ani.arr_key[len-1];
        if(ani.countms>endKey.ms)//如果完成了一次动画
		{
			//Ani.setValue(ani.elem,endKey.value,ani.type,ani.arr_pname);
			ani.func_set(ani.elem,value,ani.type,ani.arr_pname);
			if(endKey.callback)//如果结束帧上有回调函数
			{
				endKey.callback();
				console.log(ani.countms);
			}
			if(ani.loop)
			{
				ani.countms=ani.countms%endKey.ms;
				for(var i=0;i<len;i++)
				{
					var key1=ani.arr_key[i];
					key1.called=false;
				}
				
			}
			else{
				if(ani.endcallback)//如果有动画结束回调
				{
					ani.endcallback(ani);
				}
				
				delete Ani.obj_anis[key];
				ani=null;
			}
		}

    }
	

    Ani.lastframe=Ani.currentframe;
    if(Ani.runningAni==true)
    {
        window.requestAnimFrame(function(){
            Ani.Frame();
        })
    }
}


Ani.setValue=function(elem,value,type,arr_pname)
{
    if(type=="css_px")//这时arr_pname只有一层，是一个字符串
    {
        elem.style[arr_pname]=value+"px";
    }
    else if(type=="transform-rotate-deg")//
    {
        elem.style["transform"]="rotate("+value+"deg)";
    }
}
Ani.obj_func_ease={
    //单浮点数线性
    float_line:function(key1,key2,countms){
        var ms1=key1.ms;
        var ms2=key2.ms;
        var v1=key1.value;
        var v2=key2.value
        return Ani.inBetween(ms1,ms2,v1,v2,countms);
    }
};
//插值
Ani.inBetween=function(ms1,ms2,v1,v2,ms)
{
    var v=v1+((ms-ms1)/(ms2-ms1))*(v2-v1);
    return v;
}
Ani.randomString=function(len)
{
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

// Copyright 2010, Google Inc.
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                window.setTimeout(callback, 1000/60);
            };
    })();

