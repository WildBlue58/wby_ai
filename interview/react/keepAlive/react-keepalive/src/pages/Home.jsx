import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  return (
    <div>
      Home Page
      <p>计数:{count}</p>
      <button onClick={() => setCount((c) => c + 1)}>加1</button>
    </div>
  );
}
