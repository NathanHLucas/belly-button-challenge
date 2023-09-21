
// define data location
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// retrieve data and output to console
data = d3.json(url)
console.log(data)

// create the initialization function
function init() {
    let dropdownMenu = d3.select("#selDataset");


    d3.json(url).then((data) => {
        
        // create names variable
        let names = data.names;

        // add samples to the drop down menu
        names.forEach((id) => {
            dropdownMenu.append("option").text(id).property("value",id);
        });

        // define the starter sample
        let start_sample = names[0];

        // call the builder functions for the starter sample
        buildMeta(start_sample);
        buildBar(start_sample);
        buildBubble(start_sample);


    });

};

// create function that outputs the demographics
function buildMeta(sample) {

    // retrieve all of the data
    d3.json(url).then((data) => {

        // retrieve metadata and filter for current sample only
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);

        // get first index from the array
        let value_data = value[0];

        // clear out metadata
        d3.select("#sample-metadata").html("");

        // add each key/value pair to the panel
        Object.entries(value_data).forEach(([key,value]) => {

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// create the function that builds the top 10 bar chart
function buildBar(sample) {

    // retrieve all of the data
    d3.json(url).then((data) => {

        // retrieve sample data and filer for current sample
        let sample_info = data.samples;
        let value = sample_info.filter(result => result.id == sample);

        // first index from the array
        let value_data = value[0];

        //otu_ids, labels, and sample values as defined in assignment
        let otu_ids = value_data.otu_ids;
        let otu_labels = value_data.otu_labels;
        let sample_values = value_data.sample_values;

        // display top 10 items in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // create the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // setup layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // use plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// create function that builds the bubble chart
function buildBubble(sample) {

    // retrieve all of the data
    d3.json(url).then((data) => {
        
        // retrieve sample data
        let sample_info = data.samples;

        // filter based on the value of the sample
        let value = sample_info.filter(result => result.id == sample);

        // first index from the array
        let value_data = value[0];

        // otu_ids, lables, and sample values
        let otu_ids = value_data.otu_ids;
        let otu_labels = value_data.otu_labels;
        let sample_values = value_data.sample_values;
        
        // create trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // create the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // use plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};


// create function that changes the webpage upon change in dropdown menu (optionChanged defined in HTML)
function optionChanged(value) { 

    // call the build functions 
    buildMeta(value);
    buildBar(value);
    buildBubble(value);

};




// initialize the webpage
init();