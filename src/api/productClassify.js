import request from '@/utils/request'

export function getSecondRootClassify() {
    return request({
      url: 'api/admin/productClassify/getSecondRootClassify',
      method: 'get'
    })
}

export function fetchList(query) {
  return request({
    url: 'api/admin/productClassifies',
    method: 'get',
    params:query
  })
}

export function productClassifies(data) {
  return request({
    url: 'api/admin/productClassifies',
    method: 'post',
    data
  })
}

export function updateClassify(data) {
  return request({
    url: 'api/admin/productClassifies',
    method: 'put',
    data
  })
}

export function deleteProductClassify(data) {
  return request({
    url: 'api/admin/productClassifies',
    method: 'delete',
    data
  })
}

export function getRootClassify() {
  return request({
    url: 'api/admin/productClassify/getRootClassify',
    method: 'get'
  })
}

export function getClassify(query) {
  return request({
    url: 'api/admin/productClassify/getClassify',
    method: 'get',
    params: query
  })
}

