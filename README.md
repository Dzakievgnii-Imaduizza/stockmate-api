<<<<<<< Updated upstream
**Stockmate API**
  Stockmate API is a backend system built with Node.js, Express, Prisma ORM, and PostgreSQL. It features robust data management, JWT authentication, and automated workflows powered by n8n.

**Prerequisites**
  Before getting started, ensure you have the following installed on your system:
  
  Node.js (v18 or higher recommended)
  
  PostgreSQL (v16 or higher)
  
  n8n (for handling OTP and Excel export workflows)
  
**Getting Started**
  Step 1: Extract & Open the Project
  
    1. Locate your downloaded stockmate-api-main.zip file.
    
    2. Right-click and select Extract All... to unzip it.
    
    3. Open the extracted stockmate-api-main folder.
    
    4. Open a terminal inside this folder:
    
    5. Windows Quick Tip: Click on the address bar at the very top of your File Explorer window, type cmd, and press Enter.
    
  Step 2: Install Dependencies
  
    In your terminal window, run the following command to download the project's required packages:
  
    Bash:
    ===============
    | npm install |
    ===============  
  Step 3: Create the PostgreSQL Database
  
    1. Open pgAdmin 4 from your Windows Start menu.
    
    2. Enter your master password if prompted.
    
    3. In the left sidebar, expand Servers > PostgreSQL 16.
    
    4. Right-click on Databases, hover over Create, and select Database....
    
    5. Set the database name exactly to: stockmate_db
    
    6. Click Save.
    
  Step 4: Configure Environment Variables
  
    Inside the root folder, right-click an empty space and choose New -> Text Document.
    
    Rename the file to exactly .env (ensure it does not end in .txt).
    
    Open the file in a text editor (like Notepad) and paste the following configuration:
    ==================================================================================================================================================================
    | PORT=3000                                                                                                                                                      |
    | NODE_ENV=development                                                                                                                                           |
    |                                                                                                                                                                |
    | # Database configuration                                                                                                                                       |
    | DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/stockmate?schema=public"                                                             | 
    | JWT_SECRET="your_random_secret_string"                                                                                                                         |
    |                                                                                                                                                                |
    | # n8n Webhook URLs                                                                                                                                             |
    | N8N_WEBHOOK_URL_OTP="your-n8n-otp-webhook-url"                                                                                                                 |
    | N8N_EXCEL_WEBHOOK_URL="your-n8n-excel-webhook-url"                                                                                                             |
    | Crucial: Replace YOUR_POSTGRES_PASSWORD with your actual local PostgreSQL password. Replace the placeholder n8n webhook URLs once you complete Step 6          |
    ==================================================================================================================================================================    
  
  Step 5: Initialize the Database Tables
  
    Execute the following commands in your terminal one after the other to sync your Prisma schema with PostgreSQL:
    
    Generate the Prisma client:
    Bash
    =======================
    | npx prisma generate |
    =======================
    
    Run database migrations:
    Bash
    ======================================
    | npx prisma migrate dev --name init |
    ======================================
    
    Seed the database with initial starter data:
    Bash
    ======================
    | npx prisma db seed |
    ======================
  Step 6: Set Up n8n Workflows
  
    This project relies on n8n to handle OTP distribution and Excel data generation.
    
    1. Open your terminal or a fresh command prompt and start your local n8n instance:
    
    cmd
    =======
    | n8n |
    =======  
    2. Open the n8n editor interface in your browser (usually http://localhost:5678).
    
    3. Import the OTP Workflow:
    
      3.1. Create a new workflow.
      
      3.2. Click the three dots (menu) in the top right corner -> Import from file.
      
      3.3. Select OTP_STOCKMATE.json from your project directory.

      3.4 Fill in the credentials needed for the SMTP node ( application password )
      
      3.5. Copy the generated production/test Webhook URL from the Webhook trigger node.
    
    4. Import the Excel Workflow:
    
      4.1 Create another new workflow.
      
      4.2 Select Import from file and choose STOCKMATE_EXCEL.json.
      
      4.3 Copy the generated Webhook URL from the Excel Webhook trigger node.
      
    5. Paste both webhook URLs into their respective fields inside your .env file (from Step 4).
    
    **Remember to Activate both workflows in the n8n interface.**
    
  Step 7: Launch the Application
  
    With the database initialized and n8n workflows active, start your backend server:
    
    Bash
    ===============================================================================  
    | npm run dev                                                                 |
    | The server will boot up in development mode, ready to receive API requests. |
    ===============================================================================
=======
# StockMate API

Backend API for the StockMate project using Express, Prisma, and PostgreSQL.

## Requirements

- Node.js 22+
- npm 10+
- PostgreSQL

## Quick setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
copy .env.example .env
```

3. Update `DATABASE_URL` and `JWT_SECRET` in `.env`.

Example local connection:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stockmate_db?schema=public"
```

4. Create the database in PostgreSQL if it does not exist yet.

5. Run migrations:

```bash
npm run prisma:migrate
```

6. Seed initial data:

```bash
npm run prisma:seed
```

7. Start the API:

```bash
npm run dev
```

The server runs at `http://localhost:3000` by default and health check is available at `GET /ping`.

## Useful scripts

- `npm run dev` - run server with nodemon
- `npm start` - run server normally
- `npm run prisma:generate` - generate Prisma client
- `npm run prisma:migrate` - create/apply development migrations
- `npm run prisma:deploy` - apply migrations in non-dev environments
- `npm run prisma:seed` - seed database
- `npm run prisma:studio` - open Prisma Studio

## Seed credentials

The seed script creates an admin user:

- Email: `boss@stockmate.com`
- Password: `admin123`

You can change the seeded admin credentials with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env`.

## Troubleshooting

- If `npm run prisma:deploy` or `npm run prisma:migrate` fails and PostgreSQL returns `ECONNREFUSED`, your local PostgreSQL service is not running yet or is not listening on `localhost:5432`.
- If PostgreSQL is running but credentials differ, update `DATABASE_URL` in `.env`.
>>>>>>> Stashed changes
