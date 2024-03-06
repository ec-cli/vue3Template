/*
 * @Author: tuoyouxin@fpwis.com
 * @Description: 公共接口
 * @Date: 2023-08-10 19:42:39
 * @LastEditors: rk
 * @LastEditTime: 2024-01-24 09:19:01
 */
import request from '@/utils/request'

export function upload(data) {
  return request({
    url: '/common/UploadFile',
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}

/**
 * 发送邮件
 * @param {*} data
 * @returns
 */
export function sendEmail(data) {
  return request({
    url: '/common/SendEmail',
    method: 'POST',
    data
  })
}
