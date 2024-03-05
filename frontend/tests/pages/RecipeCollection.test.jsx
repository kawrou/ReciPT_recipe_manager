import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { RecipeCollection } from "../../src/pages/RecipeCollection/RecipeCollection";
import { getRecipes } from "../../src/services/getRecipes";
import { useNavigate } from "react-router-dom";
import { useFetchRecipes } from "../../src/hooks/useFetchRecipe";

// Mocking the getRecipes service
vi.mock("../../src/services/getRecipes", () => {
  const getRecipesMock = vi.fn();
  return { getRecipes: getRecipesMock };
});

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

vi.mock("../../src/hooks/useFetchRecipe");

const testToken = "testToken";

describe("Recipe collection - When token is present", () => {
  beforeEach(() => {
    window.localStorage.setItem("token", testToken);
  });

  afterEach(() => {
    window.localStorage.removeItem("token");
  });
  //Token handling for FETCH handled in useFetchRecipes hook
  test("renders collection and recipes from db", async () => {
    useFetchRecipes.mockReturnValue({
      recipes: [
        { _id: "12345", title: "Recipe 1", duration: "45" },
        { _id: "23456", title: "Recipe 2", duration: "60" },
      ],
      loading: false,
      error: null,
    });

    render(<RecipeCollection />);
    //Renders the elements
    expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
    expect(screen.getByTestId("searchBarDescription")).toBeVisible();
    expect(screen.getByPlaceholderText("Enter your recipe URL")).toBeVisible();
    expect(screen.getByText("Generate Recipe")).toBeVisible();
    expect(screen.getByText("Enter Manually")).toBeVisible();
    expect(screen.getByRole("heading", { level: 2 })).toBeVisible();

    //Checks that recipes received from the backend are rendered
    expect(useFetchRecipes).toHaveBeenCalledWith(testToken);
    expect(screen.getByText("Recipe 1, 45 mins")).toBeVisible();
    expect(screen.getByText("Recipe 2, 60 mins")).toBeVisible();
  });

  test("renders a message when recipes is undefined", async () => {
    useFetchRecipes.mockReturnValue({
      recipes: undefined,
      loading: false,
      error: null,
    });

    render(<RecipeCollection />);

    //Renders the elements
    expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
    expect(screen.getByTestId("searchBarDescription")).toBeVisible();
    expect(screen.getByPlaceholderText("Enter your recipe URL")).toBeVisible();
    expect(screen.getByText("Generate Recipe")).toBeVisible();
    expect(screen.getByText("Enter Manually")).toBeVisible();
    expect(screen.getByRole("heading", { level: 2 })).toBeVisible();

    expect(useFetchRecipes).toHaveBeenCalledWith(testToken);
    expect(screen.getByText("No recipes found")).toBeVisible();
  });

  test("renders a message when recipes is an empty array", async () => {
    useFetchRecipes.mockReturnValue({
      recipes: [],
      loading: false,
      error: null,
    });

    render(<RecipeCollection />);

    //Renders the elements
    expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
    expect(screen.getByTestId("searchBarDescription")).toBeVisible();
    expect(screen.getByPlaceholderText("Enter your recipe URL")).toBeVisible();
    expect(screen.getByText("Generate Recipe")).toBeVisible();
    expect(screen.getByText("Enter Manually")).toBeVisible();
    expect(screen.getByRole("heading", { level: 2 })).toBeVisible();

    expect(useFetchRecipes).toHaveBeenCalledWith(testToken);
    expect(screen.getByText("No recipes found")).toBeVisible();
  });

  test('renders a loading message when loading is true', async () => {
    useFetchRecipes.mockReturnValue({
      recipes: [],
      loading: true,
      error: null,
    });

    render(<RecipeCollection />);

    expect(useFetchRecipes).toHaveBeenCalledWith(testToken);
    expect(screen.getByText("Loading ...")).toBeVisible();
  })

  test('renders an error message when error is true', async () => {
    useFetchRecipes.mockReturnValue({
      recipes: [],
      loading: false,
      error: {message: "some error message"},
    });

    render(<RecipeCollection />);

    expect(useFetchRecipes).toHaveBeenCalledWith(testToken);
    expect(screen.getByText("Error: some error message")).toBeVisible();
  })

// Not sure the following 2 tests are good or really valid.
// Doesn't check if getRecipes was called with URL input
// Possibly ok to be covered by other tests and might change after merging main
  test("generate recipe btn navigates to recipe page", async () => {
    useFetchRecipes.mockReturnValue({
      recipes: [],
      loading: false,
      error: null,
    });

    render(<RecipeCollection />);
    const navigateMock = useNavigate();
    await userEvent.type(
      screen.getByPlaceholderText("Enter your recipe URL"),
      "test url"
    );
    await userEvent.click(screen.getByText("Generate Recipe"));
    expect(navigateMock).toHaveBeenCalledWith("/recipe");
  });

  test("enter Manually btn navigates to recipe page", async () => {
    useFetchRecipes.mockReturnValue({
      recipes: [],
      loading: false,
      error: null,
    });

    render(<RecipeCollection />);
    const navigateMock = useNavigate();
    await userEvent.click(screen.getByText("Enter Manually"));
    expect(navigateMock).toHaveBeenCalledWith("/recipe");
  });
});

// This test might not be valid as not sure at what point the user would be sent
// back to login. 
describe("Recipe collection - When no token is present", () => {
  test("It navigates to login if no token is present", async () => {
    useFetchRecipes.mockReturnValue({
      recipes: [],
      loading: false,
      error: null,
    });

    render(<RecipeCollection />);
    const navigateMock = useNavigate();
    await userEvent.click(screen.getByText("Generate Recipe"));
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});
