import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import FilterDropdown from './FilterDropdown'; // Import the FilterDropdown component
import Header from './Header';
import Loading from './Loading'; // Import the Loading component
import { Bar } from 'react-chartjs-2'; // Import Bar chart from Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,ChartDataLabels);

const SchoolScorecard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null); // State for selected indicator
  const [selectedDistrict, setSelectedDistrict] = useState(null); // State for selected district

  useEffect(() => {
    const fetchSchoolScores = async () => {
      try {
        const response = await fetch('http://localhost:3000/school/school-scores');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setScores(data);

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category_name))];
        setCategories(uniqueCategories);
        setSelectedCategories(uniqueCategories); // Set all categories as selected by default
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolScores();
  }, []);

  // Filter scores based on selected categories, indicator, and district
  const filteredScores = scores.filter(score => {
    const categoryMatch = selectedCategories.includes(score.category_name);
    const indicatorMatch = selectedIndicator ? score.indicator_name === selectedIndicator : true;
    const districtMatch = selectedDistrict ? score.dist_name === selectedDistrict : true;
    return categoryMatch && indicatorMatch && districtMatch;
  });

  // Calculate indicator values based on filtered scores
  const indicatorValues = filteredScores.reduce((acc, item) => {
    acc[item.indicator_name] = item.value; // Assuming value is the percentage
    return acc;
  }, {});

  // Calculate district values based on filtered scores
  const districtValues = filteredScores.reduce((acc, item) => {
    acc[item.dist_name] = item.value; // Assuming value is the percentage
    return acc;
  }, {});

  // Calculate block and school values based on filtered scores
  const blockSchoolValues = filteredScores.reduce((acc, item) => {
    const key = `${item.block_name}-${item.school_name}`; // Create a unique key for each block and school combination
    if (!acc[key]) {
      acc[key] = { block_name: item.block_name, school_name: item.school_name, value: item.value };
    }
    return acc;
  }, {});

  if (loading) return <Loading />; // Use custom loading component
  if (error) return <p>Error: {error}</p>;

  // Chart data for indicators
  const indicatorChartData = {
    labels: Object.keys(indicatorValues),
    datasets: [
      {
        label: 'Indicator Values',
        data: Object.values(indicatorValues),
        backgroundColor: '#297899', // Change color as needed
      },
    ],
  };

  // Chart options with drill-down functionality for indicators
  const indicatorChartOptions = {
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'start',
        color: 'white',
      },
    },
    
    indexAxis: 'y', // This makes the bar chart horizontal
    
    scales: {
      x: {
        beginAtZero: true, // Start the scale at zero
      },
    },
    
  
    
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const clickedIndicator = indicatorChartData.labels[index];
        setSelectedIndicator(clickedIndicator); // Set the selected indicator
      }
    },
  };

  // Chart data for districts
  const districtChartData = {
    labels: Object.keys(districtValues),
    datasets: [
      {
        label: 'District Values',
        data: Object.values(districtValues),
        backgroundColor: '#297664', // Change color as needed
      },
    ],
  };

  // Chart options with drill-down functionality for districts
  const districtChartOptions = {
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'start',
        color: 'white',
      },
    },
    indexAxis: 'y', // This makes the bar chart horizontal
    scales: {
      x: {
        beginAtZero: true, // Start the scale at zero
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const clickedDistrict = districtChartData.labels[index];
        setSelectedDistrict(clickedDistrict); // Set the selected district
      }
    },
  };

  return (
    <div className="container border">
      <Header />
      <div className="row">
        <div className="col-8">
          <h1 className="my-4">OAVS (KPI School Scorecard Analysis)</h1>
        </div>
        <div className="col-4 text-center pt-4">
          <h4 className="text-left mb-0">Total Records: {filteredScores.length}</h4>
        </div>
      </div>
      <hr />
      <Row className="mb-4">
        <Col md={8}>
        </Col>

        <Col md={4}>
          <FilterDropdown
            title="Select Categories"
            options={categories}
            selectedOptions={selectedCategories}
            onOptionChange={setSelectedCategories}
          />
        </Col>
      </Row>

      {/* Indicators Section with Chart */}
      <Row className="my-4">
        <Col md={6}>
          <Card>
            <CardHeader style={{ backgroundColor: '#297899', color: 'white' }}>
              Indicators
            </CardHeader>
            <CardBody>
              <Bar data={indicatorChartData} options={indicatorChartOptions} height={400} /> {/* Set height */}
            </CardBody>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <CardHeader style={{ backgroundColor: '#297664', color: 'white' }}>
              Districts
            </CardHeader>
            <CardBody>
              <Bar data={districtChartData} options={districtChartOptions} height={400} /> {/* Set height */}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Blocks and Schools Table with Vertical Scrolling */}
      <Card className="my-4">
        <CardHeader style={{ backgroundColor: '#295814', color: 'white' }}>
          Blocks and Schools
        </CardHeader>
        <CardBody style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Table bordered >
            <thead>
              <tr>
                <th>Block Name</th>
                <th>School Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(blockSchoolValues).map(({ block_name, school_name, value }, index) => (
                <tr key={index}>
                  <td>{block_name}</td>
                  <td>{school_name}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default SchoolScorecard;
