import { describe, expect, it } from "vitest";
import { addToIndex, removeFromIndex } from "@/lib/admin/job-store";

describe("addToIndex", () => {
  it("adds a new id to the list", () => {
    expect(addToIndex(["a", "b"], "c")).toEqual(["a", "b", "c"]);
  });

  it("does not duplicate an id already in the list", () => {
    expect(addToIndex(["a", "b"], "b")).toEqual(["a", "b"]);
  });

  it("adds to an empty list", () => {
    expect(addToIndex([], "a")).toEqual(["a"]);
  });
});

describe("removeFromIndex", () => {
  it("removes a matching id", () => {
    expect(removeFromIndex(["a", "b", "c"], "b")).toEqual(["a", "c"]);
  });

  it("is a no-op when the id isn't present", () => {
    expect(removeFromIndex(["a", "b"], "z")).toEqual(["a", "b"]);
  });

  it("returns an empty list when removing the only entry", () => {
    expect(removeFromIndex(["a"], "a")).toEqual([]);
  });
});
