"use client";

import { useState } from 'react';

export default function SkipButton({ onSkip }) {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={onSkip}
        className="matrix-button blue px-6 py-3 text-lg"
        aria-label="Skip Intro"
      >
        Skip
      </button>
    </div>
  );
}