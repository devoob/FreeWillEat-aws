// Script to fix username duplicate key issues
import mongoose from 'mongoose';
import User from '../models/User.js';
import { generateUniqueUsername } from '../utils/nameGenerator.js';

const fixUsernameIssue = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freewill');
    console.log('Connected to MongoDB');

    // Drop the existing username index that might be causing issues
    try {
      await User.collection.dropIndex('username_1');
      console.log('Dropped existing username index');
    } catch (error) {
      console.log('No existing username index to drop or error dropping:', error.message);
    }

    // Find all users with default username "username"
    const usersWithDefaultUsername = await User.find({ username: 'username' });
    console.log(`Found ${usersWithDefaultUsername.length} users with default username`);

    // Generate unique usernames for each user
    for (const user of usersWithDefaultUsername) {
      const newUsername = await generateUniqueUsername();
      user.username = newUsername;
      await user.save();
      console.log(`Updated user ${user._id} with new username: ${newUsername}`);
    }

    // Find users with null/undefined usernames
    const usersWithoutUsername = await User.find({
      $or: [
        { username: { $exists: false } },
        { username: null },
        { username: '' }
      ]
    });
    console.log(`Found ${usersWithoutUsername.length} users without username`);

    // Generate usernames for users without one
    for (const user of usersWithoutUsername) {
      const newUsername = await generateUniqueUsername();
      user.username = newUsername;
      await user.save();
      console.log(`Updated user ${user._id} with new username: ${newUsername}`);
    }

    // Create the sparse unique index
    await User.collection.createIndex({ username: 1 }, { unique: true, sparse: true });
    console.log('Created sparse unique index for username');

    console.log('Username issue fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing username issue:', error);
    process.exit(1);
  }
};

fixUsernameIssue();