import {Component, NgZone, OnDestroy} from '@angular/core';
import {NavController} from 'ionic-angular';

import store from '../../app/store'
import currencyFormatter from 'currency-formatter'


@Component({
  selector: 'page-quest',
  templateUrl: 'quest.html'
})
export class QuestPage implements OnDestroy {
  ngOnDestroy(): void {
    store.setEventHandler(null)
  }

  spend = 0

  budget = 100

  actionQueue = []

  transactions = null

  currentAction = null

  constructor(public navCtrl: NavController, private zone: NgZone) {
    this.transactions = store.getTransactions()

    if (this.transactions !== null) {
      this.transactions.forEach(transaction => {
        this.spend += transaction.amount
      })
    }

    store.setEventHandler((transactions) => {
      this.zone.run(() => {
        if (this.transactions == null) {
          this.transactions = []

          transactions.forEach(transaction => {
            this.spend += transaction.amount
            this.transactions.push(transaction)
          })

        } else {
          transactions.forEach(transaction => {
            this.action(transaction)
            this.transactions.push(transaction)
          })
        }
      })
    })
  }

  action(data) {
    if (this.actionQueue.length !== 0) {
      this.actionQueue.push(data)
      return
    }

    this.actionQueue = [data]

    this.dequeActions()
  }

  dequeActions() {
    if (this.actionQueue.length === 0) {
      return
    }

    this.currentAction = this.actionQueue[0]
    this.spend += this.currentAction.amount

    setTimeout(() => {
      this.currentAction = null

      setTimeout(() => {
        this.actionQueue = this.actionQueue.slice(1)
        this.dequeActions()
      }, 500)
    }, 1000)
  }

  getCharacterUrl() {
    return this.currentAction ? `../assets/female_fall.png` : `../assets/female_idle.png`
  }

  getCharacterClass() {
    return this.currentAction ? 'hero-hit' : ''
  }

  getShield() {
    const percent = (this.budget - this.spend) / this.budget

    return Math.max(0, Math.min(1, percent))
  }

  getHealth() {
    const percent = ((this.budget * 2) - this.spend) / this.budget

    return Math.max(0.02, Math.min(1, percent * 2))
  }

  prettyPrintCurrency(amount) {
    return currencyFormatter.format(amount, {code: 'USD'})
  }

  getIconOfTransaction(category) {
    switch (category) {
      case 'Groceries':
        return 'ios-cart'
      case 'Eat & Drink':
        return 'pizza'
      case 'Medication':
        return 'heart'
      case 'Leisure':
        return 'happy-outline'
      case 'Transportation':
        return 'car'
    }
  }
}

