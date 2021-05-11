const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

// @route GET api/auth
// @desc Check if user is logged in
// @access Public
router.get('/', verifyToken, async (req, res) => {
	try {
		const user = await User.findById(req.userId).select('-password');
		if (!user)
			return res
				.status(400)
				.json({ success: false, message: 'User not found' });
		res.json({ success: true, user });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: 'Internal server error' });
	}
});

router.post('/register', async (req, res) => {
	const { username, password } = req.body;

	//Simple Validation
	if (!username || !password)
		return res
			.status(400)
			.json({ success: false, message: 'Missing username or password' });

	try {
		//Check existing user
		const user = await User.findOne({ username });
		if (user)
			return res
				.status(200)
				.json({ success: false, message: 'Username already taken' });
		// All good - hashpw
		const hashedPassword = await argon2.hash(password);
		const newUser = new User({
			username,
			password: hashedPassword
		});
		await newUser.save();
		//Return tokens
		const accessToken = jwt.sign(
			{ userId: newUser._id },
			process.env.ACCESS_TOKEN_SECRET
		);

		res.json({
			success: true,
			message: 'User created successfully',
			accessToken
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
});

// @route POST api/auth/login
// @desc login user
// @access public

router.post('/login', async (req, res) => {
	const { username, password } = req.body;

	//Simple Validation
	if (!username || !password)
		return res
			.status(400)
			.json({ success: false, message: 'Missing username or password' });

	try {
		//@check existing user
		const user = await User.findOne({ username });
		if (!user)
			return res
				.status(400)
				.json({ success: false, message: 'Incorrect username or password ' });
		//@check password user
		const passwordValid = await argon2.verify(user.password, password);
		if (!passwordValid)
			return res
				.status(400)
				.json({ success: false, message: 'Incorrect username or password' });
		//@All good
		const accessToken = jwt.sign(
			{ userId: user._id },
			process.env.ACCESS_TOKEN_SECRET
		);

		res.json({
			success: true,
			message: 'User logged in successfully',
			accessToken
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: 'Internal Server Error' });
	}
});

module.exports = router;
