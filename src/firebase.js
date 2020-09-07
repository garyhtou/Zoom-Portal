import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/database";

var firebaseConfig = {
	apiKey: "AIzaSyAgsObvofZLpnMT1rlKgA7AP9dgthT42P0",
	authDomain: "zoom-portal.firebaseapp.com",
	databaseURL: "https://zoom-portal.firebaseio.com",
	projectId: "zoom-portal",
	storageBucket: "zoom-portal.appspot.com",
	messagingSenderId: "855944975010",
	appId: "1:855944975010:web:31c73b1448195cf0423dfb",
	measurementId: "G-NDZBTLTC6K",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.database();

export default firebase;
