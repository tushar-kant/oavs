import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Card, CardHeader, CardBody } from 'reactstrap';
import { Pie } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import PaginationComponent from './PaginationComponent'; // Import the PaginationComponent
import Header from './Header';
import FilterDropdown from './FilterDropdown';
import Loading from './Loading'; // Import the Loading component
ChartJS.register(Title, Tooltip, Legend, ArcElement);
const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const [dropdownOpen, setDropdownOpen] = useState({
    institute: false,
    session_name: false,
    student_status: false,
    distict_code: false,
  });
  const [instituteFilters, setInstituteFilters] = useState([]);
  const [sessionNameFilters, setSessionNameFilters] = useState([]);
  const [studentStatusFilters, setStudentStatusFilters] = useState([]);
  const [districtFilters, setDistrictFilters] = useState([]);

  const [selectedInstitute, setSelectedInstitute] = useState([]);
  const [selectedSessionName, setSelectedSessionName] = useState([]);
  const [selectedStudentStatus, setSelectedStudentStatus] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch('http://localhost:3000/student/student-details');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setStudents(data);
        // Extract unique values for filters
        setInstituteFilters([...new Set(data.map(item => item.institute).filter(Boolean))]);
        setSessionNameFilters([...new Set(data.map(item => item.session_name).filter(Boolean))]);
        setStudentStatusFilters([...new Set(data.map(item => item.student_status).filter(Boolean))]);
        setDistrictFilters([...new Set(data.map(item => item.distict_code).filter(Boolean))]);
        // Set all filter values as selected initially
        setSelectedInstitute([...new Set(data.map(item => item.institute).filter(Boolean))]);
        setSelectedSessionName([...new Set(data.map(item => item.session_name).filter(Boolean))]);
        setSelectedStudentStatus([...new Set(data.map(item => item.student_status).filter(Boolean))]);
        setSelectedDistrict([...new Set(data.map(item => item.distict_code).filter(Boolean))]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);
  const toggleDropdown = (type) => {
    setDropdownOpen(prevState => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };
  const handleCheckboxChange = (type, value) => {
    setSelectedFilters(prevFilters => {
      const currentFilters = prevFilters[type];
      if (currentFilters.includes(value)) {
        return {
          ...prevFilters,
          [type]: currentFilters.filter(v => v !== value),
        };
      } else {
        return {
          ...prevFilters,
          [type]: [...currentFilters, value],
        };
      }
    });
  };
  const paginateData = (data) => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  };
  const filteredStudents = students.filter(student => {
    return (
      (!selectedInstitute.length || selectedInstitute.includes(student.institute)) &&
      (!selectedStudentStatus.length || selectedStudentStatus.includes(student.student_status)) &&
      (!selectedSessionName.length || selectedSessionName.includes(student.session_name)) &&
      (!selectedDistrict.length || selectedDistrict.includes(student.distict_code))
    );
  });
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  if (loading) return <Loading />; // Use custom loading component
  if (error) return <p>Error: {error}</p>;
  const getCategoryCounts = (category) =>
    filteredStudents.reduce((acc, student) => {
      const value = student[category] || 'Unknown';
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  const generateRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);
  const genderPieData = {
    labels: Object.keys(getCategoryCounts('gender')),
    datasets: [{
      data: Object.values(getCategoryCounts('gender')),
      backgroundColor: Array.from({ length: 3 }, generateRandomColor), // Generate 3 random colors
    }],
  };
  const category1PieData = {
    labels: Object.keys(getCategoryCounts('category_1')),
    datasets: [{
      data: Object.values(getCategoryCounts('category_1')),
      backgroundColor: Array.from({ length: 3 }, generateRandomColor), // Generate 3 random colors
    }],
  };

  const category2PieData = {
    labels: Object.keys(getCategoryCounts('category_2')),
    datasets: [{
      data: Object.values(getCategoryCounts('category_2')),
      backgroundColor: ['#FF6F61', '#6B8E23', '#FFD700', '#48D1CC', '#BA55D3'], // Coral, olive green, gold, medium turquoise, orchid
    }],
  };
  const phaseCounts = getCategoryCounts('phase');
  const phaseTableRows = Object.entries(phaseCounts).map(([phase, count]) => (
    <tr key={phase}>
      <td>{phase}</td>
      <td>{count}</td>
    </tr>
  ));
  const instituteCounts = filteredStudents.reduce((acc, student) => {
    const key = `${student.institute}_${student.institute_code}`;
    if (!acc[key]) {
      acc[key] = { institute: student.institute, institute_code: student.institute_code, count: 0 };
    }
    acc[key].count += 1;
    return acc;
  }, {});

  // const instituteTableRows = paginateData(Object.values(instituteCounts)).map(({ institute, institute_code, count }) => (
  //   <tr key={institute_code}>
  //     <td>{institute}</td>
  //     <td>{institute_code}</td>
  //     <td>{count}</td>
  //   </tr>
  // ));

  const instituteTableRows = Object.values(instituteCounts).map(({ institute, institute_code, count }) => (
    <tr key={institute_code}>
      <td>{institute}</td>
      <td>{institute_code}</td>
      <td>{count}</td>
    </tr>
  ));

  const totalPages = Math.ceil(Object.values(instituteCounts).length / itemsPerPage);

  return (
    <div className="container border">
      <Header />
      <Row className="align-items-center mb-4 p-1">
        <Col md={6}>
          <h1 className="">OAVS (Student Overview Dashboard)</h1>
        </Col>
        <Col md={3}></Col>
        <Col md={3}>
          <h4 className="text-left mb-0">Total Records: {filteredStudents.length}</h4>
        </Col>
      </Row><hr />
      <Row className="mb-4 align-items-center">
        <Col md={12}>
          <div className="dropdown-filters d-flex justify-content-end">
            <FilterDropdown
              title="Institute"
              options={instituteFilters}

              selectedOptions={selectedInstitute}
              onOptionChange={setSelectedInstitute}
            />
            <FilterDropdown
              title="Session Name"
              options={sessionNameFilters}
              selectedOptions={selectedSessionName}
              onOptionChange={setSelectedSessionName}
            />
            <FilterDropdown
              title="Student Status"
              options={studentStatusFilters}
              selectedOptions={selectedStudentStatus}
              onOptionChange={setSelectedStudentStatus}
            />
            <FilterDropdown
              title="District Code"
              options={districtFilters}
              selectedOptions={selectedDistrict}
              onOptionChange={setSelectedDistrict}
            />
          </div>
        </Col>
      </Row><hr />
      <Row className="mb-4">
  <Col md={8}>
    <Row>
      <Col md={6}>
        <Card>
          <CardHeader style={{ backgroundColor: '#20c997', color: 'white' }}>
            Gender Distribution
          </CardHeader>
          <CardBody>
            <Pie data={genderPieData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </CardBody>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <CardHeader style={{ backgroundColor: '#498754', color: 'white' }}>
            Category 1 Distribution
          </CardHeader>
          <CardBody>
            <Pie data={category1PieData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </CardBody>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col md={6}>
        <Card>
          <CardHeader style={{ backgroundColor: '#6610f2', color: 'white' }}>
            Category 2 Distribution
          </CardHeader>
          <CardBody>
            <Pie data={category2PieData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </CardBody>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <CardHeader style={{ backgroundColor: '#788754', color: 'white' }}>
            Phase-wise Student Count
          </CardHeader>
          <CardBody>
            <Table bordered>
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>{phaseTableRows}</tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Col>
  <Col md={4}>
    <Card>
      <CardHeader style={{ backgroundColor: '#978754', color: 'white' }}>
        Institute-wise Student Count
      </CardHeader>
      <CardBody>
        <div className="table-responsive" style={{ maxHeight: '750px', overflowY: 'auto' }}>
          <Table bordered>
            <thead>
              <tr>
                <th>Institute</th>
                <th>Institute Code</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>{instituteTableRows}</tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  </Col>
</Row>

    </div>
  );
};
export default StudentTable;
