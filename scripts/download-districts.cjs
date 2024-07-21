const https = require("https");
const fs = require("fs");
const path = require("path");

const url =
  "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/USA_118th_Congressional_Districts_all_territories/FeatureServer/0/query?where=0%3D0&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=DISTRICTID%2CPARTY&returnGeometry=false&returnCentroid=false&returnEnvelope=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnTrueCurves=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=";

const filePath = path.join(__dirname, "../src/data", "districts-dict.json");

// Ensure the directory exists
fs.mkdirSync(path.dirname(filePath), { recursive: true });

https
  .get(url, (res) => {
    let data = "";

    // A chunk of data has been received.
    res.on("data", (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Save the result.
    res.on("end", () => {
      let dict = {};
      JSON.parse(data).features.forEach((d) => {
        dict[d.attributes.DISTRICTID] = d.attributes.PARTY;
      });

      fs.writeFile(filePath, JSON.stringify(dict), "utf8", (err) => {
        if (err) {
          console.error(
            "An error occurred while writing JSON Object to File.",
            err
          );
        } else {
          console.log("JSON file has been saved.");
        }
      });
    });
  })
  .on("error", (err) => {
    console.error("An error occurred while fetching the URL.", err);
  });
