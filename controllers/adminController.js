// Import Model
const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Feature = require('../models/Feature');
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
    const { name, nameBank, nomorRekening } = req.body;
    try {
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
      // console.log(nameBank);
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
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();
        req.flash('alertMessage', 'Sukses Update Bank');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/bank');
      }
    } catch (error) {
      // console.log(error);
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
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
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

  viewItem: async (req, res) => {
    try {
      const item = await Item.find();
      const category = await Category.find()
        .populate({ path: 'imageId', select: 'id imageUrl' })
        .populate({ path: 'categoryId', select: 'id name' });
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render('admin/item/index', {
        title: 'PRO38 Admin | Item',
        category,
        alert,
        item,
        action: 'view',
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  addItem: async (req, res) => {
    try {
      const { categoryId, title, price, city, about } = req.body;
      if (req.files.length > 0) {
        // jika input gambar
        const category = await Category.findOne({ _id: categoryId });
        const newItem = {
          categoryId: category._id,
          title,
          description: about,
          price,
          city,
        };
        const item = await Item.create(newItem);
        // console.log(item);
        category.itemId.push({ _id: item._id }); // ditable category menambahkan row itemId
        await category.save();
        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.imageId.push({ _id: imageSave._id }); // ditable item menambahkan row imageId
          await item.save();
        }
        req.flash('alertMessage', 'Sukses Menambah Item Baru');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');
      }
    } catch (error) {
      // console.log(error);
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  showImageItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({
        //populate untuk memanggil collection image yg ada di item
        path: 'imageId',
        select: 'id imageUrl',
      });

      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render('admin/item/index', {
        title: 'PRO38 Admin | Show Image Item',
        alert,
        item,
        action: 'show image',
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  showEditItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }) //select by id item
        .populate({
          //populate untuk memanggil collection image yg ada di item
          path: 'imageId',
          select: 'id imageUrl',
        })
        .populate({
          path: 'categoryId',
          select: 'id name',
        });
      const category = await Category.find();
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render('admin/item/index', {
        title: 'PRO38 Admin | Edit Item',
        alert,
        item,
        category,
        action: 'edit',
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { categoryId, title, price, city, about } = req.body;
      const item = await Item.findOne({ _id: id }) //select by id item
        .populate({
          //populate untuk memanggil collection image yg ada di item
          path: 'imageId',
          select: ' id imageUrl',
        })
        .populate({
          path: 'categoryId',
          select: 'id name',
        });

      if (req.files.length > 0) {
        for (let i = 0; i < item.imageId.length; i++) {
          const imageUpdate = await Image.findOne({
            _id: item.imageId[i]._id,
          });
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
        }
        item.title = title;
        item.price = price;
        item.city = city;
        item.description = about;
        item.categoryId = categoryId;
        await item.save();
        req.flash('alertMessage', 'Sukses Update Item');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');
      } else {
        item.title = title;
        item.price = price;
        item.city = city;
        item.description = about;
        item.categoryId = categoryId;
        await item.save();
        req.flash('alertMessage', 'Sukses Update Item');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/item');
      }
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate('imageId');
      for (let i = 0; i < item.imageId.length; i++) {
        Image.findOne({ _id: item.imageId[i]._id })
          .then((image) => {
            fs.unlink(path.join(`public/${image.imageUrl}`));
            image.remove();
          })
          .catch((error) => {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
          });
      }
      await item.remove();
      req.flash('alertMessage', 'Item Telah Terhapus');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/item');
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('/admin/item');
    }
  },

  viewDetailItem: async (req, res) => {
    const { itemId } = req.params;
    try {
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alert = {
        message: alertMessage,
        status: alertStatus,
      };
      res.render('admin/item/detail__item/view_detail_item', {
        title: 'PRO38 Admin | Detail Item',
        alert,
        itemId,
      });
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show_detail_item/${itemId}`);
    }
  },

  addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash('alertMessage', 'Image not found');
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
      const feature = await Feature.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      //logika dimana table child menambahkan id foregirKey di parent table
      const item = await Item.findOne({ _id: itemId });  
      item.featureId.push({ _id: feature._id });
      await item.save();

      req.flash('alertMessage', 'Sukses Menambah Feature Baru');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  viewBooking: (req, res) => {
    res.render('admin/booking/index', { title: 'PRO38 Admin | Booking' });
  },
};
