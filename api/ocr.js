const { Router } = require('express');
const multer = require('multer');

const router = Router();
const upload = multer();

const extractText = require('../tesseract');
const languages = require('../languages');

router.post('/ocr', upload.single('file'), async (req, res) => {

    const buffer = req.file.buffer;
    const image = Buffer.from(buffer);

    const lang = languages.find(l => l.name.toLowerCase() === req.query.lang);
    const langCode = lang ? lang.code : 'eng';

    const text = await extractText(langCode, image);
    res.json({ text });

});

module.exports = router;