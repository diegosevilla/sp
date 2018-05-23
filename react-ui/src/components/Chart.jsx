import React from 'react';
import PropTypes from 'prop-types';
import { Collection, CollectionItem, Tabs, Tab} from 'react-materialize';
import { ResponsivePie, ResponsiveBar,ResponsiveLine } from 'nivo';
import _ from 'lodash';
import Math from 'mathjs'
import styles from '../stylesheets/CreateSurvey.css';

const CanvasJS = window.CanvasJS;
const $ = window.$;

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      answers: []
    };
  }
  componentDidMount(){
    const {question, chartData} = this.props;
    let data = [];
    let temp = _.countBy(chartData, 'response');
    for(let key in temp){
      data.push({key, label: key + ' (' + temp[key] + ')', y: temp[key]});
    }
    this.setState({data:data, answers: chartData});
  }

  componentDidUpdate(){
    const {question, chartData} = this.props;
    const {data} = this.state;
    let chart;
    let fileName = question.label.toLowerCase().split(' ').join('-');
    switch (question.questionType) {
      case 'Checkbox':
        chart = new CanvasJS.Chart('chartContainer-'+question.id, {
          animationEnabled: true,
          exportEnabled: true,
          exportFileName: fileName,
          title: {
            text: question.label
          },
          data: [{
            type: 'column',
            dataPoints: data
          }]
        });
        break;
      case 'Number':
        chart = new CanvasJS.Chart('chartContainer-'+question.id, {
          theme: 'light2',
          animationEnabled: true,
          exportEnabled: true,
          exportFileName: fileName,
          title:{
            text: question.label
          },
          data: [{
            type: 'line',
            startAngle: 45,
            yValueFormatString: '#,##0.0#\'%\'',
            dataPoints: data
          }]
        });
        break;
      default:
        chart = new CanvasJS.Chart('chartContainer-'+question.id, {
          theme: 'light2',
          animationEnabled: true,
          exportEnabled: true,
          exportFileName: fileName,
          title:{
            text: question.label
          },
          data: [{
            type: 'pie',
            startAngle: 45,
            dataPoints: data
          }]
        });
        break;
    }
    if(chart && question.questionType != 'Text')
  	 chart.render();

  };

  render(){
    const {question} = this.props;
    let {answers, data} = this.state;

    return (
      <div className='App'>
        <div id={'chartContainer-'+question.id}></div>
      </div>
    )
  }
}

Chart.propTypes = {
    question: PropTypes.object.isRequired,
    chartData: PropTypes.array.isRequired
};

export default Chart;
