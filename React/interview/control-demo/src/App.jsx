// import { useState, useRef } from 'react'
// import './App.css'

// function ControlledInput({onSubmit}) {
//   const [value, setValue] = useState('')// 响应式状态
//   const [error, setError] = useState('')
//   const handleSubmit = (e) => {
//     e.preventDefault()
//     console.log(value,'???')
//     onSubmit(value)
//   }
//   const handleChange = (e) => {
//     setValue(e.target.value)
//     // 频繁触发 实时判断表单是否合格
//     if (e.target.value.length < 6) {
//       setError('请输入至少6个字符')
//     } else {
//       setError('')
//     }
//   }
//   return (
//     <form onSubmit={handleSubmit}>
//       <label htmlFor="controlled-input">受控组件</label>
//       <input
//         type="text"
//         value={value}
//         onChange={handleChange}
//         placeholder="请输入内容"
//         required
//       />
//       {error && <p>{error}</p>}
//       <button type="submit">提交</button>
//     </form>
//   )
// }

// function UncontrolledInput({ onSubmit }) {
//   const inputRef = useRef(null);
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const value = inputRef.current.value
//     console.log(value, "???");
//     onSubmit(value);
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       <label htmlFor="uncontrolled-input">非受控组件</label>
//       <input
//         ref={inputRef}
//         type="text"
//         placeholder="请输入内容"
//         id="uncontrolled-input"
//       />
//       <button type="submit">提交</button>
//     </form>
//   );
// }

// function App() {
//   const handleSubmit = (value) => {
//     console.log(value,'???')
//   }

//   return (
//     <div>
//       <ControlledInput onSubmit={handleSubmit}/>
//       <UncontrolledInput onSubmit={handleSubmit}/>
//     </div>
//   )
// }

// export default App

import { useState, useRef } from "react";
import "./App.css";

function App() {
  // 受控组件的状态
  const [controlledInput, setControlledInput] = useState("");
  const [controlledSelect, setControlledSelect] = useState("");
  const [controlledTextarea, setControlledTextarea] = useState("");

  // 非受控组件的 ref
  const uncontrolledInputRef = useRef(null);
  const uncontrolledSelectRef = useRef(null);
  const uncontrolledTextareaRef = useRef(null);

  // 处理受控组件的变化
  const handleControlledInputChange = (e) => {
    setControlledInput(e.target.value);
  };

  const handleControlledSelectChange = (e) => {
    setControlledSelect(e.target.value);
  };

  const handleControlledTextareaChange = (e) => {
    setControlledTextarea(e.target.value);
  };

  // 获取非受控组件的值
  const handleUncontrolledSubmit = (e) => {
    e.preventDefault();
    const inputValue = uncontrolledInputRef.current.value;
    const selectValue = uncontrolledSelectRef.current.value;
    const textareaValue = uncontrolledTextareaRef.current.value;

    alert(
      `非受控组件值：\n输入框: ${inputValue}\n选择框: ${selectValue}\n文本域: ${textareaValue}`
    );
  };

  return (
    <div className="app">
      <h1>受控组件 vs 非受控组件演示</h1>

      <div className="container">
        {/* 受控组件 */}
        <div className="section">
          <h2>受控组件 (Controlled Components)</h2>
          <p>组件的状态完全由 React 控制，数据流是单向的</p>

          <div className="form-group">
            <label>输入框：</label>
            <input
              type="text"
              value={controlledInput}
              onChange={handleControlledInputChange}
              placeholder="输入内容..."
            />
            <p>当前值: {controlledInput}</p>
          </div>

          <div className="form-group">
            <label>选择框：</label>
            <select
              value={controlledSelect}
              onChange={handleControlledSelectChange}
            >
              <option value="">请选择...</option>
              <option value="react">React</option>
              <option value="vue">Vue</option>
              <option value="angular">Angular</option>
            </select>
            <p>当前值: {controlledSelect}</p>
          </div>

          <div className="form-group">
            <label>文本域：</label>
            <textarea
              value={controlledTextarea}
              onChange={handleControlledTextareaChange}
              placeholder="输入多行文本..."
              rows="3"
            />
            <p>当前值: {controlledTextarea}</p>
          </div>
        </div>

        {/* 非受控组件 */}
        <div className="section">
          <h2>非受控组件 (Uncontrolled Components)</h2>
          <p>组件的状态由 DOM 自身管理，通过 ref 获取值</p>

          <form onSubmit={handleUncontrolledSubmit}>
            <div className="form-group">
              <label>输入框：</label>
              <input
                type="text"
                ref={uncontrolledInputRef}
                defaultValue=""
                placeholder="输入内容..."
              />
            </div>

            <div className="form-group">
              <label>选择框：</label>
              <select ref={uncontrolledSelectRef} defaultValue="">
                <option value="">请选择...</option>
                <option value="react">React</option>
                <option value="vue">Vue</option>
                <option value="angular">Angular</option>
              </select>
            </div>

            <div className="form-group">
              <label>文本域：</label>
              <textarea
                ref={uncontrolledTextareaRef}
                defaultValue=""
                placeholder="输入多行文本..."
                rows="3"
              />
            </div>

            <button type="submit">获取非受控组件值</button>
          </form>
        </div>
      </div>

      <div className="comparison">
        <h2>对比总结</h2>
        <table>
          <thead>
            <tr>
              <th>特性</th>
              <th>受控组件</th>
              <th>非受控组件</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>状态管理</td>
              <td>React 管理</td>
              <td>DOM 管理</td>
            </tr>
            <tr>
              <td>数据绑定</td>
              <td>value + onChange</td>
              <td>defaultValue + ref</td>
            </tr>
            <tr>
              <td>实时更新</td>
              <td>✅ 可以实时获取值</td>
              <td>❌ 需要手动获取</td>
            </tr>
            <tr>
              <td>表单验证</td>
              <td>✅ 容易实现</td>
              <td>❌ 较难实现</td>
            </tr>
            <tr>
              <td>性能</td>
              <td>每次输入都重新渲染</td>
              <td>不触发重新渲染</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
