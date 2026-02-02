export default function Alert({ type = "error", children }) {
  const styles = {
    error: "bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-200",
    success: "bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-200",
    warning: "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
    info: "bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
  };

  return (
    <div className={`rounded-md p-4 ${styles[type]}`} role="alert">
      <p className="text-sm">{children}</p>
    </div>
  );
}
