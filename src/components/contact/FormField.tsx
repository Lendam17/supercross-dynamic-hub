import { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  isTextarea?: boolean;
}

const FormField = ({ label, error, isTextarea = false, ...props }: FormFieldProps) => {
  const Component = isTextarea ? "textarea" : "input";
  
  return (
    <div>
      <label htmlFor={props.id} className="block text-gray-700 font-medium mb-2">
        {label}
      </label>
      <Component
        {...props}
        className={`w-full p-3 rounded-lg bg-white border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors ${isTextarea ? 'min-h-[120px] resize-none' : ''}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;