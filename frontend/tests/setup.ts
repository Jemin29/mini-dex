import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

Object.defineProperty(window, "location", {
  value: {
    origin: "http://localhost",
    href: "http://localhost/"
  },
  writable: true
});

afterEach(() => {
  cleanup();
});
