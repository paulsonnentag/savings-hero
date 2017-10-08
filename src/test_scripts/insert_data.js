const firebase = require('firebase')
const card_data = require('./insert_data.json').data
const shortid = require('shortid');

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyA7MHn5QVVqlWvDzvXmwUvh5C7WRuR6lWs',
  authDomain: 'hacktomorrow-2fee6.firebaseapp.com',
  databaseURL: 'https://hacktomorrow-2fee6.firebaseio.com/',
  projectId: 'hacktomorrow-2fee6',
  storageBucket: 'hacktomorrow-2fee6.appspot.com',
  messagingSenderId: '696839577065'
}

firebase.initializeApp(config);

card_data[0].id = shortid.generate();
card_data[1].id = shortid.generate();
card_data[2].id = shortid.generate();
card_data[3].id = shortid.generate();

firebase.database().ref('transactions/' + card_data[0].id).set(card_data[0]).then(() => {
 console.log('Set')
 
 setTimeout(() => {
   firebase.database().ref('transactions/' + card_data[1].id).set(card_data[1]).then(() => {
    console.log('Set2')
    setTimeout(() => {
        firebase.database().ref('transactions/' + card_data[2].id).set(card_data[2]).then(() => {
            console.log('Set 3')
            setTimeout(() => {
                firebase.database().ref('transactions/' + card_data[3].id).set(card_data[3]).then(() => {
    console.log('Set4')})
            }, 2000)
        })
    }, 4000);
   })  
 }, 2000);
});

/*
for (let i = 0; i < card_data.length; i++) {
    firebase.database().ref('transactions/' + card_data[i].id).set(card_data[i]).then(() => {
 console.log('Set:', i)
})
}
*/