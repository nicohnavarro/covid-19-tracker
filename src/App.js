import React, { useState, useEffect } from 'react';
import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import numeral from 'numeral';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    //async -> send a request,wait for it, do something with 
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) =>
            ({
              name: country.country,
              value: country.countryInfo.iso2
            }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, [])

  // https://disease.sh/v3/covid-19/countries
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        
        setCountry(countryCode);
        setCountryInfo(data);
        if(!(countryCode ==="worldwide")){
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(3);
        }
        else{
          setMapCenter([34.80746, -40.4796]);
          setMapZoom(3);
        }
        
      })
  };

  return (
    <div className="app">

      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl color="secondary" className="app__dropdown">
            <Select className="app__select" variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox  onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"} total={numeral(countryInfo.cases).format("0,0a")} cases={prettyPrintStat(countryInfo.todayCases)}></InfoBox>
          <InfoBox onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"} total={numeral(countryInfo.recovered).format("0,0a")}cases={prettyPrintStat(countryInfo.todayRecovered)}></InfoBox>
          <InfoBox onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"} total={numeral(countryInfo.deaths).format("0,0a")} cases={prettyPrintStat(countryInfo.todayDeaths)}></InfoBox>
        </div>

        <Map countries={mapCountries}  casesType={casesType} center={mapCenter} zoom={mapZoom}></Map>
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}></Table>
          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} ></LineGraph>
        </CardContent>

      </Card>
    </div>
  );
}

export default App;
