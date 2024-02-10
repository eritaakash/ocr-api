const { Router } = require('express');
const multer = require('multer');

const router = Router();
const upload = multer();

const extractText = require('../tesseract');
const languages = require('../languages');

router.post('/ocr', upload.single('file'), async (req, res) => {

    const buffer = req.file.buffer;
    const image = Buffer.from(buffer);

    const lang = languages.find(l => l.code.toLowerCase() === req.query.lang);
    const langCode = lang ? lang.code : 'eng';

    const text = await extractText(langCode, image);
    res.json({ text });
});

const fs = require('fs');
const path = require('path');

const pdfPoppler = require('pdf-poppler');

router.post('/pdf', upload.single('file'), async (req, res) => {

    const pdfFilePath = path.join(__dirname, '../public/uploads', `${Date.now()}.pdf`);
    const outputPath = path.join(__dirname, '../public/pages/' + req.query.id);
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const pdfBuffer = req.file.buffer;

        const outputPrefix = 'page'; // Prefix for output image files
        const outputFormat = 'jpeg'; // Output image format

        // Write the PDF buffer to a temporary file
        fs.writeFileSync(pdfFilePath, pdfBuffer);
        fs.mkdirSync(outputPath);

        const options = {
            format: outputFormat,
            out_dir: outputPath,
            out_prefix: outputPrefix,
            page: null,
        };

        // Convert PDF file to images
        const images = await pdfPoppler.convert(pdfFilePath, options);
        console.log('Images converted successfully:', images);

        const imgBuffers = [];
        const imagesPath = path.join(__dirname, '../public/pages/' + req.query.id);
        const imagesDir = fs.readdirSync(imagesPath);

        for (const imgfile of imagesDir) {
            const img = fs.readFileSync(path.join(imagesPath, imgfile));
            imgBuffers.push(img);
        }

        console.log('Images:', imgBuffers);
        res.status(200).json({ images: imgBuffers });

    } catch (error) {
        console.error('Error converting PDF to images:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        fs.unlinkSync(pdfFilePath);

        const output = fs.readdirSync(outputPath);

        for (const file of output) {
            fs.unlinkSync(path.join(outputPath, file));
        };

        fs.rmdirSync(outputPath);
    }
});

router.post('/hello', (req, res) => {
    res.json({ message: 'Hello, friend!' });
});

module.exports = router;