const Button = ({
  children,
  type = 'button',
  variant = 'primary', // 'primary' (blue), 'danger' (red), 'secondary' (gray)
  className = '',
  ...props
}) => {
  const baseClasses = `
    px-5 py-2 rounded-lg font-medium shadow-md transition-colors duration-200
    cursor-pointer
  `

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    nav: 'text-left px-4 hover:bg-blue-100'
  }

  return (
    <button
      type={type}
      {...props}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
