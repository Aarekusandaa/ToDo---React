class TodoApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            todos: [],
            optionToShow: 'ALL',
            todosInOption: [],
            text: ''
        }
        this.getTodos();
    }

    render() {
        return (
            <div>
                <div className="jumbotron text-center">
                    <h1>nodeTODO: <span className="label label-info">{this.state.todos.length}</span></h1>
                </div>

                <div id="tabs" className="tabs">
                    <button id="btn1" value="ALL" onClick={this.state.optionToShow === "ALL", (e) => this.optionClicked(e)}>All</button>
                    <button id="btn2" value="TODO" onClick={this.state.optionToShow === "TODO", (e) => this.optionClicked(e)}>To do</button>
                    <button id="btn3" value="DONE" onClick={this.state.optionToShow === "DONE", (e) => this.optionClicked(e)}>Done</button>
                </div>

                <div id="todo-list" className="row">
                    <div className="col-sm-8 col-sm-offset-2">
                        {this.state.todosInOption.map((todo => {
                            return (
                                <div className="checkbox" key={todo._id}>
                                    <label>
                                        <input type="checkbox" onChange={() => this.updateTodo(todo)}
                                                checked={todo.done}/>
                                                {todo.text}
                                    </label>
                                    <button className="btn btn-secondary btn-lg" type="button"
                                            onClick={() => this.deleteTodo(todo._id)}>Usuń
                                    </button>
                                </div>
                            )
                        }))}
                    </div>
                </div>

                <div id="todo-form" className="row">
                    <div className="col-sm-8 col-sm-offset-2 text-center">
                        <form>
                            <div className="form-group">
                                <input id="newTodo" type="text" className="form-control input-lg text-center"
                                       placeholder="co jeszcze chcesz zrobić?" value={this.state.text}
                                       onChange={this.catchText}/>
                            </div>
                            <button type="button" className="btn btn-primary btn-lg"
                                    onClick={() => this.createTodo()}>Dodaj
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    getTodos() {
        fetch('http://localhost:3000/api/todos').then(response => response.json()).then(data => this.setState({todos: data, todosInOption: data}));
    }

    updateTodo(todo) {
        todo.done = !todo.done;
        const requestOptions = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(todo)
        };
        fetch('http://localhost:3000/api/todos', requestOptions).then(response => response.json()).then(data => this.setState(
                {
                    todos: data,
                    todosInOption: this.showTodos(this.state.optionToShow, data)
                }
            ));
    }

    deleteTodo(id) {
        const requestOptions = {
            method: 'DELETE'
        }
        fetch('http://localhost:3000/api/todos/' + id, requestOptions).then(response => response.json()).then(data => this.setState(
                {
                    todos: data,
                    todosInOption: this.showTodos(this.state.optionToShow, data)
                }
            ));
    }

    createTodo() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({text: this.state.text})
        }
        fetch('http://localhost:3000/api/todos/', requestOptions).then(response => response.json()).then(data => this.setState(
                {
                    todos: data,
                    text: '',
                    todosInOption: this.showTodos(this.state.optionToShow, data)
                }
            ));
    }

    optionClicked(e) {
        this.setState({
            optionToShow: e.target.value,
            todosInOption: this.showTodos(e.target.value, this.state.todos)
        });
    }

    showTodos(option, todos) {
        let todosToShow = [];
        if (option === 'ALL') {
            todosToShow = todos;
        }
        else if (option === 'TODO') {
            todosToShow = todos.filter((todo) => {return !todo.done});
        }
        else if (option === 'DONE') {
            todosToShow = todos.filter((todo) => {return todo.done});
        }
        return todosToShow;
    }

    catchText = (e) => {
        this.setState({text: e.target.value})
    }
}


ReactDOM.render(
    <TodoApp/>,
    document.getElementById('todo')
);
