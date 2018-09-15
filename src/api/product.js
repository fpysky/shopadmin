import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'api/admin/products',
    method: 'get',
    params: query
  })
}

export function products(data) {
  return request({
    url: 'api/admin/products',
    method: 'post',
    data
  })
}

export function updateProducts(data) {
  return request({
    url: 'api/admin/products',
    method: 'put',
    data
  })
}

export function deleteProduct(data) {
  return request({
    url: 'api/admin/products',
    method: 'delete',
    data
  })
}

export function getAttributes(query) {
  return request({
    url: 'api/admin/productSkuAttributes/' + query,
    method: 'get'
  })
}


export function saveAttribute(data) {
  return request({
    url: 'api/admin/productSkuAttributes',
    method: 'post',
    data
  })
}


export function deleteAttributes(data) {
  return request({
    url: 'api/admin/productSkuAttributes/'+ data,
    method: 'delete'
  })
}

export function deleteSku(data) {
  return request({
    url: 'api/admin/productSku',
    method: 'delete',
    data
  })
}

export function getProduct(query) {
  return request({
    url: 'api/admin/products/' + query,
    method: 'get'
  })
}

export function updateColor(data) {
  return request({
    url: 'api/admin/products/updateColor',
    method: 'put',
    data
  })
}

export function getSellProducts() {
  return request({
    url: 'api/admin/getSellProducts',
    method: 'get'
  })
}