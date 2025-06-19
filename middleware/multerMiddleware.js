// for handle receiving file

import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) =>{
        const fileName = file.originalname;
        cb(null, fileName);
    },
});

const upload = multer({storage});

// const upload = multer({ storage: multer.memoryStorage() });


export default upload;