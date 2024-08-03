const Button = ({ onClick, children, ...props }) => (
  <button
    onClick={onClick}
    className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
    {...props}
  >
    {children}
  </button>
);
export default Button;
