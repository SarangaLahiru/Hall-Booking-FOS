import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCtoeufLDEk4uEtOULTq1mzYksM_hwrEt8",
    authDomain: "exe4-5d1c0.firebaseapp.com",
    projectId: "exe4-5d1c0",
    storageBucket: "exe4-5d1c0.appspot.com",
    messagingSenderId: "901880366629",
    appId: "1:901880366629:web:737067c23a19a91aaee1cc",
    measurementId: "G-7BF4L151SK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const firestore = getFirestore(app);
const storage = getStorage(app);

export { firestore, storage }; // Export Firestore instance
