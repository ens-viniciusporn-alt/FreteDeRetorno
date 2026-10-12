export default function Button({ children, href, variant = 'primary', size = '', type = 'button', onClick }) {
  const className = `btn btn-${variant}${size ? ` btn-${size}` : ''}`;

  if (href) {
    return <a className={className} href={href} onClick={onClick}>{children}</a>;
  }

  return <button className={className} type={type} onClick={onClick}>{children}</button>;
}
