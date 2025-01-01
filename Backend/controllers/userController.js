import bcrypt from 'bcryptjs'; 

const users = [];

export const getAllUsers = (req, res) => {
  try {
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve users' });
  }
};

export const createUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    // Check if the email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = { email, password: hashedPassword };

    // Add the new user to the array
    users.push(newUser);

    // Send response (excluding password for security)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { email: newUser.email },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
};
