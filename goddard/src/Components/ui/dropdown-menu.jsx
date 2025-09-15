import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenu = ({ children, ...props }) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <div className="relative inline-block text-left" {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { open, setOpen })
      )}
    </div>
  )
}

const DropdownMenuTrigger = React.forwardRef(({ className, children, open, setOpen, asChild, ...props }, ref) => {
  const handleClick = () => setOpen(!open)
  
  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      ref,
      onClick: handleClick,
      className: cn(className, children.props.className)
    })
  }
  
  return (
    <button
      ref={ref}
      className={cn("inline-flex items-center justify-center", className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef(({ className, children, open, setOpen, ...props }, ref) => {
  if (!open) return null
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute left-0 mt-2 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50",
        className
      )}
      {...props}
    >
      <div className="py-1">
        {React.Children.map(children, child =>
          React.cloneElement(child, { setOpen })
        )}
      </div>
    </div>
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef(({ className, children, onClick, setOpen, ...props }, ref) => {
  const handleClick = (e) => {
    onClick?.(e)
    setOpen?.(false)
  }
  
  return (
    <button
      ref={ref}
      className={cn(
        "flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-4 py-2 text-sm font-semibold text-gray-900", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("my-1 h-px bg-gray-200", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
}