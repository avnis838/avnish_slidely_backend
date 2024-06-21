"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
const dbFilePath = path_1.default.resolve(__dirname, "db.json");
app.use(body_parser_1.default.json());
// Load submissions from the JSON file
const loadSubmissions = () => {
    const data = fs_1.default.readFileSync(dbFilePath, "utf8");
    return JSON.parse(data);
};
// Save submissions to the JSON file
const saveSubmissions = (submissions) => {
    fs_1.default.writeFileSync(dbFilePath, JSON.stringify(submissions, null, 2));
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
    const submissions = loadSubmissions();
    console.log(submissions.length);
    submissions.push({ name, email, phone, github_link, stopwatch_time });
    saveSubmissions(submissions);
    res.json({ success: true });
});
// /read endpoint
app.get("/read", (req, res) => {
    const index = parseInt(req.query.index, 10);
    if (isNaN(index) || index < 0) {
        return res.status(400).json({ error: "Invalid index" });
    }
    const submissions = loadSubmissions();
    if (index >= submissions.length) {
        return res.status(404).json({ error: "Submission not found" });
    }
    res.json(submissions[index]);
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
