# Quản lý chi phí công trình – React Create React App + Firestore + đăng nhập riêng

## Cấu trúc
- React Create React App (`react-scripts`), không dùng Vite.
- Đăng nhập riêng trên website bằng username/mật khẩu; không dùng Firebase Authentication.
- Mật khẩu được băm bằng bcrypt ở API server Vercel; trình duyệt không nhận mật khẩu đã băm.
- Firestore vẫn lưu dữ liệu công trình dùng chung. Mọi thao tác dữ liệu đi qua API Vercel và Firebase Admin SDK.
- Giữ chức năng công trình, chi phí, đối tác, nhập/xuất Excel, logo công ty, in và số tiền bằng chữ.

## Bắt buộc cấu hình Vercel trước khi dùng
Trong Project → Settings → Environment Variables, thêm các biến sau cho Production (và Preview nếu cần):
1. `FIREBASE_SERVICE_ACCOUNT`: toàn bộ JSON service-account của Firebase project `quanlycongtrinh-a16ce` (tạo trong Google Cloud/Firebase → Service Accounts). Chỉ lưu ở Vercel server environment; tuyệt đối không đưa vào `src/` hoặc GitHub.
2. `AUTH_SECRET`: chuỗi ngẫu nhiên bí mật dài tối thiểu 32 ký tự.
3. `ADMIN_INITIAL_PASSWORD`: mật khẩu ban đầu của Admin `jsquockhanh@gmail.com`, tối thiểu 8 ký tự. Đây là mật khẩu đăng nhập trên website; không phải mật khẩu Google.

Sau khi khai báo, Redeploy. Lần đăng nhập đầu tiên bằng `jsquockhanh@gmail.com` sẽ tự khởi tạo hồ sơ Admin trong `userProfiles`. Hãy bảo quản mật khẩu Admin cẩn thận. Admin có thể tự đổi mật khẩu bằng API `/api/auth/password` sau khi đăng nhập (PATCH JSON `{ "password": "mat-khau-moi" }`).

## Quy trình cập nhật
1. Sao lưu Firestore trước khi thay đổi.
2. Đẩy toàn bộ thư mục dự án lên GitHub.
3. Vercel kết nối GitHub: Framework Preset `Create React App`, Build Command `npm run build`, Output Directory `build`.
4. Thêm 3 biến môi trường ở trên và Redeploy.
5. Firestore → Rules: Publish nội dung trong `firestore.rules`. Quy tắc này chặn truy cập trực tiếp từ trình duyệt; API máy chủ dùng Admin SDK để truy cập.

## Tài khoản người dùng
- Admin đăng nhập bằng `jsquockhanh@gmail.com`.
- Admin tạo username và mật khẩu trực tiếp tại Cài đặt & quản trị. Username không cần là email thật.
- Admin có thể khóa/mở khóa, đặt mật khẩu mới và xóa tài khoản phụ.
- Người dùng đăng nhập bằng username và mật khẩu.
- Không có đăng ký công khai. Không lưu mật khẩu dạng chữ thường.

## Lưu ý quan trọng
- Không cần Firebase Authentication và không cần nâng Firebase lên Blaze chỉ để xác thực tài khoản. Firestore vẫn thuộc Firebase; API dùng Admin SDK phía Vercel.
- Service account có quyền cao: chỉ đặt trong Environment Variables của Vercel, không chia sẻ và không commit lên GitHub. Nếu nghi lộ khóa, thu hồi và tạo khóa mới.
- Dữ liệu cũ có `ownerId: 'main'` tiếp tục được dùng chung. Các bản ghi cũ còn `ownerId` là UID riêng sẽ không tự động nhập chung trong phiên bản này để tránh gộp nhầm dữ liệu; cần sao lưu và rà soát riêng trước khi chuyển.
- API dùng Firestore Admin SDK; quy tắc Firestore chặn truy cập trực tiếp từ client.
