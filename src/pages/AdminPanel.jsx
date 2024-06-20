import React, { useState, useEffect } from 'react';
import { firestore, storage } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { ref, getDownloadURL } from 'firebase/storage';

function AdminPanel() {
    const [bookingRequests, setBookingRequests] = useState([]);

    useEffect(() => {
        fetchBookingRequests();
    }, []);

    const fetchBookingRequests = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'bookings'));
            const requests = [];
            await Promise.all(querySnapshot.docs.map(async (doc) => {
                const data = doc.data();
                // Fetch the file URL if it exists
                let fileURL = null;
                if (data.fileURL) {
                    fileURL = await getFileURL(data.fileURL);
                }
                requests.push({ id: doc.id, ...data, fileURL });
            }));
            setBookingRequests(requests);
        } catch (error) {
            console.error('Error fetching booking requests:', error);
        }
    };

    const getFileURL = async (fileRef) => {
        try {
            const storageRef = ref(storage, fileRef); // Create a reference to the file location
            const url = await getDownloadURL(storageRef); // Get the download URL using getDownloadURL function
            return url;
        } catch (error) {
            console.error('Error getting file URL:', error);
            return null;
        }
    };
    const handleApprove = async (id) => {
        try {
            await updateDoc(doc(firestore, 'bookings', id), { status: 'approved' });
            // Refresh the list of booking requests after approval
            fetchBookingRequests();
        } catch (error) {
            // Handle error
            console.error('Error approving booking request:', error);
        }
    };

    const handleReject = async (id) => {
        try {
            await updateDoc(doc(firestore, 'bookings', id), { status: 'rejected' });
            // Refresh the list of booking requests after rejection
            fetchBookingRequests();
        } catch (error) {
            // Handle error
            console.error('Error rejecting booking request:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Booking Requests</h2>
            <ul>
                {bookingRequests.map(request => (
                    <li key={request.id} className="border border-gray-300 rounded p-4 mb-4">
                        <p className="text-lg font-semibold">Date: {request.date}</p>
                        <p>Time: {request.time}</p>
                        <p>Duration: {request.duration}</p>
                        <p>Reason: {request.reason}</p>
                        {request.fileURL && (
                            <div>
                                <p>File:</p>
                                <a href={request.fileURL} target="_blank" rel="noreferrer">file</a>
                            </div>
                        )}
                        <div className="mt-4">
                            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2" onClick={() => handleApprove(request.id)}>Approve</button>
                            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={() => handleReject(request.id)}>Reject</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminPanel;
