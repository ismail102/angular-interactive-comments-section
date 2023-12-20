import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, Color } from 'chart.js';

import { Chart } from 'chart.js/auto';
import { ApiService } from '../service/api.service';
//or
// import {Chart} from 'chart.js';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  public chart: any;

  public type: number = 0;


  trend_labels = ["approval","toxic","obscene", 'insult', "threat", "hate", "offensive", "neither"];
  polarity_labels = ["positive","negative","neutral", 'amigeous'];

  data1 = [0,0,0,0,0,0,0,0];
  colors1 =  [
    '#FF0000',  //# Red
    '#00FF00',  //# Green
    '#0000FF',  //# Blue
    '#FFFF00',  //# Yellow
    '#800080',  //# Purple
    '#00FFFF',  //# Cyan
    '#FFA500',  //# Orange
    '#FFC0CB'   //# Pink
  ];

  data2 = [0,0,0,0];
  colors2 =  [
    '#FF0000',  //# Red
    '#00FF00',  //# Green
    '#0000FF',  //# Blue
    '#FFFF00',  //# Yellow
  ];

  public ticks = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  public progressColor: string ="";
  public tooltipText: string = '';

  constructor(private apiService: ApiService ) { }

  ngOnInit(): void {
    this.createChart(this.data1);
  }

  onchange(event: any) {
    console.log(event.target.value)
      this.apiService.getApiData(event.target.value).subscribe(
      (data: any) => {
        // console.log("Scores: ", data)
        if (!this.type) {
          this.updateChart(data.tscores);
          // Find the maximum value in the array
          const maxValue = Math.max(...data.tscores);
          // Find the index of the maximum value
          const maxIndex = data.tscores.indexOf(maxValue);
          this.changeBackgroundColor(maxIndex);
        }
        else {
          this.updateChart(data.polarity);
          // Find the maximum value in the array
          const maxValue = Math.max(...data.polarity);

          // Find the index of the maximum value
          const maxIndex = data.polarity.indexOf(maxValue);
          this.changeBackgroundColor(maxIndex);
        }
      },
      (err) => {
        console.log('!Error: ', err);
      }
    );
  }

  createChart(data: any[]) {
    // Sample data for the bar chart
    let barData = {
      labels: this.trend_labels,
      datasets: [{
        label: '',
        data: data,
        backgroundColor: this.colors1,
        borderColor: 'black',
        borderWidth: 1 // Border width of bars
      }]
    };
  
    // Bar chart configuration
    let options = {
      legend: {
        display: false // Hide legend
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
    // Create the bar chart
    this.chart = new Chart('MyChart', {
      type: 'bar',
      data: barData,
      options: options
    });

    this.progressColor = 'gray';
  }

  updateChart(data: any[]) {
    // console.log(this.chart)
    let barData = {
      labels: this.type==0?this.trend_labels:this.polarity_labels,
      datasets: [{
        label: '',
        data: data,
        backgroundColor: this.type==0?this.colors1:this.colors2,
        borderColor: 'black',
        borderWidth: 1 // Border width of bars
      }]
    };

    this.chart.data = barData;
    this.chart.update();
  }

  // Function to change the background color dynamically
  changeBackgroundColor(idx: number): void {

    if (!this.type) {
      let color = this.colors1[idx]
      // console.log(color)
      this.progressColor = color;
      this.tooltipText = 'Comment section is going towards ' + this.trend_labels[idx];
    }
    else {
      let color = this.colors2[idx]
      // console.log(color)
      this.progressColor = color;
      this.tooltipText = 'Comment section is going towards ' + this.polarity_labels[idx];
    }

  }

  onchangeGraph(event: any) {
    console.log(event.target.value)
    if (event.target.value == 'trend') {
      this.type = 0;
      this.updateChart(this.data1);
    }
    else{
      this.type = 1;
      this.updateChart(this.data2);
    }
  }

  // Example: Change the background color to yellow after 2 seconds
  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     this.changeBackgroundColor('yellow');
  //   }, 2000);
  // }
}
