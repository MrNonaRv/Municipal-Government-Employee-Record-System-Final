# Government Employee Record System (GovRecords)

This application is configured to run locally on your machine using a Node.js backend and a secure SQLite database. It is a comprehensive Human Resources management system built for Local Government Units (LGUs).

## Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Local Installation Instructions
1. **Download the Code:**
   - Export the project as a ZIP file from the **Settings** menu in AI Studio.
   - Extract the ZIP file to a folder on your computer.

2. **Install Dependencies:**
   Open your terminal/command prompt in the extracted folder and run:
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a file named `.env` in the root directory and add a secret key for database encryption:
   ```env
   DB_ENCRYPTION_KEY=your-32-character-secret-key-here
   ```
   *Note: Use a strong, unique 32-character string to keep your data safe.*

4. **Run the Application:**
   Start the development server:
   ```bash
   npm run dev
   ```

5. **Access the App:**
   Open your browser and navigate to:
   `http://localhost:3000`

## Key Features
- **Local Database & Offline Capability:** Uses SQLite (`database.sqlite`) stored directly on your computer for offline reliability.
- **Data Encryption:** All employee records are encrypted using AES-256-GCM before being saved.
- **Google Drive Integration:** Securely attach files directly to employee records via Google Drive.
- **1-Click Cloud Database Backup:** Export and instantly push full database backups as standard JSON files directly to a dedicated `GovRecords_Backups` folder in Google Drive.
- **Notice of Salary Adjustment (NOSA) Module:** Instantly generate mathematically perfect, legally compliant Individual and Batch NOSAs formatted for immediate A4 printing.
- **Personal Data Sheet (PDS) Module:** Generate accurate, CS Form No. 212 compliant Personal Data Sheets directly from employee profile data, pre-formatted for official printing.
- **Leave Cards & Service Records:** Robust tracking modules for employee history, salaries, and vacation/sick leave balances.
- **Print Ready:** Professional dossiers, reports, and official forms precisely formatted for paper layouts.

## Security Note
The `database.sqlite` file contains your data. While it is encrypted, you should still keep this file secure. Do not share your `.env` file or the encryption key with anyone.

---

## 🕒 Recent Changelog & Updates
*Last Updated: 2026-08-26 19:05:00 (Local Time)*

- **PDS Generator Module:** Implemented a new Personal Data Sheet (CS Form 212) generator that auto-populates employee data into an official-layout printable format.
- **NOSA UI Overhaul:** Rebuilt the Individual and Batch Notice of Salary Adjustment modal interface with grouped thematic sections, clear typography, intuitive visual icons, and color-coded adjustment indicators (green/amber) to drastically improve usability and prevent data-entry fatigue.
- **Print Layout Fixes:** Adjusted the maximum width constraints (`w-[98vw]` and `max-w-[1200px]`) of the generation modals to guarantee 1:1 true rendering of 8.5"x11" documents, fixing right-edge clipping on ultra-wide monitors.
- **Google Drive Backup System:** Implemented automated 1-click cloud backups for the entire database.
