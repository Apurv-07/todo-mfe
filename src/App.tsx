import { useEffect, useState } from 'react'
import './App.css'
import { 
  ListTodo, 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  Sparkles, 
  Check 
} from 'lucide-react'

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
          setTodoItem("") // Clean up input field nicely after adding
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
          setCurrentItem({}) // Reset current editing item view on success
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
      <div className="h-full w-full bg-slate-950 text-slate-100 p-6 sm:p-12 relative overflow-x-hidden font-sans">
          
          {/* Background Aurora Glow Orbs */}
          <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

          {/* Main Wrapper */}
          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
              
              {/* Header Card */}
              <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-2xl flex items-center justify-between">
                  <div>
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Task Command Center</span>
                      </div>
                      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Smart Todos</h1>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-inner">
                      <ListTodo className="w-7 h-7" />
                  </div>
              </div>

              {/* Add Todo Input Bar Card */}
              <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row gap-3">
                  <input 
                      type="text" 
                      value={todoItem} 
                      onChange={(e) => setTodoItem(e.target.value)} 
                      placeholder="What needs to be conquered today..."
                      className="flex-1 px-5 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                  <button 
                      onClick={handleAdd}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 sm:text-white font-bold text-sm tracking-wide uppercase flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all cursor-pointer"
                  >
                      <Plus className="w-5 h-5" />
                      <span>Add Task</span>
                  </button>
              </div>

              {/* Todos List Container */}
              <div className="space-y-4">
                  {todos.length === 0 ? (
                      <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-dashed border-white/10 text-slate-500 text-sm">
                          No tasks found. Start adding some above!
                      </div>
                  ) : (
                      todos.map((item: any) => (
                          <div 
                              key={item._id}
                              className={`p-5 rounded-2xl bg-slate-900/80 border transition-all duration-300 backdrop-blur-xl shadow-lg flex items-center justify-between gap-4 group ${
                                  item.status ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-white/10 hover:border-cyan-500/30'
                              }`}
                          >
                              {/* Left side: Checkbox + Text / Editable Input */}
                              <div className="flex items-center space-x-4 flex-1 min-w-0">
                                  <label className="relative flex items-center justify-center cursor-pointer">
                                      <input
                                          type="checkbox"
                                          id="subscribe-checkbox"
                                          checked={item.status}
                                          onChange={(e)=>handleEdit(item._id, e.target.checked, item.todo)}
                                          className="peer sr-only"
                                      />
                                      <div className="w-6 h-6 rounded-lg bg-slate-950 border border-white/20 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center transition-all">
                                          <Check className="w-4 h-4 text-slate-950 opacity-0 peer-checked:opacity-100 transition-opacity" />
                                      </div>
                                  </label>

                                  <div className="flex-1 min-w-0">
                                      {item._id != currentItem._id ? (
                                          <span className={`block text-sm sm:text-base font-medium truncate transition-colors ${
                                              item.status ? 'text-slate-500 line-through' : 'text-slate-100'
                                          }`}>
                                              {item.todo}
                                          </span>
                                      ) : (
                                          <input 
                                              value={currentItem.todo} 
                                              onChange={(e)=>setCurrentItem({...currentItem, todo: e.target.value})} 
                                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-cyan-500/50 text-white text-sm focus:outline-none shadow-inner"
                                          />
                                      )}
                                  </div>
                              </div>

                              {/* Right side Actions */}
                              <div className="flex items-center space-x-2 shrink-0">
                                  {currentItem._id != item._id ? (
                                      <button 
                                          onClick={()=>{handleEditField(item)}}
                                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/20 transition-all cursor-pointer"
                                          title="Edit Task"
                                      >
                                          <Pencil className="w-4 h-4" />
                                      </button>
                                  ) : (
                                      <button 
                                          onClick={()=>{handleEdit(currentItem._id, currentItem.status, currentItem.todo)}}
                                          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all cursor-pointer"
                                      >
                                          <Save className="w-3.5 h-3.5" />
                                          <span>Update</span>
                                      </button>
                                  )}

                                  <button 
                                      onClick={()=>{handleDelete(item._id)}}
                                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all cursor-pointer"
                                      title="Delete Task"
                                  >
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                          </div>
                      ))
                  )}
              </div>

          </div>
      </div>
  )
}

export default App