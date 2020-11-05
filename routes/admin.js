const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { uploadSingle, uploadMulti } = require('../middlewares/multer');

router.get('/dashboard', adminController.viewDashboard);

router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);

router.get('/bank', adminController.viewBank);
router.post('/bank', uploadSingle, adminController.addBank);
router.put('/bank', uploadSingle, adminController.editBank); // knp ketika upload tdk digunakan menjadi stuck??
router.delete('/bank/:id', adminController.deleteBank);

router.get('/item', adminController.viewItem);
router.post('/item', uploadMulti, adminController.addItem);
router.get('/item/show-image/:id', adminController.showImageItem);
router.get('/item/:id', adminController.showEditItem);
router.put('/item/:id', uploadMulti, adminController.editItem);
router.delete('/item/:id/delete', adminController.deleteItem);

router.get('/item/show-detail-item/:itemId', adminController.viewDetailItem);
router.post('/item/add/feature', uploadSingle, adminController.addFeature);

// router.get('/booking', adminController.viewBooking);
// router.post('/booking', adminController.addBooking);
// router.put('/booking', adminController.editBooking);
// router.delete('/booking/:id', adminController.deleteBooking);

module.exports = router;
