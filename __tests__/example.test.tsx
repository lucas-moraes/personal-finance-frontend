import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

// Example component for testing
function HelloWorld({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

describe("Example Test Suite", () => {
  it("should render a greeting message", () => {
    render(<HelloWorld name="World" />);
    expect(screen.getByText("Hello, World!")).toBeInTheDocument();
  });

  it("should perform a simple calculation", () => {
    const sum = 2 + 2;
    expect(sum).toBe(4);
  });
});
