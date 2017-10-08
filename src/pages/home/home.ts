import { Component, NgZone, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import store from '../../app/store';


import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnDestroy{
  ngOnDestroy(): void {
    store.setEventHandler(null)
  }

  title: string = 'D3.js with Ionic 2!';

  margin = {top: 20, right: 20, bottom: 30, left: 50};
  width: number;
  height: number;
  radius: number;

  arc: any;
  labelArc: any;
  pie: any;
  color: any;
  svg: any;

  transactions: any;
  categories: any;
  data: any;

  constructor(public navCtrl: NavController, private zone: NgZone) {
    this.width = 900 - this.margin.left - this.margin.right ;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.radius = Math.min(this.width, this.height) / 2;

    this.categories = {};
    this.transactions = store.getTransactions();

    store.setEventHandler((transactions) => {
      this.zone.run(() => {
        console.log("event", transactions.length);

        transactions.forEach(transaction => {
          this.transactions.push(transaction)
        });
      })
    });

    // I feel bad for this...
    this.transactions.forEach((transaction) => {
      const { amount, category } = transaction;
      this.categories[category] = (this.categories[category] || 0) + amount;
    });

    let tmp = [];
    for (const category in this.categories) {
      tmp.push({ category: category, amount: this.categories[category] }) ;
    }

    this.categories = tmp;


  }

  ionViewDidLoad() {
    //console.log("ionViewDidLoad Pie Chart");
    this.initSvg();
    this.drawPie();
  }

  initSvg() {
    this.color = d3Scale.scaleOrdinal()
      .range(["#b8d0a6", "#d26f49", "#d5edf7", "#7e8787", "#b8824d"]);
    this.arc = d3Shape.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(this.radius - 125);
    this.labelArc = d3Shape.arc()
      .outerRadius(this.radius - 40)
      .innerRadius(this.radius - 40);
    this.pie = d3Shape.pie()(this.categories.map((d) => d.amount));

    this.svg = d3.select("#pieChart")
      .append("svg")
      .attr("width", '100%')
      .attr("height", '100%')
      .attr('viewBox','0 0 '+Math.min(this.width,this.height)+' '+Math.min(this.width,this.height))
      .append("g")
      .attr("transform", "translate(" + Math.min(this.width,this.height) / 2 + "," + Math.min(this.width,this.height) / 2 + ")");
  }

  drawPie() {
    let g = this.svg.selectAll(".arc")
      .data(this.pie)
      .enter().append("g")
      .attr("class", "arc");

    g.append("path").attr("d", this.arc)
      .style("fill", (d: any, index) => this.color(index));

    g.append("text").attr("transform", (d: any) => "translate(" + this.labelArc.centroid(d) + ")")
      .attr("dy", ".5em")
      .style("text-anchor", "middle")
      .text((d: any, index) => this.categories[index].category)
  }
}
