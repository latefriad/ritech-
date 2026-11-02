import { NavLink } from "react-router-dom";

const navLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/shop", label: "جميع المنتجات" },
  { to: "/shop?cat=phones", label: "هواتف ذكية" },
  { to: "/shop?cat=phone-accessories", label: "إكسسوارات الهواتف" },
  { to: "/shop?cat=computers", label: "حواسيب ولابتوب" },
  { to: "/shop?cat=pc-accessories", label: "ملحقات الكمبيوتر" },
  { to: "/shipping", label: "الشحن والتسليم" },
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
