import i18n from '../../lang';
import api from "./api";
function formatTime(time) {
  if (time) {
    var dateTime = new Date(time);
  } else {
    dateTime = new Date();
  }
  var y = dateTime.getFullYear();
  var m = dateTime.getMonth() + 1;
  var d = dateTime.getDate();
  var h = dateTime.getHours();
  var mm = dateTime.getMinutes();
  var s = dateTime.getSeconds();
  return (
    y +
    "-" +
    add0(m) +
    "-" +
    add0(d) +
    " " +
    add0(h) +
    ":" +
    add0(mm) +
    ":" +
    add0(s)
  );
}
function add0(m) {
  return m < 10 ? "0" + m : m;
}
async function checkIP(rule, value) {
  let re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //正则表达式
  if (!value) return Promise.reject(i18n.global.t('validate.required'));
  if (re.test(value)) {
    if ( RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256 )
      return Promise.resolve();
    else return Promise.reject(i18n.global.t('validate.iperr'));
  } else {
    return Promise.reject(i18n.global.t('validate.iperr'));
  }
}
function checkIPandCIDR(rule, value) {
  let re1 = /^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d+)$/;
  if (!value) return Promise.resolve();
  if (re1.test(value)) {
    if ( RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256 ) {
      if ( RegExp.$5 <= 32 && RegExp.$5 >= 8){
        return Promise.resolve();
      }else {
        return Promise.reject(i18n.global.t('validate.validcidr') + ': 8-32')
      }
    }else {
      return Promise.reject(i18n.global.t('common.example') + ': 192.168.1.1/24')
    }
  }else {
    return Promise.reject(i18n.global.t('common.example') + ': 192.168.1.1/24')
  }
}

function checkIPV6andCIDR(rule, value) {
  let re1 = /([0-9a-fA-F]*:{1,4}){1,7}[0-9a-fA-F]{1,4}\/(\d+)$/g;
  if (!value) return Promise.resolve();
  if (re1.test(value)) {
    let arr = value.split('/');
    if (arr[1] >=8 && arr[1] <= 128) {
      return Promise.resolve();
    }else {
      return Promise.reject(i18n.global.t('validate.validcidr') + ': 8-128')
    }
  }else {
    return Promise.reject(i18n.global.t('common.example') + ': 2001:DB8::42/64')
  }
}
function checkIPV6(rule, value) {
  let re1 = /([0-9a-fA-F]*:{1,4}){1,7}[0-9a-fA-F]{1,4}$/g;
  if (!value) return Promise.resolve();
  if (re1.test(value)) {
    return Promise.resolve();
  }else {
    return Promise.reject(i18n.global.t('common.example') + ': 2001:DB8::42')
  }
}
function checkName(rule, value) {
  let re = /^[A-Za-z0-9]+$/ ; //正则表达式
  if (!value) return Promise.resolve();
  if (re.test(value)) {
    return Promise.resolve();
  } else {
    return Promise.reject(i18n.global.t('validate.lettersornumbersaresupported'));
  }
}
function checkIDName(rule, value){
  let re1 = /^\w+$/;
  let re2 = /^[a-zA-Z]/;
  let re3 = /[A-Za-z0-9]$/;
  if (!value) return Promise.reject(i18n.global.t('validate.required'));
  if (re1.test(value)) {
    if (re2.test(value) && re3.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(i18n.global.t('validate.muststartwidthalettersendwidthalettersornumber'));
  } else {
    return Promise.reject(i18n.global.t('validate.lettersornumbersaresupportedorunderscores'));
  }
}
function checkHexadecimalID(rule, value){
  let re = /[0-9a-fA-F]{4}$/;
  if (!value) return Promise.reject(i18n.global.t('validate.required'));
  if (re.test(value)) {
    return Promise.resolve();
  }else {
    return Promise.reject(i18n.global.t('validate.idformaterr'));
  }
}
function checkPath(rule, value){
  let re =  /^\/(\w+\/?)+$/;
  if (!value) return Promise.reject(i18n.global.t('validate.required'));
  if (re.test(value)) {
    return Promise.resolve();
  } else {
    return Promise.reject(i18n.global.t('validate.patherr'));
  }
}
function checkPasswd(rule, value){
  let re = /[^\x00-\xff]/g;
  if (!value) return Promise.reject(i18n.global.t('validate.required'));
  if (re.test(value)) {
    return Promise.reject(i18n.global.t('validate.chinesecharactersarenotallowed'));
  } else {
    return Promise.resolve();
  }
}
function unitConversion(val){
  if (val >= 1024 &&  val < 1048576 ){
    return (val / 1024).toFixed(2) + 'GiB';
  }else if (val >= 1048576) {
    return (val / (1024 * 1024)).toFixed(2) + 'TiB';
  }else {
    return val.toFixed(2) + 'MiB';
  }
}
function checkBytes(num){
  return (num > 0) && ((num & (num - 1)) == 0);
}
function byteConvert(bytes) {
  if (isNaN(bytes)) {
      return '';
  }
  var symbols = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var exp = Math.floor(Math.log(bytes)/Math.log(2));
  if (exp < 1) {
      exp = 0;
  }
  var i = Math.floor(exp / 10);
  bytes = bytes / Math.pow(2, 10 * i);

  if (bytes.toString().length > bytes.toFixed(2).toString().length) {
      bytes = bytes.toFixed(2);
  }
  return bytes + ' ' + symbols[i];
}
function byteConvert_monitor(bytes) {
  if (isNaN(bytes)) {
      return '';
  }
  var symbols = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  var exp = Math.floor(Math.log(bytes)/Math.log(2));
  if (exp < 1) {
      exp = 0;
  }
  var i = Math.floor(exp / 10);
  bytes = bytes / Math.pow(2, 10 * i);

  if (bytes.toString().length > bytes.toFixed(2).toString().length) {
      bytes = bytes.toFixed(1);
  }
  return bytes + ' ' + symbols[i];
}
function values_filter(values, start, name, sum_num, step) {
  let detaildata = {
    data: [],
    time: [],
    name: name
  }
  let second = Number(start)
  let steps = Number(step) || 3
  if (values.length > 0) {
    for (let i = 0; i < values.length - 1; i++) {
      let value = []
      if (values[i + 1]) {
        if (values[i + 1][0] === values[i][0] + steps) {
          value[0] = values[i][0] * 1000;
          value[1] = (parseFloat(values[i][1]) / sum_num).toFixed(2)
          detaildata.data.push(value)
        } else {
          // 填充相邻两个数据时间的缺失
          let j = values[i][0]
          while (j < values[i + 1][0]) {
            detaildata.data.push([j * 1000, null])
            j += steps
          }
        }
      }
    }
    // 填充查询starttime到返回的第一个数据之间的空缺
    if (detaildata.data[0][0] / 1000 - second >= steps) {
      let i = detaildata.data[0][0] / 1000
      while(i > second) {
        detaildata.data.unshift([i * 1000, null])
        i -= steps
      }
    }
    // 填充返回的最后一个数据到查询endtime之间的空缺
    if (second + 300 - detaildata.data[detaildata.data.length - 1][0] / 1000 >= steps) {
      let i = detaildata.data[detaildata.data.length - 1][0] / 1000 + steps
      while (i < second + 300) {
        detaildata.data.push([i * 1000, null])
        i += steps
      }
    }
  } else {
    for (let i = second; i < second + steps * 1000; i = i + steps) {
      detaildata.data.unshift([i * 1000, null])
    }
  }

  // let curr_seconds = second
  // if (second - values[values.length - 1][0] <= 3) curr_seconds = values[values.length - 1][0]
  // for (let i = curr_seconds - 300; i < curr_seconds; i += 3) {
  //   let value = values.find(item =>{
  //     return item[0] == i
  //   })
  //   if (value) {
  //     value[0] = value[0]*1000;
  //     value[1] = (parseFloat(value[1])/sum_num).toFixed(2)
  //     detaildata.data.push(value)
  //   }else {
  //     detaildata.data.push([i * 1000, null])
  //   }
  // }
  return detaildata
}
export { formatTime, checkIP, unitConversion, byteConvert, checkName, checkIDName, checkBytes, checkPath, checkIPandCIDR, checkIPV6andCIDR, checkIPV6, checkPasswd, checkHexadecimalID, byteConvert_monitor, values_filter }