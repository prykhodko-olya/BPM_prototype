import React from 'react';
import ActionStep from './ActionStep';
import axios from 'axios';

const Step = React.createClass({

  getInitialState() {
    return {
      steps: [],
      reset: false,
      recommendations: {},
      recommendationsStep: 0,
      recommendAction: "",
      hideActions: false,
      setupStep: false,
      currentStep: {
        id: Date.now(),
        title: '',
        actions: []
      }
    }
  },

  componentDidMount() {
    this.fetchRecommendations(this.state.recommendationsStep);
  },

  setActions(data) {
    var state = Object.assign({}, this.state);
    state.currentStep.actions = data.actions;
    this.setState({
      currentStep: state.currentStep,
      reset: false
    });
  },

  sendStep() {
    var state = Object.assign({}, this.state);
    state.steps.push(state.currentStep);

    //reset currentStep
    state.currentStep = {
      id: Date.now(),
        title: 'awesome title',
        actions: []
    };

    state.recommendationsStep += 1;
    state.reset = true;

    this.setState(state);
    this.fetchRecommendations(state.recommendationsStep)

  },

  fetchRecommendations(step, actions) {
    axios.get('/recommendations?step=' + step)
      .then(response => {
        this.setState({recommendations : response.data, hideActions: actions || false});
      })
      .catch(error => {
        console.log(error);
      });
  },

  sendForm() {

    var state = Object.assign({}, this.state);
    state.steps.push(state.currentStep);

    this.props.saveData(state.steps);

  },

  addRecommendAction(action, id) {
    var state = Object.assign({}, this.state);
    state.recommendAction = action;

    state.recommendations.actions = this.state.recommendations.actions.filter(function (item) {
      return item.id !== id;
    });

    this.setState(state, ()=> {
      this.setState({recommendAction: ""});
    });

  },

  setRecommendedStep() {
    var state = Object.assign({}, this.state);
    state.recommendations.actions = [];

    this.setState({
      setupStep: true,
      recommendationsStep: ++this.state.recommendationsStep,
    });

    //prevent next step to setup
    setTimeout(() => {

      this.fetchRecommendations(this.state.recommendationsStep, true);

      this.setState({
        setupStep: false,
        recommendations: state.recommendations
      });
    }, 200);

  },

  render() {

    let recommendIsActive = (this.state.recommendations.actions ? this.state.recommendations.actions.length : 0) && !this.state.hideActions;

    let actions = this.state.recommendations.actions && this.state.recommendations.actions.map((action) => {
      return (
        <div className="field" key={action.id}>
          <div className="row">
            <div className="col-md-6">{action.value} ({action.type})</div>
            <div className="col-md-6">
              <button className="btn pull-right" onClick={this.addRecommendAction.bind(null, action, action.id)}>Add this field</button>
            </div>
          </div>
        </div>
      );
    });

    let recommendStep = this.state.recommendations.nextStep && this.state.recommendations.nextStep.actions.map((action) => {
        return (
          <div className="item" key={action.id}>
            <div className="row">
              <div className="col-md-9">Title: {action.value} </div>
              <div className="col-md-3">Type: {action.type}</div>
            </div>
          </div>
        );
      });

    return (
      <div>
        <div className="container modal-step-container">

          <div className="actions">
            <ActionStep sendState={this.setActions} reset={this.state.reset} recommend={this.state.recommendAction} setupRecommendStep={this.state.setupStep} recommendedStepActions={this.state.recommendations.nextStep && this.state.recommendations.nextStep.actions} />
          </div>

          <div className="assign-block">
            {recommendIsActive ?
              <div className="recommendations">
                <p>Similar process already exist. Maybe you want to reuse it.</p>
                <div className="fields">
                  {actions}
                </div>
              </div> : ''
            }

            {this.state.recommendations.nextStep &&
              <div className="recommendation-step recommendations">
                <p>Recommended next step</p>
                <div className="fields">
                  {recommendStep}
                </div>
                <div className="row text-center">
                  <div className="col-md-12">
                    <button className="btn" onClick={this.setRecommendedStep}>Add as next step</button>
                  </div>
                </div>
              </div>
            }

            <div className="step-controls">
              <div className="row">
                <div className="col-md-12">
                  <button type="button" onClick={this.sendStep} className="btn btn-default">Create next step</button>
                  <button type="button" onClick={this.sendForm} className="btn btn-default pull-right">Finish</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
});


export default Step;
