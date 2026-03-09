// components/ui/select.tsx
import * as React from 'react'

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  onValueChange?: (value: string) => void
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, onValueChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e)
      onValueChange?.(e.target.value)
    }

    return (
      <select
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        ref={ref}
        onChange={handleChange}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = 'Select'

interface SelectItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {}

const SelectItem = React.forwardRef<HTMLOptionElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => (
    <option ref={ref} className={className} {...props}>
      {children}
    </option>
  )
)
SelectItem.displayName = 'SelectItem'

export { Select, SelectItem }