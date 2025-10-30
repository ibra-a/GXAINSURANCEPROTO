import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-xl",
          description: "group-[.toast]:text-gray-600",
          actionButton:
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-blue-500 group-[.toast]:to-indigo-600 group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-900",
          error: "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-red-50 group-[.toaster]:to-rose-50 group-[.toaster]:text-red-900 group-[.toaster]:border-red-200",
          success: "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-green-50 group-[.toaster]:to-emerald-50 group-[.toaster]:text-green-900 group-[.toaster]:border-green-200",
          warning: "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-yellow-50 group-[.toaster]:to-amber-50 group-[.toaster]:text-yellow-900 group-[.toaster]:border-yellow-200",
          info: "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-blue-50 group-[.toaster]:to-indigo-50 group-[.toaster]:text-blue-900 group-[.toaster]:border-blue-200",
        },
        style: {
          borderRadius: "12px",
          padding: "16px",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
