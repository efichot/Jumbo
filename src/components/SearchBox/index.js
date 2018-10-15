import React from 'react';
import { connectSearchBox, Hits, Highlight } from 'react-instantsearch-dom';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import AlgoliaLogo from 'assets/images/services/algolia.png';

function Product({ hit }) {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <span className="hit-name">
        <Highlight attribute="name" hit={hit} />
      </span>
      <div className="d-flex flex-column ml-auto mr-2">
        {hit.labels.map(label => (
          <Chip
            label={label}
            key={label}
            className={`${label === 'Important' ? 'bg-red' : 'bg-orange'}`}
          />
        ))}
      </div>
      <Avatar alt="" src={hit.photoURL} />
    </div>
  );
}

class SearchBox extends React.Component {
  state = {
    currentRefinement: this.props.currentRefinement
  };

  render() {
    const { styleName, placeholder, onChange, value, refine } = this.props;
    return (
      <div className={`search-bar right-side-icon bg-transparent ${styleName}`}>
        <div className="form-group d-flex">
          <input
            className="form-control border-0"
            type="search"
            placeholder={placeholder}
            onChange={
              onChange ||
              (e => {
                refine(e.target.value);
                this.setState({ currentRefinement: e.target.value });
              })
            }
            value={value || this.state.currentRefinement}
            onBlur={() => this.setState({ currentRefinement: '' })}
          />
          {this.state.currentRefinement && (
            <img
              alt="algolia logo"
              src={AlgoliaLogo}
              className="rounded"
              style={{ width: '50%', marginLeft: '-4px' }}
            />
          )}
          <button className="search-icon">
            <i className="zmdi zmdi-search zmdi-hc-lg" />
          </button>
        </div>
        {this.state.currentRefinement && <Hits hitComponent={Product} />}
      </div>
    );
  }
}
export default connectSearchBox(SearchBox);
