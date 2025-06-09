import { useState } from 'react'

function Todos(props) { 
    // console.log(props, '/////')
    const { todos, onToggle, onDelete, onEdit } = props
    const [editingId, setEditingId] = useState(null)
    const [editText, setEditText] = useState('')

    // 开始编辑
    const handleEditStart = (id, currentText) => {
        setEditingId(id)
        setEditText(currentText || '')
    }

    // 保存编辑
    const handleEditSave = (id) => {
        if (editText.trim()) {
            onEdit(id, editText.trim())
        }
        setEditingId(null)
        setEditText('')
    }

    // 取消编辑
    const handleEditCancel = () => {
        setEditingId(null)
        setEditText('')
    }

    // 获取分类对应的颜色
    const getCategoryColor = (category) => {
        const colors = {
            '工作': '#dc3545',
            '学习': '#007bff',
            '生活': '#28a745',
            '其他': '#6c757d'
        }
        return colors[category] || '#6c757d'
    }

    return (
        <div className="todos-area">
            <ul>
                {
                    todos.map(todo => (
                        <li key={todo.id}>
                            <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => onToggle(todo.id)}
                                />
                                
                                {/* 分类标签 */}
                                <span 
                                    className="category-tag"
                                    style={{ backgroundColor: getCategoryColor(todo.category) }}
                                >
                                    {todo.category}
                                </span>
                                
                                {/* 待办事项文本或编辑框 */}
                                {editingId === todo.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    handleEditSave(todo.id)
                                                } else if (e.key === 'Escape') {
                                                    e.preventDefault()
                                                    handleEditCancel()
                                                }
                                            }}
                                            style={{
                                                background: 'white',
                                                color: '#222',
                                                border: '2px solid #368be6',
                                                padding: '0.5rem 0.7rem',
                                                fontSize: '1rem',
                                                fontFamily: 'Arial, sans-serif',
                                                borderRadius: '6px',
                                                flex: 1,
                                                boxSizing: 'border-box',
                                                outline: 'none'
                                            }}
                                            autoFocus
                                        />

                                    </>
                                ) : (
                                    <span>{todo.text}</span>
                                )}
                            </div>
                            
                            <div className="todo-actions">
                                {editingId === todo.id ? (
                                    <>
                                        <button 
                                            className="save-btn"
                                            onClick={() => handleEditSave(todo.id)}
                                        >
                                            保存
                                        </button>
                                        <button 
                                            className="cancel-btn"
                                            onClick={handleEditCancel}
                                        >
                                            取消
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEditStart(todo.id, todo.text)}
                                        >
                                            编辑
                                        </button>
                                        <button 
                                            className="complete-btn"
                                            onClick={() => onToggle(todo.id)}
                                        >
                                            {todo.completed ? '取消完成' : '完成'}
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => onDelete(todo.id)}
                                        >
                                            删除
                                        </button>
                                    </>
                                )}
                            </div>
                        </li>
                    ))
                }
            </ul>
            {todos.length === 0 && (
                <div className="empty-tip">暂无待办事项</div>
            )}
        </div>
    )
}

export default Todos