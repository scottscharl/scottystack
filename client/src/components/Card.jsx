export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 dark:bg-gray-800 ${className}`}
    >
      {children}
    </div>
  );
}
