import request from '@/utils/request'

export function getAllOrder(name) {
  const params = {
    page: 0,
    size: 9999,
    name
  }
  return request({
    url: 'api/order',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/order',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/order',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/order',
    method: 'put',
    data
  })
}

export default { add, edit, del }
