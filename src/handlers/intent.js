'use strict';

const { classifyIntent } = require('../lib/gpt');

/**
 * Handler gửi nội dung hội thoại lên GPT để phân loại ý định.
 */
module.exports.post = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const text = body.text;

    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Thiếu nội dung cần phân loại.' })
      };
    }

    const intent = await classifyIntent(text);

    return {
      statusCode: 200,
      body: JSON.stringify({ intent })
    };
  } catch (error) {
    console.error('Lỗi khi phân loại ý định', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Không thể phân loại ý định từ GPT.' })
    };
  }
};
