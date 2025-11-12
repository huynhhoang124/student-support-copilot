'use strict';

const { documentClient } = require('../lib/db');
const { verifyPassword, signToken } = require('../lib/auth');

/**
 * Handler đăng nhập, trả JWT cho client.
 */
module.exports.post = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { studentId, password } = body;

    if (!studentId || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Thiếu mã sinh viên hoặc mật khẩu.' })
      };
    }

    const result = await documentClient
      .get({
        TableName: process.env.STUDENTS_TABLE,
        Key: { id: studentId }
      })
      .promise();

    if (!result.Item || !result.Item.passwordHash) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Sai thông tin đăng nhập.' })
      };
    }

    const isValid = await verifyPassword(password, result.Item.passwordHash);

    if (!isValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Sai thông tin đăng nhập.' })
      };
    }

    const token = signToken({ sub: studentId, name: result.Item.name });

    return {
      statusCode: 200,
      body: JSON.stringify({ token })
    };
  } catch (error) {
    console.error('Lỗi đăng nhập', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Không thể xử lý đăng nhập.' })
    };
  }
};
