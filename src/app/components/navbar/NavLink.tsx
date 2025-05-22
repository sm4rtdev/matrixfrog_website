import React from 'react';
import Link from 'next/link';

interface NavLinkProps {
  href: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label }) => {
  return (
    <div className="nav-item">
      <Link href={href}>
        <span className="nav-link hover-white">
          {label}
        </span>
      </Link>
    </div>
  );
};

export default NavLink;