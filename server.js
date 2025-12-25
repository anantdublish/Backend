

const express = require("express");
const Joi = require("joi");

const app = express();
const PORT = 5000;

// Middleware to read JSON body
app.use(express.json());

// STEP 0.7: In-memory user storage
let users = [];
let currentId = 1;

// Joi schema for UPDATE user
const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid("admin", "user").optional(),
  status: Joi.string().valid("active", "inactive").optional(),
}).min(1);

// STEP 0.8: CREATE USER API
app.post("/api/users", (req, res) => {
  const { name, email, role, status } = req.body;

  if (!name || !email || !role || !status) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const newUser = {
    id: currentId++,
    name,
    email,
    role,
    status,
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: newUser,
  });
});

// STEP 0.9: LIST USERS API
app.get("/api/users", (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

// STEP 3: UPDATE USER API
app.put("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // Validate ID
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
  }

  // Validate request body
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  // Find user
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Update user
  Object.assign(user, req.body);

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

// STEP 4: DELETE USER API
app.delete("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // Validate ID
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
  }

  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  users.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
