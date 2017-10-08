import {Component, NgZone, OnDestroy} from '@angular/core';
import {NavController} from 'ionic-angular';

import store from '../../app/store'


@Component({
  selector: 'page-quest',
  templateUrl: 'quest.html'
})
export class QuestPage implements OnDestroy{
  ngOnDestroy(): void {
    store.setEventHandler(null)
  }

  spend = 0

  budget = 100

  actionQueue = []

  transactions = []

  currentAction = null

  constructor(public navCtrl: NavController, private zone: NgZone) {

    console.log('done')

    this.transactions = store.getTransactions()

    store.setEventHandler((transactions) => {
      this.zone.run(() => {
        console.log("event", transactions.length)

        transactions.forEach(transaction => {
          this.action(transaction)
          this.transactions.push(transaction)
        })
      })
    })
  }

  public action(data) {
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

  getHealth () {
    const percent = ((this.budget * 2) - this.spend) / this.budget

    return Math.max(0.1, Math.min(1, percent * 2))
  }
}

