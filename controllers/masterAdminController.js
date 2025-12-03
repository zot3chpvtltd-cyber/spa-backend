const { SpaOrganization, Booking, Payment, User } = require('../models');
const { Op } = require('sequelize');

// Get all SPAs
exports.getAllSpas = async (req, res) => {
    try {
        const spas = await SpaOrganization.findAll({
            order: [['CreatedAt', 'DESC']]
        });
        res.json(spas);
    } catch (error) {
        console.error('Get All Spas Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get all Bookings (Global)
exports.getAllBookings = async (req, res) => {
    try {
        const { Service } = require('../models');
        const bookings = await Booking.findAll({
            include: [
                { model: SpaOrganization, attributes: ['SpaName'] },
                { model: Service, attributes: ['Title', 'Price'] }
            ],
            order: [['BookingDate', 'DESC'], ['BookingTime', 'DESC']]
        });

        // Flatten the response for easier frontend consumption
        const formattedBookings = bookings.map(booking => ({
            bookingId: booking.BookingId,
            spaName: booking.SpaOrganization?.SpaName || 'N/A',
            customerName: booking.CustomerName,
            customerPhone: booking.CustomerPhone,
            customerEmail: booking.CustomerEmail,
            serviceName: booking.Service?.Title || 'N/A',
            bookingDate: booking.BookingDate,
            amount: booking.Service?.Price || 0,
            status: booking.Status
        }));

        res.json(formattedBookings);
    } catch (error) {
        console.error('Get All Bookings Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get all Sales (Global)
exports.getAllSales = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            include: [
                { model: SpaOrganization, attributes: ['SpaName'] }
            ],
            order: [['PaymentDate', 'DESC']]
        });

        // Flatten the response
        const formattedSales = payments.map(payment => ({
            saleId: payment.PaymentId,
            spaName: payment.SpaOrganization?.SpaName || 'N/A',
            customerName: 'N/A', // Payment table doesn't have customer name
            serviceName: payment.PaymentFor || 'Subscription',
            saleDate: payment.PaymentDate,
            paymentMethod: payment.PaymentMethod,
            amount: payment.Amount
        }));

        res.json(formattedSales);
    } catch (error) {
        console.error('Get All Sales Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Create SPA (Master Admin only)
exports.createSpa = async (req, res) => {
    try {
        const { spaName, spaSlug, contactEmail, contactPhone } = req.body;

        // Check if slug or email exists
        const existingSpa = await SpaOrganization.findOne({
            where: {
                [Op.or]: [{ SpaSlug: spaSlug }, { ContactEmail: contactEmail }]
            }
        });

        if (existingSpa) {
            return res.status(400).json({ message: 'SPA with this Slug or Email already exists.' });
        }

        const newSpa = await SpaOrganization.create({
            SpaName: spaName,
            SpaSlug: spaSlug,
            ContactEmail: contactEmail,
            ContactPhone: contactPhone,
            SetupFee: 15000.00,
            YearlyPrice: 7000.00, // 6-7k as requested
            SubscriptionStatus: 'Pending Payment'
        });

        res.status(201).json(newSpa);
    } catch (error) {
        console.error('Create SPA Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
}
