import fs from 'fs';
import path from 'path';
import dcmjs from 'dcmjs';

const { DicomMessage, DicomMetaDictionary } = dcmjs.data;

/**
 * Recursively get all files from a directory.
 * @param dirPath - Directory to scan
 * @returns List of absolute file paths
 */
const getAllFiles = (dirPath: string): string[] => {
  let files: string[] = [];

  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      files = files.concat(getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
};

/**
 * Checks if a file is a DICOM file.
 * A quick check can be done by looking for "DICM" at byte offset 128.
 */
const isDicomFile = (filePath: string): boolean => {
  const buffer = fs.readFileSync(filePath);
  if (buffer.length < 132) return false;
  return buffer.toString('utf8', 128, 132) === 'DICM';
};

/**
 * Read a DICOM file and check for StudyInstanceUID.
 * @param filePath - Path to the DICOM file
 * @returns Whether the file is missing StudyInstanceUID
 */
const checkDicomForStudyInstanceUID = (filePath: string): boolean => {
  try {
    const buffer = fs.readFileSync(filePath);
    const dicomData: any = DicomMessage.readFile(buffer);

    // dicomData.dict is the raw dataset keyed by tag numbers.
    const naturalDataset: any = DicomMetaDictionary.naturalizeDataset(
      dicomData.dict ?? dicomData
    );

    // naturalDataset uses human names like 'StudyInstanceUID'
    const studyInstanceUID =
      naturalDataset?.StudyInstanceUID ??
      // fallback to numeric tag forms just in case
      naturalDataset?.['0020000D'] ??
      naturalDataset?.['0020,000D'];

    return !studyInstanceUID; // true if missing
  } catch (error) {
    console.error(`Error reading DICOM file at ${filePath}:`, (error as Error).message);
    return true; // treat as missing if unreadable
  }
};

/**
 * Main function: scans a directory and flags files missing StudyInstanceUID
 */
const scanDicomDirectory = (rootDir: string): void => {
  const allFiles = getAllFiles(rootDir);
  const dicomFiles = allFiles.filter(isDicomFile);

  console.log(`\nFound ${dicomFiles.length} DICOM files.`);

  const missingUIDFiles: string[] = [];

  for (const file of dicomFiles) {
    const isMissing = checkDicomForStudyInstanceUID(file);
    if (isMissing) {
      missingUIDFiles.push(file);
    }
  }

  if (missingUIDFiles.length > 0) {
    missingUIDFiles.forEach(file => console.log(`- ${file}`));
  }
};

// Run the script
const targetDirectory = process.argv[2];
if (!targetDirectory) {
  console.error('Please provide a directory path as an argument.');
  process.exit(1);
}

scanDicomDirectory(path.resolve(targetDirectory));
