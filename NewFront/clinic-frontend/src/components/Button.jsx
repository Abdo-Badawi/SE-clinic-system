export default function Button({ children, onClick, type = "button", variant = "blue" }) {
  const colors = { blue: "bg-blue-500", red: "bg-red-500", green: "bg-green-500" };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${colors[variant]} text-white px-4 py-2 rounded hover:opacity-80`}
    >
      {children}
    </button>
  );
}