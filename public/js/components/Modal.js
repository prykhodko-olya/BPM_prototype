import Modal from 'react-bootstrap/lib/Modal';
import React from 'react';
import Step from './Step';
import axios from 'axios';

const Select = React.createClass({

  handleSelect(val) {
    this.props.setValue(val);
  },

  componentDidMount() {

    var select = this.refs.domain;
    var _this = this;

    $(select).select2({
      ajax: {
        url: '/domains',
        processResults: function (data) {
          return {
            results: data
          };
        }
      }
    });

    $(select).on('change', function() {
      _this.handleSelect($(this).val());
    });

  },

  render() {
    return (
      <select className="form-control" ref="domain" onChange={this.handleSelect}></select>
    );
  }
});

const CustomModal = React.createClass({
  getInitialState() {
    return {
      showModal: false,
      data: {},
      startStep: false
    };
  },

  close() {
    this.setState({ showModal: false, data: {}, startStep: false });
  },

  open() {
    this.setState({ showModal: true });
  },

  setDomainId(id) {
    var state = Object.assign({}, this.state);
    state.data.domain = id;
    this.setState(state);
  },

  setName(e) {
    var state = Object.assign({}, this.state);
    state.data.name = e.target.value;
    this.setState(state);
  },

  goStep() {
    this.setState({
      startStep: true
    });
  },

  sendForm(data) {

    var state = Object.assign({}, this.state);
    state.data.steps = data;

    axios.post('/process', state.data)
      .then(function (response) {
        window.location.href = "/projects/" + response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  },

  render() {
    return (
      <div>
        <button type="button" onClick={this.open} className="btn btn-default">Start new process</button>

        <Modal show={this.state.showModal} onHide={this.close} ref="modal">
          <Modal.Header closeButton>
            <Modal.Title>Start new workflow</Modal.Title>
          </Modal.Header>

          <div className="modal-body">

            {this.state.startStep ?

              <Step saveData={this.sendForm} /> :

              <form className="form-horizontal">
                <div className="form-group">
                  <label htmlFor="domain" className="col-sm-2 control-label">Domain</label>
                  <div className="col-sm-10">
                    <Select setValue={this.setDomainId}/>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="name" className="col-sm-2 control-label">Name</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" id="name" name="name" placeholder="Name"
                           onChange={this.setName}/>
                  </div>
                </div>
              </form>
            }

          </div>

          <Modal.Footer className={this.state.startStep && "hide"}>
            <div className="center-content">
              <button type="button" className="btn btn-default pagination-centered" onClick={this.goStep}>Create and start first step</button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

export default CustomModal;
