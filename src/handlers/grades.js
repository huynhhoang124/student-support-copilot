'use strict';

const { documentClient } = require('../lib/db');

/**
 * Handler xem bảng điểm theo studentId.
 */
module.exports.get = async (event) => {
  const studentId = event?.pathParameters?.studentId;
  const term = event?.queryStringParameters?.term;

  if (!studentId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Thiếu mã sinh viên.' })
    };
  }

  try {
    const params = {
      TableName: process.env.GRADES_TABLE,
      KeyConditionExpression: '#studentId = :studentId',
      ExpressionAttributeNames: {
        '#studentId': 'studentId'
      },
      ExpressionAttributeValues: {
        ':studentId': studentId
      }
    };

    if (term) {
      params.KeyConditionExpression += ' AND #term = :term';
      params.ExpressionAttributeNames['#term'] = 'term';
      params.ExpressionAttributeValues[':term'] = term;
    }

    const result = await documentClient.query(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items || [])
    };
  } catch (error) {
    console.error('Lỗi khi lấy bảng điểm', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Không thể tải bảng điểm.' })
    };
  }
};
