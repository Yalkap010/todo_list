const TodosForm = ({ newTodo, addTodo, handleTodoChange }) => {
  return (
    <div className="pt-2 pl-12 pb-8">
      <form onSubmit={addTodo}>
        <input
          className="bg-teal py-4 px-4 rounded-3xl w-3/5 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Add new todo"
          value={newTodo}
          onChange={handleTodoChange}
        />
        <button
          className="bg-orange hover:bg-blue transition duration-500 text-white font-medium py-4 px-4 w-1/5 rounded-3xl focus:outline-none focus:shadow-outline"
          type="submit"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default TodosForm;
