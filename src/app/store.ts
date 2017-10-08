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
let events = null

let callback = null
let summaryCallback = null

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

const eventsRef = firebase.database().ref('events');
eventsRef.on('value', (snapshot) => {
  if (snapshot.val() == null) {
    return
  }

  events = _((snapshot.val()))
    .values()
    .map(event => ({
      type: event.type,
      saved: event.saved,
      date: new Date(event.date),
      id: event.id
    }))
    .sortBy('date')
    .reverse()
    .value()


  if (callback) {
    summaryCallback(events)
  }
})

export default {
  getTransactions () {
    return transactions
  },

  getEvents () {
    return events
  },

  setEventHandler (cb) {
    callback = cb
  },

  setSummaryEventHandler (cb) {
    summaryCallback = cb
  },

  saveMoney (id, amount) {
    this.saved = amount

    console.log('update', `events/${id}`)

    db.ref(`events/${id}`).update({saved: amount})
  }
}
