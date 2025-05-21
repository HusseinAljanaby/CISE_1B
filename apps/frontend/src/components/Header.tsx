import React from "react";
import headerStyles from "@/styles/Header.module.scss";

interface HeaderProps {
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  return (
    <div className={headerStyles.header}>
      SPEED
      <ul className={headerStyles.navList}>
        <li className={currentPage === "submit" ? headerStyles.current : ""}>
          <a href="submit">Submit</a>
        </li>
        <li className={currentPage === "search" ? headerStyles.current : ""}>
          <a href="search">Search</a>
        </li>
      </ul>
    </div>
  );
};

export default Header;