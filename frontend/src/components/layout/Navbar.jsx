import { NavLink } from "react-router-dom";

const navLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/shop", label: "المتجر" },
  { to: "/shop?cat=clothing", label: "التصنيفات" },
  { to: "/shipping", label: "الشحن والتسليم" },
  { to: "/payment", label: "طرق الدفع" },
  { to: "/about", label: "عن المتجر" },
  { to: "/contact", label: "تواصل معنا" },
];

export default function Navbar() {
  return (
    <nav className="nav">
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => (isActive ? "active" : "")}
          end={link.to === "/"}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
