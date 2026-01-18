import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';
import SEOHead from '../components/SEOHead';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [relatedEvents, setRelatedEvents] = useState([]);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const docRef = doc(db, 'events', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists() && docSnap.data().status === 'published') {
                    const data = docSnap.data();

                    let organizerName = 'Tickify Organizer';
                    if (data.organizerId) {
                        try {
                            const orgRef = doc(db, 'organizers', data.organizerId);
                            const orgSnap = await getDoc(orgRef);
                            if (orgSnap.exists()) {
                                organizerName = orgSnap.data().name || orgSnap.data().organizerName || organizerName;
                            }
                        } catch (err) { }
                    }

                    const eventData = {
                        id: docSnap.id,
                        ...data,
                        title: data.eventTitle || data.title,
                        description: data.eventDescription || data.description,
                        image: data.bannerUrl || data.image,
                        date: data.startDate || data.date,
                        time: data.startTime || data.time,
                        location: data.venueName ? `${data.venueName}, ${data.city}` : (data.location || data.city || 'Online'),
                        organizer: organizerName,
                        tickets: (data.tickets || []).map(t => ({
                            ...t,
                            features: Array.isArray(t.features) ? t.features : (t.description ? [t.description] : [])
                        }))
                    };
                    setEvent(eventData);

                    if (eventData.tickets && eventData.tickets.length > 0) {
                        setSelectedTicket(eventData.tickets[0].id || 0);
                    }

                    // Fetch Related Events
                    if (eventData.category) {
                        const q = query(
                            collection(db, 'events'),
                            where('category', '==', eventData.category),
                            where('status', '==', 'published'),
                            limit(4)
                        );
                        const querySnapshot = await getDocs(q);
                        const related = [];
                        querySnapshot.forEach((doc) => {
                            if (doc.id !== id) {
                                related.push({ id: doc.id, ...doc.data() });
                            }
                        });
                        setRelatedEvents(related);
                    }

                } else {
                    setEvent(null);
                }
            } catch (error) {
                toast.error("Error fetching event details");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleQuantityChange = (delta) => {
        setTicketQuantity(Math.max(1, ticketQuantity + delta));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-36 pb-20 flex justify-center items-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-32 w-full max-w-2xl bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 pt-36 pb-20 flex justify-center items-center">
                <div className="text-xl font-medium text-gray-500">Event not found.</div>
            </div>
        );
    }

    const currentTicketPrice = event.tickets?.find((t, index) => (t.id || index) === selectedTicket)?.price || 0;
    const totalPrice = currentTicketPrice * ticketQuantity;

    const isRegistrationClosed = event ? (() => {
        if (!event.registrationEndDate) return false;
        const now = new Date();
        const endDate = new Date(`${event.registrationEndDate}T${event.registrationEndTime || '23:59'}`);
        return now > endDate;
    })() : false;

    return (
        <>
            {event && (
                <SEOHead
                    title={`${event.title} - Book Tickets`}
                    description={event.description}
                    image={event.image}
                />
            )}

            <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-20">
                {/* Background Banner Blur (Optional, subtle) */}
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-[#F5F5F5] opacity-50 -z-10"></div>

                <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

                    {/* Header Title Section */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                                    {event.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600">
                                    <span className="bg-white text-gray-800 px-3 py-1 rounded-full border border-gray-200 text-xs uppercase tracking-wide shadow-sm">
                                        {event.category || 'Event'}
                                    </span>
                                    {event.isVerified && (
                                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                                            Verified
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                        <svg className="w-4 h-4 text-[#F84464]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                        {event.location}
                                    </span>
                                    <span className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                        <svg className="w-4 h-4 text-[#F84464]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        {event.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                        {/* LEFT COLUMN: Main Content */}
                        <div className="flex-1">
                            {/* Main Banner Image */}
                            <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-sm mb-10 bg-white border border-gray-100">
                                <img
                                    src={event.image || "https://placehold.co/1200x600"}
                                    alt={event.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </div>

                            {/* About Section */}
                            <div className="mb-12">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-[#F84464] pl-4">About the Event</h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                    {event.description}
                                </p>
                            </div>

                            {/* Lineup / Artists */}
                            {event.lineup && event.lineup.length > 0 && (
                                <div className="mb-12">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-[#F84464] pl-4">Artist Lineup</h3>
                                    <div className="flex flex-wrap gap-8">
                                        {event.lineup.map((artist, idx) => (
                                            <div key={idx} className="flex flex-col items-center gap-3 w-28">
                                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-200 hover:scale-105 transition-transform duration-300">
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-2xl font-bold text-gray-400">
                                                        {artist.charAt(0)}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-bold text-gray-900 text-sm">{artist}</div>
                                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Artist</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Terms & Info (Static for now to match minimal feel) */}
                            <div className="mb-12 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Terms & Conditions</h3>
                                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 marker:text-[#F84464]">
                                    <li>Tickets cannot be exchanged or refunded, but you can resell them on our marketplace.</li>
                                    <li>An Internet handling fee per ticket may be levied.</li>
                                    <li>Please check the total amount before payment.</li>
                                    <li>We recommend that you arrive at-least 20 minutes prior at the venue for a seamless entry.</li>
                                </ul>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Booking Sidebar (Sticky) */}
                        <div className="w-full lg:w-[380px] shrink-0">
                            <div className="sticky top-28 space-y-6">
                                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 checkout-card">
                                    {/* Ticket Selection */}
                                    {event.tickets && event.tickets.length > 0 ? (
                                        <>
                                            <div className="mb-6">
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Select Category</label>
                                                <div className="space-y-3">
                                                    {event.tickets.map((ticket, index) => (
                                                        <div
                                                            key={ticket.id || index}
                                                            onClick={() => setSelectedTicket(ticket.id || index)}
                                                            className={`cursor-pointer p-4 rounded-lg border transition-all flex justify-between items-center group
                                                            ${(selectedTicket === (ticket.id || index))
                                                                    ? 'border-[#F84464] bg-red-50 ring-1 ring-[#F84464] shadow-sm'
                                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                                        >
                                                            <div>
                                                                <div className="font-bold text-gray-900">{ticket.name}</div>
                                                                {ticket.description && (
                                                                    <div className="text-xs text-gray-500 mt-0.5 max-w-[150px] truncate">{ticket.description}</div>
                                                                )}
                                                            </div>
                                                            <div className="font-bold text-[#F84464]">₹{ticket.price}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Quantity */}
                                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                                                <span className="text-sm font-bold text-gray-500 uppercase">Quantity</span>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => handleQuantityChange(-1)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition">-</button>
                                                    <span className="w-6 text-center font-bold text-gray-900">{ticketQuantity}</span>
                                                    <button onClick={() => handleQuantityChange(1)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 transition">+</button>
                                                </div>
                                            </div>

                                            {/* Total & Action */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-sm font-medium text-gray-600">Total Amount</span>
                                                    <span className="text-2xl font-bold text-gray-900">₹{totalPrice}</span>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        if (isRegistrationClosed) return;

                                                        if (!currentUser) {
                                                            const ticket = event.tickets.find((t, idx) => (t.id || idx) === selectedTicket);
                                                            const checkoutState = {
                                                                event: event,
                                                                items: [{
                                                                    ...ticket,
                                                                    quantity: ticketQuantity,
                                                                    totalPrice: totalPrice,
                                                                    price: ticket.price,
                                                                    name: ticket.name
                                                                }],
                                                                totalPrice: totalPrice
                                                            };

                                                            navigate('/login', {
                                                                state: {
                                                                    from: '/checkout',
                                                                    checkoutState: checkoutState
                                                                }
                                                            });
                                                            return;
                                                        }

                                                        if (event.seatingType === 'Reserved' || (event.seatingGrid && event.seatingGrid.length > 0)) {
                                                            navigate(`/events/${event.id}/seats`);
                                                        } else {
                                                            const ticket = event.tickets.find((t, idx) => (t.id || idx) === selectedTicket);
                                                            navigate('/checkout', {
                                                                state: {
                                                                    event: event,
                                                                    items: [{
                                                                        ...ticket,
                                                                        quantity: ticketQuantity,
                                                                        totalPrice: totalPrice,
                                                                        price: ticket.price,
                                                                        name: ticket.name
                                                                    }],
                                                                    totalPrice: totalPrice
                                                                }
                                                            });
                                                        }
                                                    }}
                                                    disabled={isRegistrationClosed}
                                                    className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98]
                                                    ${isRegistrationClosed ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#e50914] hover:bg-[#b00710] shadow-red-200'}`}
                                                    style={{ backgroundColor: isRegistrationClosed ? undefined : '#F84464' }}
                                                >
                                                    {isRegistrationClosed ? 'Sold Out' : 'Book Tickets'}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No tickets available currently.
                                        </div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <p className="text-xs text-gray-400">Verified & Secured by Tickify</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Events Section */}
                    {relatedEvents.length > 0 && (
                        <div className="mt-24 pt-12 border-t border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-[#F84464] pl-4">You May Also Like</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {relatedEvents.map((evt) => (
                                    <Link to={`/events/${evt.id}`} key={evt.id} className="group block h-full">
                                        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden border border-gray-100">
                                            <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                                                <img
                                                    src={evt.bannerUrl || evt.image || 'https://placehold.co/400x300'}
                                                    alt={evt.eventTitle || evt.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800 shadow-sm">
                                                    {evt.category || 'Event'}
                                                </div>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col">
                                                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 leading-tight group-hover:text-[#F84464] transition-colors">
                                                    {evt.eventTitle || evt.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-3 line-clamp-1">{evt.venueName || evt.location || 'Online'}</p>
                                                <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center text-sm">
                                                    <span className="font-medium text-gray-900">{evt.startDate || evt.date}</span>
                                                    {evt.tickets && evt.tickets.length > 0 && (
                                                        <span className="font-bold text-[#F84464]">₹{evt.tickets[0].price}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default EventDetails;
