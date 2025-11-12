'use strict';

const { documentClient } = require('../lib/db');

/**
 * Handler trả danh sách FAQ.
 */
module.exports.get = async () => {
  try {
    const result = await documentClient
      .scan({ TableName: process.env.FAQ_TABLE })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items || [])
    };
  } catch (error) {
    console.error('Lỗi khi truy vấn FAQ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Không thể tải danh sách FAQ.' })
    };
  }
};
