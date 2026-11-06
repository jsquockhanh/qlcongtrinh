# Quản lý chi phí công trình – React Create React App + Firebase

Dự án dùng cấu trúc React kiểu Create React App (không dùng Vite): `public/`, `src/App.js`, `src/index.js`, `package.json`.

## Firebase
- Firebase Authentication: đăng nhập/đăng ký email và mật khẩu.
- Cloud Firestore: lưu projects, parties, expenses theo `ownerId`.
- Firebase Web Config được đặt trực tiếp trong `src/App.js`.
- Không dùng service account key hoặc service_role secret ở trình duyệt.

## Chạy local
```bash
npm install
npm start
```

## Build
```bash
npm run build
```

## Triển khai Vercel
Import repository GitHub vào Vercel. Framework: Create React App; Build Command: `npm run build`; Output Directory: `build`. Không cần khai báo biến môi trường VITE.

## Firestore Rules
Dùng nội dung `firestore.rules` trong Firebase Console → Firestore Database → Rules → Publish. Rules giới hạn dữ liệu theo UID đăng nhập.

Lưu ý: cần bật Authentication → Email/Password và tạo Firestore Database trước khi dùng.
