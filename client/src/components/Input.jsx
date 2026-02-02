export default function Input({
  id,
  label,
  type = "text",
  error,
  className = "",
  rounded = "both",
  ...props
}) {
  const roundedStyles = {
    top: "rounded-t-md",
    bottom: "rounded-b-md",
    both: "rounded-md",
    none: "rounded-none",
  };

  const baseStyles = `appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600 dark:focus:ring-blue-400 dark:focus:border-blue-400`;

  const borderStyles = error
    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300";

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        aria-label={label}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${baseStyles} ${borderStyles} ${roundedStyles[rounded]} ${className}`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
