import styles from "./sprite-pet.module.css";

type PetPreviewProps = {
  petId: string;
  label: string;
  eager?: boolean;
  className?: string;
};

export function PetPreview({
  petId,
  label,
  eager = false,
  className,
}: PetPreviewProps) {
  return (
    <span
      className={[styles.previewWindow, className].filter(Boolean).join(" ")}
      role="img"
      aria-label={label}
    >
      {/* Previews are exact 192×208 idle frames exported from the validated v2 atlas. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/pets/${petId}/web/preview.webp`}
        alt=""
        aria-hidden="true"
        width={192}
        height={208}
        decoding="async"
        draggable={false}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "low"}
      />
    </span>
  );
}
