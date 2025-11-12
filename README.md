# Student Support Copilot

Dự án **Student Support Copilot** là một backend đơn giản chạy trên **Serverless Framework** (Node.js) + **DynamoDB Local**, đóng vai trò trợ lý học vụ cho sinh viên.

## 🎯 Mục tiêu

Xây dựng một "trợ lý hỗ trợ sinh viên" kiểu chatbot/API, có thể tích hợp vào front-end hoặc demo bằng Postman/curl.

## ✨ Tính năng chính

- **Xác thực**: Đăng ký/đăng nhập với JWT
- **Quản lý sinh viên**: Tra cứu hồ sơ, điểm, thời khóa biểu
- **FAQ + GPT**: Hỏi đáp thường gặp, fallback sang GPT
- **Phân loại ý định**: Sử dụng GPT để hiểu ý định sinh viên
- **Tạo ticket hỗ trợ**: Quản lý khiếu nại
- **GPT soạn email**: Tự động soạn email học vụ
- **Gợi ý kế hoạch học tập**: GPT gợi ý kế hoạch học tập

## 🛠️ Công nghệ

- **Node.js 18+** + Serverless Framework
- **DynamoDB Local** - Chạy hoàn toàn offline
- **OpenAI GPT** - Tích hợp AI
- **JWT** - Xác thực

## 🚀 Cài đặt nhanh

### Bước 1: Clone repository

```bash
git clone https://github.com/huynhhoang124/student-support-copilot.git
cd student-support-copilot
```

### Bước 2: Chạy script tự động tạo toàn bộ file

```bash
chmod +x setup.sh
./setup.sh
```

Script này sẽ tự động tạo:
- Tất cả các file cấu hình (package.json, serverless.yml, .env.example)
- Dữ liệu mẫu (seed/) bằng tiếng Việt
- Source code (src/) với đầy đủ handlers và libraries
- File prompts cho GPT

### Bước 3: Cài đặt dependencies

```bash
npm install
npx serverless dynamodb install
```

### Bước 4: Cấu hình .env

Tạo file `.env` từ `.env.example` và điền thông tin:

```bash
cp .env.example .env
```

Sửa file `.env`:
```
OPENAI_API_KEY=sk-your-openai-api-key
JWT_SECRET=your-secret-key
```

### Bước 5: Chạy local

Mở 2 terminal:

**Terminal 1** - DynamoDB Local:
```bash
npm run dynamodb:start
```

**Terminal 2** - API Server:
```bash
npm run start
```

API sẽ chạy tại: `http://localhost:3000`

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập

### Students
- `GET /students` - Danh sách sinh viên
- `GET /students/{id}` - Chi tiết sinh viên
- `POST /students` - Tạo sinh viên mới

### FAQ & AI
- `GET /faq?q=<query>` - Tìm kiếm FAQ (có GPT fallback)
- `POST /intent` - Phân loại ý định

### Academic
- `GET /grades/{studentId}` - Xem điểm
- `GET /timetable/{studentId}` - Xem thời khóa biểu
- `GET /enrollments/{studentId}` - Xem môn đăng ký

### Support
- `POST /tickets` - Tạo ticket hỗ trợ
- `GET /tickets?studentId=<id>` - Xem tickets

### GPT Features
- `POST /emails/send` - GPT soạn email
- `POST /studyplan` - GPT gợi ý kế hoạch học
- `GET /trending` - FAQ phổ biến

## 📝 Ví dụ sử dụng

### Đăng ký tài khoản
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@ptit.edu.vn", "password": "123456", "fullName": "Nguyễn Văn A"}'
```

### Hỏi FAQ
```bash
curl "http://localhost:3000/faq?q=học%20phí"
```

### Xem điểm
```bash
curl http://localhost:3000/grades/S001
```

## 📂 Cấu trúc thư mục

```
student-support-copilot/
├── package.json
├── serverless.yml
├── .env.example
├── setup.sh              # Script tự động tạo file
├── README.md
├── seed/                # Dữ liệu mẫu
│   ├── students.json
│   ├── courses.json
│   ├── faq.json
│   └── grades.json
└── src/
    ├── handlers/        # API handlers
    ├── lib/             # Thư viện (db, gpt, auth)
    └── prompts/         # GPT prompts
```

## ⚠️ Lưu ý

- **Dữ liệu mẫu**: Dự án có sẵn dữ liệu mẫu tiếng Việt trong folder `seed/`
- **OpenAI API Key**: Cần API key để sử dụng tính năng GPT
- **DynamoDB Local**: Chạy hoàn toàn offline, không cần AWS thật

## 🔧 Troubleshooting

**Lỗi: Cannot find module**
- Chạy: `npm install`

**DynamoDB không start**
- Kiểm tra Java đã cài: `java -version`
- Chạy lại: `npx serverless dynamodb install`

**Lỗi GPT**
- Kiểm tra OPENAI_API_KEY trong file `.env`

## 📚 Tài liệu tham khảo

- [Serverless Framework](https://www.serverless.com/)
- [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html)
- [OpenAI API](https://platform.openai.com/docs)

## 👨‍💻 Tác giả

Tạo bởi ChatGPT & Comet

## 📝 License

MIT License
