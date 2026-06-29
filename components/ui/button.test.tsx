import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./button";

describe("Button Primitives", () => {
  it("renders children successfully", () => {
    const { getByRole } = render(<Button>Click me</Button>);
    expect(getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("handles loading states correctly", () => {
    const { getByRole } = render(<Button isLoading>Submit</Button>);
    const button = getByRole("button");
    expect(button).toBeDisabled();
    expect(button.querySelector("svg")).toBeInTheDocument();
  });
});
