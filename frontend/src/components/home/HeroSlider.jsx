import { useState, useEffect, useCallback } from "react";
import { useSettings } from "../../context/SettingsContext";

export default function HeroSlider() {
  const { settings } = useSettings();
  const slides = settings?.slides || [];
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((n) => {
    setCurrent(n);
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <section className="hero">
      <div
        className="slides"
        style={{ transform: `translateX(${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="slide"
            style={{
              background: slide.image
                ? `url(${slide.image}) center/cover`
                : slide.gradient,
            }}
          >
            {slide.image && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.35)",
                }}
              />
            )}
            <div className="slide-deco" />
            <div className="slide-content">
              <div className="slide-badge">{slide.badge}</div>
              <div className="slide-title">{slide.title}</div>
              <div className="slide-sub">{slide.subtitle}</div>
              <div className="slide-btns">
                <button className="btn-primary">{slide.btn1}</button>
                <button className="btn-outline">{slide.btn2}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-dots">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            className={`dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
