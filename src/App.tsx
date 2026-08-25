import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todoItem, setTodoItem] = useState("")
    const [todos, setTodos] = useState<any>([])
    const [currentItem, setCurrentItem]=useState<{_id?:string; todo?:string; status?: boolean;}>({})
    useEffect(() => {
        const getData = async () => {
            const todoResponse = await fetch('https://todo-mfe-be.onrender.com/todo/todos', {
                credentials: 'include',
                method: 'GET'
            })
            const data = await todoResponse.json();
            console.log(data)
            setTodos(data.todos)
        }
        getData();
    }, [])
    const handleAdd = async () => {
        const addTodo = await fetch("https://todo-mfe-be.onrender.com/todo/todos", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                todo: todoItem,
            }),
        });
        const result = await addTodo.json();
        if (addTodo.status === 200) {
            alert('Todo added successfully')
            console.log(result)
            setTodos([...todos, result.newTodo])
        }
    }
    const handleEdit = async (id?: string, status: boolean = false, todo: string = "") => {
        if (!id) return;

        const res = await fetch(`https://todo-mfe-be.onrender.com/todo/todos/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                todo,
                status
            })
        })
        const data = await res.json();
        if (res.status == 200) {
            alert("Updated")
            const updatedItem = todos.map((item: any) => item._id == id ? data.updatedTodo : item)
            setTodos([...updatedItem])
        }
    }
    const handleEditField = (item: any) => {
        setCurrentItem(item)
    }
    const handleDelete = async(id: string)=>{
        const res = await fetch(`https://todo-mfe-be.onrender.com/todo/todos/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json();
        if(res.status==200){
            alert(data.message)
            const newTodos = todos.filter((item:any)=>item._id!=id)
            console.log("JJJJJ", newTodos)
            setTodos([...newTodos])
        }
    }
    return (
        <div>
            <input type="text" value={todoItem} onChange={(e) => setTodoItem(e.target.value)} />
            <button onClick={handleAdd}>Add</button>
            {todos.map((item:any)=>(
                <div key={item._id}>
        <input
          type="checkbox"
          id="subscribe-checkbox"
          checked={item.status}
          onChange={(e)=>handleEdit(item._id, e.target.checked, item.todo)}
        />
                    {item._id!=currentItem._id?item.todo:<input value={currentItem.todo} onChange={(e)=>setCurrentItem({...currentItem, todo: e.target.value})} />}
                    {currentItem._id!=item._id?<button onClick={()=>{handleEditField(item)}}>Edit</button>:
                    <button onClick={()=>{handleEdit(currentItem._id, currentItem.status, currentItem.todo)}}>Update</button>}
                    <button onClick={()=>{handleDelete(item._id)}}>Delete</button>
                </div>
            ))}
        </div>
    )
}

export default App
