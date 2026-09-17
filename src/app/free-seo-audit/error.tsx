"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#10213c",
        padding: "5rem",
        fontFamily: "system-ui",
      }}
    >
      <h1>The analyzer couldn’t load.</h1>
      <p>Please try again. Your existing website pages remain available.</p>
      <button onClick={reset}>Try again</button>{" "}
      <a href="/">Return to HaadiGlobal</a>
    </div>
  );
}
