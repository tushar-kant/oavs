import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import FilterDropdown from './FilterDropdown';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Header from './Header';
import Loading from './Loading'; // Import the Loading component

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BoardResultOverall = () => {
  const [overallResults, setOverallResults] = useState([]);
  const [subjectResults, setSubjectResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null); // New state for selected subject

  useEffect(() => {
    const fetchOverallResults = async () => {
      try {
        const response = await fetch('http://localhost:3000/school/board-results-be1');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setOverallResults(data);
        const uniqueSessions = [...new Set(data.map(item => item.session))];
        setSessions(uniqueSessions);
        setSelectedSessions(uniqueSessions);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchSubjectResults = async () => {
      try {
        const response = await fetch('http://localhost:3000/school/board-results-be2');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setSubjectResults(data);
      } catch (error) {
        setError(error.message);
      }
    };

    Promise.all([fetchOverallResults(), fetchSubjectResults()])
      .then(() => setLoading(false))
      .catch(error => setError(error.message));
  }, []);

  const handleBarClick = (chartElement) => {
    if (chartElement.length > 0) {
      const index = chartElement[0].index;
      const label = chartDataStacked1.labels[index]; // Get the session label clicked
      setSelectedSessions([label]); // Set selected session to clicked session
    }
  };

  const handleSubjectClick = (chartElement) => {
    if (chartElement.length > 0) {
      const index = chartElement[0].index;
      const subject = chartDataGrouped.labels[index]; // Get the subject label clicked
      setSelectedSubject(subject); // Set the selected subject to clicked subject
    }
  };

  const filteredOverallResults = selectedSessions.length > 0
    ? overallResults.filter(result => selectedSessions.includes(result.session))
    : overallResults;

  const filteredSubjectResults = selectedSubject
    ? subjectResults.filter(result => result.subject === selectedSubject)
    : subjectResults;

  const chartDataStacked1 = {
    labels: filteredOverallResults.map(result => result.session),
    datasets: [
      { label: 'Above 95%', data: filteredOverallResults.map(result => result.percentage_of_above95), backgroundColor: '#4caf50' },
      { label: 'Above 90%', data: filteredOverallResults.map(result => result.percentage_of_above90), backgroundColor: '#ffeb3b' },
      { label: 'Above 75%', data: filteredOverallResults.map(result => result.percentage_of_above75), backgroundColor: '#f57c00' },
      { label: 'Above 60%', data: filteredOverallResults.map(result => result.percentage_of_above60), backgroundColor: '#f44336' }
    ]
  };

  const chartDataStacked2 = {
    labels: filteredOverallResults.map(result => result.session),
    datasets: [
      { label: 'Pass Percentage', data: filteredOverallResults.map(result => result.pass_percentage), backgroundColor: '#8bc34a' },
      { label: 'Fail Percentage', data: filteredOverallResults.map(result => result.fail_percentage), backgroundColor: '#f44336' },
      { label: 'Compartmental Percentage', data: filteredOverallResults.map(result => result.compartmental_percentage), backgroundColor: '#ff9800' }
    ]
  };

  const subjects = [...new Set(filteredSubjectResults.map(result => result.subject))];
  const chartDataGrouped = {
    labels: subjects,
    datasets: selectedSessions.map(session => ({
      label: session,
      data: subjects.map(subject => {
        const result = filteredSubjectResults.find(r => r.session === session && r.subject === subject);
        return result ? result.state_average : 0;
      }),
      backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16)
    }))
  };

  if (loading) return <Loading />; // Use custom loading component
  if (error) return <p className="text-danger text-center">Error: {error}</p>;

  return (
    <div className="container border">
      <Header />
      <div className="row">
        <div className="col-8 ">
          <h1 className="my-4">OAVS(Overall Board Result)</h1>
        </div>
        <div className="col-4 text-center pt-4">
          <h4 className="text-left mb-0">Total Records: {filteredOverallResults.length}</h4>
        </div>
      </div>
      <hr />
      <Row className="my-3">
        <Col md={9} className="text-left"></Col>
        <Col md={3} className="text-right">
          <FilterDropdown
            title="Select Sessions"
            options={sessions}
            selectedOptions={selectedSessions}
            onOptionChange={setSelectedSessions}
          />
        </Col>
      </Row>

      <Row className="my-3">
        <Col md={6}>
          <Card className="mb-3">
            <CardHeader style={{ backgroundColor: '#255554', color: 'white' }}>
              Subject Results
            </CardHeader>
            <CardBody style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>No. of Students Secured 100</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjectResults.map(result => (
                    <tr key={`${result.session}-${result.subject}`}>
                      <td>{result.subject}</td>
                      <td>{result.no_of_stdsecured_100}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-3">
            <CardHeader style={{ backgroundColor: '#299954', color: 'white' }}>
              State Average
            </CardHeader>
            <CardBody style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>State Average</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjectResults.map(result => (
                    <tr key={`${result.session}-${result.subject}`}>
                      <td>{result.subject}</td>
                      <td>{result.state_average}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="my-3">
        <Col md={12} className="text-left">
          <h5>Total Subject Records: {filteredSubjectResults.length}</h5>
        </Col>
      </Row>

      <Row className="my-4">
        <Col md={6}>
          <Card>
            <CardHeader style={{ backgroundColor: '#888854', color: 'white' }}>
              Stacked Bar Chart - Percentage Categories
            </CardHeader>
            <CardBody>
              <Bar
                data={chartDataStacked1}
                options={{
                  responsive: true,
                  plugins: {
                    datalabels: {
                      anchor: 'end',
                      align: 'start',
                      formatter: (value) => `${value.toFixed(2)}%`, // Format the label as percentage
                      color: 'white',
                    },
                  },
                  onClick: (event, chartElement) => handleBarClick(chartElement) // Add click handler
                }}
              />
            </CardBody>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <CardHeader style={{ backgroundColor: '#334754', color: 'white' }}>
              Stacked Bar Chart - Pass, Fail, Compartmental
            </CardHeader>
            <CardBody>
              <Bar
                data={chartDataStacked2}
                options={{
                  responsive: true,
                  plugins: {
                    datalabels: {
                      anchor: 'end',
                      align: 'start',
                      formatter: (value) => `${value.toFixed(2)}%`, // Format the label as percentage
                      color: 'white',
                    },
                  },
                  onClick: (event, chartElement) => handleBarClick(chartElement) // Add click handler
                }}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="my-4">
        <Col md={12}>
          <Card>
            <CardHeader style={{ backgroundColor: '#158f8f', color: 'white' }}>
              State Average by Subject
            </CardHeader>
            <CardBody>
              <Bar
                data={chartDataGrouped}
                options={{
                  responsive: true,
                  plugins: {
                    datalabels: {
                      anchor: 'end',
                      align: 'start',
                      formatter: (value) => `${value.toFixed(2)}%`, // Format the label as percentage
                      color: 'white',
                    },
                  },
                  onClick: (event, chartElement) => handleSubjectClick(chartElement) // Add click handler
                }}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BoardResultOverall;
