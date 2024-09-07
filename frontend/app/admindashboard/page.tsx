'use client'
import { createClient } from '@/utils/supabase/client';
import React, { useState, useEffect } from 'react';

function AdminDashboard() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

            const client = createClient()
            const session = await client.auth.getSession()
            const accessToken = session.data?.session?.access_token

            const response = await fetch(`${BACKEND_URL}/events/admin/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            setEvents(data);
        };

        fetchEvents();
    }, []);

    const approveEvent = (id: number) => {
        // Logic to approve event goes here
        console.log(`Approved event with id: ${id}`);
    };

    const rejectEvent = (id: number) => {
        // Logic to reject event goes here
        console.log(`Rejected event with id: ${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Pending Events</h1>

            {events.length === 0 ? (
                <p className="text-gray-400">No pending events.</p>
            ) : (
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    {events.map((event) => (
                        <div key={event.id} className="bg-gray-800 p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
                            <p className="text-gray-400 mb-4">{event.description}</p>

                            {/* Add more event details here */}

                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => approveEvent(event.id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => rejectEvent(event.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
