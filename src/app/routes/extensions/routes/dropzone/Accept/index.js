import React from 'react';
import Dropzone from 'react-dropzone';

class Accept extends React.Component {
  constructor() {
    super();
    this.state = {
      accepted: [],
      rejected: []
    }
  }

  render() {
    return (
      <div className="dropzone-card">
        <div className="dropzone">
          <Dropzone
            accept="image/jpeg, image/png"
            onDrop={(accepted, rejected) => {
              this.setState({accepted, rejected});
            }}
          >
            <p>Try dropping some files here, or click to select files to upload.</p>
            <p className="mb-0">Only *.jpeg and *.png images will be accepted</p>
          </Dropzone>
        </div>
        <div className="dropzone-content">
          <h2>Accepted files</h2>
          {this.state.accepted.length > 0 && <ul className="upload-file-list">
            {
              this.state.accepted.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
            }
          </ul>
          }
          <h2>Rejected files</h2>
          {this.state.rejected.length > 0 && <ul className="upload-file-list">
            {
              this.state.rejected.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
            }
          </ul>
          }
        </div>
      </div>
    );
  }
}

export default Accept;