// cloudfunctions/addPost/index.js
const db = wx.cloud.database();

exports.main = async (event, context) => {
  try {
    const { title, content, images } = event;
    const result = await db.collection('posts').add({
      data: {
        title,
        content,
        images,
        createdAt: db.serverDate(),
        commentsCount: 0
      }
    });
    return {
      id: result._id
    };
  } catch (e) {
    console.error(e);
    return {
      error: e.message
    };
  }
};
