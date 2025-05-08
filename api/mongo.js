const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://babushka:${password}@cluster0.het17of.mongodb.net/todoApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const todoSchema = new mongoose.Schema({
  content: String,
  complete: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

const todo = new Todo({
  content: 'HTML is easy',
  complete: true,
})

/*
todo.save().then(result => {
  console.log('todo saved!')
  mongoose.connection.close()
})
*/


Todo.find({ complete: true }).then(result => {
    result.forEach(todo => {
        console.log(todo);
    })
    mongoose.connection.close();
})
