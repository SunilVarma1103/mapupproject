import Papa from "papaparse";
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

const DashboardPage = (props) => {
  const [data, setData] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/mapupproject/Electric_Vehicle_Population_Data.csv"
        );
        const csvData = await response.text();
        Papa.parse(csvData, {
          header: true,
          complete: (result) => {
            setData(result.data);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }
    };
    fetchData();
  }, []);

  const vehicleCountsByYear = useMemo(() => {
    return data.reduce((acc, vehicle) => {
      const year = vehicle?.["Model Year"];
      if (year) {
        acc[year] = (acc[year] || 0) + 1;
      }
      return acc;
    }, {});
  }, [data]);

  const vehicleCountsByMake = useMemo(() => {
    return data.reduce((acc, vehicle) => {
      const make = vehicle.Make;
      acc[make] = (acc[make] || 0) + 1;
      return acc;
    }, {});
  }, [data]);

  const vehicleCountsByType = useMemo(() => {
    return data.reduce((acc, vehicle) => {
      const type = vehicle["Electric Vehicle Type"];
      if (type && type.trim() !== "") {
        acc[type] = (acc[type] || 0) + 1;
      }
      return acc;
    }, {});
  }, [data]);

  const { totalVehicles, averageRange } = useMemo(() => {
    let totalVehicles = 0;
    let totalRange = 0;
    let rangeCount = 0;

    data.forEach((vehicle) => {
      const range = parseFloat(vehicle["Electric Range"]);
      if (!isNaN(range)) {
        totalVehicles++; // Count all vehicles, including those with 0 range
        if (range > 0) {
          totalRange += range;
          rangeCount++;
        }
      }
    });

    const averageRange = rangeCount > 0 ? totalRange / rangeCount : 0;

    return {
      totalVehicles,
      averageRange,
    };
  }, [data]);

  const calculateRangeExtremes = (data) => {
    let maxRange = -Infinity;
    let minRange = Infinity;

    data.forEach((vehicle) => {
      const range = parseFloat(vehicle["Electric Range"]);
      if (!isNaN(range) && range > 0) {
        // Exclude vehicles with 0 range
        if (range > maxRange) {
          maxRange = range;
        }
        if (range < minRange) {
          minRange = range;
        }
      }
    });

    // If no valid range was found, set max and min to 0
    if (maxRange === -Infinity) maxRange = 0;
    if (minRange === Infinity) minRange = 0;

    return {
      maxRange,
      minRange,
    };
  };

  const { maxRange, minRange } = calculateRangeExtremes(data);

  const calculateMsrpExtremes = (data) => {
    let maxMsrp = -Infinity;
    let minMsrp = Infinity;

    data.forEach((vehicle) => {
      const msrp = parseFloat(vehicle["Base MSRP"]);
      if (!isNaN(msrp) && msrp >= 0) {
        // Only consider valid, non-negative MSRP values
        if (msrp > maxMsrp) {
          maxMsrp = msrp;
        }
        if (msrp > 0 && msrp < minMsrp) {
          // Exclude 0 for min MSRP
          minMsrp = msrp;
        }
      }
    });

    // If no valid MSRP was found, set max to 0 and min to -Infinity to indicate an error
    if (maxMsrp === -Infinity) maxMsrp = 0;
    if (minMsrp === Infinity) minMsrp = -1; // Set to -1 to indicate no valid min was found

    return {
      maxMsrp,
      minMsrp,
    };
  };

  const { maxMsrp, minMsrp } = calculateMsrpExtremes(data);

  const calculateAverage = (field) => {
    let total = 0;
    let count = 0;

    data.forEach((vehicle) => {
      const value = parseFloat(vehicle[field]);
      if (!isNaN(value) && value >= 0) {
        total += value;
        count++;
      }
    });

    return count > 0 ? total / count : 0;
  };

  const averageMsrp = useMemo(() => calculateAverage("Base MSRP"), [data]);

  const getUniqueValues = (key) => {
    const uniqueSet = new Set();
    data.forEach((vehicle) => {
      const value = vehicle[key];
      if (value) uniqueSet.add(value);
    });
    return Array.from(uniqueSet);
  };

  const uniqueCities = useMemo(() => getUniqueValues("City"), [data]);
  const uniqueElectricUtilities = useMemo(
    () => getUniqueValues("Electric Utility"),
    [data]
  );

  const getVehicleLocations = (selectedMakeModelYear) => {
    if (!selectedMakeModelYear) return [];
    const [selectedMake, selectedModelYear] = selectedMakeModelYear
      .split(",")
      .map((value) => value.trim());
    return data
      .filter(
        (vehicle) =>
          vehicle.Make === selectedMake &&
          vehicle["Model Year"] === selectedModelYear
      )
      .map((vehicle) => vehicle["Vehicle Location"])
      .filter((location) => location);
  };

  const vehicleLocations = useMemo(
    () => getVehicleLocations(selectedVehicle),
    [data, selectedVehicle]
  );

  const extractLatLong = (data) => {
    return data
      .map((vehicle) => {
        const location = vehicle["Vehicle Location"];
        const match =
          location && location.match(/POINT \((-?\d+\.\d+)\s(-?\d+\.\d+)\)/);

        if (match) {
          const [_, longitude, latitude] = match;
          return {
            lat: parseFloat(latitude),
            lon: parseFloat(longitude),
          };
        }

        return null; // Return null if location data doesn't match the pattern
      })
      .filter((coords) => coords !== null); // Filter out null values
  };

  const countByCAFVEligibility = (data) => {
    return data.reduce((acc, vehicle) => {
      const eligibility =
        vehicle["Clean Alternative Fuel Vehicle (CAFV) Eligibility"];
      if (eligibility) {
        acc[eligibility] = (acc[eligibility] || 0) + 1;
      }
      return acc;
    }, {});
  };

  const cafvEligibilityCounts = useMemo(
    () => countByCAFVEligibility(data),
    [data]
  );

  const getMakeAndModelYearArray = () => {
    const makeAndModelYears = new Set();

    data.forEach((vehicle) => {
      const make = vehicle["Make"];
      const modelYear = vehicle["Model Year"];

      if (make && modelYear) {
        makeAndModelYears.add(`${make}, ${modelYear}`);
      }
    });

    return Array.from(makeAndModelYears);
  };

  const makeAndModelYearArray = useMemo(
    () => getMakeAndModelYearArray(),
    [data]
  );

  const getCountiesByMakeAndModelYear = (selectedMakeModelYear) => {
    const counties = new Set();

    if (!selectedMakeModelYear) return [];

    const [selectedMake, selectedModelYear] = selectedMakeModelYear
      .split(",")
      .map((value) => value.trim());

    data.forEach((vehicle) => {
      const make = vehicle["Make"];
      const modelYear = vehicle["Model Year"];
      const county = vehicle["County"];

      if (make === selectedMake && modelYear === selectedModelYear && county) {
        counties.add(county);
      }
    });

    return Array.from(counties);
  };

  const counties = useMemo(
    () => getCountiesByMakeAndModelYear(selectedVehicle),
    [data, selectedVehicle]
  );

  const getAverageElectricRangeAndMsrp = (selectedMakeModelYear) => {
    if (!selectedMakeModelYear) {
      return {
        currentElectricRange: 0,
        currentMsrp: 0,
      };
    }

    const [selectedMake, selectedModelYear] = selectedMakeModelYear
      .split(",")
      .map((value) => value.trim());

    let totalElectricRange = 0;
    let totalMsrp = 0;
    let count = 0;

    data.forEach((vehicle) => {
      const make = vehicle["Make"];
      const modelYear = vehicle["Model Year"];
      const electricRange = parseFloat(vehicle["Electric Range"]);
      const msrp = parseFloat(vehicle["Base MSRP"]);

      if (make === selectedMake && modelYear === selectedModelYear) {
        if (!isNaN(electricRange) && electricRange > 0) {
          totalElectricRange += electricRange;
        }
        if (!isNaN(msrp) && msrp >= 0) {
          totalMsrp += msrp;
        }
        count++;
      }
    });

    const currentElectricRange = count > 0 ? totalElectricRange / count : 0;
    const currentMsrp = count > 0 ? totalMsrp / count : 0;

    return {
      currentElectricRange,
      currentMsrp,
    };
  };

  const { currentElectricRange, currentMsrp } = useMemo(
    () => getAverageElectricRangeAndMsrp(selectedVehicle),
    [data, selectedVehicle]
  );

  const getCityNameCounts = (data) => {
    const cityCounts = {};

    data.forEach((vehicle) => {
      const city = vehicle["City"]; // Adjust this key based on your data structure
      if (city) {
        // Trim the city name and handle case insensitivity
        const trimmedCity = city.trim().toLowerCase();
        cityCounts[trimmedCity] = (cityCounts[trimmedCity] || 0) + 1;
      }
    });

    return cityCounts;
  };

  // Example usage:
  const cityCounts = getCityNameCounts(data);

  const extractVehicleLocationByMakeAndModelYear = (
    data,
    selectedMakeModelYear
  ) => {
    // Check if selectedMakeModelYear is null or empty
    if (!selectedMakeModelYear) {
      return [];
    }

    const [selectedMake, selectedModelYear] = selectedMakeModelYear
      .split(",")
      .map((value) => value.trim());

    const locations = [];

    data.forEach((vehicle) => {
      const make = vehicle["Make"]; // Adjust this key based on your data structure
      const modelYear = vehicle["Model Year"]; // Adjust this key based on your data structure
      const locationString = vehicle["Vehicle Location"]; // Adjust this key based on your data structure

      if (
        make === selectedMake &&
        modelYear === selectedModelYear &&
        locationString &&
        locationString.startsWith("POINT")
      ) {
        // Extract coordinates from the string
        const coordinates = locationString
          .replace("POINT (", "")
          .replace(")", "")
          .trim()
          .split(" "); // Split by space

        if (coordinates.length === 2) {
          const long = parseFloat(coordinates[0]);
          const lat = parseFloat(coordinates[1]);

          if (!isNaN(long) && !isNaN(lat)) {
            locations.push({ long, lat });
          }
        }
      }
    });

    return locations;
  };

  const selectedVehicleLocations = extractVehicleLocationByMakeAndModelYear(
    data,
    selectedVehicle
  );

  return (
    <DashboardLayout
      vehicleCountsByYear={vehicleCountsByYear}
      vehicleCountsByMake={vehicleCountsByMake}
      cafvEligibilityCounts={cafvEligibilityCounts}
      uniqueCities={uniqueCities}
      uniqueElectricUtilities={uniqueElectricUtilities}
      vehicleCountsByType={vehicleCountsByType}
      averageRange={averageRange}
      totalVehicles={totalVehicles}
      latLongArray={extractLatLong(data)}
      dashboardMode={props?.dashboardMode}
      setDashboardMode={props?.setDashboardMode}
      minRange={minRange}
      maxRange={maxRange}
      maxMsrp={maxMsrp}
      minMsrp={minMsrp}
      averageMsrp={averageMsrp}
      makeAndModelYearArray={makeAndModelYearArray}
      counties={counties}
      selectedVehicle={selectedVehicle}
      setSelectedVehicle={setSelectedVehicle}
      vehicleLocations={vehicleLocations}
      currentMsrp={currentMsrp}
      currentElectricRange={currentElectricRange}
      cityCounts={cityCounts}
      selectedVehicleLocations={selectedVehicleLocations}
    />
  );
};

export default DashboardPage;
