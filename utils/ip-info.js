require('dotenv').config();
const request = require('request');
const IP_INFO_API_KEY = process.env.IP_INFO_API_KEY || '';

const ipinformation = (ip, callback) => {
    const url = `https://ipinfo.io/${(ip)?ip+'/':''}?token=${IP_INFO_API_KEY}`;
    request({url, json:true}, (error, {body})=>{
        if(error) {
            return callback(error);
        }else {
            return (callback(body));
        }
    });
}

module.exports = ipinformation;