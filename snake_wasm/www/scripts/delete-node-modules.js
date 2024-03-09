const fs = require('fs');
const path = require('path');

const deleteNodeModules = () => {
    const directory = path.join(__dirname, '..', 'node_modules');
    if (fs.existsSync(directory)) {
        fs.rmdirSync(directory, { recursive: true });
        console.log(`[INFO] Deleted ${directory}`);
    }
}

deleteNodeModules();