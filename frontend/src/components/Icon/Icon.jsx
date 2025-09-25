export default function Icon({ id, ...props }) {
  return (
    <svg {...props}>
      <use href={`/sprite.svg#${id}`} xlinkHref={`/sprite.svg#${id}`} />
    </svg>
  );
}
