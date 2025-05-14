import { useState, useEffect } from 'react';
import todoService from './services/todos';
import TodosForm from './components/TodosForm';
import Todos from './components/Todos';
import Footer from './components/Footer';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    todoService.getAll().then(initialTodos => {
      setTodos(initialTodos);
    });
  }, []);

  const addTodo = (event) => {
    event.preventDefault();
    if (!newTodo.trim()) return;

    if (todos.find(todo => todo.content === newTodo)) {
      alert(`${newTodo} was already added to database`);
      setNewTodo('');
    } else {
      const todoObject = { content: newTodo };
      todoService.create(todoObject).then(returnedTodo => {
        setTodos(todos.concat(returnedTodo));
        setNewTodo('');
      });
    }
  };

  const completeTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    const completedTodo = { ...todo, complete: !todo.complete };

    todoService.update(id, completedTodo).then(returnedTodo => {
      setTodos(todos.map(todo => todo.id !== id ? todo : returnedTodo));
    }).catch(error => {
      alert(`Todo '${todo.content}' was already removed from the server`);
    });
  };

  const removeTodo = id => {
    const todo = todos.find(t => t.id === id);
    if (confirm(`Delete ${todo.content}?`)) {
      todoService.remove(id).then(() => {
        setTodos(todos.filter(t => t.id !== id));
      }).catch(() => {
        alert("This todo was already removed from the server");
        setTodos(todos.filter(t => t.id !== id));
      });
    }
  };

  const startEdit = (id, content) => {
    setEditingTodoId(id);
    setEditingContent(content);
  };

  const cancelEdit = () => {
    setEditingTodoId(null);
    setEditingContent('');
  };

  const saveEdit = (id) => {
    const todo = todos.find(t => t.id === id);
    const updatedTodo = { ...todo, content: editingContent };

    todoService.update(id, updatedTodo).then(returnedTodo => {
      setTodos(todos.map(todo => todo.id !== id ? todo : returnedTodo));
      cancelEdit();
    }).catch(() => {
      alert("Cannot update, todo may have been removed.");
    });
  };

  const handleTodoChange = (event) => setNewTodo(event.target.value);
  const handleEditChange = (event) => setEditingContent(event.target.value);

  const todosToShow = showAll ? todos : todos.filter(todo => todo.complete === true);

  return (
    <div className="bg-teal flex flex-col h-screen justify-center items-center pt-10">
      <div className="box-content h-screen w-3/5 max-w-screen-sm rounded-3xl drop-shadow-md bg-white">
        <h1 className="text-black text-4xl font-semibold p-12">To-Do List</h1>

        <TodosForm newTodo={newTodo} addTodo={addTodo} handleTodoChange={handleTodoChange} />

        <div>
          <button onClick={() => setShowAll(!showAll)} className="p-1 mr-4 mb-3 border-solid border-2 float-right">
            Show {showAll ? 'Completed' : 'All'}
          </button>
        </div>

        <ul className="justify-center">
          {todosToShow.map(todo =>
            <Todos
              key={todo.id}
              todo={todo}
              removeTodo={() => removeTodo(todo.id)}
              completeTodo={() => completeTodo(todo.id)}
              isEditing={editingTodoId === todo.id}
              editValue={editingContent}
              handleEditChange={handleEditChange}
              startEdit={() => startEdit(todo.id, todo.content)}
              cancelEdit={cancelEdit}
              saveEdit={() => saveEdit(todo.id)}
            />
          )}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default App;
