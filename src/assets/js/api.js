import axios from 'axios'
import qs from 'qs'
import Promise from 'es6-promise'
import router from '../../router'
// const baseURL = process.env.NODE_ENV == "development" ? '/api' : null;
const baseURL = null
let timerArrs = {}
axios.interceptors.request.use(
  (config) => {
    config.headers['CSRFPreventionToken'] =
      localStorage.getItem('token') || null
    return config
  },
  (err) => {
    console.log(err)
    return Promise.reject(err)
  },
)
axios.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status == 401) router.push('/login')
    // 对响应错误做点什么
    return Promise.reject(error)
  },
)
function post(url, data, useInterval = false) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      baseURL: baseURL,
      url: url,
      data: data,
    })
      .then((response) => {
        if (useInterval) {
          getBuf(response, resolve)
        } else {
          resolve(response)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  })
}
function put(url, data, useInterval = false) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'PUT',
      baseURL: baseURL,
      url: url,
      data: data,
    })
      .then((response) => {
        if (useInterval) {
          getBuf(response, resolve)
        } else {
          resolve(response)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  })
}
function get(url, params, useInterval = false) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      baseURL: baseURL,
      url: url,
      params,
      timeout: 20000,
      paramsSerializer: (params) => {
        return qs.stringify(params, {
          indices: false,
        })
      },
    })
      .then((response) => {
        if (useInterval) {
          getBuf(response, resolve)
        } else {
          resolve(response)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

function deletes(url, params, useInterval = false) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'delete',
      baseURL: baseURL,
      url: url,
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, {
          indices: false,
        })
      },
    })
      .then((response) => {
        if (useInterval) {
          getBuf(response, resolve)
        } else {
          resolve(response)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  })
}
function getBuf(response, resolve) {
  clearInterval(timerArrs[response.uuid])
  timerArrs[response.uuid] = null
  delete timerArrs[response.uuid]
  timerArrs[response.uuid] = setInterval(() => {
    axios({
      method: 'get',
      baseURL,
      url: '/webapp/get_buf?remote_ip=' + router.currentRoute._value.query.ip,
      params: {
        method: response.task,
        method_uuid: response.uuid,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, {
          indices: false,
        })
      },
    })
      .then((res) => {
        if (res.state != 1001) {
          clearInterval(timerArrs[response.uuid])
          timerArrs[response.uuid] = null
          delete timerArrs[response.uuid]
          resolve(res)
        }
      })
      .catch(() => {
        clearInterval(timerArrs[response.uuid])
        timerArrs[response.uuid] = null
        delete timerArrs[response.uuid]
      })
  }, 50)
}
// 请求方式的配置
export default {
  post,
  get,
  deletes,
  put,
}
