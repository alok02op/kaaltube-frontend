import React, { useId } from 'react'

const Input = ({
  label,
  type = 'text',
  className = '',
  editMode = true,
  ...props
}, ref) => {
  const id = useId()

  return (
    <div className='w-full'>
      {label && (
        <label 
          className='block mb-2 text-sm font-medium text-gray-700'
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input 
        type={type}
        id={id}
        ref={ref}
        disabled={!editMode}
        className={`
          w-full px-4 py-2 rounded-lg border 
          text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:border-blue-500 transition-colors duration-200
          ${editMode ? 'border-blue-400 bg-white' : 'bg-gray-100 border-gray-300 cursor-not-allowed'}
          ${className}
        `}
        {...props}
      />
    </div>
  )
}

export default React.forwardRef(Input)
