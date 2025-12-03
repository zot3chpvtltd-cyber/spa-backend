const { Booking, Service, SpaOrganization, Sale } = require('../models');
const { Op } = require('sequelize');

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const spaId = req.user.spaId;

        const totalBookings = await Booking.count({ where: { SpaId: spaId } });
        const pendingBookings = await Booking.count({ where: { SpaId: spaId, Status: 'Pending' } });
        const totalServices = await Service.count({ where: { SpaId: spaId } });

        res.json({
            totalBookings,
            pendingBookings,
            totalServices
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get Spa Bookings
exports.getBookings = async (req, res) => {
    try {
        const spaId = req.user.spaId;
        const bookings = await Booking.findAll({
            where: { SpaId: spaId },
            include: [{
                model: Service,
                attributes: ['Title', 'Price']
            }],
            order: [['BookingDate', 'DESC']]
        });

        // Format the response to match frontend expectations
        const formattedBookings = bookings.map(booking => {
            // Format date as YYYY-MM-DD string
            let formattedDate = '';
            if (booking.BookingDate) {
                const date = new Date(booking.BookingDate);
                formattedDate = date.toISOString().split('T')[0];
            }

            // Format time as HH:mm:ss string
            let formattedTime = booking.BookingTime || '';

            return {
                bookingId: booking.BookingId,
                customerName: booking.CustomerName,
                customerEmail: booking.CustomerEmail,
                customerPhone: booking.CustomerPhone,
                bookingDate: formattedDate,
                bookingTime: formattedTime,
                status: booking.Status || 'Pending',
                serviceName: booking.Service ? booking.Service.Title : 'N/A',
                servicePrice: booking.Service ? booking.Service.Price : 0,
                specialRequests: booking.SpecialRequests
            };
        });

        res.json(formattedBookings);
    } catch (error) {
        console.error('Get Bookings Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Create Service
exports.createService = async (req, res) => {
    try {
        const spaId = req.user.spaId;
        const { title, description, duration, price, imageUrl } = req.body;

        const newService = await Service.create({
            SpaId: spaId,
            Title: title,
            Description: description,
            Duration: duration,
            Price: price,
            ImageUrl: imageUrl
        });

        res.status(201).json(newService);
    } catch (error) {
        console.error('Create Service Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get Services (Admin View)
exports.getServices = async (req, res) => {
    try {
        const spaId = req.user.spaId;
        const services = await Service.findAll({
            where: { SpaId: spaId }
        });
        res.json(services);
    } catch (error) {
        console.error('Get Services Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Update Booking Status
exports.updateBookingStatus = async (req, res) => {
    try {
        const spaId = req.user.spaId;
        const { id } = req.params;

        // Extract status from request body
        const newStatus = req.body.status;

        if (!newStatus) {
            return res.status(400).json({ message: 'Status is required.' });
        }

        // Find the booking and verify it belongs to this spa
        const booking = await Booking.findOne({
            where: { BookingId: id, SpaId: spaId },
            include: [{ model: Service }]
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        const oldStatus = booking.Status;

        // Update the status
        booking.Status = newStatus;
        await booking.save();

        // If status changed to 'Confirmed' or 'Completed', create a sale entry
        if ((newStatus === 'Confirmed' || newStatus === 'Completed') && oldStatus !== newStatus) {
            console.log('Creating sale entry for booking:', booking.BookingId);
            try {
                const saleEntry = await Sale.create({
                    SpaId: spaId,
                    BookingId: booking.BookingId,
                    CustomerName: booking.CustomerName,
                    ServiceName: booking.Service ? booking.Service.Title : 'N/A',
                    Amount: booking.Service ? booking.Service.Price : 0,
                    PaymentMethod: 'Cash',
                    SaleDate: new Date()
                });
                console.log('Sale created successfully:', saleEntry.SaleId);
            } catch (saleError) {
                console.error('Error creating sale:', saleError);
            }
        }

        res.json({ message: 'Booking status updated successfully.', booking });
    } catch (error) {
        console.error('Update Booking Status Error:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};

// Get Sales
exports.getSales = async (req, res) => {
    try {
        const spaId = req.user.spaId;
        const sales = await Sale.findAll({
            where: { SpaId: spaId },
            order: [['SaleDate', 'DESC']]
        });

        res.json(sales);
    } catch (error) {
        console.error('Get Sales Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Delete Booking
exports.deleteBooking = async (req, res) => {
    try {
        const spaId = req.user.spaId;
        const { id } = req.params;

        // Find the booking and verify it belongs to this spa
        const booking = await Booking.findOne({
            where: { BookingId: id, SpaId: spaId }
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        await booking.destroy();

        res.json({ message: 'Booking deleted successfully.' });
    } catch (error) {
        console.error('Delete Booking Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
