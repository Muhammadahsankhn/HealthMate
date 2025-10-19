import React from 'react'

const Input = ({ label, name, type = 'text', value, onChange, placeholder }) => {
    return (
        <div className="mb-4">
            {label && <label htmlFor={name} className="block mb-1 font-semibold">{label}</label>}
            {type === 'textarea' ? (
                <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full p-3 rounded border bg-white text-black outline-none" rows={4} />
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full p-2 rounded border bg-white text-black outline-none transition-shadow focus:shadow-lg"
                    required
                />
            )}
        </div>
    )
}

export default Input