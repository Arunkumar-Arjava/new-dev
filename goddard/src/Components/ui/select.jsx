import * as React from "react"
import { cn } from "@/lib/utils"

const Select = ({ children, value, onValueChange, ...props }) => {
  const [open, setOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value)

  React.useEffect(() => {
    setSelectedValue(value)
  }, [value])

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
    setOpen(false)
  }

  return (
    <div className="relative" {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { 
          open, 
          setOpen, 
          selectedValue, 
          onValueChange: handleValueChange 
        })
      )}
    </div>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, open, setOpen, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    onClick={() => setOpen(!open)}
    {...props}
  >
    {children}
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, selectedValue, children }) => {
  return (
    <span className="block truncate">
      {children || selectedValue || placeholder}
    </span>
  )
}

const SelectContent = React.forwardRef(({ className, children, open, onValueChange, ...props }, ref) => {
  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        className
      )}
      {...props}
    >
      {React.Children.map(children, child =>
        React.cloneElement(child, { onValueChange })
      )}
    </div>
  )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    onClick={() => onValueChange?.(value)}
    {...props}
  >
    {children}
  </div>
))
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}