import fs from 'fs';
import path from 'path';
import { Logger } from './logger';

const logger = new Logger({ module: 'fileWriter' });

export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function writeTextFile(relativePath: string, content: string): void {
  const fullPath = path.resolve(process.cwd(), relativePath);
  const dir = path.dirname(fullPath);
  ensureDir(dir);
  fs.writeFileSync(fullPath, content, { encoding: 'utf8' });
  logger.info(`Arquivo escrito: ${relativePath}`);
}

export function writeJsonFile(relativePath: string, data: unknown): void {
  writeTextFile(relativePath, JSON.stringify(data, null, 2));
}

