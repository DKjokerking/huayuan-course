// 云函数: login
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  const { username, password } = event;
  const user = await db.collection('users').where({
    username: username
  }).get();

  if (user.data.length > 0) {
    if (user.data[0].password === password) {
      // 登录成功
      return { success: true, userInfo: user.data[0] , message: '登录成功'};
    } else {
      // 密码错误
      return { success: false, message: '密码错误' };
    }
  } else {
    // 注册新用户
    await db.collection('users').add({
      data: {
        username: username,
        password: password,
        avatar: 'cloud://scut-bkt-7gj2a5dfb4edd50d.7363-scut-bkt-7gj2a5dfb4edd50d-1331566483/avatars/default_avatar.png', // 此为默认头像，具体头像可以在个人信息页面中设置
        nickname: '信工人',
        class: 'xx级信工x班'
      }
    });
    return { success: false, message: '注册成功，请重新登陆' };
  }
};
