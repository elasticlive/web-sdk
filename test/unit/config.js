"use strict";
import assert from "assert";
import ELive from "../../src/ELive";

describe("config", () => {
  describe("create without config", () => {
    it("should return a config error", () => {
      try {
        const elive = new ELive();
      } catch (e) {
        console.log(JSON.stringify(e));
        assert.equal(e.code, "1200");
      }
      throw new Error("no config");
    });
  });
});
