import request from '@/utils/request'

export function loginByUsername(data) {
  return request({
    url: 'oauth/token',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: 'api/admin/user',
    method: 'get',
  })
}

export function geetest_api_v1() {
  return request({
    url: 'api/admin/geetest_api_v1',
    method: 'post'
  })
}

export function valiGeet(data) {
  return request({
    url: 'api/admin/valiGeet',
    method: 'post',
    data
  })
}