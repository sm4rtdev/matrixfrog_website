import React from "react";
import Link from "next/link";

interface NavLinkProps {
  href: string | null;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, onClick }) => {
  return (
    <div className="nav-item">
      <Link href={href ?? "#"} onClick={onClick}>
        <span className="nav-link hover-white">{label}</span>
      </Link>
    </div>
  );
};

export default NavLink;
