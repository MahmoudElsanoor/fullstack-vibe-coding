import React, { useState } from "react";

// component:
// This is a small React component called WelcomeCard.
function WelcomeCard({ name }) {
  // state:
  // "count" is state because this value can change while the app is running.
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "16px" }}>
      <h2>Hello, {name}!</h2>

      {/* props:
          "name" is a prop because it is passed into the component from outside. */}
      <p>This component receives the name prop: {name}</p>

      <p>Button clicks: {count}</p>

      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

export default function Day6Example() {
  return (
    <div>
      <h1>Day 6 React Basics</h1>
      <WelcomeCard name="Sara" />
    </div>
  );
}
