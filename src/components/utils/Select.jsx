import React, { useId } from 'react'

const Select = ({
  options,
  label,
  className = '',
  ...props
}, ref) => {
  const id = useId()

  return (
    <div className='w-full'>
      {label && (
        <label 
          htmlFor={id} 
          className='block mb-2 text-sm font-medium text-gray-700'
        >
          {label}
        </label>
      )}
      <select
        {...props}
        id={id}
        ref={ref}
        className={`
          w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-300
          text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 
          focus:border-red-500 transition-colors duration-200
          ${className}
        `}
      >
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default React.forwardRef(Select)
