import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Storage setup
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (_, file, cb) => {
    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, filename);
  }
});

// General file upload filter
const generalFileFilter = (_, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/webm'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

// Profile image filter (only images)
const imageFilter = (_, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, png, gif, svg) are allowed for profile upload'), false);
  }
};


// Export two upload middlewares
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: generalFileFilter
});

export const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for profile images
  fileFilter: imageFilter
});
