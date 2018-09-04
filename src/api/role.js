import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'api/admin/permission/roles',
    method: 'get',
    params: query
  })
}

export function getAllPermission() {
  return request({
    url: 'api/admin/permission/getAllPermission',
    method: 'get'
  })
}

export function getRolePermission(query) {
  return request({
    url: 'api/admin/permission/getRolePermission',
    method: 'get',
    params:query
  })
}

export function roles(data) {
  return request({
    url: 'api/admin/permission/roles',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/admin/permission/roles/',
    method: 'put',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: 'api/admin/permission/roles',
    method: 'delete',
    data
  })
}