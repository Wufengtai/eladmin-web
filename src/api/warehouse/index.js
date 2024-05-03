import request from '@/utils/request'

export function getAllStores(name) {
  const params = {
    page: 0,
    size: 9999,
    name
  }
  return request({
    url: 'api/store',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/store',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/store',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/store',
    method: 'put',
    data
  })
}

export default { add, edit, del }
