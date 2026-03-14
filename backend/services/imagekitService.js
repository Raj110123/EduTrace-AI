const ImageKit = require('imagekit');
const fs = require('fs');
const axios = require('axios');

// Set global axios timeout because ImageKit SDK doesn't expose it
// This will only work if the SDK shares the same axios instance
axios.defaults.timeout = 300000; 

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_ENDPOINT
});

/**
 * Uploads a file to ImageKit
 * @param {string} filePath - Path to the local file
 * @param {string} fileName - Name to save the file as
 * @returns {Promise<Object>} - ImageKit upload response
 */
const uploadToImageKit = async (filePath, fileName) => {
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const fileContent = fs.readFileSync(filePath);

            console.log(`Uploading to ImageKit (Attempt ${attempt}/${maxRetries})...`);
            const response = await imagekit.upload({
                file: fileContent,
                fileName: fileName,
                folder: process.env.IMAGEKIT_FOLDER || '/EduTrace/transcripts',
                useUniqueFileName: true
            });

            console.log(`File uploaded to ImageKit: ${response.url}`);
            return response;
        } catch (error) {
            lastError = error;
            console.error(`ImageKit Upload Attempt ${attempt} failed:`, error.message);
            
            if (attempt < maxRetries) {
                const delay = attempt * 2000;
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw new Error(`Failed to upload to ImageKit after ${maxRetries} attempts: ${lastError.message}`);
};

module.exports = {
    uploadToImageKit
};
