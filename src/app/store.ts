/* globals firebase */

import firebase from 'firebase'
import _ from 'lodash'

const config = {
  apiKey: 'AIzaSyA7MHn5QVVqlWvDzvXmwUvh5C7WRuR6lWs',
  authDomain: 'hacktomorrow-2fee6.firebaseapp.com',
  databaseURL: 'https://hacktomorrow-2fee6.firebaseio.com/',
  projectId: 'hacktomorrow-2fee6',
  storageBucket: 'hacktomorrow-2fee6.appspot.com',
  messagingSenderId: '696839577065'
}

firebase.initializeApp(config)

const db = firebase.database()

let transactions = null

let callback = null

const starCountRef = firebase.database().ref('transactions');
starCountRef.on('value', (snapshot) => {
  if (snapshot.val() == null) {
    return
  }

  var _transactions = _((snapshot.val()))
    .values()
    .map(transaction => ({
      amount: parseFloat(transaction.amount),
      category: transaction.category,
      subcategory: transaction.subcategory,
      desc: transaction.desc,
      date: new Date(transaction.date),
      id: transaction.id
    }))
    .sortBy('date')
    .filter(t => !transactions || !transactions.find(({id}) => t.id === id))
    .reverse()
    .value()

  transactions = transactions !== null ? transactions.concat(_transactions) : _transactions

  if (callback) {
    callback(_transactions)
  }
})


export default {
  getTransactions () {
    return transactions
  },

  setEventHandler (cb) {
    callback = cb
  }
}
