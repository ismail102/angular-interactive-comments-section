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
  public chartBar: any;
  public chartLine: any;

  public type: number = 0;
  public progressValue: number = 0;
  isPlay: boolean = false;
  interval: any = null;
  public isLine: number = 0;

  emotion_labels = [
    'admiration', 'amusement', 'anger', 'annoyance', 'approval', 'caring',
    'confusion', 'curiosity', 'desire', 'disappointment', 'disapproval',
    'disgust', 'embarrassment', 'excitement', 'fear', 'gratitude', 'grief',
    'joy', 'love', 'nervousness', 'optimism', 'pride', 'realization',
    'relief', 'remorse', 'sadness', 'surprise', 'neutral'
  ]
  trend_labels = ["approval","toxic","obscene", 'insult', "threat", "hate", "offensive", "neither"];
  polarity_labels = ["positive","negative","neutral", 'ambiguous'];


  data0 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  colors0 = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080',
    '#C0C0C0', '#808080', '#FFA500', '#FFC0CB', '#800080', '#FFD700',
    '#7CFC00', '#6B8E23', '#008B8B', '#DC143C', '#00BFFF', '#556B2F',
    '#8A2BE2', '#FF1493', '#FF4500', '#DAA520'
  ]
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
  public currentProgressBarPoint: any = {
    'target':{
      'value': 0
    }
  };
  public lineData: any;

  emotionData: any = [];
  trendData: any = [];
  sentimentData: any = [];
  allLineData: any = Object.assign({});

  constructor(private apiService: ApiService) {
   }

  ngOnInit(): void {
    console.log("HELLO")
    this.isLine = 0;
    this.createChart(this.data0);
    // this.onchangeProgress();
    this.getBarData();
    this.getLineData();
  }
  
  getBarData() {
    console.log("Get All data")
    this.apiService.getAllData().subscribe(
      (data: any) => {
        console.log("###Scores: ", data)
        this.emotionData = data['emotion'];
        this.trendData = data['trend'];
        this.sentimentData = data['sentiment']
      });
  }

  getLineData() {
    // console.log("line Event: ", event.target.value);
    this.apiService.getSingleTrend().subscribe(
      (data: any) => {
        this.allLineData = data;
        console.log(this.allLineData)
    });
  }

  onchangeProgress(event?: any) {
    if (event != null && event != undefined) {
        this.currentProgressBarPoint = event
    }
    // this.progressValue = event.target.value;
    console.log("ith comment:", this.currentProgressBarPoint.target.value)

    if (this.isLine == 0) {
      // this.getBarData();
      this.updateBarData();
    } 
    else {
      // this.getLineData();
      this.updateLineData();
    }
  }

  updateBarData() {
    let index = this.currentProgressBarPoint.target.value;
    if(this.type==0) {
      let escores = this.emotionData[index];
      // console.log(this.emotionData)

      this.updateChart(escores);
      // Find the maximum value in the array
      const maxValue = Math.max(...escores);
      // Find the index of the maximum value
      const maxIndex = escores.indexOf(maxValue);
      this.changeBackgroundColor(maxIndex);
    }
    else if (this.type==1) {
      let tscores = this.trendData[index];

      this.updateChart(tscores);
      // Find the maximum value in the array
      const maxValue = Math.max(...tscores);
      // Find the index of the maximum value
      const maxIndex = tscores.indexOf(maxValue);
      this.changeBackgroundColor(maxIndex);
    }
    else {
      let sentiment = this.sentimentData[index];

      this.updateChart(sentiment);
      // Find the maximum value in the array
      const maxValue = Math.max(...sentiment);

      // Find the index of the maximum value
      const maxIndex = sentiment.indexOf(maxValue);
      this.changeBackgroundColor(maxIndex);
    }
  }

  updateLineData(event?:any) {
    if (event != null && event != undefined) {
          this.lineData = this.allLineData[event.target.value];
          let labels = []
          for (let i = 0; i < this.lineData.length; i++) {
            labels.push('');
          }
          let lineData = {
            labels: labels,
            datasets: [{
              label: event.target.value,
              data: this.lineData.slice(0, this.currentProgressBarPoint.target.value),  //plum, pear,
              backgroundColor: this.colors1[this.trend_labels.indexOf(event.target.value)],
              // borderColor: 'black',
              tension: 0.1, // Curve tension of the line (0 is linear)
              fill: false // Do not fill area under the line
            }]
          };
          this.chartLine.data = lineData;
          this.chartLine.update();
          this.progressColor = this.colors1[this.trend_labels.indexOf(event.target.value)];
    } else {
      this.chartLine.data.datasets[0].data = this.lineData.slice(0, this.currentProgressBarPoint.target.value);
      this.chartLine.update();
    }
  }

  createChart(data: any[]) {
    console.log("Is line: ", this.isLine);
    // Sample data for the bar chart
    let barData = {
      labels: this.emotion_labels,
      datasets: [{
        label: '',
        data: data,
        backgroundColor: this.colors0,
        borderColor: 'black',
        borderWidth: 1 // Border width of bars
      }]
    };

    let lineData = {
      labels: ['', '', '', '', '','', '', '', ''],
      datasets: [{
        label: 'approval',
        data: [],
        backgroundColor: 'red',
        tension: 0.1, // Curve tension of the line (0 is linear)
        fill: false // Do not fill area under the line
      }]
    };

    // Bar chart configuration
    let options1 = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }

    // Bar chart configuration
    let options2 = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }

    // Create the bar chart
    this.chartBar = new Chart('MyChart1', {
      type: 'bar',
      data: barData,
      options: options1
    });
    this.progressColor = 'gray';

    this.chartLine = new Chart('MyChart2', {
      type: 'line',
      data: lineData,
      options: options2
    });
  }

  updateChart(data: any[]) {
    // let barData = {
    //   labels: this.type==0?this.emotion_labels:this.type==1?this.trend_labels:this.polarity_labels,
    //   datasets: [{
    //     label: '',
    //     data: data,
    //     backgroundColor: this.type==0?this.colors0:this.type==1?this.colors1:this.colors2,
    //     borderColor: 'black',
    //     borderWidth: 1 // Border width of bars
    //   }]
    // };
    // console.log("Data Update: ", data)
    this.chartBar.data.datasets[0].data = data;
    this.chartBar.update();
  }

  // Function to change the background color dynamically
  changeBackgroundColor(idx: number): void {

    if (this.type == 0) {
      let color = this.colors0[idx]
      this.progressColor = color;
      this.tooltipText = 'Comment section is going towards ' + this.emotion_labels[idx];
      this.chartBar.options.plugins.legend.display = false;
    }
    else if (this.type == 1) {
      let color = this.colors1[idx]
      this.progressColor = color;
      this.tooltipText = 'Comment section is going towards ' + this.trend_labels[idx];
      this.chartBar.options.plugins.legend.display = false;
    }
    else {
      let color = this.colors2[idx]
      this.progressColor = color;
      this.tooltipText = 'Comment section is going towards ' + this.polarity_labels[idx];
      this.chartBar.options.plugins.legend.display = false;
    }
  }

  onchangeGraph(event: any) {
    console.log("Graph:", event.target.value)
    if(event.target.value == 'emotion') {
      this.type = 0;
      this.chartBar.data.labels = this.emotion_labels
      this.chartBar.data.datasets[0].backgroundColor = this.colors0
      // this.updateChart(this.data0);
    }
    else if (event.target.value == 'trend') {
      this.type = 1;
      this.chartBar.data.labels = this.trend_labels
      this.chartBar.data.datasets[0].backgroundColor = this.colors1
      // this.updateChart(this.data1);
    }
    else{
      this.type = 2;
      this.chartBar.data.labels = this.polarity_labels
      this.chartBar.data.datasets[0].backgroundColor = this.colors2
      // this.updateChart(this.data2);
    }

    // console.log("Progress Bar Point:", this.currentProgressBarPoint);
    this.onchangeProgress(this.currentProgressBarPoint);
  }

  onClickPlay(value: number) {
    this.progressValue = this.currentProgressBarPoint.target.value;
    console.log("Progress Bar Point:", this.progressValue);
    this.isPlay = !value;

    console.log("isPlay", this.isPlay);
    
    if(this.isPlay) {
        this.interval = setInterval(() => {
          this.moveProgressBar();
          this.currentProgressBarPoint['target']['value'] = this.progressValue;
          this.onchangeProgress(this.currentProgressBarPoint);
      }, 100);
    }
    else {
      clearInterval(this.interval);
    }
  }

  moveProgressBar(): void {
    // Increase the progress value
    this.progressValue++;

    // // Check if the progress is complete (100%)
    // if (this.progressValue >= 100) {
    //   // Reset progress
    //   this.progressValue = 0;
    // }
  }

  onChangeSelectOption(event: any) {
    console.log("Select: ", event.target.value)

    if(event.target.value == 1) {
      this.isLine = 0;
    } else {
      this.isLine = 1;
      let data = Object.assign({});
      data['target'] = {};
      data['target']['value'] = 'approval';
      this.updateLineData(data);
    }
    // this.createChart(this.data0);
  }

  getSingleTrend(event: any) {
    // this.progressValue = event.target.value;
    console.log("ith comment:", this.currentProgressBarPoint.target.value)
    this.updateLineData(event);
  }
}
