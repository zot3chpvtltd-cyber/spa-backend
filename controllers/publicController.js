const { Service, SpaOrganization, Booking } = require('../models');

// Get Services (Public - for development, uses spaId from query or defaults to first spa)
exports.getServices = async (req, res) => {
    try {
        let spaId = req.query.spaId;

        // If no spaId provided, get the first spa (for development)
        if (!spaId) {
            const firstSpa = await SpaOrganization.findOne();
            if (!firstSpa) {
                return res.status(404).json({ message: 'No spa found.' });
            }
            spaId = firstSpa.SpaId;
        }

        const services = await Service.findAll({
            where: { SpaId: spaId, IsActive: true }
        });

        // Format response to match frontend expectations (camelCase)
        const formattedServices = services.map(service => ({
            serviceId: service.ServiceId,
            title: service.Title,
            description: service.Description,
            duration: service.Duration,
            price: service.Price,
            imageUrl: service.ImageUrl
        }));

        res.json(formattedServices);
    } catch (error) {
        console.error('Get Services Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get Services by Spa Slug
exports.getServicesBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const spa = await SpaOrganization.findOne({ where: { SpaSlug: slug } });
        if (!spa) {
            return res.status(404).json({ message: 'Spa not found.' });
        }

        const services = await Service.findAll({
            where: { SpaId: spa.SpaId, IsActive: true }
        });

        res.json({ spa, services });
    } catch (error) {
        console.error('Get Public Services Error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Create Booking (Public)
exports.createBooking = async (req, res) => {
    try {
        const { spaId, serviceId, customerName, customerEmail, customerPhone, bookingDate, bookingTime, specialRequests } = req.body;

        console.log('Creating booking with data:', { spaId, serviceId, customerName, customerEmail, customerPhone, bookingDate, bookingTime });

        const newBooking = await Booking.create({
            SpaId: spaId,
            ServiceId: serviceId,
            CustomerName: customerName,
            CustomerEmail: customerEmail,
            CustomerPhone: customerPhone,
            BookingDate: bookingDate,
            BookingTime: bookingTime,
            SpecialRequests: specialRequests
        });

        res.status(201).json({ message: 'Booking created successfully!', bookingId: newBooking.BookingId });
    } catch (error) {
        console.error('Create Booking Error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};
