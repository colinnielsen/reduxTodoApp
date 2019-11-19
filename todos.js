const { Component, useState, useRef } = React;
const { createStore, combineReducers } = Redux;

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
         ]
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
         })
      case 'TOGGLE_COMPLETED':
         return state.map(todo => {
            if (todo.id !== action.id) {
               return todo;
            }
            console.log()
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

const addTodo = (input) => {
   let { value } = input;
   const payload = {
      type: 'ADD_TODO',
      id: store.getState().length,
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

const reducers = combineReducers({ todoReducer, visibilityFilter })
const store = createStore(reducers);

class TodoApp extends Component {
   render() {
      const { todos } = this.props.todoReducer;
      return (
         <>
            <button onClick={() => addTodo(this.input)}>add todo</button>
            <input ref={node => this.input = node}></input>
            <ul>
               {todos.map(todo => <ListItem todo={todo} />)}
            </ul>
         </>
      )
   }
}

const ListItem = (props) => {
   const { text = '', id, completed } = props.todo;
   const [renderEdit, toggleRenderEdit] = useState(false);

   const EditTodo = (props) => {
      const [inputVal, setInputVal] = useState('');
      return (
         <>
            <input onChange={(e) => setInputVal(e.target.value)} value={inputVal}></input>
            <button onClick={() => editTodo(inputVal, id)}>edit</button>
         </>
      );
   }

   return (
      <>
         <li key={id} onDoubleClick={() => toggleRenderEdit(!renderEdit)}
            style={{
               textDecoration: completed ? 'line-through' : 'none'
            }}>{text}</li>
         {renderEdit ? <EditTodo /> : ''}
         <button onClick={() => toggleComplete(completed, id)}>✔</button>
         <button onClick={() => deleteTodo(id)}>🗑</button>
      </>
   );
}

const root = document.getElementById('root');
const render = () => {
   ReactDOM.render(<TodoApp todos={store.getState()} />, root);
}
store.subscribe(render);
render();