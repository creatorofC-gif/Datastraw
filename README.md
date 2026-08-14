![Logo](https://media.licdn.com/dms/image/v2/D4D0BAQFzYk1-vc7iEw/company-logo_200_200/company-logo_200_200/0/1704962440243/datastraw_logo?e=1788393600&v=beta&t=EuUjDw4DIUzKS607fLdD6s97Qv8FKYjvClt8W7GOWpQ) 

# Customer Support Ticketing CRM System 
A web application for managing customer support tickets.

## Features

1) Interactive dashboard displaying real-time KPI metrics (Total, Open, and Resolved tickets).
2) Ticket creation with automatic ID generation and timestamps.
3) Live search functionality to instantly filter tickets by keyword or subject.
4) One-click "Export to CSV" to download the ticket queue as a spreadsheet and
Custom "Print PDF" ticket layout optimized for A4 physical or digital saving.
5) Detailed Ticket View featuring the customer's original query and order details.
6) Ability to update ticket statuses (Open, In Progress, Closed) dynamically.
7) Internal system notes section for agents to collaborate on tickets.
8) Chronological Activity Audit Trail tracking ticket creation and system notes.


## Tech Stack

**Frontend:** React (bootstrapped with Vite), Axios (for API communication), HTML5 / CSS3 

**Server:** Express.js (REST API framework), JSON Web Tokens (JWT) for secure authentication

**Database and Hosting:**
MongoDB and Vercel



## Demo

https://datastraw-frontend.vercel.app/

## Local Setup Instructions

Follow these steps to run the Datastraw CRM system locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd Datastraw
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and configure the required environment variables:
   ```env
   PORT=
   MONGODB_URI=
   ADMIN_PASSWORD=
   ALLOWED_ORIGINS=
   JWT_SECRET=
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server should now be running on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory and add the backend API URL:
   ```env
   VITE_API_URL=
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application should now be accessible at `http://localhost:5173`.

### 4. Access the Application
To log into the admin dashboard, open `http://localhost:5173` in your browser and use the following credentials:
- **User ID**: `admin`
- **Password**: *(The `ADMIN_PASSWORD` you configured in the backend `.env` file)*
