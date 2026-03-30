import Button from "./Button.jsx";

export default function BackToTop({ show, onClick }) {
  if (!show) return null;
  return (
    <Button
      variant="dark"
      type="button"
      aria-label="Volver arriba"
      onClick={onClick}
      className="fixed bottom-24 right-6 z-[60] px-5 py-3 shadow-ink sm:bottom-6"
    >
      Arriba
    </Button>
  );
}
