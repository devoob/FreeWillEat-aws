import OpenAI from 'openai';
import Restaurant from '../models/Restaurant.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getAiRestaurantSuggestion = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Message is required',
    });
  }

  try {
    const restaurants = await Restaurant.find().select('restaurant_name details region').lean();
    const restaurantList = restaurants.map(r => `${r.restaurant_name} in ${r.region}: ${r.details}`).join('\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that suggests restaurants based on user queries. Here is a list of available restaurants:\n${restaurantList}\n\nBased on the user's request, suggest the best matching restaurant from the list and explain why. If no restaurants match, say so.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error with OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestion from AI',
    });
  }
};