import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotFound } from "../../../src/components/not-found.component";

describe(NotFound.name, () => {
  it("should render", () => {
    const { container } = render(<NotFound />);
    expect(container).toBeDefined();
    expect(
      screen.getByText("Sorry, the page you visited does not exist.")
    ).toBeInTheDocument();
    expect(screen.getByText("404")).toBeInTheDocument();
  });
});
