// // connecting my drop down menu with javascript 
var dropdownMenu = d3.select("#selDataset");
console.log(dropdownMenu)
// //create varibale to hold data outside of function
var globalData ;


//create function to add to dropDown
function init() {
    //// Fetch the JSON data and console log it
d3.json("data/samples.json").then((sampleData) => {
    console.log(sampleData);
    // store data in globalData declared outside of function
    globalData = sampleData;
    // //print to check 
    console.log(globalData);
    //pull only name and store in id_names
    var id_names = globalData.names;
    // //print to check 
    console.log(id_names)
    // loop through each name 
    id_names.forEach(element => 
    // //append to dropdownMenu
        dropdownMenu.append("option")
        .property("value",element)
        .text(element))
    buildPlot(940)
    buildDemo(940)
});
}
init();

// //create funtion to store change in selection and call buildDemo function...print to console
function optionChange() {
    var id = this.value;
    buildDemo(id);
    console.log(id)
    buildPlot(id);
}

// // // Use D3 to create an event handler
dropdownMenu.on("change", optionChange)

// //// This function is called when a dropdown menu item is selected
function buildDemo(current_id) {
//     //filter to metatdata 
    var filterId = globalData.metadata;
    // console.log(filterId)
//     //iterate each item and filter to selected item (set string to interger)
    var filteredId = filterId.filter(element => element.id === parseInt(current_id))[0]
    console.log(filteredId)
//     //create variable refering to html element
    var htmlMeta = d3.select("#sample-metadata");
    //clear results before new selection
    htmlMeta.html("");
//     //iterate through each key value pair and append to html h6
    Object.entries(filteredId).forEach(([key, value]) =>htmlMeta
    .append("h6")
    .text(`${key}: ${value}`))  
        // Build the plot with the new test subject

}
  
//create fucntion to build plot 
function buildPlot(current_id) {
    d3.json("data/samples.json").then((sampleData) => {

    var filterSample = sampleData.samples;
    console.log(filterSample)
    var filteredSample= filterSample.filter(element => parseInt(element.id) === parseInt(current_id))
    console.log(filteredSample)
    //Bar Chart
    var sampleValues = filteredSample[0]
    console.log(sampleValues)
    var TopSampleValues = sampleValues.sample_values.slice(0,10).reverse();
    console.log(TopSampleValues)
    var TopTenOtu = sampleValues.otu_ids.map(id=>`OTUid ${id}`).slice(0,10).reverse()
    console.log(TopTenOtu)
    var topTenOtuLables = sampleValues.otu_labels.slice(0,10).reverse();
    console.log(topTenOtuLables)  

    //Bubble chart
    var sampleBubble = sampleValues.sample_values
    console.log(sampleBubble)
    var OtuBubble = sampleValues.otu_ids
    console.log(OtuBubble)
    var otuLablesBubble = sampleValues.otu_labels
    console.log(otuLablesBubble) 

 // Trace1 
    var trace1 = {
    x: TopSampleValues,
    y: TopTenOtu,
    text:topTenOtuLables,
    name: "BioDiversitys",
    type: "bar",
    orientation: "h"
  };

  // data
    var chartData = [trace1];

  // Apply the group bar mode to the layout
    var layout = {
    title: "Belly Botton Biodiversity",
    margin: {
      l: 100,
      r: 5,
      t: 100,
      b: 50
        }
  }
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", chartData, layout);  

    //bubble chart
    var trace2 = {
        x: OtuBubble,
        y: sampleBubble,
        mode: "markers",
        text:otuLablesBubble,
        marker: {
            color:OtuBubble,
            size:sampleBubble,
            sizeref:1.02
        }
      };
      
      var data = [trace2];
      
      var layout = {
        title: 'Belly Botton Biodiversity Bubble Graph',
        showlegend: false,
      };
      
    Plotly.newPlot("bubble", data, layout);
})
};