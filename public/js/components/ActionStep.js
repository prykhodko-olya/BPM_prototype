import React from 'react';

const Row = React.createClass({

  sendText(e) {
    this.props.text(e.target.value, this.props.action.id);
  },

  sendType(e) {
    this.props.type(e.target.value, this.props.action.id);
  },

  sendCheckbox(type, e) {
    this.props.checkBoxValue(e.target.checked, this.props.action.id, type);
  },

  render() {
    return (
      <tr>
        <td>
          <input className="form-control" type="text" onChange={this.sendText} value={this.props.action.value}/>
        </td>
        <td>
          <select className="form-control" onChange={this.sendType} value={this.props.action.type}>
            <option value="text">Text</option>
            <option value="date">Date</option>
            <option value="file">File</option>
            <option value="number">Number</option>
          </select>
        </td>
        <td>
          <input type="checkbox" onChange={this.sendCheckbox.bind(this, "validations")} checked={this.props.action.validations } />
        </td>
        <td>
          <input type="checkbox" onChange={this.sendCheckbox.bind(this, "required")} checked={this.props.action.required } />
        </td>
        <td>
          <button onClick={this.props.deleteAction.bind(null, this.props.action.id)} className="btn btn-action-delete"><span className="glyphicon glyphicon-remove"></span></button>
        </td>
      </tr>
    );
  }
});

const ActionStep = React.createClass({

  getInitialState() {
    return {
      actions: []
    }
  },

  resetState() {
    this.setState({
      actions: []
    });
  },

  componentWillReceiveProps(nextProps) {

    var state = Object.assign({}, this.state);

    if (nextProps.recommend) {
      state.actions.push(nextProps.recommend);
      this.setState({
        actions: state.actions
      }, () => {
        setTimeout(()=> {
          this.sendState();
        }, 200);
      });
    }

    if (nextProps.reset) {
      this.resetState();
    }

    if (nextProps.setupRecommendStep) {

      this.resetState();

      nextProps.recommendedStepActions.forEach((el)=> {
        state.actions.push(el);
      });

      this.setState({
        actions: state.actions
      }, () => {
        setTimeout(()=> {
          this.sendState();
        }, 200);
      });
    }

  },

  sendState() {
    this.props.sendState(this.state);
  },

  addAction() {
    var state = Object.assign({}, this.state);
    state.actions.push({
      id: Date.now(),
      canDelete: true,
      value: "",
      type: "",
      validations: false,
      required: false
    });
    this.setState({
      actions: state.actions
    }, () => {
      this.sendState();
    });
  },

  deleteAction(id) {

    var state = Object.assign({}, this.state);

    state.actions = this.state.actions.filter(function (item) {
      return item.id !== id;
    });

    this.setState({actions: state.actions},() => {
      this.sendState();
    });

  },

  setName(txt, id) {
    var state = Object.assign({}, this.state);

    state.actions.forEach((action) => {
      if (action.id == id) {
        action.value = txt;
      }
    });

    this.setState({
      actions: state.actions
    }, () => {
      this.sendState();
    });

  },

  setType(type, id) {
    var state = Object.assign({}, this.state);

    state.actions.forEach((action) => {
      if (action.id == id) {
        action.type = type;
      }
    });

    this.setState({
      actions: state.actions
    }, () => {
      this.sendState();
    });
  },

  setCheckbox(value, id, type) {
    var state = Object.assign({}, this.state);

    state.actions.forEach((action) => {
      if (action.id == id) {
        action[type] = value
      }
    });

    this.setState({
      actions: state.actions
    }, () => {
      this.sendState();
    });

  },

  render() {

    let actionsProps = this.state.actions;

    let actions = actionsProps.map((action, idx) => {
      return <Row key={action.id} action={action} index={idx} deleteAction={this.deleteAction} text={this.setName} type={this.setType} checkBoxValue={this.setCheckbox} />
    });

    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Validation</th>
              <th>Required</th>
              <th></th>
            </tr>
          </thead>
          <tbody>

          {actions}

          </tbody>
        </table>

        {!actions.length ?
        <div className="empty-actions">
          <p>Empty list</p>
        </div> : ""}

        <button onClick={this.addAction} className="btn btn-action-create"><span className="glyphicon glyphicon-plus"></span> Add new action</button>
      </div>
    );
  }
});



export default ActionStep;
