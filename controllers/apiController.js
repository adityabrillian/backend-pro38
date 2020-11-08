const Item = require('../models/Item');
const Treasure = require('../models/Activity');
const Traveler = require('../models/Booking');
const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Member = require('../models/Member');
const Booking = require('../models/Booking');

module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select('_id title country city price unit imageId')
        .limit(5)
        .populate({ path: 'imageId', select: '_id imageUrl' }); // untuk menemukan gambarnya

      const category = await Category.find()
        .select('_id name')
        .limit(3)
        .populate({
          path: 'itemId',
          select: '_id title country city isPopular imageId',
          perDocumentLimit: 4, //perDocumentLimit adalah limit dalam populate
          option: { sort: { sumBooking: -1 } }, // membuat sort descending -1 : desc, 1 : asc
          populate: {
            path: 'imageId',
            select: '_id imageUrl',
            perDocumentLimit: 1,
          },
        });
      const traveler = await Traveler.find();
      const treasure = await Treasure.find();
      const city = await Item.find();

      // Membuat logika dimana si item dalam category tersebut memiliki 'sumBooking' terbanyak dibandingkan item lainnya maka isPopular nya menjadi 'true'
      for (let i = 0; i < category.length; i++) {
        for (let j = 0; j < category[i].itemId.length; j++) {
          const item = await Item.findOne({ _id: category[i].itemId[j]._id });
          item.isPopular = false;
          await item.save();
          // kenapa dibandingkan dengan itemId[0] karena sebelumnya sudah di sort desc sehingga item dengan 'sumBooking' tertinggi berada di array 0
          if (category[i].itemId[0] === category[i].itemId[j]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      // Dibuat sendiri dari frontend karena bersifat static??
      const testimonial = {
        _id: 'asd1293uasdads1',
        imageUrl: 'images/testimonial2.jpg',
        name: 'Happy Family',
        rate: 4.55,
        content:
          'What a great trip with my family and I should try again next time soon ...',
        familyName: 'Angga',
        familyOccupation: 'Product Designer',
      };

      res.status(200).json({
        hero: {
          travelers: traveler.length,
          treasures: treasure.length,
          cities: city.length,
        },
        mostPicked,
        categories: category,
        testimonial,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ messsage: 'Internal server error' });
    }
  },

  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: 'featureId', select: '_id name qty imageUrl' })
        .populate({ path: 'activityId', select: '_id name type imageUrl' })
        .populate({ path: 'imageId', select: '_id imageUrl' });

      const bank = await Bank.find();

      // Dibuat sendiri dari frontend karena bersifat static??
      const testimonial = {
        _id: 'asd1293uasdads1',
        imageUrl: 'images/testimonial1.jpg',
        name: 'Happy Family',
        rate: 4.55,
        content:
          'What a great trip with my family and I should try again next time soon ...',
        familyName: 'Angga',
        familyOccupation: 'Product Designer',
      };

      res.status(200).json({
        ...item._doc, // ini di gunakan untuk agar hanya mengambil documentanya, gk perlu ada 'item:' nya
        bank,
        testimonial,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ messsage: 'Internal server error' });
    }
  },

  // POST
  bookingPage: async (req, res) => {
    const {
      idItem,
      duration,
      // price,
      bookingStartDate,
      bookingEndDate,
      firstName,
      lastName,
      email,
      phoneNumber,
      accountHolder,
      bankFrom,
    } = req.body;

    // Validasi
    if (!req.file) {
      return res.status(404).josn({ message: 'image not found' });
    }

    if (
      idItem === undefined ||
      duration === undefined ||
      // price === undefined ||
      bookingStartDate === undefined ||
      bookingEndDate === undefined ||
      firstName === undefined ||
      lastName === undefined ||
      email === undefined ||
      phoneNumber === undefined ||
      accountHolder === undefined ||
      bankFrom === undefined
    ) {
      res.status(404).json({ message: 'Lengkapi semua field' });
    }

    const item = await Item.findOne({ _id: idItem });

    if (!item) {
      res.status(404).json({ message: 'Item not found' });
    }

    item.sumBooking += 1;
    await item.save();

    let total = item.price * duration;
    let tax = total * 0.1;

    const invoice = Math.floor(1000000 + Math.random() * 9000000);

    const member = await Member.create({
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    const newBooking = {
      invoice,
      bookingStartDate,
      bookingEndDate,
      total: (total += tax),
      itemId: {
        _id: item.id,
        title: item.title,
        price: item.price,
        duration: item.duration,
      },

      memberId: member.id,
      payments: {
        proofPayment: `images/${req.file.filename}`,
        bankFrom: bankFrom,
        accountHolder: accountHolder,
      },
    };

    const booking = await Booking.create(newBooking);
    // await booking.save();

    res.status(201).json({ message: 'Sukses Booking' });
  },
};
