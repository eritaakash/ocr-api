const { createWorker } = require('tesseract.js');

const extractText = async (lang, img) => {
    const worker = await createWorker(lang);
    const ret = await worker.recognize(img);
    await worker.terminate();
    return ret.data.text;
};

module.exports = extractText;