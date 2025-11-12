'use strict';

const { documentClient } = require('../lib/db');
const { hashPassword } = require('../lib/auth');

/**
 * Handler đăng ký tài khoản sinh viên mới.
 */
module.exports.post = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { studentId, name, email, password } = body;

    if (!studentId || !name || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Thiếu thông tin đăng ký bắt buộc.' })
      };
    }

    const existing = await documentClient
      .get({
        TableName: process.env.STUDENTS_TABLE,
        Key: { id: studentId }
      })
      .promise();

    if (existing.Item) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'Sinh viên đã tồn tại.' })
      };
    }

    const passwordHash = await hashPassword(password);

    const student = {
      id: studentId,
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    await documentClient
      .put({
        TableName: process.env.STUDENTS_TABLE,
        Item: student
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ id: studentId, name, email })
    };
  } catch (error) {
    console.error('Lỗi đăng ký', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Không thể xử lý đăng ký.' })
    };
  }
};
