import React, { Component } from 'react';
import { Link } from 'react-router';

class Home extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      globalErrorMessage: null,
      localErrorMessage: null
    };
  }

  render() {
    return (
      <div className="view-container">
        <div>
          <p>This example demonstrates how to handle errors. You can handle errors locally in the action creator or globally in a middleware. Open the Developer's Console to see this in action.</p>
        </div>
        <div style={{ margin: '20px 0' }}>
          <p>
            <strong>
              <span>Throw local error message with reason: </span>
              <span>{this.state.localErrorMessage}</span>
            </strong>
          </p>
          <input
            placeholder="Local reject reason"
            style={{ display: 'block' }}
            ref={node => this.localErrorInput = node}
            onChange={() => this.setState({
              localErrorMessage: this.localErrorInput.value
            })}
          />
          <button
            style={{ display: 'block', marginTop: '10px'  }}
            children="Throw Local Error"
            onClick={() => {
              this.props.throwLocalError(this.state.localErrorMessage);
            }}
          />
        </div>
        <div style={{ margin: '20px 0' }}>
          <p>
            <strong>
              <span>Throw global error message with reason: </span>
              <span>{this.state.globalErrorMessage}</span>
            </strong>
          </p>
          <input
            placeholder="Global reject reason"
            style={{ display: 'block'}}
            ref={node => this.globalErrorInput = node}
            onChange={() => this.setState({
              globalErrorMessage: this.globalErrorInput.value
            })}
          />
          <button
            style={{ display: 'block', marginTop: '10px'  }}
            children="Throw Global Error"
            onClick={() => {
              this.props.throwGlobalError(this.state.globalErrorMessage);
            }}
          />
        </div>
      </div>
    );
  }
}

export default Home;
