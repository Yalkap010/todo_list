const Todos = ({ todo, editId, editContent, setEditContent, editTodo, saveEdit, removeTodo, completeTodo }) => {
    return (
      <li className="flex p-4 w-full bg-grey rounded-sm items-center">
        <input type="checkbox" className="w-5 h-5 cursor-pointer" checked={todo.complete || false} onChange={completeTodo} />
  
        {editId === todo.id ? (
          <input
            type="text"
            className="pl-5 px-2 text-md w-10/12 border"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        ) : (
          <p className={`pl-5 px-2 text-md w-10/12 ${todo.complete ? "line-through text-gray-400" : "text-black"}`}>{todo.content}</p>
        )}
  
        {editId === todo.id ? (
          <button onClick={() => saveEdit(todo.id)} className="bg-green-500 text-white rounded-full w-7 h-7 ml-2">✔</button>
        ) : (
          <button onClick={() => editTodo(todo.id, todo.content)} className="bg-yellow-400 text-white rounded-full w-7 h-7 ml-2">✎</button>
        )}
  
        <button onClick={removeTodo} className="bg-red-500 text-white rounded-full w-7 h-7 ml-2">×</button>
      </li>
    );
  };
  
  export default Todos;