'use strict';

const { documentClient } = require('../lib/db');

/**
 * Handler trả về các câu hỏi FAQ phổ biến dựa trên số lượt xem.
 */
module.exports.get = async (event) => {
  const limit = Number(event?.queryStringParameters?.limit || 5);

  try {
    const result = await documentClient
      .scan({ TableName: process.env.FAQ_TABLE })
      .promise();

    const faqs = (result.Items || [])
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);

    return {
      statusCode: 200,
      body: JSON.stringify(faqs)
    };
  } catch (error) {
    console.error('Lỗi khi lấy FAQ phổ biến', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Không thể lấy danh sách FAQ phổ biến.' })
    };
  }
};
