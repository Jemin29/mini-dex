export default function Spinner() {
  return (
    <span className="relative inline-flex h-4 w-4">
      <span className="absolute inset-0 rounded-full border-2 border-accent/30" />
      <span className="absolute inset-0 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </span>
  );
}
