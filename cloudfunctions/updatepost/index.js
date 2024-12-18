// cloudfunctions/updatePost/index.js
const db = wx.cloud.database();

exports.main = async (event, context) => {
  try {
    const { id, title, content, images } = event;
    await db.collection('posts').doc(id).update({
      data: {
        title,
        content,
        images,
        updatedAt: db.serverDate()
      }
    });
    return {
      success: true
    };
  } catch (e) {
    console.error(e);
    return {
      error: e.message
    };
  }
};
