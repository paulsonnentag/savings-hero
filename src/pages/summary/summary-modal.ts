import {Component} from '@angular/core';
import {NavParams, ViewController} from "ionic-angular";

import currencyFormatter from 'currency-formatter'

@Component({
  selector: 'page-summary-modal',
  templateUrl: 'summary-modal.html'
})
export class SummaryModal {

  spend = 0
  budget = 0

  constructor(params: NavParams, public viewCtrl: ViewController) {
    this.spend = params.get('spend')
    this.budget = params.get('budget')
  }

  dismiss () {
    this.viewCtrl.dismiss()
  }

  getHeroImage () {
    if (this.spend <= this.budget) {
      return 'female_cheer1.png'
    }

    return 'head_hurt.png'
  }

  getTitle () {
    if (this.spend <= this.budget) {
      return 'Success!'
    }

    return 'Bummer'
  }

  getMessage () {
    if (this.spend <= this.budget) {
      return `
        Good job! You stayed in you budget of ${currencyFormatter.format(this.budget, {code: 'USD'})} 
        and spend ${currencyFormatter.format(this.budget - this.spend, {code: 'USD'})} less 
      `
    }

    return `
        Unfortunately your quest today wasn't successfull. You went over your budget of ${currencyFormatter.format(this.budget, {code: 'USD'})} today 
        and spend ${currencyFormatter.format(Math.abs(this.budget - this.spend), {code: 'USD'})} more 
      `
  }
}

