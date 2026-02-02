const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

/***********************
 * Closure: ID Generator
 ***********************/
function createId() {
  let id = 0;
  return () => ++id;
}
const generateId = createId();

/***********************
 * In-memory data
 ***********************/
let members = [];

/***********************
 * Add Member (Callback)
 ***********************/
function addMember(name, flat, callback) {
  const member = {
    id: generateId(),
    name,
    flat,
    maintenance: 0
  };
  members.push(member);
  callback(member);
}

app.post("/add-member", (req, res) => {
  const { name, flat } = req.body;

  addMember(name, flat, (member) => {
    res.json(member);
  });
});

/***********************
 * Get Members (Promise)
 ***********************/
function getMembers() {
  return new Promise(resolve => {
    setTimeout(() => resolve(members), 500);
  });
}

app.get("/members", async (req, res) => {
  const data = await getMembers();
  res.json(data);
});

/***********************
 * Add Maintenance
 ***********************/
app.post("/add-maintenance", async (req, res) => {
  const { id, amount } = req.body;

  const member = members.find(m => m.id === id);
  if (!member) return res.status(404).json({ message: "Member not found" });

  member.maintenance += amount;
  res.json(member);
});

/***********************
 * Total Collection
 ***********************/
app.get("/total", (req, res) => {
  const total = members.reduce((sum, m) => sum + m.maintenance, 0);
  res.json({ total });
});

/***********************
 * Event Loop Demo
 ***********************/
console.log("Server Start");

setTimeout(() => console.log("setTimeout executed"), 0);
Promise.resolve().then(() => console.log("Promise executed"));

console.log("Server End");

/***********************
 * Server
 ***********************/
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});