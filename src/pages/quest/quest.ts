import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
  selector: 'page-quest',
  templateUrl: 'quest.html'
})
export class QuestPage {
  spend = 0

  budget = 100

  actionQueue = []


  currentAction = null


  constructor(public navCtrl: NavController) {


    setTimeout(() => {

      this.action({amount: 6})
      this.action({amount: 20})
      this.action({amount: 30})
      this.action({amount: 500})


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

    console.log('dequee', this.actionQueue)


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
    const percent = ((this.budget * 2) - this.spend) / (this.budget * 2)

    Math.max(0.2, Math.min(1, percent))
  }
}

