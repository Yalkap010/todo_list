const TodosForm = ({ newTodo, addTodo, handleTodoChange }) => {
  return (
    <div className="pt-2 pl-12 pb-8">
      <form onSubmit={(e) => { e.preventDefault(); addTodo(); }}>
        <input
          className="bg-teal py-4 px-4 rounded-3xl w-3/5"
          type="text"
          placeholder="Add new todo"
          value={newTodo}
          onChange={handleTodoChange}
        />
        <button
          className="bg-orange hover:bg-blue text-white py-4 px-4 w-1/5 rounded-3xl"
          type="submit"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default TodosForm;
