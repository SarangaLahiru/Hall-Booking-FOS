import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { firestore, storage } from '../../firebase';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import Swal from 'sweetalert2';

function BookingForm() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [activeStep, setActiveStep] = useState(0);
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [post, setPost] = useState('');
    const [faculty, setFaculty] = useState('');
    const [activityIntroduction, setActivityIntroduction] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [isAgree, setIsAgree] = useState('');
    const [facilities, setFacilities] = useState('');
    const [date, setDate] = useState(queryParams.get('date') || '');
    const [time, setTime] = useState(queryParams.get('time') || '');
    const [duration, setDuration] = useState(queryParams.get('duration') || '');
    const [reason, setReason] = useState('');
    const [file, setFile] = useState(null);

    const steps = ['Personal Info', 'Booking Info 1', 'Booking Info2', 'Confirmation'];

    const handleNext = () => {
        let isValid = true;
        switch (activeStep) {
            case 0:
                if (!name || !position || !post || !faculty || !phone || !email) {
                    isValid = false;
                    // Set error messages or show notification for missing fields
                    Swal.fire({
                        title: "Oops...",
                        text: "please fill all the field",
                        icon: "error"
                    });
                }
                break;
            case 1:
                if (!date || !time || !duration || !reason) {
                    isValid = false;
                    // Set error messages or show notification for missing fields
                    Swal.fire({
                        title: "Oops...",
                        text: "please fill all the field",
                        icon: "error"
                    });
                }
                break;
            case 2:
                if (!file || !facilities) {
                    isValid = false;
                    // Set error messages or show notification for missing fields
                    Swal.fire({
                        title: "Oops...",
                        text: "please fill all the field",
                        icon: "error"
                    });
                }
                break;
            case 3:
                if (!isAgree) {
                    isValid = false;
                    // Set error messages or show notification for missing fields
                    Swal.fire({
                        title: "Oops...",
                        text: "You have to agree",
                        icon: "error"
                    });
                }
                break;
            default:
                break;
        }
        if (isValid) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            // Show error message or notification
            Swal.fire({
                title: "Oops...",
                text: "please fill all the field",
                icon: "error"
            });
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dateTime = new Date(date + 'T' + time);
            const formattedDate = dateTime.toISOString().split('T')[0];
            const formattedTime = dateTime.toISOString().split('T')[1].substring(0, 5);

            let fileURL = null;
            if (file) {
                const storageRef = ref(storage, `images/${file.name}`);
                await uploadBytes(storageRef, file);
                fileURL = await getDownloadURL(storageRef);
            }

            await addDoc(collection(firestore, 'bookings'), {
                name,
                position,
                post,
                phone,
                email,
                isAgree,
                facilities,
                faculty,
                activityIntroduction,
                date: formattedDate,
                time: formattedTime,
                duration,
                reason,
                fileURL,
                status: 'pending'
            });

            console.log('Booking added successfully');
            Swal.fire({
                title: "Success",
                text: "Your request send Successfully\nWe send your email after approved your Booking",
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "/home"; // Replace "your-url-here" with the URL of the page you want to navigate to
                }
            });

            // Show success message or redirect
        } catch (error) {
            console.error('Error adding booking:', error);
            // Handle error
        }
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <div className=''>
                        <div>
                            <div className='lg:flex items-center justify-center'>
                                <input
                                    type="text"
                                    placeholder="User Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="m-2 w-full h-10 px-3 mt-2 mb-4 text-base placeholder-gray-500 border rounded-lg focus:shadow-outline"
                                    required
                                />
                                <select
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                    className="m-2 w-full h-10 px-3 mb-4 text-base placeholder-gray-500 border rounded-lg focus:shadow-outline"
                                    required
                                >
                                    <option value="">Select Position</option>
                                    <option value="academic">Academic</option>
                                    <option value="non-academic">Non-Academic</option>
                                    <option value="student">Student</option>
                                </select>
                            </div>
                            <input
                                type="text"
                                placeholder="Post or student No"
                                value={post}
                                onChange={(e) => setPost(e.target.value)}
                                className=" m-2 w-full h-10 px-3 mb-4 text-base placeholder-gray-500 border rounded-lg focus:shadow-outline"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Faculty or Society"
                                value={faculty}
                                onChange={(e) => setFaculty(e.target.value)}
                                className=" m-2 w-full h-10 px-3 mb-4 text-base placeholder-gray-500 border rounded-lg focus:shadow-outline"
                                required
                            />

                            <div className='lg:flex '>
                                <input
                                    type="text"
                                    placeholder="E-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className=" m-2 w-full h-10 px-3 mb-4 text-base placeholder-gray-500 border rounded-lg focus:shadow-outline"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Phone number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className=" m-2 w-full h-10 px-3 mb-4 text-base placeholder-gray-500 border rounded-lg focus:shadow-outline"
                                    required
                                />
                            </div>


                        </div>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <div className='lg:flex'>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="m-2 w-full h-10 px-3 mt-2 mb-4 text-base placeholder-gray-500 border rounded-lg focus:shadow-outline"
                                required
                            />
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="m-2 w-full h-10 px-3 mb-4 text-base placeholder-gray-500 border rounded-lg focus:shadow-outline"
                                required
                            />
                        </div>
                        <input
                            type="number"
                            placeholder="Duration (in hours)"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="m-2 w-full h-10 px-3 mb-4 text-base placeholder-gray-500 border rounded-lg focus:shadow-outline"
                            required
                        />
                        <textarea
                            placeholder="Breafly introduction of Activity"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="m-2 w-full h-20 px-3 py-2 mb-4 text-base placeholder-gray-500 border rounded-lg focus:shadow-outline resize-none"
                            required
                        />
                        {/* <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="m-2 w-full h-10 px-3 mb-4 text-base placeholder-gray-500 border rounded-lg focus:shadow-outline"
                        /> */}
                    </div>
                );
            case 2:
                return (
                    <div>


                        <textarea
                            placeholder="Breafly introduction of Activity"
                            value={facilities}
                            onChange={(e) => setFacilities(e.target.value)}
                            className="m-2 w-full h-20 px-3 py-2 mb-4 text-base placeholder-gray-500 border rounded-lg focus:shadow-outline resize-none"
                            required
                        />
                        <label className='m-3' htmlFor="">Upload your verification file <span className=' text-red-500 text-xl'>*</span></label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="m-2 block w-full text-sm text-gray-900 border border-gray-500 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Confirmation Content</h2>
                        <div>
                            <p>Are you agree this statement</p>
                            <label className="inline-flex items-center mt-3">
                                <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-gray-600"
                                    onChange={(e) => setIsAgree(e.target.checked)}
                                />
                                <span className="ml-2 text-gray-700">I agree</span>
                            </label>
                        </div>
                    </div>
                );
            default:
                return 'Unknown step';
        }
    };

    return (

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-20">
            <h2 className='m-auto  text-center  text-6xl'>Hall Booking</h2>
            <p className='m-auto  text-center  text-xl mt-2'>please fill your correct details!</p>
            <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                    margin: "50px auto",
                    fontSize: "20px",
                    "& .MuiStepIcon-root": {
                        // Change color of step icons
                        fontSize: "3rem", // Change size of step icons
                        borderRadius: "24px",

                    },
                    "& .MuiStepLabel-label": {
                        // Change color of step labels
                        fontSize: "1rem", // Change size of step labels

                    },

                }}
            >
                {steps.map((label, index) => (
                    <Step key={label}  >
                        <StepLabel

                            sx={{
                                "& .MuiStepLabel-label": {
                                    color: index === activeStep ? "blue" : "black", // Change color of current step label
                                },
                            }}

                        >{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {
                activeStep === steps.length ? (
                    <div className="text-center">
                        <Typography variant="h5" align="center">
                            All steps completed - you're finished
                        </Typography>
                        <button onClick={handleSubmit} className=' bg-blue-600 px-10 py-4 rounded-2xl text-2xl text-cyan-50 mt-10'>Send Booking Request</button>
                    </div>
                ) : (
                    <div className='p-10'>
                        <div className='lg:-mt-5 ml-5 m-auto lg:w-5/12 lg:absolute'>{getStepContent(activeStep)}</div>
                        <div className="mt-22 lg:mt-56">
                            <button
                                onClick={handleBack}
                                className={`inline-flex m-5 items-center px-14 py-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                disabled={activeStep === 0}
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className={` inline-flex m-5 items-center px-14 py-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </button>
                        </div>
                    </div>
                )
            }
        </form >
    );
}

export default BookingForm;
