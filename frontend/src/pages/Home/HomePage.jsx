import React from "react";
import RecipeScraper from "../../components/RecipeScraper";  
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="HomePage">
      <h1 className="text-5xl font-bold underline">Welcome to the Recipe Scraper App</h1>
      <RecipeScraper />
    </div>
  );
};

export default HomePage;
