import { useAuth } from "../../../context/auth-and-perm/AuthProvider";

interface AvatarProps {
  src?: string; // Make src optional
  alt?: string; // Alt text for the avatar
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge"; // Avatar size
  status?: "online" | "offline" | "busy" | "none"; // Status indicator
  name?: string; // Optional name to generate initials (like Mantine)
}

const sizeClasses = {
  xsmall: "h-6 w-6 max-w-6",
  small: "h-8 w-8 max-w-8",
  medium: "h-10 w-10 max-w-10",
  large: "h-12 w-12 max-w-12",
  xlarge: "h-14 w-14 max-w-14",
  xxlarge: "h-16 w-16 max-w-16",
};

const statusSizeClasses = {
  xsmall: "h-1.5 w-1.5 max-w-1.5",
  small: "h-2 w-2 max-w-2",
  medium: "h-2.5 w-2.5 max-w-2.5",
  large: "h-3 w-3 max-w-3",
  xlarge: "h-3.5 w-3.5 max-w-3.5",
  xxlarge: "h-4 w-4 max-w-4",
};

const statusColorClasses = {
  online: "bg-success-500",
  offline: "bg-error-400",
  busy: "bg-warning-500",
};

// Function to generate initials from a name
const getInitials = (name: string) => {
  const words = name.trim().split(" ");
  const initials = words
    .slice(0, 2) // Take first two words
    .map((word) => word[0]?.toUpperCase())
    .join("");
  return initials;
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "User Avatar",
  size = "medium",
  status = "none",
  name = "",
}) => {
  const { user } = useAuth();
  return (
    <div className={`relative rounded-full ${sizeClasses[size]}`}>
      {src ? (
        // If src is provided, show the image
        <img src={src} alt={alt} className="object-cover rounded-full h-full w-full" />
      ) : (
        // If no src, show a default avatar with initials or placeholder
        <div
          className={`flex items-center justify-center rounded-full h-full w-full text-white bg-blue-500`}
        >
          {name ? (
            <span className="text-sm font-medium">{getInitials(name || user?.name)}</span>
          ) : (
            <span className="text-sm font-medium"></span> // Placeholder if no name
          )}
        </div>
      )}

      {/* Status Indicator */}
      {status !== "none" && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-[1.5px] border-white dark:border-gray-900 ${statusSizeClasses[size]
            } ${statusColorClasses[status] || ""}`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;