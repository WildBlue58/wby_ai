import { useState } from 'react'

function TodoForm(props) { 
    const { onAdd, categories } = props
    const [text, setText] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('其他')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!text.trim()) {
            setError('请输入待办事项内容')
            return
        }
        onAdd(text, selectedCategory)
        setText('')
        setSelectedCategory('其他')
        setError('')
    }

    const handleChange = (e) => {
        setText(e.target.value)
        if (error) {
            setError('')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="请输入待办事项"
                    value={text}
                    onChange={handleChange}
                    className={error ? 'error' : ''}
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-select"
                >
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                {error && <div className="error-message">{error}</div>}
            </div>
            <button type="submit">添加</button>
        </form>
    )
}

export default TodoForm