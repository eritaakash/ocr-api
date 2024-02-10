const pdfPoppler = require('pdf-poppler');

async function convertPdfToImages(pdfPath, outputPath) {
    const options = {
        format: 'jpeg',  // You can specify the output image format here (e.g., 'jpeg', 'png')
        out_dir: outputPath,
        out_prefix: 'page',  // Prefix for output image files
        page: null,  // Convert all pages
    };

    try {
        const images = await pdfPoppler.convert(pdfPath, options);
        console.log('Images converted successfully:', images);
    } catch (error) {
        console.error('Error converting PDF to images:', error);
    }
}

module.exports = convertPdfToImages;