interface AvatarProps {
  initials: string;
  size?: number;
}

export default function Avatar({ initials, size = 36 }: AvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #1A472A, #2D6A4F)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.33,
        fontWeight: 700,
        letterSpacing: 0.5,
        flexShrink: 0,
        fontFamily: "inherit",
      }}
    >
      {initials}
    </div>
  );
}
