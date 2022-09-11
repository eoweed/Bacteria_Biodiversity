function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("static/data/samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("static/data/samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }
  
  // ---------------------------------- Deliverable 1 ----------------------------------
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("static/data/samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var bacteriaSamples = data.samples;
  
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var bacteriaSamplesArray = bacteriaSamples.filter(x => x.id === sample);
      
      //  5. Create a variable that holds the first sample in the array.
      var bacteriaSamplesresult = bacteriaSamplesArray[0];
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otu_ids = bacteriaSamplesresult.otu_ids;
      var otu_labels = bacteriaSamplesresult.otu_labels;
      var sample_values = bacteriaSamplesresult.sample_values;
    
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
     top10otu_ids = otu_ids.slice(0,10).map(x=>'OTU '+x).reverse()
  
      // 8. Create the trace for the bar chart. 
      var barData = [{
        x: sample_values.slice(0,10).reverse(),
        y: top10otu_ids,
        text: otu_labels.slice(0,10).reverse(),
        orientation: 'h',
        type: 'bar',
        marker: {color: 'LightCoral'}
      }];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 Bacteria Cultures",
        xaxis: {title: "Sample Values", font: {size: 10}}
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout)


// ---------------------------------- Deliverable 2 ----------------------------------
      // 1. Create the trace for the bubble chart.
    var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            size: sample_values,
            color: otu_ids,
        }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "All Bacteria Cultures Found",
        xaxis: {title: "OTU IDs"},
        yaxis: {title: "Sample Values"},
        hovermode: 'closest'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
      

// ---------------------------------- Deliverable 3 ----------------------------------
    var metadata = data.metadata;

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = metadata.filter(x => x.id == sample);
    // Create a variable that holds the first sample in the array.
    var metadata1 = metadataArray[0];
    console.log("metadata", metadata1);

    // 3. Create a variable that holds the washing frequency.
   var wfreq = parseFloat(metadata1.wfreq);
   console.log(wfreq)
    
    // 4. Create the trace for the gauge chart.

    var gaugeData = [
        {
          type: "indicator",
          mode: "gauge+number",
          value: wfreq,
          title: { text: "Belly Button Weekly Washing Frequency", font: { size: 24 } },
          gauge: {
            axis: { range: [0, 10], tickwidth: 1, tickcolor: "black" },
            bar: { color: "maroon", thickness: 0.5 },
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              { range: [0, 2], color: "peachpuff" },
              { range: [2, 4], color: "lightsalmon" },
              { range: [4, 6], color: "tomato" },
              { range: [6, 8], color: "orangered" },
              { range: [8, 10], color: "crimson" }
            ],
          }
        }
      ];
      
      var layout = {
        width: 500,
        height: 400,
      };
      

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, layout);


    });
  }
  