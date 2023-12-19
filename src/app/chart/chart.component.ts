import { Component, OnInit } from '@angular/core';
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
        this.updateChart(data.tscores)
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
        label: 'Current Trend',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Background color of bars
        borderColor: 'rgba(75, 192, 192, 1)', // Border color of bars
        borderWidth: 1 // Border width of bars
      }]
    };
  
    // Bar chart configuration
    let options = {
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
  }

  updateChart(data: any[]) {
    // console.log(this.chart)
    let barData = {
      labels: this.labels,
      datasets: [{
        label: 'Current Trend',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Background color of bars
        borderColor: 'rgba(75, 192, 192, 1)', // Border color of bars
        borderWidth: 1 // Border width of bars
      }]
    };
    this.chart.data = barData;
    this.chart.update();
  }
}
