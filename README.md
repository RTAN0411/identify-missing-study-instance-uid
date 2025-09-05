# DICOM StudyInstanceUID Scanner

This project provides a **TypeScript script** that recursively scans a given directory for **DICOM files** and flags files that are missing the `StudyInstanceUID` tag.  
This can be useful for validating datasets before uploading to a PACS, DICOMWeb server, or any medical imaging system.

---

## Features

- **Recursive directory scanning** – Scans all subdirectories for DICOM files.
- **Quick DICOM check** – Detects valid DICOM files by checking for `"DICM"` at offset 128.
- **Validates `StudyInstanceUID`** – Flags any files missing the required UID.
- **Error handling** – Treats unreadable files as missing UIDs.
- **Clean TypeScript setup** – Includes type declarations for `dcmjs`.

---

## Requirements

- Node.js **v16 or higher**
- npm or yarn
- TypeScript

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/RTAN0411/identify-missing-study-instance-uid.git
   cd scan-valid-dicom-files
   ```

2. **npm install**
  
  ```bash
  npm install
  ```

3. **Start Using**
Go to the folder that contains all the DICOM you wish to check in its subdirectories and copy the 'absolute path'

```bash
ts-node scanDicomFiles.ts '/path/to/dicom/folder'
```
