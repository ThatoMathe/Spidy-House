# Manual Deployment of React.js Website to Web Hosting (cPanel)

## 1. Local Setup – How to Run the Project

### 1.1 Clone the Repository
```bash
git clone https://github.com/ThatoMathe/Spidy-House.git
```

### 1.2 Navigate to the Project Directory
```bash
cd Spidy-House
```

### 1.3 Install Required Tools (if not already installed)
- **Node.js** (includes npm): https://nodejs.org/  
- **Composer** (for PHP dependencies): https://getcomposer.org/download/  
- **XAMPP** (includes Apache & MySQL): https://www.apachefriends.org/

### 1.4 Install Project Dependencies
- For frontend:
  ```bash
  npm install
  ```
- For backend:
  ```bash
  composer install
  ```

### 1.5 Start the Backend (PHP API)
1. Place the backend folder inside your `htdocs` directory (XAMPP).
2. Start **Apache** and **MySQL** via the XAMPP Control Panel.
3. Access the backend using:
   ```bash
   php -S localhost:8000
   ```
   Or via browser:
   ```
   http://localhost:8000
   ```

### 1.6 Start the React Frontend
In the root of the React project, run:
```bash
npm start
```
This will start the development server at:
```
http://localhost:3000
```

### 1.7 Database Setup
1. Open your browser and go to:
   ```
   http://localhost/phpmyadmin
   ```
2. Create a new database (e.g., `spidy_house_db`).
3. Import the `.sql` file from the `/database` folder.

### 1.8 Configuration Notes
- Ensure your React app points to:
  ```
  http://localhost:8000/
  ```
- Update database credentials in:
  ```
  /api/config/db.php
  ```

## 2. Deployment to Web Hosting (cPanel)

### 2.1 Build the React Project for Production
```bash
npm run build
```
This will generate a `build/` folder with optimized static files.

### 2.2 Review the Build Output
Ensure the `build/` folder contains:
- `index.html`
- `static/` folder (with JS, CSS)
- Other assets (manifest, icons, etc.)

### 2.3 Upload to Your Web Host

#### Option A: Using cPanel File Manager
1. Log in to cPanel (e.g., `yourdomain.com/cpanel`).
2. Open **File Manager** > `public_html/`.
3. Remove old files if necessary.
4. On your computer, compress the **contents** of `build/` into `site.zip` (do not include the folder itself).
5. Upload `site.zip` to `public_html/`.
6. Extract the `.zip` file.
7. Ensure `index.html` is directly inside `public_html/`.

#### Option B: Using FileZilla (FTP)
1. Connect with your FTP credentials.
2. Navigate to `public_html/` on the server.
3. On your machine, open the `build/` folder.
4. Upload **all contents** (not the folder itself) to `public_html/`.

### 2.4 Test the Website
Visit:
```
https://yourdomain.com
```
If the site doesn’t load:
- Make sure `index.html` is in `public_html/`.
- Verify all files from `build/` were uploaded properly.

### 2.5 (Optional) Enable React Router with `.htaccess`
If using React Router (for paths like `/about`, `/contact`), add the following `.htaccess` in `public_html/`:

```apacheconf
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Allow real files and folders
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Allow API requests
  RewriteCond %{REQUEST_URI} ^/api/ [NC]
  RewriteRule ^ - [L]

  # Allow uploads folder
  RewriteCond %{REQUEST_URI} ^/uploads/ [NC]
  RewriteRule ^ - [L]

  # Allow config folder
  RewriteCond %{REQUEST_URI} ^/config/ [NC]
  RewriteRule ^ - [L]

  # Redirect all else to index.html
  RewriteRule ^ index.html [L]
</IfModule>
```

This ensures the React Router handles client-side routing properly instead of showing a 404 error.