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
  labels = ["approval","toxic","obscene", 'insult', "threat", "hate", "offensive", "neither"];
  data = [0,0,0,0,0,0,0,0];
  colors =  [
    '#FF0000',  //# Red
    '#00FF00',  //# Green
    '#0000FF',  //# Blue
    '#FFFF00',  //# Yellow
    '#800080',  //# Purple
    '#00FFFF',  //# Cyan
    '#FFA500',  //# Orange
    '#FFC0CB'   //# Pink
  ];

  public ticks = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  public progressColor: string ="";
  public tooltipText: string = '';

  constructor(private apiService: ApiService ) { }

  ngOnInit(): void {
    this.createChart(this.data);
  }

  getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  onchange(event: any) {
    console.log(event.target.value)
      this.apiService.getApiData(event.target.value).subscribe(
      (data: any) => {
        // console.log("Scores: ", data)
        this.updateChart(data.tscores);
        // Find the maximum value in the array
        const maxValue = Math.max(...data.tscores);

        // Find the index of the maximum value
        const maxIndex = data.tscores.indexOf(maxValue);
        this.changeBackgroundColor(maxIndex);
      },
      (err) => {
        console.log('!Error: ', err);
      }
    );
  }

  createChart(data: any[]) {
    // Sample data for the bar chart
    let barData = {
      labels: this.labels,
      datasets: [{
        label: '',
        data: data,
        backgroundColor: this.colors,
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
      },
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
      labels: this.labels,
      datasets: [{
        label: '',
        data: data,
        backgroundColor: this.colors,
        borderColor: 'black',
        borderWidth: 1 // Border width of bars
      }]
    };
    this.chart.data = barData;
    this.chart.update();
  }

  // Function to change the background color dynamically
  changeBackgroundColor(idx: number): void {
    let color = this.colors[idx]
    // console.log(color)
    this.progressColor = color;
    this.tooltipText = 'Comment section is going towards ' + this.labels[idx];
  }

  // Example: Change the background color to yellow after 2 seconds
  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     this.changeBackgroundColor('yellow');
  //   }, 2000);
  // }
}
