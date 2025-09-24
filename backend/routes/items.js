const express = require('express');
const { body } = require('express-validator');
const { 
  createItem, 
  getItems, 
  getItem, 
  claimItem, 
  suggestMatches 
} = require('../controllers/itemController');
const { auth } = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

router.post('/', 
  auth, 
  upload.array('images', 5),
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('description').not().isEmpty().withMessage('Description is required'),
    body('category').not().isEmpty().withMessage('Category is required'),
    body('type').isIn(['lost', 'found']).withMessage('Type must be lost or found'),
    body('location').not().isEmpty().withMessage('Location is required'),
    body('date').isISO8601().withMessage('Valid date is required')
  ],
  createItem
);

router.get('/', getItems);
router.get('/:id', getItem);
router.post('/:id/claim', auth, claimItem);
router.get('/:id/matches', auth, suggestMatches);

module.exports = router;