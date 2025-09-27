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
 * Generates a unique username
 * @param {number} maxAttempts - Maximum number of attempts to find a unique username
 * @returns {Promise<string>} - A unique username
 */
export const generateUniqueUsername = async (maxAttempts = 100) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const animal = animals[Math.floor(Math.random() * animals.length)];
    const randomNumber = Math.floor(Math.random() * 999) + 1;

    const username = `${adjective}${animal}${randomNumber}`.toLowerCase();

    // Check if this username already exists in the database
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return username;
    }
  }

  // If we couldn't find a unique username after maxAttempts, use timestamp
  const timestamp = Date.now().toString().slice(-6);
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];

  return `${adjective}${animal}${timestamp}`.toLowerCase();
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

/**
 * Ensures a user has both fullName and username, generating them if needed
 * @param {Object} user - The user object
 * @returns {Promise<Object>} - Object with fullName and username
 */
export const ensureUserHasNamesAndUsername = async (user) => {
  let hasChanges = false;

  // Ensure fullName
  if (!user.fullName || !user.fullName.trim()) {
    user.fullName = await generateUniqueFullName();
    hasChanges = true;
  }

  // Ensure username
  if (!user.username || !user.username.trim()) {
    user.username = await generateUniqueUsername();
    hasChanges = true;
  }

  if (hasChanges) {
    await user.save();
  }

  return {
    fullName: user.fullName,
    username: user.username
  };
};