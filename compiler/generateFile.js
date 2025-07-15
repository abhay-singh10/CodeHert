const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');


const dirCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = (format, content) => {
    const jobID = uuid();
    let filePath;

    if (format === 'java') {
        // For Java, create a subdirectory and save as Main.java
        const javaDir = path.join(dirCodes, jobID);
        if (!fs.existsSync(javaDir)) {
            fs.mkdirSync(javaDir, { recursive: true });
        }
        filePath = path.join(javaDir, 'Main.java');
    } else {
        // For other languages, save as codes/uuid.<ext>
        let extension = format;
        if (format === 'python') {
            extension = 'py';
        }
        const filename = `${jobID}.${extension}`;
        filePath = path.join(dirCodes, filename);
    }

    fs.writeFileSync(filePath, content);
    return filePath;
};

module.exports = {
    generateFile,
};