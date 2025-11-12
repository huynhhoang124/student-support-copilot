'use strict';

const { documentClient } = require('../lib/db');

/**
 * Handler tạo thời khóa biểu dựa trên các môn sinh viên đã đăng ký.
 */
module.exports.get = async (event) => {
  const studentId = event?.pathParameters?.studentId;

  if (!studentId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Thiếu mã sinh viên.' })
    };
  }

  try {
    const enrollmentResult = await documentClient
      .scan({
        TableName: process.env.ENROLLMENTS_TABLE,
        FilterExpression: '#studentId = :studentId',
        ExpressionAttributeNames: {
          '#studentId': 'studentId'
        },
        ExpressionAttributeValues: {
          ':studentId': studentId
        }
      })
      .promise();

    const enrollments = enrollmentResult.Items || [];

    if (enrollments.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify([])
      };
    }

    const courseIds = enrollments.map((item) => item.courseId);

    const courseResult = await documentClient
      .batchGet({
        RequestItems: {
          [process.env.COURSES_TABLE]: {
            Keys: courseIds.map((id) => ({ id }))
          }
        }
      })
      .promise();

    const courses = courseResult?.Responses?.[process.env.COURSES_TABLE] || [];

    const timetable = enrollments.map((enrollment) => {
      const course = courses.find((item) => item.id === enrollment.courseId) || {};
      return {
        courseId: enrollment.courseId,
        title: course.title,
        instructor: course.instructor,
        // Tạo slot giả lập theo thứ tự đăng ký để demo
        slot: `Thứ ${((enrollments.indexOf(enrollment) + 1) % 5) + 2} - Tiết ${(enrollments.indexOf(enrollment) + 1) * 2}`
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(timetable)
    };
  } catch (error) {
    console.error('Lỗi khi dựng thời khóa biểu', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Không thể dựng thời khóa biểu.' })
    };
  }
};
