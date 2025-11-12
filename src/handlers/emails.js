'use strict';

const { composeEmail } = require('../lib/gpt');

/**
 * Handler nhờ GPT soạn email trả lời sinh viên.
 */
module.exports.post = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { recipient, subject, context } = body;

    if (!recipient || !subject || !context) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Thiếu người nhận, chủ đề hoặc ngữ cảnh.' })
      };
    }

    const email = await composeEmail({ recipient, subject, context });

    return {
      statusCode: 200,
      body: JSON.stringify(email)
    };
  } catch (error) {
    console.error('Lỗi khi soạn email', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Không thể soạn email với GPT.' })
    };
  }
};
