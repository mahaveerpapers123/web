"use client";
import React, { useState } from "react";

type MenuItem = {
  title: string;
  path: string;
  type?: "category" | "collection" | "product";
  slugKey?: string;
  submenu?: MenuItem[];
};

type Props = {
  menuItem: MenuItem;
  stickyMenu: boolean;
  onNavigate: (itemOrPath: MenuItem | string) => void;
};

const Dropdown: React.FC<Props> = ({ menuItem, stickyMenu, onNavigate }) => {
  const [open, setOpen] = useState(false);

  const children = menuItem.submenu || [];

  return (
    <li
      className="group relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={`hover:text-blue text-custom-sm font-medium text-dark flex items-center ${
          stickyMenu ? "xl:py-4" : "xl:py-6"
        }`}
        onClick={() => {
          // if parent is itself navigable, you can choose to navigate here too:
          // onNavigate(menuItem);
        }}
      >
        {menuItem.title}
        <svg
          className="ml-1 w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && children.length > 0 && (
        <ul className="absolute left-0 top-full mt-2 bg-white border border-gray-3 rounded-md shadow-lg min-w-[220px] z-50">
          {children.map((child, idx) => (
            <li key={idx}>
              <button
                onClick={() => onNavigate(child)} // pass the whole child object
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                {child.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Dropdown;
