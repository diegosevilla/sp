import React, {Component} from 'react'
import {Modal, Button, Icon, Input} from 'react-materialize';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { editQuestion } from './../actions/index';
import AddLikertQuestion from './AddLikertQuestion';
import AddTextQuestion from './AddTextQuestion';
import AddNumberQuestion from './AddNumberQuestion';
import AddDefaultQuestion from './AddDefaultQuestion';
import AddDemographicQuestion from './AddDemographicQuestion';

const $ = window.$;
const Materialize = window.Materialize;

class EditModal extends Component{
    edit(e) {
      e.preventDefault();
      const{survey, input} = this.props;

      let editedEntry = {
        label:$('#label-'+input.id).val(),
        required:$('#required-'+input.id).is(':checked'),
        id: input.id
      }

      switch(input.questionType){
        case 'Text':
          editedEntry.defaultValue = $('#defaultValue-'+input.id).val();
          break;
        case 'Number':
          editedEntry.minVal = $('#minValue-'+input.id).val();
          editedEntry.maxVal = $('#maxValue-'+input.id).val();
          editedEntry.step = $('#step-'+input.id).val();
          break;
        case 'Demographic':
          editedEntry.defaultValue = $('#demographic-'+input.id).val();
          if(editedEntry.defaultValue == 'Age'){
            editedEntry.minVal = $('#minAge-'+input.id).val();
            editedEntry.maxVal = $('#maxAge-'+input.id).val();
            editedEntry.step = $('#interval-'+input.id).val();
          }
          let options =  $('#options-'+input.id).val().split('\n');
          if(options.length == 1){
            Materialize.toast('Cannot add '+ editedEntry.type + ' - ' + editedEntry.defaultValue + ' question with only one option to choose from.', 4000, 'red lighten-1');
            return
          }
          editedEntry.options = options.join('&options=');
          break;
        case 'Likert-Scale':
          let su = $('#supports-'+input.id).val();
          su =  _.compact(su.split(','));
          let cn = $('#contradicts-'+input.id).val();
          cn = _.compact(cn.split(','))
          editedEntry.defaultValue = su + ':' + cn + ':' + $('#likertType-'+input.id).val();
        default:
          options =  $('#options-'+input.id).val().split('\n');
          if(options.length == 1){
            Materialize.toast('Cannot add '+ input.questionType + ' question with only one option to choose from.', 4000, 'red lighten-1');
            return
          }
          editedEntry.options = options.join('&options=');
      }
      this.props.editQuestion(editedEntry)
      .then(()=>{
        Materialize.toast('Successfully edited question.', 4000, 'green lighten-1');
      })
      .catch((err)=>{
        Materialize.toast('Error editing question.', 4000, 'red lighten-1');
      });
      $('#editModal-'+input.id).modal('close');
    }

    render() {
      const {input, survey} = this.props;
      let form = [];
      form.push(<Input key={'label-'+input.id} id={'label-'+input.id} label='Label' defaultValue={input.label}/>);
      form.push(<Input key={'required-'+input.id} id={'required-'+input.id} type='checkbox' label='Required' checked={input.required}/>)
      switch(input.questionType){
        case 'Text':
          form.push(<Input key={'defaultValue-'+input.id} id={'defaultValue-'+input.id} label='Default Value' defaultValue={input.defaultValue}/>);
          break;
        case 'Number':
          form.push(<Input type='number' s={12} key={'minValue-'+input.id} id={'minValue-'+input.id} label='Minimum Value' defaultValue={input.minValue}/>);
          form.push(<Input type='number' s={12} key={'maxValue-'+input.id} id={'maxValue-'+input.id} label='Maximum Value' defaultValue={input.maxValue}/>);
          form.push(<Input type='number' s={12} key={'step-'+input.id} id={'step-'+input.id} label='Step' defaultValue={input.step}/>);
          break;
        case 'Demographic':
          form.push(<AddDemographicQuestion question={input}/>);
          break;
        case 'Likert-Scale':
          form.push(<AddLikertQuestion question={input} survey={survey}/>);
          break;
        default:
          form.push(<Input type='textarea' required='true' key={'options-'+input.id} id={'options-'+input.id} label='Options (Separated  by new line)' defaultValue={input.options.join('\n')}/>);
      }

      return(
        <Modal id={'editModal-'+input.id} s={8} header='Edit Question' trigger={<Button floating small='true' className='green' waves='light' tooltip='Edit'> <Icon> edit </Icon> </Button>}>
          <form onSubmit={(e) => this.edit(e)}>
            {form}
            <input type='submit' className='btn' value='Edit'/>
          </form>
        </Modal>
      )
    }
}

EditModal.propTypes = {
    survey: PropTypes.object.isRequired,
    input: PropTypes.object.isRequired,
    editQuestion: PropTypes.func.isRequired,
};

export default connect(
    state => ({ survey: state.survey }),
    { editQuestion }
)(EditModal);
