import { useState, useRef } from 'react'
import './App.css'

function ControlledInput({onSubmit}) {
  const [value, setValue] = useState('')// 响应式状态
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(value,'???')
    onSubmit(value)
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="controlled-input">受控组件</label>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="请输入内容"
      />
      <button type="submit">提交</button>
    </form>
  )
}

function UncontrolledInput({ onSubmit }) {
  const inputRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const value = inputRef.current.value
    console.log(value, "???");
    onSubmit(value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="uncontrolled-input">非受控组件</label>
      <input
        ref={inputRef}
        type="text"
        placeholder="请输入内容"
        id="uncontrolled-input"
      />
      <button type="submit">提交</button>
    </form>
  );
}

function App() {
  const handleSubmit = (value) => {
    console.log(value,'???')
  }

  return (
    <div>
      <ControlledInput onSubmit={handleSubmit}/>
      <UncontrolledInput onSubmit={handleSubmit}/>
    </div>
  )
}

export default App