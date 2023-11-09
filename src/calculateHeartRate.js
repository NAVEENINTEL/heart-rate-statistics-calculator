const fs = require('fs');

function calculateMedian(arr) {
  const sortedArr = arr.sort((a, b) => a - b);
  const middle = Math.floor(sortedArr.length / 2);
  if (sortedArr.length % 2 === 0) {
    return (sortedArr[middle - 1] + sortedArr[middle]) / 2;
  } else {
    return sortedArr[middle];
  }
}

// Read the heart rate data from the heartrate.json file
const heartRateData = JSON.parse(fs.readFileSync('data/heartrate.json', 'utf8'));

// Calculate daily statistics
const dailyStats = {};

for (const measurement of heartRateData) {
  const date = measurement.timestamps.startTime.slice(0, 10); // Extract date (YYYY-MM-DD)
  if (!dailyStats[date]) {
    dailyStats[date] = {
      min: measurement.beatsPerMinute,
      max: measurement.beatsPerMinute,
      heartRates: [measurement.beatsPerMinute],
      latestDataTimestamp: measurement.timestamps.endTime,
    };
  } else {
    dailyStats[date].min = Math.min(dailyStats[date].min, measurement.beatsPerMinute);
    dailyStats[date].max = Math.max(dailyStats[date].max, measurement.beatsPerMinute);
    dailyStats[date].heartRates.push(measurement.beatsPerMinute);
    dailyStats[date].latestDataTimestamp = measurement.timestamps.endTime;
  }
}

// Calculate median for each day
for (const date in dailyStats) {
  dailyStats[date].median = calculateMedian(dailyStats[date].heartRates);
}

// Prepare output data
const outputData = Object.keys(dailyStats).map((date) => ({
  date,
  min: dailyStats[date].min,
  max: dailyStats[date].max,
  median: dailyStats[date].median,
  latestDataTimestamp: dailyStats[date].latestDataTimestamp,
}));

// Write the output to output.json
fs.writeFileSync('output/output.json', JSON.stringify(outputData, null, 2), 'utf8');

console.log('Statistics calculated and written to output.json.');
