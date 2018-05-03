import React from 'react';
import PropTypes from 'prop-types';
import {Collection, CollectionItem, Modal, Row, Button, Tabs, Tab} from 'react-materialize';
import {VictoryChart, VictoryLine, VictoryTheme} from 'victory';
import { ResponsivePie, ResponsiveBar,ResponsiveLine } from 'nivo';
import _ from 'lodash';
import Math from 'mathjs'
import styles from '../stylesheets/CreateSurvey.css';



class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      answers: []
    };
  }

  componentWillMount(){
    const {question} = this.props;
    fetch('/api/answer/'+question.id)
    .then((res) => res.json())
    .then((answers) => {
      let data = [];
      let temp = _.countBy(answers, 'response');
      for(let key in temp){
        data.push({id: key, key: key, value: temp[key]});
      }

      this.setState({data:data, answers: answers});
    })
  };

  render(){
    const {question} = this.props;
    let {answers, data} = this.state;
    const chart = [];

    data = _.sortBy(data,[function(d) { return d.name; }]);
    answers = _.sortBy(answers, [function(d) { return d.response}])
    switch (question.questionType) {
      case 'Text':
        chart.push(
          <Collection header={question.label}>
            <div className='innerbox'>
              {
                answers.map((answer)=>{
                  return <CollectionItem style={{borderStyle: 'line'}}> {answer.response} </CollectionItem>
                })
              }
            </div>
          </Collection>
        )
        break;
        case 'Checkbox':
          chart.push(
            <ResponsiveBar data={data} keys={['value']}
              margin={{
                "top": 50,
                "right": 130,
                "bottom": 50,
                "left": 60
              }}
              padding={0.45}
              colors='set3'
              colorBy='id'
              borderColor="inherit:darker(1.6)"
              borderWidth={2}
              axisBottom={{
                  "orient": "bottom",
                  "tickSize": 5,
                  "tickPadding": 5,
                  "tickRotation": 0,
                  "legend": question.label,
                  "legendPosition": "center",
                  "legendOffset": 36
              }}
              axisLeft={{
                  "orient": "left",
                  "tickSize": 5,
                  "tickPadding": 5,
                  "tickRotation": 0,
                  "legend": "FREQUENCY",
                  "legendPosition": "center",
                  "legendOffset": -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor="inherit:darker(1.6)"
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              legends={[
                  {
                      "dataFrom": "keys",
                      "anchor": "bottom-right",
                      "direction": "column",
                      "translateX": 120,
                      "itemWidth": 100,
                      "itemHeight": 20,
                      "itemsSpacing": 2,
                      "symbolSize": 20
                  }
            ]}/>
          );
      case 'Number':
        let array = _.map(answers, function(a) {return a.response});
        let stat = [];
        if(array.length > 0){
          let mode = Math.mode(array);
          if(Array.isArray(mode)) mode=_.max(mode);
          stat.push({id:'Min', x:'Min', y:parseInt(_.min(array))})
          stat.push({id:'Mean', x:'Mean', y:Math.mean(array)})
          stat.push({id:'Median', x:'Median', y:Math.median(array)})
          stat.push({id:'Mode', x:'Mode', y:parseInt(mode)})
          stat.push({id:'Max', x:'Max', y:parseInt(_.max(array))})
          chart.push(
            <Tabs className='tab-demo z-depth-1'>
              <Tab active title="Statistics">
                <div style={{backgroundColor: 'white', height: 350}}>
                  <h5> {question.label} </h5>
                  <VictoryChart
                    theme={VictoryTheme.material}
                  >
                    <VictoryLine
                      style={{
                        data: { stroke: "#c43a31" },
                        parent: { border: "1px solid #ccc"}
                      }}
                      interpolation='cardinal'
                      data={stat}
                    />
                  </VictoryChart>
                </div>
              </Tab>
              <Tab title="Results">
                <div style={{backgroundColor: 'white', height: 350}}>
                  <h5> {question.label} </h5>
                  <ResponsivePie data={data}
                    height={350}
                    margin={{
                      "top": 40,
                      "right": 111,
                      "bottom": 80,
                      "left": 80
                    }}
                    colorBy='id'
                    colors='d320c'
                    borderWidth={4}
                    borderColor='inherit:darker(0.6)'
                    radialLabelsSkipAngle={10}
                    radialLabelsTextXOffset={6}
                    radialLabelsTextColor='#333333'
                    radialLabelsLinkOffset={0}
                    radialLabelsLinkDiagonalLength={16}
                    radialLabelsLinkHorizontalLength={24}
                    radialLabelsLinkStrokeWidth={1}
                    radialLabelsLinkColor='inherit'
                    slicesLabelsSkipAngle={10}
                    slicesLabelsTextColor='black'
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                  />
                </div>
              </Tab>
            </Tabs>
          )
        }
        break;
      default:
        chart.push(
          <div style={{backgroundColor: 'white', height: 450}}>
            <h5> {question.label} </h5>
            <ResponsivePie data={data}
              height={450}
              innerRadius={0.5}
              margin={{
                "top": 40,
                "right": 111,
                "bottom": 80,
                "left": 80
              }}
              padAngle={3}
              cornerRadius={0}
              colorBy='id'
              colors='d320c'
              borderWidth={4}
              borderColor='inherit:darker(0.6)'
              radialLabelsSkipAngle={10}
              radialLabelsTextXOffset={6}
              radialLabelsTextColor='#333333'
              radialLabelsLinkOffset={0}
              radialLabelsLinkDiagonalLength={16}
              radialLabelsLinkHorizontalLength={24}
              radialLabelsLinkStrokeWidth={1}
              radialLabelsLinkColor='inherit'
              slicesLabelsSkipAngle={10}
              slicesLabelsTextColor='white'
              animate={true}
              motionStiffness={90}
              motionDamping={15}
            />
          </div>
        );
    }

    return(
      <div style={{backgroundColor: 'white', height: 500, padding: 10}}>
        {chart}
      </div>
    )
  }
}

Chart.propTypes = {
    question: PropTypes.object.isRequired,
};

export default Chart;
