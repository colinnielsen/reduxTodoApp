const { Component, useState, useRef } = React;
const { createStore, combineReducers } = Redux;

//
//// REDUCERS
//

const todoReducer = (state = [], action) => {
   const { id, text = '', completed = false } = action;
   switch (action.type) {
      case 'ADD_TODO':
         return [
            ...state,
            {
               id,
               text,
               completed,
            }
         ];
      case 'UPDATE_TODO':
         return state.map(todo => {
            if (todo.id !== action.id) {
               return todo;
            }
            return {
               id: todo.id,
               text: action.text,
               completed: action.completed,
            }
         });
      case 'TOGGLE_COMPLETED':
         return state.map(todo => {
            if (todo.id !== action.id) {
               return todo;
            }
            return {
               ...todo,
               completed: action.complete,
            }
         });
      case 'DELETE_TODO':
         return state.filter(todo => todo.id !== id);
      default:
         return state;
   }
}

const visibilityFilter = (state = "SHOW_ALL", action) => {
   switch (action.type) {
      case 'SET_VISIBILITY_FILTER':
         return action.filter;
      default:
         return state;
   }
}

const getVisibleTodos = (todos, filter) => {
   switch (filter) {
      case 'SHOW_ALL':
         return todos;
      case 'SHOW_COMPLETED':
         return todos.filter(todo => todo.completed)
      case 'SHOW_ACTIVE':
         return todos.filter(todo => !todo.completed)
      default:
         return todos;
   }
}

//
//// ACTIONS
//

const addTodo = (input) => {
   let { value } = input;
   const payload = {
      type: 'ADD_TODO',
      id: store.getState().todoReducer.length,
      text: value,
      completed: false,
   }
   store.dispatch(payload);
   input.value = '';
}

editTodo = (inputVal = '', id) => {
   const payload = {
      type: 'UPDATE_TODO',
      id: id,
      text: inputVal,
   }
   store.dispatch(payload);
}

const toggleComplete = (completed, id) => {
   const payload = {
      type: 'TOGGLE_COMPLETED',
      id: id,
      complete: !completed,
   }
   store.dispatch(payload);
}

const deleteTodo = (id) => {
   const payload = {
      type: 'DELETE_TODO',
      id,
   }
   store.dispatch(payload)
}

//
//// METHODS
//

const FilterLink = ({ filter, currentFilter, children }) => {
   if (filter === currentFilter) {
      return <span>{children}</span>;
   }

   return (
      <a href='#'
         onClick={e => {
            e.preventDefault();
            store.dispatch({
               type: 'SET_VISIBILITY_FILTER',
               filter
            });
         }}>
         {children}
      </a>
   );
};

//
////COMPONENTS
//

const EditTodo = (props) => {
   const [inputVal, setInputVal] = useState('');
   const { id } = this.props;

   return (
      <>
         <input onChange={(e) => setInputVal(e.target.value)} value={inputVal}></input>
         <button onClick={() => editTodo(inputVal, id)}>edit</button>
      </>
   );
}

const ListItem = (props) => {
   const { text = '', id, completed } = props.todo;
   const [renderEdit, toggleRenderEdit] = useState(false);

   return (
      <>
         <li key={id} onDoubleClick={() => toggleRenderEdit(!renderEdit)}
            style={{
               textDecoration: completed ? 'line-through' : 'none'
            }}>{text}</li>
         {renderEdit ? <EditTodo /> : ''}
         <button onClick={() => toggleComplete(completed, id)}>✅</button>
         <button onClick={() => deleteTodo(id)}>🗑</button>
      </>
   );
}

//
////APP
//

const reducers = combineReducers({ todoReducer, visibilityFilter })
const store = createStore(reducers);

class TodoApp extends Component {

   render() {
      const { visibilityFilter, todoReducer } = this.props;
      const visibileTodos = getVisibleTodos(todoReducer, visibilityFilter);

      return (
         <>
            <button onClick={() => addTodo(this.input)}>add todo</button>
            <input ref={node => this.input = node}></input>
            <ul>
               {visibileTodos.map(todo => <ListItem todo={todo} />)}
            </ul>
            <p>
               Show:
               {' '}
               <FilterLink
                  filter='SHOW_ALL'
                  currentFilter={visibilityFilter}
                  >
                  All
               </FilterLink>
               {', '}
               <FilterLink
                  filter='SHOW_ACTIVE'
                  currentFilter={visibilityFilter}
                  >
                  Active
               </FilterLink>
               {', '}
               <FilterLink
                  filter='SHOW_COMPLETED'
                  currentFilter={visibilityFilter}
               >
                  Completed
               </FilterLink>
            </p>
         </>
      );
   }
}

//RENDERERS
const root = document.getElementById('root');
const render = () => {
   ReactDOM.render(<TodoApp  {...store.getState()} />, root);
}
store.subscribe(render);
render();