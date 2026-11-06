ĐĂNG NHẬP RIÊNG TRÊN WEBSITE

Không dùng Firebase Authentication. Admin tạo tài khoản tại Cài đặt & quản trị. Username có thể là tên bất kỳ, không cần email thật. Mật khẩu được băm bằng bcrypt phía máy chủ.

Cần cấu hình trên Vercel: FIREBASE_SERVICE_ACCOUNT, AUTH_SECRET (>=32 ký tự), ADMIN_INITIAL_PASSWORD (>=8 ký tự). Sau khi khai báo, Redeploy. Admin đăng nhập bằng jsquockhanh@gmail.com và mật khẩu đã cấu hình.

Không đưa service-account JSON hoặc AUTH_SECRET vào GitHub/src.
