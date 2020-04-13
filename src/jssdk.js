const cacheme = require('memory-cache');
const request = require("request-promise");
const crypto = require('crypto');
let config = {appId:'',secret:""}
/**
 * 获取access_token
 * @returns {*}
 */
function  getTokenByWechat() {
    console.log("get token ")
    let options = {
        method: 'POST',
        uri: "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appId="+config.appId+"&secret="+config.secret,
        json: true // Automatically stringifies the body to JSON
    };

    return request(options)
}
function saveToken(op,timeExpires){
    cacheme.put('access_token',op,timeExpires)
}
function getToken(){
   let op =  cacheme.get('access_token')||{access_token:''}
    return op.access_token
}
/**
 * 更新数据库中数据，时隔小于两个小时，7000s
 */
async  function updateToken() {
    let data = await getTokenByWechat()
    if(data.errcode){
        console.log('token error:',data)
        throw new Error(JSON.stringify(data));
    }

    let timeExpires = 7000*1000
    let op = {access_token:data.access_token}
    saveToken(op,timeExpires)
    return data.access_token
}

async function isTokenExpire(){
    let token = getToken();
    if(!token){

      token = await updateToken()
    }
    return token
}

async function get_ticket_by_wechat(){
    let data = await isTokenExpire()
    console.log('get jsapi_ticket')
    let options = {
        method: 'POST',
        uri: `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${data}&type=jsapi`,
        json: true // Automatically stringifies the body to JSON
    };
   return request(options)
}

function saveTicket(op,timeExpires){
    cacheme.put('ticket',op,timeExpires)
}
function getTicket(){
    let op =  cacheme.get('ticket')||{ticket:''}
    return op.ticket
}
//从微信获取jsapi_ticket
async function update_jsapi_ticket() {

    let wxdata = await get_ticket_by_wechat()
    if(wxdata.errcode){
        console.log('ticket error:',wxdata)
        throw new Error(JSON.stringify(wxdata));
    }
    let timeExpires = 7000*1000
    let op = {ticket:wxdata.ticket}
    saveTicket(op,timeExpires)
    return wxdata.ticket
}

//7200秒后jsapi_ticket失效，7000s 更新一次
async  function get_jsapi_ticket() {
    let ticket = getTicket()
    if(!ticket){
        ticket =await  update_jsapi_ticket()
    }
    return ticket
}

function raw(args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};
/**
 * 生成签名的时间戳
 * @return {字符串}
 */
function createTimestamp() {
    return parseInt(new Date().getTime() / 1000) + ''
}

/**
 * 生成签名的随机串
 * @return {字符串}
 */
function createNonceStr() {
    return Math.random().toString(36).substr(2, 15)
}

// sha1加密
function sha1(str) {
    let shasum = crypto.createHash("sha1")
    shasum.update(str)
    str = shasum.digest("hex")
    return str
}
//js-sdk，为网页端开发的方法
function jssdkSign(jsapi_ticket,noncestr,timestamp,url) {
    var ret = {jsapi_ticket:jsapi_ticket,noncestr:noncestr,timestamp:timestamp,url:url}
    let string = raw(ret);
    return sha1(string)
}

async  function jssdk(url){
    if(!url){throw new Error('获取 jsapi_ticket,需要当前网页的url，不包含#及其后面部分');}
    let jsapi_ticket =await  get_jsapi_ticket()
    let nonceStr = createNonceStr();//16位随机串
    let timestamp =createTimestamp()
    let signature =  jssdkSign(jsapi_ticket,nonceStr,timestamp,url)
    return {timestamp,nonceStr,signature,jsapi_ticket}
}
exports.getjssdk =async function(url){
    let data = await jssdk(url)
    data.appId = config.appId
    return data
}
exports.configure = function (option) {
    config = option
}