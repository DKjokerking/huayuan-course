const cloud = require('wx-server-sdk') // 引入微信云开发 SDK
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 初始化云环境
const db = cloud.database() // 获取数据库引用

// 主函数，处理获取留言的请求
exports.main = async (event, context) => {
  const { content } = event // 从事件中解构出留言内容
  const wxContext = cloud.getWXContext() // 获取微信上下文信息
  console.log(wxContext)
  try {
    // 向 'messages' 集合中添加新留言
    await db.collection('messages').add({
      data: {
        content, // 留言内容
        author: wxContext.USERINFO.nickname, // 留言作者的昵称
        createTime: db.serverDate() // 创建时间
      }
    })
    return { success: true } // 返回成功状态
  } catch (err) {
    console.error('添加留言失败：', err) // 记录错误信息
    return { 
      success: false, // 返回失败状态
      error: err // 返回错误信息
    }
  }
}