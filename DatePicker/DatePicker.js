DatePicker=function(id,obj_p)
{
    //如果已经有这个div则建立失败
    var div=document.getElementById("id");
    if(div)
    {
        console.log("组件id重复，请使用其他组件id");
        return;
    }
    div=document.createElement("div");
    this.id=id;
    this.div=div;
    div.id=id;
    var _this=this;

    this.width=obj_p.width||256;
    this.height=obj_p.height||202;
    this.shadowSize=obj_p.shadowSize||4;
    this.shadowColor=obj_p.shadowColor||"rgb(203,203,203)";
    this.backColor=obj_p.backColor||"white";
    //this.boxShadow=obj_p.boxShadow||"inset 0 0 4px 4px rgb(203,203,203)";
    div.style.border="0px";
    div.style.width=this.width+"px";
    div.style.height=this.height+"px";
    div.style.boxShadow="inset 0 0 "+this.shadowSize+"px "+this.shadowSize+"px "+this.shadowColor;
    div.style.position="absolute";
    div.style.backgroundColor=this.backColor;

    this.title=obj_p.title||"日期选择";
    //this.noTitle=obj.noTitle||false;
    //this.noBanner=obj.noBanner||false;
    this.h1=obj_p.h1||24;//最上面的一行空间
    this.h2=obj_p.h2||24;
    //this.h3=obj_p.h3||208;
    this.titleFontSize=obj_p.titleFontSize||12;
    this.contentFontSize=obj_p.contentFontSize||10;
    var span=document.createElement("span")
    span.innerText=this.title;
    span.style.height=this.h1+"px";
    span.style.fontSize=this.titleFontSize+"px";
    span.style.fontWeight="bold";
    span.style.lineHeight=this.h1+"px";
    span.style.display="inline-block";
    span.style.left=this.shadowSize+"px";
    span.style.paddingLeft=this.shadowSize+"px";
    span.style.position="absolute";
    span.style.zIndex="2";
    div.appendChild(span);

    this.bannerBackColor=obj_p.bannerBackColor||"rgb(169,16,10)";
    this.bannerFontColor=obj_p.bannerFontColor||"white";
    this.date=obj_p.date||(new Date());
    this.year=this.date.getFullYear();
    this.month=this.date.getMonth();
    this.day31=this.date.getDate();
    this.day7=this.date.getDay();
    this.arr_day7=obj_p.arr_day7||["","一","二","三","四","五","六","日"];
    this.arr_bannerp=obj_p.arr_bannerp||([
        {id:"btn1",width:10,marginLeft:20,text:"《",onclick:function(){_this.year-=10;_this.changeYear()}}
        ,{id:"btn2",width:10,marginLeft:5,text:"〈",onclick:function(){_this.year-=1;_this.changeYear()}}
        ,{id:"btn3",width:40,marginLeft:5,text:this.year,onclick:function(){}}
        ,{id:"btn4",width:10,marginLeft:5,text:"〉",onclick:function(){_this.year+=1;_this.changeYear()}}
        ,{id:"btn5",width:10,marginLeft:5,text:"》",onclick:function(){_this.year+=10;_this.changeYear()}}
        ,{id:"btn6",width:10,marginLeft:50,text:"〈",onclick:function(){_this.month-=1;if(_this.month<0){_this.month=11;_this.year-=1;}_this.changeMonth();_this.changeYear()}}
        ,{id:"btn7",width:20,marginLeft:5,text:this.month+1,onclick:function(){}}
        ,{id:"btn8",width:10,marginLeft:5,text:"〉",onclick:function(){_this.month+=1;if(_this.month>11){_this.month=0;_this.year+=1;}_this.changeMonth();_this.changeYear()}}
        ])

    var div_banner=document.createElement("div");
    div_banner.style.height=this.h2+"px";
    //div_banner.style.width="100%";
    div_banner.style.left=this.shadowSize+"px";
    div_banner.style.right=this.shadowSize+"px";
    div_banner.style.top=this.h1+"px";
    div_banner.style.position="absolute";
    div_banner.style.backgroundColor=this.bannerBackColor;
    div_banner.style.lineHeight=this.h2+"px";
    div_banner.style.zIndex="2";
    //div_banner.style.fontSize=this.contentFontSize+2+"px";
    //div_banner.style.color=this.bannerFontColor;
    //div_banner.style.fontWeight="bold";

    //this.changeYearBack=obj_p.

    var len=this.arr_bannerp.length;
    var sum_left=0;
    for(var i=0;i<len;i++)
    {
        var bannerp=this.arr_bannerp[i];
        var btn=document.createElement("button");
        btn.id=bannerp.id;
        btn.style.position="absolute";
        btn.style.backgroundColor=this.bannerBackColor;
        btn.style.border="0px";
        btn.style.padding="0px";
        btn.style.textAlign="center";
        btn.style.color=this.bannerFontColor;//button这个属性并不会自动继承
        btn.style.fontWeight="bold";
        btn.style.fontSize=this.contentFontSize+2+"px";
        btn.style.height="100%";
        btn.style.lineHeight=this.h2+"px";
        btn.style.width=bannerp.width+"px";
        btn.style.left=sum_left+bannerp.marginLeft+"px";
        btn.innerText=bannerp.text;
        btn.onclick=bannerp.onclick;
        sum_left+=(bannerp.width+bannerp.marginLeft);
        this[btn.id]=btn;
        div_banner.appendChild(btn);
    }
    div.appendChild(div_banner);
    this.paddingSize=obj_p.paddingSize||6;

    this.gridBackColor=obj_p.gridBackColor||"#eeeeee";
    this.gridColor=obj_p.gridColor||"#000000";//本月单元格的文字颜色
    this.gridColor0=obj_p.gridColor0||"#888888";//连带显示的非本月单元格的文字颜色
    this.hoverBorderColor=obj_p.hoverBorderColor||"#888888";//鼠标移入可选单元格后的边框颜色
    this.enableBackColor=obj_p.enableBackColor||"rgb(207,232,252)";//可以被选择的单元格的背景颜色
    this.enableBackColorPicked=obj_p.enableBackColorPicked||"rgb(252,232,207)";
    var div_list=document.createElement("div");
    var int1=this.shadowSize+this.paddingSize;
    div_list.style.left=int1+"px";
    div_list.style.right=int1+"px";
    div_list.style.top=int1+"px";
    div_list.style.bottom=this.shadowSize+"px";
    div_list.style.position="absolute";
    div_list.style.backgroundColor=this.gridBackColor;
    div.appendChild(div_list);
    this.sizex=Math.floor((this.width-int1*2)/7);
    this.sizey=Math.floor((this.height-int1-this.shadowSize-(this.h1+this.h2-this.shadowSize-this.paddingSize))/7);
    this.pickcallback=obj_p.pickcallback;//pick日期之后的响应方法
    this.div_list=div_list;
    this.obj_enable={};
    this.searchEnableUrl=obj_p.searchEnableUrl;//||apiHost+"/public/searchEnableDate";
    this.flag_canPickUnEnabled=obj_p.flag_canPickUnEnabled||false;//是否可以点击不激活的按钮
    if(!this.searchEnableUrl)//根本不区分按钮是否激活
    {
        this.flag_canPickUnEnabled=true;
    }
    //this.reloadDateList(obj_p.initcallback);
    //将日历的选择值与某些dom对象关联起来
    this.arr_innerlink=obj_p.arr_innerlink||[];
    this.arr_valuelink=obj_p.arr_valuelink||[];
}
DatePicker.linkValue=function(value,that)
{
    var len=that.arr_innerlink.length;
    for(var i=0;i<len;i++)
    {
        that.arr_innerlink[i].innerHTML=value;
    }
    var len=that.arr_valuelink.length;
    for(var i=0;i<len;i++)
    {
        that.arr_valuelink[i].value=value;
    }
}
DatePicker.prototype.changeYear=function()
{
    this.btn3.innerText=this.year;
    this.reloadDateList();//根据当前月份重新排列日期btn
    console.log("改变了年份")
}
DatePicker.prototype.changeMonth=function()
{
    this.btn7.innerText=this.month+1;
    console.log("改变了月份")
}
DatePicker.DrawButton=function(that,callback)
{
    try {

        var sizex = that.sizex;//每个小块的宽度
        var sizey = that.sizey;//每个小块的宽度
        var date_list = new Date(that.year + "-" + (that.month + 1) + "-1");//取这个月的第一天
        var day7_list = date_list.getDay();
        //上一个月有几天？
        var date_list0 = date_list - 1000 * 60 * 60;//上个月的最后一天
        var day31_list0 = (new Date(date_list0)).getDate();//是几号

        var int3 = that.month + 2;
        var int4 = that.year;
        if (int3 > 12) {
            int3 = 1;
            int4++;
        }
        var date_list2 = new Date(int4 + "-" + (int3) + "-1");//取下个月的第一天
        var date_list1 = date_list2 - 1000 * 60 * 60;//这个月的最后一天
        var day31_list1 = (new Date(date_list1)).getDate();//是几号
        for (var i = 0; i < (day7_list - 1); i++) {
            that.arr_date.push({text: day31_list0 - (day7_list - 2 - i), inmonth: false})
        }
        if(that.searchEnableUrl)
        {
            var list_enabledate = that.obj_json.list_enabledate;
            for (var i = 1; i <= day31_list1; i++) {
                var len = list_enabledate.length;
                var str_fulldate = that.year + (that.month + 1 + 100 + "").substr(1) + (i + 100 + "").substr(1);
                var obj = {text: i, inmonth: true, isenable: false, str_fulldate: str_fulldate};
                for (var j = 0; j < len; j++) {
                    if (list_enabledate[j].CBRQ == (str_fulldate)) {
                        obj.isenable = true;
                        //obj.str_fulldate=str_fulldate;
                        break;
                    }
                }
                that.arr_date.push(obj);
            }
        }
        else {
            for (var i = 1; i <= day31_list1; i++) {
                var str_fulldate = that.year + (that.month + 1 + 100 + "").substr(1) + (i + 100 + "").substr(1);
                var obj = {text: i, inmonth: true, isenable: false, str_fulldate: str_fulldate};
                //obj.isenable = true;<-在不区分是否激活的情况下，不需要变色标记
                that.arr_date.push(obj);
            }
        }

        var len = that.arr_date.length;
        for (i = 0; i < (42 - len); i++) {
            that.arr_date.push({text: i + 1, inmonth: false})
        }

        var int2 = that.h1 + that.h2 - that.shadowSize - that.paddingSize;
        for (var i = 0; i < 7; i++)//对于每一行
        {
            for (var j = 0; j < 7; j++) {

                (function () {
                    var div = document.createElement("div");
                    div.class = "div_riligrid";
                    //div.className="div_riligrid";
                    div.style.position = "absolute";
                    div.style.display = "inline-block";
                    div.style.top = i * sizey + int2 + "px";
                    div.style.left = j * sizex + "px";
                    div.style.width = sizex + "px";
                    div.style.height = sizey + "px";

                    //div.style.borderWidth="0px"
                    //div.style.borderColor=that.hoverBorderColor
                    div.style.textAlign = "center";


                    if (i == 0)//第一行显示一周七天的名字，按中式习惯从周一到周日显示
                    {
                        div.style.color = that.gridColor;
                        div.innerText = that.arr_day7[j + 1];
                        div.style.fontSize = that.contentFontSize + "px";
                        div.style.cursor = "default";
                    }
                    else//接下来根据列表生成日期小块
                    {
                        div.style.fontSize = that.contentFontSize + 4 + "px";
                        div.style.cursor = "pointer";
                        var index = (i - 1) * 7 + j;
                        (function () {
                            var obj = that.arr_date[index];
                            div.innerText = obj.text;
                            if (!obj.inmonth) {
                                div.style.color = that.gridColor0;
                            }
                            else//考虑到还要选择视频，在本月内的页面即有资格被选中！！！！<-改为根据条件判断
                            {
                                div.style.color = that.gridColor;
                                //obj.isEnabled=false;
                                //div.style.borderWidth
                                /*div.onclick=function(){
                                    that.pickcallback(obj.text)
                                }*/
                                div.style.top = i * sizey + int2 + 1 + "px";
                                div.style.left = j * sizex + 1 + "px";
                                div.style.width = sizex - 2 + "px";
                                div.style.height = sizey - 2 + "px";
                                if (obj.isenable == true || that.flag_canPickUnEnabled) {
                                    div.onclick = function () {
                                        //obj.isenable
                                        that.pickcallback(obj.str_fulldate,that)
                                    }
                                }

                                //div.style.border="1px solid "+that.hoverBorderColor;
                                //鼠标移入移出事件
                                div.onpointerenter = function () {//鼠标移入时显示边框
                                    div.style.border = "1px solid " + that.hoverBorderColor;
                                }
                                div.onpointerleave = function () {
                                    div.style.border = "0px"
                                }
                                that.obj_enable["div_" + obj.str_fulldate] = div;
                                if (obj.isenable) {
                                    div.style.backgroundColor = that.enableBackColor;

                                }
                            }
                        })()
                        //事件
                    }
                    that.div_list.appendChild(div);
                })()
            }
        }
        that.inited=true;
        if (that.true_cbrq) {
             that.pick(that.true_cbrq);
        }
        if (callback) {
            callback();
        }
    }catch(e)
    {
        alert(e);
        console.log(e);
    }
}
DatePicker.prototype.reloadDateList=function(callback)
{
    console.log("重新加载日期列表")//7*6标准
    this.arr_date=[];
    this.obj_enable={};
    this.div_list.innerHTML="";
    var that=this;
    //有可能不需要后台查询！
    if(this.searchEnableUrl)
    {
        if(typeof searchEnableUrl=="string") {


            //先绘制标签还是先查询标签限制？
            var ajax = createXMLHttpRequest();
            ajax.open("POST", this.searchEnableUrl);
            ajax.onreadystatechange = function () {//这里取到的this时ajax对象！
                if (ajax.readyState == 4) {

                    if (ajax.status == 200) {
                        var str_json = ajax.responseText;
                        try {
                            var obj_json = JSON.parse(str_json);
                            if (obj_json.type == "ok") {
                                that.obj_json = obj_json;
                                DatePicker.DrawButton(that, callback);

                            }
                            else if (obj_json.type == "error") {
                                alert(obj_json.str_res);
                                console.log(obj_json.str_res);
                            }
                        }
                        catch (e) {
                            alert(e);
                            console.log(e);
                        }
                        ajax.abort();
                    }
                }
            }

            //var obj_json={ str_month:this.year+(this.month+1+100+"").substr(1)}
            //ajax.send(JSON.stringify(obj_json));//总之sb2的servlet不能自动转化json和FormData
            var formData = new FormData()
            formData.append("str_month", this.year + (this.month + 1 + 100 + "").substr(1));
            ajax.send(formData);
            //
        }
        else {
            that.obj_json = this.searchEnableUrl;//不去后端查询，直接把searchEnableUrl作为所需数据
            DatePicker.DrawButton(that, callback);
        }
    }
    else {
        DatePicker.DrawButton(that,callback);
    }

}
DatePicker.prototype.pick0=function(true_cbrq)
{
    var year=parseInt(true_cbrq.substr(0,4));
    var month=parseInt(true_cbrq.substr(4,2));
    var day31=true_cbrq.substr(6,2);
    this.true_cbrq=true_cbrq;
    if(this.year!=year||(this.month+1)!=month)
    {
        this.year=year;
        this.month=month-1;
        this.true_cbrq=true_cbrq;
        this.changeMonth();
        this.changeYear();
        //this.reloadDateList()

    }
    else
    {
        if(this.inited)
        {
            this.pick(true_cbrq)
        }
        else {
            this.reloadDateList();
        }
    }
}
DatePicker.prototype.pick=function(true_cbrq)
{
    if(this.grid_picked)
    {
        this.grid_picked.style.backgroundColor=this.enableBackColor;

    }
    var grid=this.obj_enable["div_"+true_cbrq];
    if(grid)
    {
        grid.style.backgroundColor=this.enableBackColorPicked;
        this.grid_picked=grid;
    }
}
DatePicker.getDateStr=function(dt)
{
    var arr_day=["","一","二","三","四","五","六","日"];
    var str_date=dt.getFullYear()+"年"+(dt.getMonth()+1)+"月"+dt.getDate()+"日 星期"+arr_day[dt.getDay()];
    return str_date;
}
DatePicker.getDateStr2=function(dt)
{
    var str_date2=dt.getFullYear()+(dt.getMonth()+1+100+"").substr(1)+(dt.getDate()+100+"").substr(1);
    return str_date2;
}
//八位纯数字日期加两个杠，变成十位标准日期
DatePicker.addGang=function(str)
{
    var str_res=str.substr(0,4)+"-"+str.substr(4,2)+"-"+str.substr(6,2);
    return str_res;
}
//八位纯数字日期加上汉字年月日，并且去掉补位的0
DatePicker.addNYR=function(str)
{
    var str_res=str.substr(0,4)+"年"+parseInt(str.substr(4,2))+"月"+parseInt(str.substr(6,2))+"日";
    return str_res;
}
