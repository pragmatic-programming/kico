import {Identity, System} from "../../src";

test("clone", () => {
    // given
    const original = new System("system", [{processor: Identity}]);
    // when
    const clone = original.clone();
    // then
    expect(clone).toEqual(original);
});
