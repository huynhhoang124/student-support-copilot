'use strict';

const { documentClient } = require('../lib/db');

/**
 * Handler lấy hồ sơ sinh viên theo mã số.
 * @param {import('aws-lambda').APIGatewayProxyEventV2} event
 */
module.exports.get = async (event) => {
  // Lấy id sinh viên từ đường dẫn
  const studentId = event?.pathParameters?.id;

  if (!studentId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Thiếu mã sinh viên trong yêu cầu.' })
    };
  }

  try {
    const result = await documentClient
      .get({
        TableName: process.env.STUDENTS_TABLE,
        Key: { id: studentId }
      })
      .promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Không tìm thấy sinh viên.' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error('Lỗi khi đọc hồ sơ sinh viên', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Lỗi máy chủ nội bộ.' })
    };
  }
};
