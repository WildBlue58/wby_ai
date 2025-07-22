import { useCounterStore } from "../../store/count";
// 来自 store

const Counter = () => {
  const { count, increment, decrement, getCount } = useCounterStore();
  return (
    <div>
      <h1>Love❤️Xiang: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

export default Counter;
