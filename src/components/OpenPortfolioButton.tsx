'use client';

import React from 'react';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export function openPortfolioAndScroll() {
  // Scroll to element with offset
  requestAnimationFrame(() => {
    setTimeout(() => {
      const el = document.getElementById('portfolio-slider');
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 72; // offset for fixed bar
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 60);
  });
}

export function OpenPortfolioButton({ className, children }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => openPortfolioAndScroll()}
    >
      {children}
    </button>
  );
}
