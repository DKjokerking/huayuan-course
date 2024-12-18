// 云函数: updateuserinfo
const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  const { username, avatar, nickname, class: userClass } = event;
  
  await db.collection('users').where({
    username: username
  }).update({
    data: {
      avatar: avatar,
      nickname: nickname,
      class: userClass
    }
  });

  return { success: true };
};
