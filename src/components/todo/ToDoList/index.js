import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import ToDoItem from './ToDoItem';
import CustomScrollbars from 'util/CustomScrollbars';

const ToDoList = ({ toDos, width, toggleStar, handleDelete }) => {
  return (
    <div className="d-flex d-column">
      <CustomScrollbars
        className="module-list-scroll scrollbar"
        style={{
          height: width >= 1200 ? 'calc(100vh - 265px)' : 'calc(100vh - 245px)'
        }}
      >
        {toDos.map((todo, index) => (
          <ToDoItem
            key={index}
            index={index}
            todo={todo}
            toggleStar={toggleStar}
            handleDelete={handleDelete}
          />
        ))}
      </CustomScrollbars>
    </div>
  );
};

export default SortableContainer(ToDoList);
