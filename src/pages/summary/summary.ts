import {Component, NgZone, OnDestroy} from '@angular/core';
import {ModalController, NavController} from 'ionic-angular';

import store from '../../app/store'
import currencyFormatter from 'currency-formatter'
import {SummaryModal} from "./summary-modal";
import moment from 'moment'


var budget = 100

@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html'
})
export class SummaryPage implements OnDestroy {
  ngOnDestroy(): void {
    store.setEventHandler(null)
  }

  budget = budget

  transactions = null
  events = null

  constructor(public navCtrl: NavController, private zone: NgZone, public modalCtrl: ModalController) {
    this.transactions = store.getTransactions()
    this.events = store.getEvents()

    store.setEventHandler((transactions) => {
      this.zone.run(() => {
        if (this.transactions == null) {
          this.transactions = []

          transactions.forEach(transaction => {
            this.transactions.push(transaction)
          })

        } else {
          transactions.forEach(transaction => {
            this.transactions.push(transaction)
          })
        }
      })
    })

    store.setSummaryEventHandler((events) => {
      this.zone.run(() => {
        this.events = events
      })
    })
  }

  openModal(summary) {
    const referenceDate = moment(summary.date).startOf('day')
    const beginning = summary.type === 'daily' ? referenceDate.clone() : referenceDate.clone().subtract(6, 'days')
    const ending = referenceDate.clone().add(1, 'days')

    const filteredTransactions =
      (this.transactions || [])
        .filter(({date}) => {
          const d = moment(date)
          return d.valueOf() < ending.valueOf() && d.valueOf() >= beginning.valueOf()
        })

    const spend = filteredTransactions.reduce((sum, event) => sum + event.amount, 0)

    const profileModal = this.modalCtrl.create(SummaryModal, {
      budget,
      spend,
      date: this.formatDate(summary)
    });
    profileModal.present();
  }

  formatDate(event) {
    if (event.type == 'daily') {
      return moment(event.date).format('dddd, MMM Do')
    }
  }

  getSum(event) {
    const referenceDate = moment(event.date).startOf('day')
    const beginning = event.type === 'daily' ? referenceDate.clone() : referenceDate.clone().subtract(6, 'days')
    const ending = referenceDate.clone().add(1, 'days')

    const filteredTransactions =
      (this.transactions || [])
        .filter(({date}) => {
          const d = moment(date)
          return d.valueOf() < ending.valueOf() && d.valueOf() >= beginning.valueOf()
        })

    return filteredTransactions.reduce((sum, event) => sum + event.amount, 0)
  }

  getIcon(sum) {
    return budget >= sum ? '../assets/head_focus.png' : '../assets/head_hurt.png'
  }

  prettyPrintCurrency(amount) {
    var value = currencyFormatter.format(amount, {code: 'USD'})

    if (amount > 0) {
      return "+" + value
    }

    return value
  }
}

