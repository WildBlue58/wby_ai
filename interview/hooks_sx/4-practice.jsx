import React, { useState, useEffect, useCallback, useMemo } from "react";

/**
 * ==========================================
 * React Hooks 实战练习题
 * ==========================================
 *
 * 这个文件包含了多个实战练习，帮助新手巩固 Hooks 知识
 * 每个练习都有详细的需求说明和实现代码
 */

// ============================================
// 练习 1：待办事项列表（综合练习）
// ============================================

/**
 * 练习目标：
 * - 使用 useState 管理列表状态
 * - 实现增删改查功能
 * - 使用 useEffect 持久化数据
 *
 * 涉及知识点：
 * - useState（数组状态）
 * - useEffect（localStorage）
 * - 事件处理
 * - 列表渲染
 */
function TodoList() {
  // 从 localStorage 读取初始数据
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, completed

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // 添加待办
  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  };

  // 删除待办
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 切换完成状态
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 编辑待办
  const editTodo = (id, newText) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  // 过滤待办
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  // 统计
  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "2px solid #4CAF50",
        borderRadius: "8px",
        margin: "10px",
        maxWidth: "600px",
      }}
    >
      <h3>📝 练习 1：待办事项列表</h3>

      {/* 输入区域 */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          placeholder="输入待办事项..."
          style={{ flex: 1, padding: "8px", fontSize: "14px" }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: "8px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          添加
        </button>
      </div>

      {/* 过滤器 */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "5px 15px",
            backgroundColor: filter === "all" ? "#2196F3" : "#ddd",
            color: filter === "all" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          全部 ({stats.total})
        </button>
        <button
          onClick={() => setFilter("active")}
          style={{
            padding: "5px 15px",
            backgroundColor: filter === "active" ? "#2196F3" : "#ddd",
            color: filter === "active" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          进行中 ({stats.active})
        </button>
        <button
          onClick={() => setFilter("completed")}
          style={{
            padding: "5px 15px",
            backgroundColor: filter === "completed" ? "#2196F3" : "#ddd",
            color: filter === "completed" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          已完成 ({stats.completed})
        </button>
      </div>

      {/* 待办列表 */}
      <div style={{ minHeight: "200px" }}>
        {filteredTodos.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>暂无待办事项</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// 待办项组件
function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText);
      setIsEditing(false);
    }
  };

  return (
    <li
      style={{
        padding: "10px",
        marginBottom: "8px",
        backgroundColor: todo.completed ? "#f0f0f0" : "white",
        border: "1px solid #ddd",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleEdit()}
          onBlur={handleEdit}
          style={{ flex: 1, padding: "4px" }}
          autoFocus
        />
      ) : (
        <span
          style={{
            flex: 1,
            textDecoration: todo.completed ? "line-through" : "none",
            color: todo.completed ? "#999" : "#000",
          }}
          onDoubleClick={() => setIsEditing(true)}
        >
          {todo.text}
        </span>
      )}

      <button
        onClick={() => setIsEditing(true)}
        style={{ padding: "4px 8px", fontSize: "12px" }}
      >
        编辑
      </button>
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          padding: "4px 8px",
          fontSize: "12px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        删除
      </button>
    </li>
  );
}

// ============================================
// 练习 2：搜索过滤列表
// ============================================

/**
 * 练习目标：
 * - 实现实时搜索过滤
 * - 使用 useMemo 优化性能
 * - 高亮显示匹配文本
 *
 * 涉及知识点：
 * - useState（搜索关键词）
 * - useMemo（过滤结果缓存）
 * - 字符串匹配
 */
function SearchList() {
  const [searchTerm, setSearchTerm] = useState("");

  // 模拟数据
  const users = [
    { id: 1, name: "张三", email: "zhangsan@example.com", role: "开发" },
    { id: 2, name: "李四", email: "lisi@example.com", role: "设计" },
    { id: 3, name: "王五", email: "wangwu@example.com", role: "产品" },
    { id: 4, name: "赵六", email: "zhaoliu@example.com", role: "开发" },
    { id: 5, name: "孙七", email: "sunqi@example.com", role: "测试" },
  ];

  // 使用 useMemo 缓存过滤结果
  const filteredUsers = useMemo(() => {
    console.log("执行过滤操作");
    if (!searchTerm) return users;

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div
      style={{
        padding: "20px",
        border: "2px solid #2196F3",
        borderRadius: "8px",
        margin: "10px",
        maxWidth: "600px",
      }}
    >
      <h3>🔍 练习 2：搜索过滤列表</h3>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="搜索姓名、邮箱或角色..."
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          fontSize: "14px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      />

      <p style={{ color: "#666", fontSize: "14px" }}>
        找到 {filteredUsers.length} 条结果（共 {users.length} 条）
      </p>

      <div>
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            style={{
              padding: "12px",
              marginBottom: "8px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
            }}
          >
            <div style={{ fontWeight: "bold" }}>{user.name}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>{user.email}</div>
            <div style={{ fontSize: "12px", color: "#999" }}>
              角色: {user.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 练习 3：表单验证
// ============================================

/**
 * 练习目标：
 * - 实现表单状态管理
 * - 实时验证
 * - 错误提示
 *
 * 涉及知识点：
 * - useState（多个状态）
 * - 表单处理
 * - 验证逻辑
 */
function FormValidation() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // 验证规则
  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "用户名不能为空";
    } else if (formData.username.length < 3) {
      newErrors.username = "用户名至少3个字符";
    }

    if (!formData.email) {
      newErrors.email = "邮箱不能为空";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "邮箱格式不正确";
    }

    if (!formData.password) {
      newErrors.password = "密码不能为空";
    } else if (formData.password.length < 6) {
      newErrors.password = "密码至少6个字符";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次密码不一致";
    }

    return newErrors;
  }, [formData]);

  // 实时验证
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      setErrors(validate());
    }
  }, [formData, touched, validate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      console.log("表单提交成功:", formData);
      // 这里可以调用 API
    } else {
      setErrors(newErrors);
      setTouched({
        username: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          padding: "20px",
          border: "2px solid #4CAF50",
          borderRadius: "8px",
          margin: "10px",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        <h3>✅ 注册成功！</h3>
        <p>欢迎，{formData.username}！</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              username: "",
              email: "",
              password: "",
              confirmPassword: "",
            });
            setErrors({});
            setTouched({});
          }}
          style={{ padding: "8px 20px", marginTop: "10px" }}
        >
          重新注册
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        border: "2px solid #FF9800",
        borderRadius: "8px",
        margin: "10px",
        maxWidth: "500px",
      }}
    >
      <h3>📋 练习 3：表单验证</h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            用户名：
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={() => handleBlur("username")}
            style={{
              width: "100%",
              padding: "8px",
              border:
                errors.username && touched.username
                  ? "2px solid red"
                  : "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          {errors.username && touched.username && (
            <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
              {errors.username}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            邮箱：
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email")}
            style={{
              width: "100%",
              padding: "8px",
              border:
                errors.email && touched.email
                  ? "2px solid red"
                  : "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          {errors.email && touched.email && (
            <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
              {errors.email}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            密码：
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur("password")}
            style={{
              width: "100%",
              padding: "8px",
              border:
                errors.password && touched.password
                  ? "2px solid red"
                  : "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          {errors.password && touched.password && (
            <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
              {errors.password}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            确认密码：
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={() => handleBlur("confirmPassword")}
            style={{
              width: "100%",
              padding: "8px",
              border:
                errors.confirmPassword && touched.confirmPassword
                  ? "2px solid red"
                  : "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          {errors.confirmPassword && touched.confirmPassword && (
            <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          注册
        </button>
      </form>
    </div>
  );
}

// ============================================
// 主演示组件
// ============================================

function PracticeDemo() {
  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333" }}>
        💪 React Hooks 实战练习
      </h1>

      <div
        style={{
          backgroundColor: "#e8f5e9",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h2>🎯 练习说明</h2>
        <p>这些练习从易到难，帮助你掌握 React Hooks 的实际应用。</p>
        <ul>
          <li>
            <strong>练习 1：</strong>综合练习，涵盖增删改查和持久化
          </li>
          <li>
            <strong>练习 2：</strong>搜索过滤和性能优化
          </li>
          <li>
            <strong>练习 3：</strong>表单处理和验证
          </li>
        </ul>
        <p style={{ marginTop: "10px", color: "#666" }}>
          💡 提示：打开控制台查看日志输出，理解组件的重新渲染机制。
        </p>
      </div>

      <TodoList />
      <SearchList />
      <FormValidation />

      <div
        style={{
          backgroundColor: "#fff3cd",
          padding: "15px",
          borderRadius: "8px",
          marginTop: "20px",
          border: "1px solid #ffc107",
        }}
      >
        <h2>📝 进阶挑战</h2>
        <p>如果你已经完成了上面的练习，可以尝试以下挑战：</p>
        <ol>
          <li>为待办事项添加优先级和分类功能</li>
          <li>在搜索列表中高亮显示匹配的关键词</li>
          <li>添加密码强度指示器</li>
          <li>实现拖拽排序功能</li>
          <li>添加撤销/重做功能</li>
        </ol>
      </div>
    </div>
  );
}

export default PracticeDemo;
