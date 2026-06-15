// require crypto, multer, and path modules
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
//configure multer storage and file filter
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "uploads/");
    },
    filename: (req, file, cb)=>{
        // generate a unique filename using current timestamp and random bytes
        const uniquesuffix = crypto.randomBytes(16).toString("hex");
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${uniquesuffix}${ext}`);
    }
});
const allowedTypes = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  // Add more allowed file types as needed
  // Example for PDF, Word, and ZIP files
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/zip": [".zip"],
};
const fileFilter = (req, file, cb)=>{
    const validationExtension = allowedTypes[file.mimetype];
   
    if(!allowedTypes[file.mimetype]){
       
            cb(new Error("Invalid file type. Only JPEG, PNG, GIF, PDF, Word, and ZIP files are allowed."), false);
        }
    if(! validationExtension.includes(path.extname(file.originalname).toLowerCase())){
      
        cb(new Error("Invalid file extension. Only JPEG, PNG, GIF, PDF, Word, and ZIP files are allowed."), false);
    }
    cb(null, true);
};
// create multer instance with the defined storage and file filter
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // limit file size to 10MB

// export the configured multer instance
module.exports = upload;