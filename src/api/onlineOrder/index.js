import request from '@/utils/request'

export function getGood(ic) {
  return request({
    url: `api/order/getGood/${ic}`,
    method: 'get'
  })
}

export function appoint(data) {
  return request({
    url: 'api/order/appoint',
    method: 'post',
    data
  })
}

export default { appoint, getGood }
