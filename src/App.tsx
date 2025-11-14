import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>+</button>
    </div>
  );
}

export default App;
