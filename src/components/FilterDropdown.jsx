import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Button } from 'reactstrap';
import './FilterDropdown.css'; // Ensure this path is correct

const FilterDropdown = ({ title, options, selectedOptions, onOptionChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Add a search term state

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  const handleOptionChange = (option) => {
    onOptionChange(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
  };

  const handleOnlyOptionChange = (option) => {
    onOptionChange([option]); // Select only the clicked option, deselect all others
  };

  const sortedOptions = [...options].sort((a, b) => a.localeCompare(b));

  // Filter the options based on the search term
  const filteredOptions = sortedOptions.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="filter-dropdown">
      <DropdownToggle className="filter-button" caret>
        {title}
      </DropdownToggle>
      <DropdownMenu className="filter-dropdown-menu" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {/* Search Input */}
        <DropdownItem toggle={false} className="p-2">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            className="filter-search-input"
          />
        </DropdownItem>
        {/* Options */}
        {filteredOptions.map(option => (
          <DropdownItem key={option} toggle={false} className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Input
                type="checkbox"
                id={`filter-${option}`}
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionChange(option)}
                className="mr-2"
              />
              {option}
            </div>
            <Button
              color="link"
              size="sm"
              className="only-button"
              onClick={() => handleOnlyOptionChange(option)}
            >
              Only
            </Button>
          </DropdownItem>
        ))}
        {/* N/A Option */}
        <DropdownItem key="N/A" toggle={false} className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Input
              type="checkbox"
              id="filter-N/A"
              checked={selectedOptions.includes('N/A')}
              onChange={() => handleOptionChange('N/A')}
              className="mr-2"
            />
            N/A
          </div>
          <Button
            color="link"
            size="sm"
            className="only-button"
            onClick={() => handleOnlyOptionChange('N/A')}
          >
            Only
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default FilterDropdown;
