'use strict';

const { v4: uuid } = require('uuid');
const { documentClient } = require('../lib/db');

/**
 * Handler đăng ký môn học và lưu bản ghi vào DynamoDB.
 */
module.exports.post = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { studentId, courseId } = body;

    if (!studentId || !courseId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Thiếu mã sinh viên hoặc môn học.' })
      };
    }

    const enrollment = {
      id: uuid(),
      studentId,
      courseId,
      createdAt: new Date().toISOString()
    };

    await documentClient
      .put({
        TableName: process.env.ENROLLMENTS_TABLE,
        Item: enrollment
      })
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(enrollment)
    };
  } catch (error) {
    console.error('Lỗi khi đăng ký môn học', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Không thể đăng ký môn học.' })
    };
  }
};
