// utils/nameGenerator.js
import User from '../models/User.js';

const adjectives = [
  'Happy', 'Lucky', 'Brave', 'Swift', 'Cool', 'Wise', 'Kind', 'Bold', 
  'Calm', 'Cheerful', 'Clever', 'Eager', 'Gentle', 'Jolly', 'Lively',
  'Noble', 'Proud', 'Quick', 'Smart', 'Bright', 'Creative', 'Dynamic',
  'Energetic', 'Friendly', 'Graceful', 'Honest', 'Inspiring', 'Joyful'
];

const animals = [
  'Fox', 'Eagle', 'Tiger', 'Bear', 'Wolf', 'Lion', 'Deer', 'Owl',
  'Hawk', 'Shark', 'Dolphin', 'Panda', 'Rabbit', 'Turtle', 'Dragon',
  'Phoenix', 'Falcon', 'Panther', 'Leopard', 'Cheetah', 'Whale', 'Otter',
  'Penguin', 'Koala', 'Kangaroo', 'Elephant', 'Giraffe', 'Zebra'
];

/**
 * Generates a random unique full name for a user
 * @param {number} maxAttempts - Maximum number of attempts to find a unique name
 * @returns {Promise<string>} - A unique full name
 */
export const generateUniqueFullName = async (maxAttempts = 100) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const randomNumber = Math.floor(Math.random() * 999) + 1;
    
    const fullName = `${adjective} ${animal} ${randomNumber}`;
    
    // Check if this name already exists in the database
    const existingUser = await User.findOne({ fullName });
    
    if (!existingUser) {
      return fullName;
    }
  }
  
  // If we couldn't find a unique name after maxAttempts, use timestamp
  const timestamp = Date.now().toString().slice(-6);
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  
  return `${adjective} ${animal} ${timestamp}`;
};

/**
 * Ensures a user has a fullName, generating one if needed
 * @param {Object} user - The user object
 * @returns {Promise<string>} - The user's fullName (existing or newly generated)
 */
export const ensureUserHasFullName = async (user) => {
  if (user.fullName && user.fullName.trim()) {
    return user.fullName;
  }
  
  const newFullName = await generateUniqueFullName();
  user.fullName = newFullName;
  await user.save();
  
  return newFullName;
};