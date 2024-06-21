# Form Submission Application

This project is a simple form submission application with backend validation and unique email checks. Follow the instructions below to set up and run the project.

## Prerequisites

- Node.js (version 12 or higher)
- npm (version 6 or higher)

## Getting Started

### Clone the Project

First, clone the project repository to your local machine:

```bash
git clone https://github.com/yourusername/your-repo.git


Navigate to the Project Directory
bash
Copy code
cd your-repo
Install Dependencies
Install the necessary dependencies for the development environment:

bash
Copy code
npm install
Run the Development Server
Start the development server:

bash
Copy code
npm run dev
The server will start running on http://localhost:3000.

API Endpoints
POST /submit
Submit a new form. Ensures that email IDs are unique.

javascript
Copy code
app.post("/submit", (req, res) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const submissions = loadSubmissions();

  if (submissions.some(submission => submission.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }

  submissions.push({ name, email, phone, github_link, stopwatch_time });
  saveSubmissions(submissions);

  res.json({ success: true });
});
PUT /update
Update an existing form submission.

javascript
Copy code
app.put("/update", (req, res) => {
  const { index, name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const submissions = loadSubmissions();

  if (submissions.some((submission, ind) => submission.email === email && ind !== index)) {
    return res.status(400).json({ error: "Email already exists" });
  }

  if (index >= 0 && index < submissions.length) {
    submissions[index] = { name, email, phone, github_link, stopwatch_time };
    saveSubmissions(submissions);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Submission not found" });
  }
});
GET /totalSubmissions
Retrieve the total number of submissions.

javascript
Copy code
app.get("/totalSubmissions", (req, res) => {
  const submissions = loadSubmissions();
  res.json({ totalSubmissions: submissions.length });
});
GET /readByEmail
Fetch a submission based on the email ID.

javascript
Copy code
app.get("/readByEmail", (req, res) => {
  const { email } = req.query;
  const submissions = loadSubmissions();
  const submission = submissions.find(submission => submission.email === email);

  if (submission) {
    res.json(submission);
  } else {
    res.status(404).json({ error: "Submission not found" });
  }
});
DELETE /delete
Delete a submission based on the index.

javascript
Copy code
app.delete("/delete", (req, res) => {
  const { index } = req.query;
  const submissions = loadSubmissions();

  if (index >= 0 && index < submissions.length) {
    submissions.splice(index, 1);
    saveSubmissions(submissions);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Submission not found" });
  }
});
Backend Setup
Create index.ts
Create an index.ts file in your project directory with the following content:

typescript
Copy code
import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

const dbFilePath = path.resolve(__dirname, 'db.json');

const loadSubmissions = () => {
  if (fs.existsSync(dbFilePath)) {
    const data = fs.readFileSync(dbFilePath, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

const saveSubmissions = (submissions: any) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
};

app.post('/submit', (req, res) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const submissions = loadSubmissions();

  if (submissions.some((submission: any) => submission.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  submissions.push({ name, email, phone, github_link, stopwatch_time });
  saveSubmissions(submissions);

  res.json({ success: true });
});

app.put('/update', (req, res) => {
  const { index, name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const submissions = loadSubmissions();

  if (submissions.some((submission: any, ind: number) => submission.email === email && ind !== index)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  if (index >= 0 && index < submissions.length) {
    submissions[index] = { name, email, phone, github_link, stopwatch_time };
    saveSubmissions(submissions);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Submission not found' });
  }
});

app.get('/totalSubmissions', (req, res) => {
  const submissions = loadSubmissions();
  res.json({ totalSubmissions: submissions.length });
});

app.get('/readByEmail', (req, res) => {
  const { email } = req.query;
  const submissions = loadSubmissions();
  const submission = submissions.find((submission: any) => submission.email === email);

  if (submission) {
    res.json(submission);
  } else {
    res.status(404).json({ error: 'Submission not found' });
  }
});

app.delete('/delete', (req, res) => {
  const { index } = req.query;
  const submissions = loadSubmissions();

  if (index >= 0 && index < submissions.length) {
    submissions.splice(index, 1);
    saveSubmissions(submissions);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Submission not found' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
Create db.json
Create an empty db.json file in your project directory. This file will store the submissions.

Frontend Functionality
Search by Email
Enter the email ID in the search textbox (txtSearchEmailId) and click the search button to fetch the corresponding submission.
Toggle Edit Mode
Click the edit button to toggle between edit mode and read-only mode for the form fields.
Update Submission
Make changes to the form fields and click the update button to save the changes.
Delete Submission
Click the delete button to remove the current submission.
Development
Run Tests
To run tests, use the following command:

bash
Copy code
npm test
Build for Production
To build the project for production, use:

bash
Copy code
npm run build
Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

License
This project is licensed under the MIT License - see the LICENSE file for details.

sql
Copy code

This `README.md` provides comprehensive instructions for setting up the project, running the server, and using the API endpoints. Make sure to adjust the repository URL and any other specific details as necessary.





