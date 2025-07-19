# 受控组件和非受控组件

- 表单 收集用户数据
  - 受 state 控制
    value = {state} onChange = {(e) => setState(e.target.value)}
    性能开销 表单的检测等，防抖节流，实时判断表单是否合格
  - 非受控
    另外一种 收集用户输入的方法
    性能好 交互不强的
