// Import Model
const Category = require('../models/Category');
const Bank = require('../models/Bank');
// const Item = require('../models/Item');
// const Booking = require('../models/Booking');

const fs = require('fs-extra');
const path = require('path');

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
      req.flash('alertMessage', `${error.message}`);
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
      req.flash('alertMessage', `${error.message}`);
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
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/category');
    }
  },

  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      // console.log(bank);
      res.render('admin/bank/index', {
        bank,
        alert,
        title: 'PRO38 Admin | Bank',
      });
    } catch (error) {
      res.redirect('/admin/bank');
    }
  },

  addBank: async (req, res) => {
    try {
      const { name, nameBank, nomorRekening } = req.body;
      await Bank.create({
        name,
        nameBank,
        nomorRekening,
        imageUrl: `images/${req.file.filename}`,
      });
      req.flash('alertMessage', 'Sukses Menambah Bank Baru');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/bank');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },

  editBank: async (req, res) => {
    try {
      const { id, name, nameBank, nomorRekening } = req.body;
      const bank = await Bank.findOne({ _id: id });
      console.log(nameBank);
      if (req.file == undefined) {
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        bank.name = name;
        await bank.save();
        req.flash('alertMessage', 'Sukses Update Bank');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/bank');
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.nameBank = nameBank;
        bank.nomorRekening = nomorRekening;
        bank.name = name;
        await bank.save();
        req.flash('alertMessage', 'Sukses Update Bank');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/bank');
      }
    } catch (error) {
      console.log(error);
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },

  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      // console.log(id);
      const bank = await Bank.findOne({ _id: id });
      await bank.remove();
      req.flash('alertMessage', 'Bank Telah Terhapus');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/bank');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/bank');
    }
  },

  viewItem: (req, res) => {
    res.render('admin/item/index', { title: 'PRO38 Admin | Item' });
  },

  viewBooking: (req, res) => {
    res.render('admin/booking/index', { title: 'PRO38 Admin | Booking' });
  },
};