

type GoogleButtonProps = {
  label?: string;
};

export default function GoogleButton({
  label = "Continue with Google",
}: GoogleButtonProps) {
  return (
    <button
      type="button"
      className="btn w-full min-h-10 bg-secondary border border-line text-sm font-medium text-main hover:bg-foreground transition-colors"
    >
      <img src="/google.png" alt="Google" className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
