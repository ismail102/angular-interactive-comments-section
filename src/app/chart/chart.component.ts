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

    const timeLabels = []; // Array to store timestamps
    const labelData = []; // Array to store label data

    // Generating sample data for demonstration
    for (let i = 0; i < 8; i++) {
      timeLabels.push(`2023-12-${i + 1 < 10 ? '0' + (i + 1) : i + 1}`);
      labelData.push([
        Math.floor(Math.random() * 20) + 5,
        Math.floor(Math.random() * 20) + 10,
        Math.floor(Math.random() * 20) + 15
      ]);
    }

    // Create datasets for each label
    const datasets = labelData.map((data, index) => ({
      label: `Label ${index + 1}`, // Label name
      data: data,
      borderColor: this.getRandomColor(), // Get random color for each label
      // backgroundColor: 'transparent',
      // Add more styling or configurations as needed
    }));

    console.log(timeLabels)
    console.log(datasets)

  
    this.chart = new Chart("MyChart", {
      type: 'line', //this denotes tha type of chart
      data: {// values on X-Axis
          labels: timeLabels,
          datasets: datasets
      },
      options: {
        aspectRatio:2.5,
        scales: {
          x: {
              min: '2023-12-01',
            }
        }
      }
    });
  }
}
