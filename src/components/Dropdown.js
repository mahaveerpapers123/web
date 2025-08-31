"use client";
import Link from "next/link";
import React, { useState } from "react";

const ArrowDown = ({ open }) => (
  <svg
    className={`fill-current ease-in-out duration-200 ${open ? "rotate-180" : ""}`}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.0001 7.8248L10.2426 3.5823L11.1854 4.5251L6.0001 9.7104L0.814786 4.5251L1.75759 3.5823L6.0001 7.8248Z" />
  </svg>
);

const ArrowRight = () => (
  <svg
    className="fill-current"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3.5823 1.75759L7.8248 6.0001L3.5823 10.2426L2.63949 9.3L6.93949 6.0001L2.63949 2.7001L3.5823 1.75759Z" />
  </svg>
);

const Dropdown = ({ menuItem, stickyMenu }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const renderNode = (node) => {
    const hasChildren = Array.isArray(node.submenu) && node.submenu.length > 0;
    return (
      <li key={node.slugKey || node.title} className="relative group">
        <Link
          href={`/shopping?category=${node.path}`}
          className="flex items-center justify-between rounded px-3.5 py-2 text-sm font-medium text-dark hover:bg-gray-100 hover:text-blue"
        >
          {node.title}
          {hasChildren && <ArrowRight />}
        </Link>
        {hasChildren && (
          <ul className="absolute left-full top-0 z-20 min-w-[220px] rounded-md bg-white p-3 shadow-lg opacity-0 invisible transition-all duration-300 group-hover:opacity-100 group-hover:visible">
            {node.submenu.map((child) => renderNode(child))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <li
      className="group relative"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <a
        href={menuItem.path}
        className={`hover:text-blue text-custom-sm font-medium text-dark flex items-center justify-between gap-2.5 ${
          stickyMenu ? "xl:py-4" : "xl:py-6"
        }`}
        onClick={(e) => {
          if (menuItem.submenu) e.preventDefault();
        }}
      >
        {menuItem.title}
        {menuItem.submenu && <ArrowDown open={dropdownOpen} />}
      </a>

      {menuItem.submenu && (
        <ul
          className={`absolute left-0 top-full z-10 min-w-[220px] rounded-md bg-white p-3 shadow-lg transition-all duration-300 ${
            dropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          {menuItem.submenu.map((sub) => renderNode(sub))}
        </ul>
      )}
    </li>
  );
};

export default Dropdown;
