import { Link } from "react-router-dom";

const menuLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/shop", label: "المتجر" },
  { to: "/shop?cat=clothing", label: "التصنيفات" },
  { to: "/shipping", label: "الشحن والتسليم" },
  { to: "/payment", label: "طرق الدفع" },
  { to: "/about", label: "عن المتجر" },
  { to: "/contact", label: "تواصل معنا" },
];

export default function MobileMenu({ open, onClose }) {
  return (
    <div className={`mobile-menu ${open ? "open" : ""}`}>
      {menuLinks.map((link) => (
        <Link key={link.to} to={link.to} onClick={onClose}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}
