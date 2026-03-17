const stripe = require("../config/stripe");
const { Booking, User, Ticket, Seat } = require("../models");

/* STRIPE CHECKOUT */

exports.checkout = async (req, res) => {

  try {

    const { price, bookingId } = req.body;

    const session = await stripe.checkout.sessions.create({

      payment_method_types: [
        "card",
        "upi",
        "netbanking"

      ],

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Event Ticket"
            },
            unit_amount: price * 100
          },
          quantity: 1
        }
      ],

      mode: "payment",

      success_url: `http://localhost:5000/payment/success/${bookingId}`,

      cancel_url: "http://localhost:3000/cancel"

    });

    res.json({
      url: session.url
    });

  } catch (err) {

    console.log(err);
    res.status(500).json({ msg: "Payment error" });

  }

};



/* PAYMENT SUCCESS */

exports.paymentSuccess = async (req, res) => {

  try {

    const bookingId = req.params.bookingId;

    const booking = await Booking.findByPk(bookingId, {
      include: [User]
    });

    const user = booking.User;

    /* UPDATE BOOKING STATUS */

    booking.status = "confirmed";
    booking.payment_status = "success";

    await booking.save();

    /* GET BOOKED SEATS */

    const seats = await Seat.findAll({
      where: {
        EventId: booking.EventId,
        status: "booked"
      }
    });

    const seatNumbers = seats.map(seat => seat.seat_number).join(",");

    const ticketNumber = "TICKET-" + Date.now();

    const ticketText = `
EVENT TICKET
Ticket: ${ticketNumber}
Name: ${user.name}
Email: ${user.email}
Seats: ${seatNumbers}
BookingId: ${booking.id}
`;

    /* CREATE TICKET */

    const ticket = await Ticket.create({
      ticket_number: ticketNumber,
      seat_number: seatNumbers,
      qr_code: ticketText,
      BookingId: booking.id,
      UserId: user.id,
      EventId: booking.EventId
    });

    res.json({
      msg: "Payment successful",
      ticketData: ticketText,
      ticket
    });

  } catch (err) {

    console.log(err);
    res.status(500).json({ msg: "Payment verification error" });

  }

};