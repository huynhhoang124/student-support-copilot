'use strict';

const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

// Đảm bảo AWS SDK dùng region mặc định
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

const options = {};

// Khi chạy offline sử dụng endpoint DynamoDB Local
if (process.env.IS_OFFLINE || process.env.AWS_DYNAMODB_ENDPOINT) {
  options.endpoint = process.env.AWS_DYNAMODB_ENDPOINT || 'http://localhost:8000';
  options.accessKeyId = process.env.AWS_ACCESS_KEY_ID || 'local';
  options.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || 'local';
}

// Tạo DocumentClient dùng chung
const documentClient = new AWS.DynamoDB.DocumentClient(options);

module.exports = {
  AWS,
  documentClient
};
