const cloud = require('wx-server-sdk') // 引入微信云开发 SDK
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 初始化云环境
const db = cloud.database() // 获取数据库引用

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 从 'messages' 集合中获取所有留言
    const messages = await db.collection('messages').get()
    return {
      success: true, // 返回成功状态
      data: messages.data // 返回留言数据
    }
  } catch (err) {
    console.error('获取留言失败：', err) // 记录错误信息
    return { 
      success: false, // 返回失败状态
      error: err // 返回错误信息
    }
  }
  
}