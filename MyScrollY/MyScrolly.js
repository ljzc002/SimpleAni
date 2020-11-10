function MyScrolly(elem,obj_p)
{
    if(elem)
    {
        obj_p=obj_p||{};
        this.elem=elem;
        this.func_render=obj_p.func_render||MyScrolly.defaultRender;
        this.func_count=obj_p.func_count||MyScrolly.countChildren;
        this.func_render(elem,this);
        this.parentelem=obj_p.parentelem||elem;//支持拖拽、释放、禁止选择等动作的外围元素范围
        this.clientY0=this.elem.clientY;
        this.last_clientY=-1;
        //elem.onload
        var that=this;
        //使用页面观察器观察dom变化！！<-兼容性如何？？<-html5,并且会导致this被替换为MutationObserver对象，并且不好控制调用条件
        // var MutationObserver=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;
        // //var mo=new MutationObserver(that.countChildren);
        // var mo=new MutationObserver(function(records){
        //     that.func_count(that);
        // });
        // this.mo=mo;
        // var option={
        //     childList:true,
        //     subtree:true,
        // }
        //mo.observe(this.elem,option);

        this.div2.onpointerdown=function (event) {
            that.picked=true;
            that.last_clientY=event.clientY;
            that.parentelem.onselectstart=function(event){//防止在上下滑动时选中div中的文本
                event.returnValue=false;
                return false;
            }
        }
        this.parentelem.onpointerup=function (event) {
            that.picked=false;
            that.parentelem.onselectstart=null;
            //that.parentelem.onmousewheel=null;
        }
        this.parentelem.onpointerleave=function (event) {
            that.picked=false;
            that.parentelem.onselectstart=null;
            that.parentelem.onmousewheel=null;
        }
        this.parentelem.onpointermove=function (event) {
            if(that.picked==true&&(that.last_clientY>=0))
            {
                //event.preventDefault();//阻止默认的行为发生

                var int_clientY=event.clientY-that.last_clientY;//因为比较难定位elem的初始位置，这里使用相对变化量
                that.last_clientY=event.clientY;
                var top_div2=parseInt(that.div2.style.top);
                var int1=top_div2+int_clientY;
                if((that.outer_height-that.height_scrollbar)<int1)
                {
                    int1=that.outer_height-that.height_scrollbar
                }
                if(int1<0)
                {
                    int1=0
                }

                // if((that.outer_height-that.height_scrollbar)>=(top_div2+int_clientY)&&((top_div2+int_clientY)>=0))
                // {
                    that.div2.style.top=int1+"px";
                    var int2=(int1)/(that.outer_height/that.inner_height)
                    that.elem.scrollTop=int2;
                    that.div1.style.top=int2+"px";
                    //console.log(that.elem.scrollTop);
               // }


            }
        }
        //this.parentelem.onclick=function(event){
        this.parentelem.onmouseenter=function(event){
            that.parentelem.onmousewheel=function(event){
                if(that.last_clientY<0)
                {
                    that.last_clientY=0;
                }
                if((that.last_clientY>=0))
                {
                    var int_clientY=-event.wheelDelta;
                    var top_div2=parseInt(that.div2.style.top);
                    var int1=top_div2+int_clientY;
                    if((that.outer_height-that.height_scrollbar)<int1)
                    {
                        int1=that.outer_height-that.height_scrollbar
                    }
                    if(int1<0)
                    {
                        int1=0
                    }

                        that.div2.style.top=int1+"px";
                        var int2=(int1)/(that.outer_height/that.inner_height)
                        that.elem.scrollTop=int2;
                        that.div1.style.top=int2+"px";
                        //console.log(that.elem.scrollTop);

                }
            }
        }

    }
    else {
        return false;
    }


}
//MyScrolly.prototype
//计算容器内部组件的实际高度,并就此调整滚动条显示
//MyScrolly.prototype.countChildren=function(records){
MyScrolly.countChildren=function(that){
    //this=that;
    var arr=that.elem.childNodes;//如果使用MutationObserver，则这里的this是MutationObserver对象！！
    var len=arr.length;
    var sum_height=0;
    // for(var i=0;i<len;i++)//假设除了滚动条之外的所有元素都是纵向排列的！！《-这里需要递归排列！！？？
    // {
    //     var obj=arr[i];
    //     if(obj.className!="div_myscroll1")
    //     {
    //         var int=obj.offsetHeight;
    //         if(int)//有些textnode的高度可能是undefined！！
    //         {
    //             sum_height+=int;
    //         }
    //
    //     }
    // }
    //考虑到margin，换一种测量思路
    for(var i=len-1;i>0;i--)
    {
        var obj=arr[i];
        if(obj.className!="div_myscroll1")
        {
            var int=obj.offsetHeight;
            if(int)//有些textnode的高度可能是undefined！！
            {
                sum_height+=int;
                sum_height+=obj.offsetTop;
                break;
            }

        }
    }
    that.inner_height=sum_height;
    that.outer_height=that.elem.offsetHeight;
    console.log("重新测量高度"+that.outer_height+"/"+that.inner_height);
    that.div2.style.top="0px";
    that.elem.scrollTop=0;
    that.clientY0=0;
    that.picked=false;
    that.last_clientY=-1;
    if(that.inner_height<=that.outer_height)
    {
        that.div1.style.display="none";
    }
    else {
        that.div1.style.display="block";
        var int=that.outer_height*(that.outer_height/that.inner_height);
        that.height_scrollbar=int;
        that.div2.style.height=int+"px";
    }
}

MyScrolly.defaultRender=function(elem,that)
{
    elem.style.position="relative";
    elem.style.overflowX="hidden";
    elem.style.overflowY="hidden";
    var div1=document.createElement("div");
    div1.className="div_myscroll1";
    div1.style.width="10px";
    div1.style.backgroundColor="rgb(245,245,245)";
    div1.style.position="absolute";
    div1.style.right="0px";
    div1.style.top="0px";
    div1.style.height="100%";
    div1.style.zIndex=elem.style.zIndex+10;
    div1.style.display="none";
    that.div1=div1;
    var div2=document.createElement("div");
    div2.className="div_myscroll2";
    div2.style.width="10px";
    div2.style.backgroundColor="rgb(226,226,226)";
    div2.style.position="absolute";
    div2.style.right="0px";
    div2.style.top="0px";
    //div1.style.height="100%";
    div2.style.zIndex=elem.style.zIndex+20;
    that.div2=div2;
    div1.appendChild(div2);
    elem.appendChild(div1);
}
