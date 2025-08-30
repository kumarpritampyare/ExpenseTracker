const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/User');
const router = express.Router();

router.post('/login', async function (req, res) {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) throw new Error('Check your credentials');

    if (!bcrypt.compareSync(req.body.password, user.password))
      throw new Error('Check your credentials');

    res.send(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/register', async function (req, res) {
  try {
    const user = new User(req.body);
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
    await user.save();
    res.send('User Registered Successfully');
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params; 
   
    const userId = id.trim();

    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: `User with ID ${userId} has been deleted successfully.`,
    });

  } catch (error) {
    console.error('Error details:', error);  
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; 

    
    const userId = id.trim();

    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }

    
    const user = await User.findById(userId).select('-password'); 

    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (error) {
    console.error('Error details:', error);  
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 
    }

    
    await user.save();

    
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



module.exports = router;
