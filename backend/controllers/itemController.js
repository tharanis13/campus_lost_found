const Item = require('../models/Item');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Import email service with error handling at the top
let sendEmail;
try {
  sendEmail = require('../services/emailService').sendEmail;
} catch (error) {
  console.log('Email service not available:', error.message);
  sendEmail = async () => {
    console.log('Email functionality disabled');
    return true;
  };
}

exports.createItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, type, location, date, uniqueMarks } = req.body;
    
    let images = [];
    if (req.files) {
      images = req.files.map(file => file.path);
    }

    const item = new Item({
      title,
      description,
      category,
      type,
      location,
      date,
      uniqueMarks,
      images,
      reporter: req.user.id
    });

    await item.save();
    
    // Populate reporter info
    await item.populate('reporter', 'name email campusId');

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { type, category, status, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    
    if (search) {
      query.$text = { $search: search };
    }

    const items = await Item.find(query)
      .populate('reporter', 'name email campusId')
      .populate('claimer', 'name email campusId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Item.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('reporter', 'name email campusId phone')
      .populate('claimer', 'name email campusId')
      .populate('claims.user', 'name email campusId');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.claimItem = async (req, res) => {
  try {
    const { description } = req.body;
    
    const item = await Item.findById(req.params.id).populate('reporter');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const existingClaim = item.claims.find(claim => 
      claim.user.toString() === req.user.id
    );

    if (existingClaim) {
      return res.status(400).json({ message: 'You have already claimed this item' });
    }

    item.claims.push({
      user: req.user.id,
      description
    });

    await item.save();

    // Send email notification to item reporter (with error handling)
    try {
      await sendEmail(
        item.reporter.email,
        'claimNotification',
        [item.title, req.user.name, description]
      );
    } catch (emailError) {
      console.log('Email notification failed, but claim was saved:', emailError.message);
    }

    // Send real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(item.reporter._id.toString()).emit('new-claim', {
        itemId: item._id,
        itemTitle: item.title,
        claimerName: req.user.name
      });
    }

    res.json({ message: 'Claim submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.suggestMatches = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const currentItem = await Item.findById(itemId);
    if (!currentItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Find potential matches based on category, title, and description
    const matches = await Item.find({
      _id: { $ne: itemId },
      type: currentItem.type === 'lost' ? 'found' : 'lost',
      category: currentItem.category,
      status: 'active',
      $text: { $search: currentItem.title + ' ' + currentItem.description }
    })
    .populate('reporter', 'name email campusId')
    .limit(5);

    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};