import React from 'react';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import Checkbox from '@material-ui/core/Checkbox';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';

const getColor = label => {
  switch (label) {
    case 'Important': {
      return 'red lighten-1';
    }
    case 'Useless': {
      return 'orange darken-2';
    }
    default: {
      return 'grey';
    }
  }
};

const Dragable = SortableHandle(() => (
  <i
    className="zmdi zmdi-menu d-none d-sm-flex m-3 text-grey"
    style={{ fontSize: '20px' }}
  />
));

const toDoItem = ({ todo, toggleStar, handleDelete }) => {
  return (
    <div className="module-list-item d-flex align-items-center">
      <Dragable />
      <Checkbox color="primary" />
      <IconButton onClick={toggleStar(todo.id)}>
        {todo.starred ? (
          <i className="zmdi zmdi-star" />
        ) : (
          <i className="zmdi zmdi-star-outline" />
        )}
      </IconButton>
      <div className="d-flex flex-column">
        <h3>{todo.name}</h3>
        <p className="text-grey">{moment.unix(todo.time.seconds).calendar()}</p>
        <div className="d-flex flex-row">
          {todo.labels.map((label, index) => (
            <Chip
              label={label}
              className={`bg-${getColor(label)} text-white m-1`}
              onDelete={handleDelete(todo.id, index)}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortableElement(toDoItem);
