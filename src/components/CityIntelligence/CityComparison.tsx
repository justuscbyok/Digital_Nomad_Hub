import React, { useState } from 'react';
import { City } from '../../types';
import { BarChart3, ThermometerSun, Wifi, Heart, Users, Clock, Globe2, DollarSign } from 'lucide-react';
import { Bar, Radar, Line, PolarArea, Doughnut } from 'react-chartjs-2';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { format } from 'date-fns';
import 'react-circular-progressbar/dist/styles.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface CityComparisonProps {
  selectedCities: City[];
  onCitySelect: (city: City) => void;
}

type MetricType = 'cost' | 'climate' | 'infrastructure' | 'quality' | 'community' | 'economic' | 'timezone' | 'visa';

export default function CityComparison({ selectedCities, onCitySelect }: CityComparisonProps) {
  const [activeMetric, setActiveMetric] = useState<MetricType>('cost');

  const metrics = [
    { id: 'cost', icon: DollarSign, label: 'Cost Analysis' },
    { id: 'climate', icon: ThermometerSun, label: 'Climate' },
    { id: 'infrastructure', icon: Wifi, label: 'Infrastructure' },
    { id: 'quality', icon: Heart, label: 'Quality of Life' },
    { id: 'community', icon: Users, label: 'Digital Nomad' },
    { id: 'economic', icon: BarChart3, label: 'Economic' },
    { id: 'timezone', icon: Clock, label: 'Time Zone' },
    { id: 'visa', icon: Globe2, label: 'Visa Info' },
  ];

  const renderMetricDashboard = () => {
    switch (activeMetric) {
      case 'quality':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Quality of Life Overview</h3>
              <Radar
                data={{
                  labels: ['Healthcare', 'Safety', 'Air Quality', 'Education', 'Recreation'],
                  datasets: selectedCities.map(city => ({
                    label: city.name,
                    data: [
                      city.metrics.qualityOfLife.healthcareIndex,
                      city.metrics.qualityOfLife.safetyIndex,
                      100 - city.metrics.qualityOfLife.pollutionIndex,
                      75, // Example education score
                      80, // Example recreation score
                    ],
                    backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
                    borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                  }))
                }}
                options={{
                  scales: {
                    r: { beginAtZero: true, max: 100 }
                  }
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Healthcare & Safety Comparison</h3>
              <Bar
                data={{
                  labels: selectedCities.map(city => city.name),
                  datasets: [
                    {
                      label: 'Healthcare Index',
                      data: selectedCities.map(city => city.metrics.qualityOfLife.healthcareIndex),
                      backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    },
                    {
                      label: 'Safety Index',
                      data: selectedCities.map(city => city.metrics.qualityOfLife.safetyIndex),
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    }
                  ]
                }}
                options={{
                  scales: {
                    y: { beginAtZero: true, max: 100 }
                  }
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Environmental Quality</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedCities.map(city => (
                  <div key={city.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{city.name}</h4>
                    <div style={{ width: 120, height: 120 }} className="mx-auto">
                      <CircularProgressbar
                        value={100 - city.metrics.qualityOfLife.pollutionIndex}
                        text={`${100 - city.metrics.qualityOfLife.pollutionIndex}%`}
                        styles={buildStyles({
                          pathColor: `rgba(82, 196, 26, ${(100 - city.metrics.qualityOfLife.pollutionIndex) / 100})`,
                          textColor: '#333',
                        })}
                      />
                    </div>
                    <p className="text-center mt-2 text-sm text-gray-600">Air Quality Score</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'community':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Digital Nomad Community Size</h3>
              <Bar
                data={{
                  labels: selectedCities.map(city => city.name),
                  datasets: [{
                    label: 'Number of Digital Nomads',
                    data: selectedCities.map(city => city.metrics.digitalNomad.communitySize),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  }]
                }}
                options={{
                  indexAxis: 'y',
                  plugins: {
                    title: { display: true, text: 'Estimated Digital Nomad Population' }
                  }
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Monthly Meetups</h3>
              <Doughnut
                data={{
                  labels: selectedCities.map(city => city.name),
                  datasets: [{
                    data: selectedCities.map(city => city.metrics.digitalNomad.monthlyMeetups),
                    backgroundColor: selectedCities.map(() => 
                      `hsla(${Math.random() * 360}, 70%, 50%, 0.6)`
                    )
                  }]
                }}
                options={{
                  plugins: {
                    title: { display: true, text: 'Average Monthly Meetups' }
                  }
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Visa Requirements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedCities.map(city => (
                  <div key={city.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{city.name}</h4>
                    <p className="text-sm text-gray-600">{city.metrics.digitalNomad.visaRequirements}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'economic':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Economic Indicators</h3>
              <Radar
                data={{
                  labels: ['GDP Growth', 'Startup Ecosystem', 'Job Market', 'Business Freedom', 'Innovation'],
                  datasets: selectedCities.map(city => ({
                    label: city.name,
                    data: [85, 75, 80, 90, 85], // Example economic metrics
                    backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
                    borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                  }))
                }}
                options={{
                  scales: {
                    r: { beginAtZero: true }
                  }
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Startup Ecosystem Ranking</h3>
              <Bar
                data={{
                  labels: selectedCities.map(city => city.name),
                  datasets: [{
                    label: 'Ecosystem Score',
                    data: [75, 85, 65], // Example startup ecosystem scores
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                  }]
                }}
                options={{
                  indexAxis: 'y',
                }}
              />
            </div>
          </div>
        );

      case 'timezone':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Time Zone Comparison</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedCities.map(city => {
                  const now = new Date();
                  const cityTime = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
                  
                  return (
                    <div key={city.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{city.name}</h4>
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">
                          {format(cityTime, 'HH:mm')}
                        </div>
                        <p className="text-sm text-gray-600">
                          {format(cityTime, 'EEEE, MMM d')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">UTC+7</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Working Hours Overlap</h3>
              <div className="h-20 bg-gray-100 rounded-lg relative">
                {selectedCities.map((city, index) => (
                  <div
                    key={city.id}
                    className="absolute h-8 rounded"
                    style={{
                      backgroundColor: `hsla(${index * 120}, 70%, 50%, 0.3)`,
                      left: '25%',
                      right: '25%',
                      top: `${index * 12 + 4}px`,
                    }}
                  >
                    <span className="text-xs absolute left-2 top-1/2 -translate-y-1/2">
                      {city.name} (9:00 - 17:00)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'visa':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Visa Requirements Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedCities.map(city => (
                  <div key={city.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-blue-50 p-4">
                      <h4 className="font-medium text-lg">{city.name}</h4>
                      <p className="text-sm text-gray-600">{city.country}</p>
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        <h5 className="font-medium mb-2">Visa Type</h5>
                        <p className="text-sm">{city.metrics.digitalNomad.visaRequirements}</p>
                      </div>
                      <div className="mb-4">
                        <h5 className="font-medium mb-2">Maximum Stay</h5>
                        <p className="text-sm">30-90 days (tourist visa)</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Requirements</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Valid passport</li>
                          <li>• Proof of funds</li>
                          <li>• Return ticket</li>
                          <li>• Travel insurance</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'climate':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Temperature Trends</h3>
              <Line
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                  datasets: selectedCities.map(city => ({
                    label: city.name,
                    data: Array.from({ length: 12 }, () => 
                      city.metrics.climate.averageTemperature + (Math.random() * 10 - 5)
                    ),
                    borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                    tension: 0.4,
                    fill: false
                  }))
                }}
                options={{
                  responsive: true,
                  plugins: {
                    title: { display: true, text: 'Monthly Temperature (°C)' }
                  }
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Precipitation Distribution</h3>
              <PolarArea
                data={{
                  labels: selectedCities.map(city => city.name),
                  datasets: [{
                    data: selectedCities.map(city => city.metrics.climate.precipitation),
                    backgroundColor: selectedCities.map(() => 
                      `hsla(${Math.random() * 360}, 70%, 50%, 0.6)`
                    )
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    title: { display: true, text: 'Annual Precipitation (mm)' }
                  }
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Seasonal Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedCities.map(city => (
                  <div key={city.id} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">{city.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {city.metrics.climate.seasons.map(season => (
                        <span key={season} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {season}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'cost':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Monthly Expenses Breakdown</h3>
              <Bar
                data={{
                  labels: selectedCities.map(city => city.name),
                  datasets: [
                    {
                      label: 'Housing',
                      data: selectedCities.map(city => city.metrics.cost.housing),
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                    {
                      label: 'Food',
                      data: selectedCities.map(city => city.metrics.cost.food),
                      backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    },
                    {
                      label: 'Transportation',
                      data: selectedCities.map(city => city.metrics.cost.transportation),
                      backgroundColor: 'rgba(255, 159, 64, 0.5)',
                    },
                    {
                      label: 'Entertainment',
                      data: selectedCities.map(city => city.metrics.cost.entertainment),
                      backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    title: { display: true, text: 'Monthly Expenses (USD)' },
                    legend: { position: 'bottom' }
                  },
                  scales: {
                    x: { stacked: true },
                    y: { stacked: true }
                  }
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Cost of Living Comparison</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCities.map(city => (
                  <div key={city.id} className="flex flex-col items-center">
                    <div style={{ width: 120, height: 120 }}>
                      <CircularProgressbar
                        value={city.metrics.cost.costOfLivingIndex}
                        text={`${city.metrics.cost.costOfLivingIndex}`}
                        styles={buildStyles({
                          textSize: '24px',
                          pathColor: `rgba(62, 152, 199, ${city.metrics.cost.costOfLivingIndex / 100})`,
                          textColor: '#333',
                          trailColor: '#d6d6d6'
                        })}
                      />
                    </div>
                    <p className="mt-2 text-center font-medium">{city.name}</p>
                    <p className="text-sm text-gray-500">Cost Index</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Detailed Cost Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Housing</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transport</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entertainment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedCities.map(city => (
                      <tr key={city.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{city.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${city.metrics.cost.housing}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${city.metrics.cost.food}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${city.metrics.cost.transportation}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${city.metrics.cost.entertainment}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          ${city.metrics.cost.housing + city.metrics.cost.food + city.metrics.cost.transportation + city.metrics.cost.entertainment}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'infrastructure':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Infrastructure Overview</h3>
              <Radar
                data={{
                  labels: ['WiFi Speed', 'Coworking Spaces', 'Internet Reliability', 'Power Stability', 'Public Transport'],
                  datasets: selectedCities.map(city => ({
                    label: city.name,
                    data: [
                      city.metrics.infrastructure.averageWifiSpeed,
                      city.metrics.infrastructure.coworkingSpaces,
                      85, // Internet reliability
                      90, // Power stability
                      75, // Public transport
                    ],
                    backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
                    borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
                  }))
                }}
                options={{
                  scales: {
                    r: { beginAtZero: true }
                  }
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Internet Speed Comparison</h3>
              <Bar
                data={{
                  labels: selectedCities.map(city => city.name),
                  datasets: [{
                    label: 'Average WiFi Speed (Mbps)',
                    data: selectedCities.map(city => city.metrics.infrastructure.averageWifiSpeed),
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                  }]
                }}
                options={{
                  indexAxis: 'y',
                  plugins: {
                    title: { display: true, text: 'Average WiFi Speed (Mbps)' }
                  }
                }}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Coworking Spaces</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedCities.map(city => (
                  <div key={city.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{city.name}</h4>
                      <span className="text-blue-600 font-bold">{city.metrics.infrastructure.coworkingSpaces}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded">
                      <div 
                        className="h-2 bg-blue-500 rounded"
                        style={{ width: `${(city.metrics.infrastructure.coworkingSpaces / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-wrap gap-2">
          {metrics.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveMetric(id as MetricType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${activeMetric === id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {renderMetricDashboard()}
    </div>
  );
}