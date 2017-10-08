const firebase = require('firebase')
const request= require('request-promise-native')
const card_data = require('./data').data
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

/*
get and write data to firebase
firebase.database().ref('/data').once('value').then((snapshot) => {
  console.log(snapshot.val())
})
*/

for (let i = 0; i < card_data.length; i++) {
    const entry = card_data[i];
    entry.id = shortid.generate();
    firebase.database().ref('transactions/' + entry.id).set(entry).then(() => console.log('Set'));  
}

/*
// get the data for our user
request({
  url: 'https://api119525live.gateway.akana.com:443/users',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  json:true
})
.then((res) => res['LegalParticipantIdentifierList'])
.then((users) => users[0])
.then((user) => {
  user = '00000000000000822943114'

  // request the users history
  const queryData = {
    'OperatingCompanyIdentifier' : '815',
    'ProductCode' : 'DDA',
    'PrimaryIdentifier' : user
  }
  
  request({
    url: 'https://api119622live.gateway.akana.com:443/account/transactions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    json: queryData,

  })
  .then((result) => {
    data = result['MonetaryTransactionResponseList']
  })
})
.catch((err) => {
  console.log(err)
})
*/

console.log(card_data)
