// Import Model
const Category = require('../models/Category');

module.exports = {
  viewDashboard: (req, res) => {
    res.render('admin/dashboard/index', { title: 'PRO38 Admin | Dashboard' });
  },

  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      // console.log(category);
      res.render('admin/category/index', {
        category,
        alert,
        title: 'PRO38 Admin | Category',
      });
    } catch (error) {
      res.redirect('/admin/category');
    }
  },

  addCategory: async (req, res) => {
    try {
      const { name } = req.body;
      // console.log(name);
      await Category.create({ name });
      req.flash('alertMessage', 'Sukses Menambah Kategori Baru');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', `$error.message`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },

  editCategory: async (req, res) => {
    try {
      const { id, name } = req.body;
      // console.log(id);
      const category = await Category.findOne({ _id: id });
      category.name = name;
      await category.save();
      req.flash('alertMessage', 'Sukses Update Kategori');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', `$error.message`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      // console.log(id);
      const category = await Category.findOne({ _id: id });
      await category.remove();
      req.flash('alertMessage', 'Kategori Telah Terhapus');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/category');
    } catch (error) {
      req.flash('alertMessage', `$error.message`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },

  viewBank: (req, res) => {
    res.render('admin/bank/index', { title: 'PRO38 Admin | Bank' });
  },

  viewItem: (req, res) => {
    res.render('admin/item/index', { title: 'PRO38 Admin | Item' });
  },

  viewBooking: (req, res) => {
    res.render('admin/booking/index', { title: 'PRO38 Admin | Booking' });
  },
};
