import React from 'react';
import {Button} from 'reactstrap';
import Dropzone from 'react-dropzone';

class Dialog extends React.Component {
  constructor() {
    super();
    this.state = {
      accepted: [],
      rejected: []
    }
  }

  render() {
    let dropzoneRef;
    return (
      <div className="dropzone-card">
        <div className="dropzone">
          <Dropzone ref={(node) => {
            dropzoneRef = node;
          }} onDrop={(accepted, rejected) => {
            alert(accepted)
          }}>
            <p>Drop files here.</p>
          </Dropzone>
          <Button color="primary" onClick={() => {
            dropzoneRef.open()
          }}>
            Open File Dialog
          </Button>
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

export default Dialog;