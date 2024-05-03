import request from '@/utils/request'

export function getAllAreas(name, storeId) {
  const params = {
    page: 0,
    size: 9999,
    name,
    storeId
  }
  return request({
    url: 'api/area',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/area',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/area',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/area',
    method: 'put',
    data
  })
}

export default { add, edit, del }
