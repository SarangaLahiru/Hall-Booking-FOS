import React, { useEffect, useState } from 'react'
import { BellSlashIcon, BuildingLibraryIcon, ClipboardDocumentCheckIcon, ExclamationCircleIcon, HandRaisedIcon } from '@heroicons/react/16/solid';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../firebase';


export default function Card() {

    const [pendingCount, setPendingCount] = useState('');
    const [approvedCount, setApprovedCount] = useState('');
    const fetchData = async () => {
        try {
            const snapshot = await getDocs(collection(firestore, 'bookings'));
            const dates = snapshot.docs.map(doc => doc.data());
            console.log(dates.filter(booking => booking.status === 'approved'))
            setPendingCount(dates.filter(booking => booking.status === 'pending').length)
            setApprovedCount(dates.filter(booking => booking.status === 'approved').length)
        }
        catch (error) {
            console.log("error")
        }
    }
    useEffect(() => {

        fetchData();
    })

    return (
        <div className=' flex flex-wrap'>
            <div className="m-5 lg:w-96 lg:m-10 box w-80 h-52 rounded-xl shadow-2xl overflow-hidden">
                <ExclamationCircleIcon className='bg-yellow-50 w-24 m-10 p-5 text-yellow-500 rounded-full' />
                <div className="dis  w-72 m-5 relative left-36 -top-32">
                    <h2 className='text-7xl font-bold'>{pendingCount}</h2>
                    <h3 className=' text-lg mt-5 max-sm:text-sm'>Still pending Requests</h3>
                </div>
            </div>
            <div className="m-5 lg:w-96 lg:m-10 box w-80 h-52 rounded-xl shadow-2xl overflow-hidden">
                <ClipboardDocumentCheckIcon className='bg-green-50 w-24 m-10 p-5 text-green-500 rounded-full' />
                <div className="dis  w-72 m-5 relative left-36 -top-32">
                    <h2 className='text-7xl font-bold'>{approvedCount}</h2>
                    <h3 className=' text-lg mt-5 max-sm:text-sm'>Approved Request</h3>
                </div>
            </div>


        </div>
    )
}
