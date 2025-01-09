const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Đường dẫn thư mục lưu trữ file
const UPLOAD_DIR = path.join(__dirname, "../uploads/products");

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true }); // Tạo thư mục, bao gồm các thư mục cha nếu cần
}

// Cấu hình nơi lưu file và đặt tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // Lưu file vào thư mục uploads/products
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// Kiểm tra loại file (ví dụ: chỉ chấp nhận hình ảnh)
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Giới hạn kích thước file (ví dụ: 2MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter,
});

export default upload;
