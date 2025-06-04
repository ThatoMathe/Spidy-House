Spidy-House Project  
===================  

1. Project Overview  
   - Spidy-House is a Warehouse Management System (WMS) designed to optimize warehouse operations, track inventory, and manage orders efficiently.  

2. Features  
   - Inventory Management  
   - Order Tracking  
   - User Authentication  
   - Real-time Data Analytics  

3. Technologies Used  
   - Frontend: HTML, CSS, JavaScript  
   - Backend: PHP, MySQL  
   - Version Control: Git & GitHub  

4. Team Members  
   - **Thato Mathe** (UI/UX, Testing) - [@ThatoMathe](https://github.com/ThatoMathe) 
   - **Tapiwanashe Mtombeni** (Database)
   - **Boitumelo Shalang** (Security & AI)
   - **Makale Thabo** (Developer) – [@Thabo486](https://github.com/Thabo486)
   - **Makale Thabiso** (Developer) – [@RivaldoTM](https://github.com/RivaldoTM)
   - **Bongane Matewela** (Technical Support)

5. Contribution Guidelines  
   - Every team member must **pull the latest updates** before making changes (`git pull origin main`).  
   - Use **branches** for new features (`git checkout -b feature-name`).  
   - Submit a **pull request** for review before merging into the main branch.  

8. License  
   - This project is open-source under the MIT License.
  

💻 Live Demo / Preview
=======================

🌐 Explore the live project here:
👉 [https://spidywarehouse.unaux.com/](https://spidywarehouse.unaux.com/)

✔️ Fully responsive and functional
✔️ Built with React + PHP + MySQL
✔️ Integrated Barcode Scanner and Transfer System



How to Run the Project
======================

1. Clone the Repository:
   Open your terminal or Git Bash and run:

   git clone https://github.com/ThatoMathe/Spidy-House.git

2. Navigate into the Project Directory:
   cd Spidy-House

3. Install Required Tools (if not already installed):
   - Install Node.js (includes npm): https://nodejs.org/
   - Install Composer (for PHP dependencies): https://getcomposer.org/download/
   - Install XAMPP (Apache & MySQL): https://www.apachefriends.org/

4. Install Project Dependencies:
   - Run this to install frontend dependencies:
     npm install

   - Run this to install backend (PHP) dependencies:
     composer install

5. Run the Project:
   a) Start your backend (PHP API):
      - Place the backend folder inside XAMPP’s `htdocs` directory.
      - Open XAMPP Control Panel and start **Apache** and **MySQL**.
      - Your PHP backend will be accessible at:
        http://localhost:8000 (if using PHP built-in server)

   b) Start the React frontend:
      - Run:
        npm run start
      - It will open the frontend at:
        http://localhost:3000

6. Database Setup:
   - Visit http://localhost/phpmyadmin
   - Create a database (e.g., `spidy_house_db`)
   - Import the `.sql` file from the `/database` folder

7. Notes:
   - Make sure the API URL in your React settings points to:
     http://localhost:8000/api or http://localhost/Spidy-House/api
   - Configure DB credentials inside `config/db.php`

### 💻 Developed By
This website was fully developed and implemented by Thabo and Thabiso,
based on the planning, documentation, and project guidelines contributed by the rest of the team (as listed above).
This project was completed as part of our final year IT capstone under supervision at Richfield.

