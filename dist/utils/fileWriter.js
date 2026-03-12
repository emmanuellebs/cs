"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDir = ensureDir;
exports.writeTextFile = writeTextFile;
exports.writeJsonFile = writeJsonFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("./logger");
const logger = new logger_1.Logger({ module: 'fileWriter' });
function ensureDir(dirPath) {
    if (!fs_1.default.existsSync(dirPath)) {
        fs_1.default.mkdirSync(dirPath, { recursive: true });
    }
}
function writeTextFile(relativePath, content) {
    const fullPath = path_1.default.resolve(process.cwd(), relativePath);
    const dir = path_1.default.dirname(fullPath);
    ensureDir(dir);
    fs_1.default.writeFileSync(fullPath, content, { encoding: 'utf8' });
    logger.info(`Arquivo escrito: ${relativePath}`);
}
function writeJsonFile(relativePath, data) {
    writeTextFile(relativePath, JSON.stringify(data, null, 2));
}
