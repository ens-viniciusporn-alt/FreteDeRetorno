export default function Button({
  children,
  href,
  variant = 'primary',
  size = '',
  type = 'button',
  onClick,
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    size && `btn-${size}`,
    className
  ].filter(Boolean).join(' ');

  if (href) {
    return (
      <a className={classes} href={href} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}