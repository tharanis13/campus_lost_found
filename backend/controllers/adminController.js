const User = require('../models/User');
const Item = require('../models/Item');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const lostItems = await Item.countDocuments({ type: 'lost' });
    const foundItems = await Item.countDocuments({ type: 'found' });
    const claimedItems = await Item.countDocuments({ status: 'claimed' });

    // Weekly stats
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const newUsersThisWeek = await User.countDocuments({ 
      createdAt: { $gte: oneWeekAgo } 
    });
    
    const newItemsThisWeek = await Item.countDocuments({ 
      createdAt: { $gte: oneWeekAgo } 
    });

    res.json({
      totalUsers,
      totalItems,
      lostItems,
      foundItems,
      claimedItems,
      newUsersThisWeek,
      newItemsThisWeek
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's items
    await Item.deleteMany({ reporter: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};