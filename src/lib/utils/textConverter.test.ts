import { describe, expect, it } from "vitest";
import { humanize, plainify, slugify, titleify } from "./textConverter";
import readingTime from "./readingTime";
import dateFormat from "./dateFormat";

describe("textConverter", () => {
  it("slugifies text", () => {
    expect(slugify("Hello Astro Blog")).toBe("hello-astro-blog");
  });

  it("humanizes text", () => {
    expect(humanize("hello_world")).toBe("Hello world");
  });

  it("titleifies text", () => {
    expect(titleify("hello-world")).toBe("Hello World");
  });

  it("plainifies markdown", () => {
    expect(plainify("**bold** &amp; text")).toContain("bold & text");
  });
});

describe("readingTime", () => {
  it("returns a readable estimate", () => {
    expect(readingTime("word ".repeat(300))).toMatch(/Min[s]? read$/);
  });
});

describe("dateFormat", () => {
  it("formats dates", () => {
    expect(dateFormat("2026-05-09")).toBe("09 May, 2026");
  });
});
