import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'api/admin/indexBanners',
    method: 'get',
    params: query
  })
}

export function deleteIndexBanner(data) {
    return request({
      url: 'api/admin/indexBanners',
      method: 'delete',
      data
    })
}

export function indexBanners(data) {
    return request({
      url: 'api/admin/indexBanners',
      method: 'post',
      data
    })
}

export function updateIndexBanner(data) {
    return request({
      url: 'api/admin/indexBanners',
      method: 'put',
      data
    })
}


export function getIndexBanner(query) {
    return request({
      url: 'api/admin/indexBanners/' + query,
      method: 'get'
    })
}