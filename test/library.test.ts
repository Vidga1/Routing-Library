import { Router } from "../src/library";

describe("Router", () => {
  let router: Router;
  let mockOnEnter: jest.Mock;
  let mockOnLeave: jest.Mock;
  let mockOnBeforeEnter: jest.Mock;

  beforeEach(() => {
    router = new Router();
    mockOnEnter = jest.fn();
    mockOnLeave = jest.fn();
    mockOnBeforeEnter = jest.fn();

    router.addRoute({
      path: "/",
      onEnter: mockOnEnter,
      onLeave: mockOnLeave,
      onBeforeEnter: mockOnBeforeEnter,
    });
  });

  test("should call onBeforeEnter and onEnter when navigating to a route", () => {
    router.navigate("/");
    expect(mockOnBeforeEnter).toHaveBeenCalled();
    expect(mockOnEnter).toHaveBeenCalled();
  });

  test("should parse query parameters correctly", () => {
    router.navigate("/?param1=value1&param2=value2");
    expect(mockOnEnter).toHaveBeenCalledWith({
      param1: "value1",
      param2: "value2",
    });
  });

  test("should not call onEnter if navigating to the current path", () => {
    router.navigate("/");
    router.navigate("/");
    expect(mockOnEnter).toHaveBeenCalledTimes(1);
  });
  test("should handle string path correctly", () => {
    const path = "/";
    router.addRoute({ path, onEnter: mockOnEnter });
    router.navigate(path);
    expect(mockOnEnter).toHaveBeenCalled();
  });

  test("should handle RegExp path correctly", () => {
    const path = /^\/test$/;
    router.addRoute({ path, onEnter: mockOnEnter });
    router.navigate("/test");
    expect(mockOnEnter).toHaveBeenCalled();
  });

  test("should handle functional path correctly", () => {
    const path = (p: string) => p === "/functional";
    router.addRoute({ path, onEnter: mockOnEnter });
    router.navigate("/functional");
    expect(mockOnEnter).toHaveBeenCalled();
  });

  test("should not call onEnter for unmatched route", () => {
    router.navigate("/unmatched");
    expect(mockOnEnter).not.toHaveBeenCalled();
  });

  test("should handle popstate event correctly", () => {
    Object.defineProperty(window, "location", {
      value: { pathname: "/new" },
      writable: true,
    });
    router.addRoute({ path: "/new", onEnter: mockOnEnter });

    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(mockOnEnter).toHaveBeenCalled();
  });
});
