
## Build Setup

```bash
npm install qc-wechat-jssdk


```
## 介绍
调用微信 jssdk，需要后台的配合，主要是 `wx.config `中timestamp,nonceStr,signature这几个参数。
```
wx.config({
  debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  appId: '', // 必填，公众号的唯一标识
  timestamp: , // 必填，生成签名的时间戳
  nonceStr: '', // 必填，生成签名的随机串
  signature: '',// 必填，签名
  jsApiList: [] // 必填，需要使用的JS接口列表
});
```
获取签名，需要签名算法，首先要通过微信API获取jsapi_ticket(公众号用于调用微信JS接口的临时票据),有效时长7200秒。由于获取jsapi_ticket的api调用次数非常有限，频繁刷新jsapi_ticket会导致api调用受限，影响自身业务，开发者必须在自己的服务全局缓存jsapi_ticket 

而获取jsapi_ticket，还需要获取access_token，也是有次数限制，有效时长7200秒，需要开发者缓存。

为了降低开发难度，这个项目封装了从微信端获取access_token、jsapi_ticket，生成签名，并且进行缓存。

利用这个项目只需要配置上公众号的 appId,开发者密码(AppSecret),再调用方法getjssdk，就可以获取timestamp,nonceStr,signature。

这个项目利用memory-cache模块进行缓存access_token、jsapi_ticket，有效时长7000秒。

## 配置
1、配置上微信公众号的 appid，secret。在公众号：开发-》基本配置中获得
 ```
const _jssdk = require('jssdk')
_jssdk.configure({appId:'',secret:""})

```
##API

#### 方法：getjssdk(url)
**说明：获取微信 jssdk 中 wx.config 方法里需要的appId，timestamp，nonceStr，signature**

#### （1）参数：url

字段 | 类型 | 描述
---|---|---
url | String |  当前网页的URL，不包含#及其后面部分，可通过location.href.split('#')[0]方法获得;



#### （2）返回数据

字段 | 类型 | 描述
---|---|---
appId | String |  公众号的唯一标识
timestamp | String |  生成签名的时间戳
nonceStr | String |  生成签名的随机串
signature | String |  签名
jsapi_ticket | String |  公众号用于调用微信JS接口的临时票据

可通过网站验证生成的签名是否正确：https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign

数据示例：
```
{
        "timestamp": "1586741095",
        "nonceStr": "3bj2c2yovij",
        "signature": "",
        "jsapi_ticket": "",
        "appId": "",
        "url": "http://wx.fenxiang.com/a.html"
}

```
