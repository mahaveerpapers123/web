// src/components/Header/Dropdown.tsx
"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation"; // <<< 1. Import useRouter

// <<< 2. Define types for props for better code quality >>>
interface MenuItem {
  title: string;
  path?: string;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  title: string;
  path: string;
  submenu?: SubMenuItem[];
}

interface DropdownProps {
  menuItem: MenuItem;
  stickyMenu: boolean;
}

const Dropdown = ({ menuItem, stickyMenu }: DropdownProps) => {
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  
  const pathUrl = usePathname();
  const router = useRouter(); // <<< 3. Initialize router

  const handleAccordionClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenAccordion(openAccordion === index ? null : index);
  };

  // <<< 4. Create a reusable navigation handler >>>
  const handleNavigation = (path: string) => {
    // path నుండి మొదటి '/' ను తీసివేయండి. ఉదా: "/stationery/pens" -> "stationery/pens"
    const categoryPath = path.startsWith('/') ? path.substring(1) : path;
    localStorage.setItem('searchQuery', categoryPath);
    router.push('/shopping');
  };

  return (
    <li
      onClick={() => setDropdownToggler(!dropdownToggler)}
      className={`group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full`}
    >
      <a
        href="#"
        onClick={(e) => e.preventDefault()} // Prevent default link behavior
        className={`hover:text-blue text-custom-sm font-medium text-dark flex items-center justify-between gap-1.5 capitalize xl:w-full ${
          stickyMenu ? "xl:py-4" : "xl:py-6"
        }`}
      >
        {menuItem.title}
        <svg
          className={`fill-current ease-in-out duration-200 ${dropdownToggler && "rotate-180"}`}
          width="16" height="16" viewBox="0 0 16 16"
        >
          <path d="M2.95363 5.67461C3.13334 5.46495 3.44899 5.44067 3.65866 5.62038L7.99993 9.34147L12.3412 5.62038C12.5509 5.44067 12.8665 5.46495 13.0462 5.67461C13.2259 5.88428 13.2017 6.19993 12.992 6.37964L8.32532 10.3796C8.13808 10.5401 7.86178 10.5401 7.67453 10.3796L3.00787 6.37964C2.7982 6.19993 2.77392 5.88428 2.95363 5.67461Z" />
        </svg>
      </a>

      <ul
        className={`dropdown ${dropdownToggler ? "flex" : ""} ${
            stickyMenu ? "xl:top-[90%]" : "xl:top-full"
        } xl:py-3 xl:px-2 xl:mt-[-35px] sm:mt-4`}
      >
        {menuItem.submenu?.map((item, index) => (
          <li key={index} className="w-full">
            {item.submenu ? (
              <>
                <button
                  onClick={(e) => handleAccordionClick(e, index)}
                  className={`flex items-center justify-between text-custom-sm hover:text-blue hover:bg-gray-1 py-[7px] px-4.5 rounded-md w-full`}
                >
                  {item.title}
                  <svg
                    className={`fill-current ease-in-out duration-200 ${openAccordion === index ? 'rotate-180' : 'rotate-0'}`}
                    width="12" height="12" viewBox="0 0 16 16"
                  >
                     <path d="M2.95363 5.67461C3.13334 5.46495 3.44899 5.44067 3.65866 5.62038L7.99993 9.34147L12.3412 5.62038C12.5509 5.44067 12.8665 5.46495 13.0462 5.67461C13.2259 5.88428 13.2017 6.19993 12.992 6.37964L8.32532 10.3796C8.13808 10.5401 7.86178 10.5401 7.67453 10.3796L3.00787 6.37964C2.7982 6.19993 2.77392 5.88428 2.95363 5.67461Z" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openAccordion === index ? "max-h-96" : "max-h-0"
                  }`}
                  style={item.submenu ? { border: "1px solid #e5e7eb", borderRadius: "8px" } : { border: "none" }}
                >
                  <ul className="pl-4 mt-1">
                    {item.submenu.map((nestedItem, nestedIndex) => (
                      <li key={nestedIndex}>
                        {/* <<< 5. Replace Link with a button that calls handleNavigation >>> */}
                        <button
                          onClick={() => handleNavigation(nestedItem.path)}
                          className={`w-full text-left flex text-custom-sm hover:text-blue hover:bg-gray-1 py-[7px] px-2.5 rounded-md`}
                        >
                          {nestedItem.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              // <<< 6. Replace Link with a button for non-submenu items as well >>>
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-full text-left flex text-custom-sm hover:text-blue hover:bg-gray-1 py-[7px] px-4.5 rounded-md`}
              >
                {item.title}
              </button>
            )}
          </li>
        ))}
      </ul>
    </li>
  );
};

export default Dropdown;