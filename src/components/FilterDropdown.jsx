import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input } from 'reactstrap';
import './FilterDropdown.css'; // Ensure this path is correct

const FilterDropdown = ({ title, options, selectedOptions, onOptionChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  const handleOptionChange = (option) => {
    if (option === 'N/A') {
      onOptionChange(prev => prev.includes('N/A') ? prev.filter(o => o !== 'N/A') : [...prev, 'N/A']);
    } else {
      onOptionChange(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
    }
  };

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="filter-dropdown">
      <DropdownToggle className="filter-button" caret>
        {title}
      </DropdownToggle>
      <DropdownMenu className="filter-dropdown-menu" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {options.map(option => (
          <DropdownItem key={option} toggle={false}>
            <Input
              type="checkbox"
              id={`filter-${option}`}
              checked={selectedOptions.includes(option)}
              onChange={() => handleOptionChange(option)}
              className="mr-2"
            />
            {option}
          </DropdownItem>
        ))}
        <DropdownItem key="N/A" toggle={false}>
          <Input
            type="checkbox"
            id="filter-N/A"
            checked={selectedOptions.includes('N/A')}
            onChange={() => handleOptionChange('N/A')}
            className="mr-2"
          />
          N/A
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default FilterDropdown;
