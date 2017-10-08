import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import  { StatsPieChart } from '../../data/pieChart'

import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

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

  data: any;

  constructor(public navCtrl: NavController) {
    this.width = 900 - this.margin.left - this.margin.right ;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.radius = Math.min(this.width, this.height) / 2;

  }

  ionViewDidLoad() {
    //console.log("ionViewDidLoad Pie Chart");
    this.initSvg();
    this.drawPie();
  }

  initSvg() {
    this.color = d3Scale.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);
    this.arc = d3Shape.arc()
      .outerRadius(this.radius - 10)
      .innerRadius(this.radius - 125);
    this.labelArc = d3Shape.arc()
      .outerRadius(this.radius - 40)
      .innerRadius(this.radius - 40);
    this.pie = d3Shape.pie()
      .sort(null)
      .value((d: any) => d.population);

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
      .data(this.pie(StatsPieChart))
      .enter().append("g")
      .attr("class", "arc");
    g.append("path").attr("d", this.arc)
      .style("fill", (d: any) => this.color(d.data.age) );
    g.append("text").attr("transform", (d: any) => "translate(" + this.labelArc.centroid(d) + ")")
      .attr("dy", ".35em")
      .text((d: any) => d.data.age);
  }
}
