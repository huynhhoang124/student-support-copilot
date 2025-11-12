'use strict';

const { summarizeTicket } = require('../lib/gpt');

/**
 * Handler tóm tắt nội dung khiếu nại để hỗ trợ bộ phận chăm sóc.
 */
module.exports.post = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { title, description, updates = [] } = body;

    if (!title || !description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Cần cung cấp tiêu đề và mô tả khiếu nại.' })
      };
    }

    const summary = await summarizeTicket({ title, description, updates });

    return {
      statusCode: 200,
      body: JSON.stringify({ summary })
    };
  } catch (error) {
    console.error('Lỗi khi tóm tắt khiếu nại', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Không thể tóm tắt khiếu nại với GPT.' })
    };
  }
};
