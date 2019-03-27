import { expect } from "chai";

import { isLevelAllowed } from "./utils";

describe("isLevelAllowed", () => {
  it("should return correct boolean", () => {
    process.env.NF_LOG_LEVEL = "verbose";

    // level with higher priority
    expect(isLevelAllowed("fatal")).to.be.true;

    // the same priority
    expect(isLevelAllowed("verbose")).to.be.true;

    // level with lower priority
    expect(isLevelAllowed("info")).to.be.false;
  });

  it("should return correct value when flag was not defined", () => {
    delete process.env.NF_LOG_LEVEL;

    expect(isLevelAllowed("fatal")).to.be.true;
    expect(isLevelAllowed("info")).to.be.true;
  });
});
