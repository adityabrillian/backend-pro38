const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { upload } = require('../middlewares/multer');

router.get('/dashboard', adminController.viewDashboard);

router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);

router.get('/bank', adminController.viewBank);
router.post('/bank', upload, adminController.addBank);
router.put('/bank', adminController.editBank);
router.delete('/bank/:id', adminController.deleteBank);

// router.get('/item', adminController.viewItem);
// router.post('/item', adminController.addItem);
// router.put('/item', adminController.editItem);
// router.delete('/item/:id', adminController.deleteItem);

// router.get('/booking', adminController.viewBooking);
// router.post('/booking', adminController.addBooking);
// router.put('/booking', adminController.editBooking);
// router.delete('/booking/:id', adminController.deleteBooking);

module.exports = router;
