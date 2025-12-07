interface SpinnerProps {
     size?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "xxxxl";
     color?: string;
}

const Spinner = ({ size = "md", color = "bg-primary" }: SpinnerProps) => {
     const sizeClasses = {
          sm: "w-4 h-4",
          md: "w-5 h-5",
          lg: "w-6 h-6",
          xl: "w-8 h-8",
          xxl: "w-10 h-10",
          xxxl: "w-12 h-12",
          xxxxl: "w-14 h-14",
     };

     return (
          <svg
               className={`animate-spin ${color} ${sizeClasses[size]}`}
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24"
          >
               <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#465fff"
                    strokeWidth="4"
               />
               <path
                    className="opacity-75"
                    fill="#465fff"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
               />
          </svg>
     );
};

export default Spinner;