import React, { useState, useEffect } from 'react';
import { useFetchData } from '../hooks/useFetchData';
import { Table, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import Header from './Header';
import FilterDropdown from './FilterDropdown'; // Import the FilterDropdown component
import Loading from './Loading'; // Import the Loading component

const SchoolTable = () => {
  const { data, loading, error } = useFetchData('http://localhost:3000/school/school-details');
  const [filter, setFilter] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [hasDistricts, setHasDistricts] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState(''); // State to store the selected phase

  useEffect(() => {
    if (data) {
      const uniqueDistricts = [...new Set(data.map(item => item.district).filter(Boolean))];
      setDistricts(uniqueDistricts);
      setHasDistricts(uniqueDistricts.length > 0);
      setFilter(uniqueDistricts.length > 0 ? [...uniqueDistricts, 'N/A'] : ['N/A']);
    }
  }, [data]);

  if (loading) return <Loading />; // Use custom loading component
  if (error) return <p>Error: {error.message}</p>;

  const filteredData = data.filter(item => {
    const districtFilterMatch = filter.length === 0 || (filter.includes('N/A') ? !item.district || filter.includes(item.district) : filter.includes(item.district));
    const phaseFilterMatch = selectedPhase === '' || item.phase === selectedPhase; // Filter by selected phase
    return districtFilterMatch && phaseFilterMatch;
  })
  

  // Phase counts for the second table
  const phaseCounts = data.reduce((acc, { phase }) => {
    acc[phase] = (acc[phase] || 0) + 1;
    return acc;
  }, {});

  
  // Handle phase click to set selected phase and filter data
  const handlePhaseClick = (phase) => {
    setSelectedPhase(prevPhase => (prevPhase === phase ? '' : phase)); // Toggle phase selection
  };

  return (
    <div className="container border mt-4">
      <Header />
      <div className="row">
        <div className="col-8">
          <h1 className="my-4">OAVS (School Overview)</h1>
        </div>
        <div className="col-4 text-center pt-4">
          <h5>Total Reports: {filteredData.length}</h5>
        </div>
      </div>
      <hr />

      <Row className="mb-3 align-items-center justify-content-between">
        <Col md={4} className="text-left"></Col>
        <Col md={4} className="text-right">
          {hasDistricts && (
            <FilterDropdown
              title="Filter by District"
              options={districts}
              selectedOptions={filter}
              onOptionChange={setFilter}
            />
          )}
        </Col>
      </Row>

      {/* Selected Data Table and Phase-wise Count Table Side by Side */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <CardHeader style={{ backgroundColor: '#297854', color: 'white' }}>
              <h4 className="mb-0">Selected Data</h4>
            </CardHeader>
            <CardBody>
              <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <Table striped bordered className="data-table">
                  <thead className="thead-dark">
                    <tr>
                      <th>Vidyalaya Name</th>
                      <th>District</th>
                      <th>Principal Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.vidyalaya_name}</td>
                        <td>{item.district || 'N/A'}</td>
                        <td>{item.principal_type}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <CardHeader style={{ backgroundColor: '#897854', color: 'white' }}>
              <h4 className="mb-0">Phase-wise Vidyalaya Count</h4>
            </CardHeader>
            <CardBody>
              <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <Table striped bordered className="data-table">
                  <thead className="thead-dark">
                    <tr>
                      <th>Phase</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(phaseCounts).map(([phase, count], index) => (
                      <tr
                        key={index}
                        style={{ cursor: 'pointer', backgroundColor: selectedPhase === phase ? '#c8e6c9' : '' }}
                        onClick={() => handlePhaseClick(phase)}
                      >
                        <td>{phase}</td>
                        <td>{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* All Data Table */}
      <Card className="shadow-sm">
        <CardHeader style={{ backgroundColor: '#597854', color: 'white' }}>
          <h4 className="mb-0">All Data</h4>
        </CardHeader>
        <CardBody>
          <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <Table striped bordered className="data-table">
              <thead className="thead-dark">
                <tr>
                  <th>Vidyalaya Name</th>
                  <th>Establishment Year</th>
                  <th>Land Type</th>
                  <th>Location Type</th>
                  <th>Building Type</th>
                  <th>Lowest Class</th>
                  <th>Highest Class</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.vidyalaya_name}</td>
                    <td>{item.establishment_year}</td>
                    <td>{item.land_type}</td>
                    <td>{item.location_type}</td>
                    <td>{item.building_type}</td>
                    <td>{item.lowest_class}</td>
                    <td>{item.highest_class}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SchoolTable;
