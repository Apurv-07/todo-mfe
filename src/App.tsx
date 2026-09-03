import { useEffect, useMemo, useState, type ReactNode } from "react";
import "./index.css";
import {
  ListTodo,
  Plus,
  Pencil,
  Trash2,
  Save,
  Sparkles,
  Check,
  X,
  CheckCircle2,
  Circle,
  ClipboardList,
} from "lucide-react";

type Todo = {
  _id?: string;
  todo?: string;
  status?: boolean;
};

type Toast = { id: number; message: string; tone: "success" | "error" };

function App() {
  const [todoItem, setTodoItem] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentItem, setCurrentItem] = useState<Todo>({});
  const [adding, setAdding] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = (message: string, tone: "success" | "error" = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  };

  useEffect(() => {
    const getData = async () => {
      const todoResponse = await fetch(
        "https://todo-mfe-be.onrender.com/todo/todos",
        {
          credentials: "include",
          method: "GET",
        },
      );
      const data = await todoResponse.json();
      setTodos(data.todos ?? []);
    };
    getData();
  }, []);

  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((t) => t.status).length;
    return { total, done, pending: total - done };
  }, [todos]);

  const handleAdd = async () => {
    if (!todoItem.trim()) return;
    setAdding(true);
    try {
      const addTodo = await fetch(
        "https://todo-mfe-be.onrender.com/todo/todos",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            todo: todoItem,
          }),
        },
      );
      const result = await addTodo.json();
      if (addTodo.status === 200) {
        setTodos((prev) => [...prev, result.newTodo]);
        setTodoItem("");
        notify("Task added");
      } else {
        notify("Could not add task", "error");
      }
    } catch {
      notify("Could not add task", "error");
    } finally {
      setAdding(false);
    }
  };

  const handleEdit = async (
    id?: string,
    status: boolean = false,
    todo: string = "",
  ) => {
    if (!id) return;

    const res = await fetch(
      `https://todo-mfe-be.onrender.com/todo/todos/${id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todo,
          status,
        }),
      },
    );
    const data = await res.json();
    if (res.status == 200) {
      const updatedItem = todos.map((item) =>
        item._id == id ? data.updatedTodo : item,
      );
      setTodos([...updatedItem]);
      setCurrentItem({});
      notify(status ? "Marked complete" : "Task updated");
    } else {
      notify("Update failed", "error");
    }
  };

  const handleEditField = (item: Todo) => {
    setCurrentItem(item);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    const res = await fetch(
      `https://todo-mfe-be.onrender.com/todo/todos/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await res.json();
    if (res.status == 200) {
      const newTodos = todos.filter((item) => item._id != id);
      setTodos([...newTodos]);
      notify(data.message ?? "Task deleted");
    } else {
      notify("Delete failed", "error");
    }
  };

  return (
    <div className="min-h-full w-full bg-slate-950 text-slate-100 p-6 sm:p-10 lg:p-12 relative overflow-x-hidden font-sans">
      {/* Background Aurora Glow Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[130px] pointer-events-none animate-pulse"
        style={{ animationDuration: "4s" }}
      />

      {/* Toasts */}
      <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 sm:max-w-xs items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl text-sm font-medium animate-[fadeIn_0.2s_ease-out] ${
              t.tone === "success"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-200"
                : "bg-rose-500/15 border-rose-500/30 text-rose-200"
            }`}
          >
            {t.tone === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Main Wrapper */}
      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        {/* Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-900/60 border border-white/10 backdrop-blur-2xl shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Task Command Center</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Smart Todos
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Capture what matters and clear it, one task at a time.
              </p>
            </div>
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 items-center justify-center text-cyan-400 shadow-inner shrink-0">
              <ListTodo className="w-7 h-7" />
            </div>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <StatPill
              label="Total"
              value={stats.total}
              icon={<ClipboardList className="w-4 h-4" />}
              accent="text-slate-200 bg-white/5 border-white/10"
            />
            <StatPill
              label="Active"
              value={stats.pending}
              icon={<Circle className="w-4 h-4" />}
              accent="text-cyan-300 bg-cyan-500/10 border-cyan-500/20"
            />
            <StatPill
              label="Done"
              value={stats.done}
              icon={<CheckCircle2 className="w-4 h-4" />}
              accent="text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
            />
          </div>
        </div>

        {/* Add Todo Input Bar Card */}
        <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-2xl shadow-xl flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={todoItem}
            onChange={(e) => setTodoItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            placeholder="What needs to be conquered today..."
            className="flex-1 px-5 py-4 rounded-2xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !todoItem.trim()}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm tracking-wide uppercase flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>{adding ? "Adding..." : "Add Task"}</span>
          </button>
        </div>

        {/* Todos List Container */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="p-14 text-center rounded-3xl bg-slate-900/40 border border-dashed border-white/10">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mb-4">
                <ClipboardList className="w-7 h-7" />
              </div>
              <p className="text-slate-300 font-medium">Nothing here yet</p>
              <p className="text-slate-500 text-sm mt-1">
                Add your first task using the field above.
              </p>
            </div>
          ) : (
            todos.map((item) => {
              const isEditing = item._id === currentItem._id;
              return (
                <div
                  key={item._id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 backdrop-blur-xl shadow-lg flex items-center justify-between gap-4 group ${
                    item.status
                      ? "border-emerald-500/25 bg-emerald-950/20"
                      : "border-white/10 bg-slate-900/80 hover:border-cyan-500/30 hover:bg-slate-900"
                  }`}
                >
                  {/* Left: Checkbox + Text / Editable Input */}
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <label className="relative flex items-center justify-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={!!item.status}
                        onChange={(e) =>
                          handleEdit(item._id, e.target.checked, item.todo)
                        }
                        className="peer sr-only"
                      />
                      <div className="w-6 h-6 rounded-lg bg-slate-950 border border-white/20 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center transition-all">
                        <Check className="w-4 h-4 text-slate-950 opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </label>

                    <div className="flex-1 min-w-0">
                      {!isEditing ? (
                        <span
                          className={`block text-sm sm:text-base font-medium truncate transition-colors ${
                            item.status
                              ? "text-slate-500 line-through"
                              : "text-slate-100"
                          }`}
                        >
                          {item.todo}
                        </span>
                      ) : (
                        <input
                          autoFocus
                          value={currentItem.todo ?? ""}
                          onChange={(e) =>
                            setCurrentItem({
                              ...currentItem,
                              todo: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter")
                              handleEdit(
                                currentItem._id,
                                currentItem.status,
                                currentItem.todo,
                              );
                            if (e.key === "Escape") setCurrentItem({});
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-cyan-500/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-inner"
                        />
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {!isEditing ? (
                      <button
                        onClick={() => handleEditField(item)}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/20 transition-all cursor-pointer"
                        title="Edit Task"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            handleEdit(
                              currentItem._id,
                              currentItem.status,
                              currentItem.todo,
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={() => setCurrentItem({})}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  accent: string;
}) {
  return (
    <div className={`rounded-2xl border px-3 py-2.5 sm:px-4 sm:py-3 ${accent}`}>
      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider opacity-80">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <p className="text-xl sm:text-2xl font-black mt-1 text-white">{value}</p>
    </div>
  );
}

export default App;
