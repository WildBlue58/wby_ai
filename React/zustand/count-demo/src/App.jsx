import "./App.css";
import { useCounterStore } from "./store/count";
import Counter from "./components/Counter";
import TodoList from "./components/TodoList";
import RepoList from "./components/RepoList";

function App() {
  const { count, increment, decrement, getCount } = useCounterStore();
  return (
    <>
      <h1>App 中的 Love❤️Xiang: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <Counter />
      <TodoList />
      <RepoList />
    </>
  );
}

export default App;
