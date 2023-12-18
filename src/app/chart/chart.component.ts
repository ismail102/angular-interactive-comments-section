import { Component, OnInit } from '@angular/core';
import { ChartOptions, Color } from 'chart.js';

import { Chart } from 'chart.js/auto';
//or
// import {Chart} from 'chart.js';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  public chart: any;

  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }

  getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  createChart(){

    let colors = ['black', 'red', 'cyan', 'green', 'blue', 'pink', 'gray', 'yellow']

    const data = [
      { x: '2023-01-01 12:00:00', y: 10 }, // Sample data with ISO date format
      { x: '2023-01-02 14:30:00', y: 15 },
      { x: '2023-01-03 16:45:00', y: 8 },
      // Add more data points as needed
    ]

    // // Create datasets for each label
    // const datasets = labelData.map((data, index) => ({
    //   label: `Label ${index + 1}`, // Label name
    //   data: data,
    //   borderColor: this.getRandomColor(), // Get random color for each label
    //   // backgroundColor: 'transparent',
    //   // Add more styling or configurations as needed
    // }));

    // console.log(timeLabels)
    // console.log(datasets)

  
    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart
      data: {
        datasets: [{
          label: 'Time Series Data',
          data: data.map(entry => ({ x: new Date(entry.x), y: entry.y })),
          borderColor: 'blue',
          fill: false,
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            min: '2023-01-01T12:00:00'
          },
          // Configure other axes if needed (e.g., y-axis)
        }
      }
    });
  }
}
