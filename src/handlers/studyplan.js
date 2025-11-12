'use strict';

const { generateStudyPlan } = require('../lib/gpt');

/**
 * Handler gợi ý kế hoạch học tập cá nhân hóa.
 */
module.exports.post = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { goals, strengths, weaknesses, timeframe } = body;

    if (!goals || !timeframe) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Cần mô tả mục tiêu và thời gian dự kiến.' })
      };
    }

    const plan = await generateStudyPlan({ goals, strengths, weaknesses, timeframe });

    return {
      statusCode: 200,
      body: JSON.stringify({ plan })
    };
  } catch (error) {
    console.error('Lỗi khi gợi ý kế hoạch học tập', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Không thể tạo kế hoạch học tập với GPT.' })
    };
  }
};
