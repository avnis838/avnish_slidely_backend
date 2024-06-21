import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
const port = 3000;
const dbFilePath = path.resolve(__dirname, "db.json");

// Regular expressions for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

app.use(bodyParser.json());

interface Submission {
  name: string;
  email: string;
  phone: string;
  github_link: string;
  stopwatch_time: string;
}

const logger = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log(`${req.method} ${req.url} ${new Date().toISOString()}`);
  next();
};

app.use(logger);

// Load submissions from the JSON file
const loadSubmissions = (): Submission[] => {
  // Check if the db.json file exists
  if (!fs.existsSync(dbFilePath)) {
    // If not, create an empty array and write it to db.json
    fs.writeFileSync(dbFilePath, JSON.stringify([]));
  }
  // Read and parse the content of db.json
  const data = fs.readFileSync(dbFilePath, "utf-8");
  return JSON.parse(data);
};

// Save submissions to the JSON file
const saveSubmissions = (submissions: Submission[]): void => {
  fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
};

// /ping endpoint
app.get("/ping", (req, res) => {
  res.json(true);
});

// /submit endpoint
app.post("/submit", (req, res) => {
  console.log(true);
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  if (!urlRegex.test(github_link)) {
    return res.status(400).json({ error: "Invalid GitHub link format" });
  }

  const submissions = loadSubmissions();

  if (submissions.some((submission) => submission.email === email)) {
    return res.status(400).json({ error: "Email already exists" });
  }
  // console.log(submissions.length);
  submissions.push({ name, email, phone, github_link, stopwatch_time });
  saveSubmissions(submissions);

  res.json({ success: true });
});

// /read endpoint
app.get("/read", (req, res) => {
  const index = parseInt(req.query.index as string, 10);
  const submissions = loadSubmissions();
  if (index >= 0 && index < submissions.length) {
    res.status(200).json(submissions[index]);
  } else {
    res.status(404).send("Submission not found");
  }
});

app.put("/update", (req, res) => {
  const index = parseInt(req.query.index as string, 10);

  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  if (!urlRegex.test(github_link)) {
    return res.status(400).json({ error: "Invalid GitHub link format" });
  }
  const submissions = loadSubmissions();
  if (
    submissions.some(
      (submission, ind) => submission.email === email && ind != index
    )
  ) {
    console.log("fefer");
    return res.status(400).json({ error: "Email already exists" });
  }
  const updatedSubmission = req.body;

  if (index >= 0) {
    submissions[index] = updatedSubmission;
    // fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
    saveSubmissions(submissions);
    res.status(200).send("Submission updated");
  } else {
    res.status(404).send("Submission not found");
  }
});

app.delete("/delete", (req, res) => {
  const index = parseInt(req.query.index as string, 10);
  const submissions = loadSubmissions();
  if (index >= 0 && index < submissions.length) {
    submissions.splice(index, 1); // Remove the submission at the given index
    fs.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
    res.status(200).send("Submission deleted");
  } else {
    res.status(404).send("Submission not found");
  }
});

// app.get("/totalSubmissions", (req, res) => {
//   const submissions = loadSubmissions(); // Ensure submissions are up-to-date
//   const totalSubmissions = submissions.length;
//   // console.log(typeof totalSubmissions);
//   res.json({ totalSubmissions });
// });

app.get("/readByEmail", (req, res) => {
  const email = req.query.email as string;
  const submissions = loadSubmissions();
  const submission = submissions.find((sub) => sub.email === email);

  if (submission) {
    res.json(submission);
  } else {
    res.status(404).json({ error: "Submission not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
