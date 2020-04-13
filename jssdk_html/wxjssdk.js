function ajax(options){
    //创建一个ajax对象
    var xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft,XMLHTTP");
    //数据的处理 {a:1,b:2} a=1&b=2;
    var str = "";
    for(var key in options.data){
        str+="&"+key+"="+options.data[key];
    }
    str = str.slice(1)
    if(options.type == "get"){
        var url = options.url+"?"+str;
        xhr.open("get",url);
        xhr.send();
    }else if(options.type == "post"){
        xhr.open("post",options.url);
        xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
        xhr.send(str)
    }
    //监听
    xhr.onreadystatechange = function(){
        //当请求成功的时候
        if(xhr.readyState == 4 && xhr.status == 200){
            var d = xhr.responseText;
            //将请求的数据传递给成功回调函数
            options.success&&options.success(d)
        }else if(xhr.status != 200){
            //当失败的时候将服务器的状态传递给失败的回调函数
            options.error&&options.error(xhr.status);
        }
    }
}
function wxjs2(){
    var _shareurl = window.location.href;
    var url = location.href.split('#')[0];//（前台传到后台的url，比后台用request.getRequestURL准确）
    url = encodeURIComponent(url)
    console.log(url)
    ajax({
        type:"get",
        url:"/api/gvrchat/jssdk",//后台接口路径
        data:{url:url},
        success:function(data){
            console.log(data)
            var obj = JSON.parse(data).data;

            console.log(obj);
            wx.config({
                debug: true,
                appId: obj.appId,
                timestamp: obj.timestamp,
                nonceStr: obj.nonceStr,
                signature: obj.signature,
                jsApiList: ['updateAppMessageShareData','updateTimelineShareData']
            });
            // var formLst = JSON.parse($("#session").html());
            var friendShareTitle = "全景图测试";
            var friendShareDesc = "点我点我点我点我点我点我点我点我点我点我点我点我点我点我点我点我点我全景图全景图全景图全景图";
            var friendShareImgUrl = "http://video2.gvrcraft.com/pic/yxk.jpg";

            var cfShareTitle = "";
            var cfShareImgUrl = "";

            wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
                wx.updateAppMessageShareData({
                    title: friendShareTitle, // 分享标题
                    desc: friendShareDesc, // 分享描述
                    link: _shareurl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: friendShareImgUrl // 分享图标

                });

                wx.updateTimelineShareData({
                    title: cfShareTitle, // 分享标题
                    link: _shareurl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                    imgUrl: cfShareImgUrl // 分享图标

                });
                elseShareMathod(cfShareTitle,_shareurl,cfShareImgUrl,friendShareDesc)
                wx.error(function (res) {
                    alert(res.toString())
                });
            });
        }
    })
}
function elseShareMathod(title,link,imgUrl,desc){
    wx.updateTimelineShareData({
        title: title, // 分享标题
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        success: function () {
            // 设置成功
        }
    })
    wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        success: function () {
            // 用户点击了分享后执行的回调函数
        }
    })
    wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        // type: '', // 分享类型,music、video或link，不填默认为link
        // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户点击了分享后执行的回调函数
        }
    });
    wx.onMenuShareQQ({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareWeibo({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareQZone({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });

}
wxjs2()