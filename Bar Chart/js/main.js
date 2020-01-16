/*
*    main.js
*    Mastering Data Visualization with D3.js
*    3.11 - Making a bar chart
*/

var margin = { left:80, right:10, top:10, bottom:150 };

var width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left 
            + ", " + margin.top + ")");

// X Label
g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width / 2)
    .attr("y", height + 140)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Platform Name");

// Y Label
g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2 ))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("TOTAL_CASES");




d3.csv("data/NetworkData.csv").then(function(data){
    console.log(data);

    data.forEach(function(d,i){

        d.TOTAL_CASES = +d.TOTAL_CASES;
        //console.log(d.TOTAL_CASES);
        //console.log(d.PLATFORM_NAME)
        //console.log(i);
    });
    //Combine platform
    var byPlatformName = d3.nest()
        .key(function(d) {return d.PLATFORM_NAME})
        .entries(data);

    var sumPlatformName = d3.nest()
        .key(function(d) {return d.PLATFORM_NAME;})
        .rollup(function(leaves){
            return{
                "total" : d3.sum(leaves,function(d) {return d.TOTAL_CASES})
            }
        })    
        .entries(data);
        console.log(sumPlatformName)


    var x = d3.scaleBand()
        .domain(data.map(function(d){ return d.PLATFORM_NAME; }))
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){
            return d.TOTAL_CASES*1.01;
        })])
        .range([height, 0]);

    var xAxisCall = d3.axisBottom(x);
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxisCall)
        .selectAll("text")
            .attr("y", "10")
            .attr("x", "-5")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)");

    var yAxisCall = d3.axisLeft(y)
        .ticks()
        .tickFormat(function(d){
            return d ;
        });
    g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);


    var rects = g.selectAll("rect")
        .data(data);
    
    rects.enter()
        .append("rect")
            
            .attr("x", function(d){ return x(d.PLATFORM_NAME); })
            .attr("width", x.bandwidth)
            
            .attr("y",  function(d,i){ return y(d.TOTAL_CASES);}) 
            .attr("height", function(d,i){ return height - y(d.TOTAL_CASES);})
            
            .attr("fill", "blue");
           

        


       var labels = g.selectAll(".label")
        .data(data)
        
        labels.enter()
            .append("text")
            .attr("class","label")
            .attr("x", function(d) {return x(d.PLATFORM_NAME) ;})
            .attr("y", function(d) {return  height - y(d.TOTAL_CASES)  ;})
            .attr("dy", ".75em")
            .text(function(d) {return (d.TOTAL_CASES);});


           //.text(function(d) {return d.TOTAL_CASES;});
           
 //y(d.name) + y.rangeBand() / 2 + 4      (width / data.length)
/*
                g.selectAll(".text")         
      .data(data)
      .enter()
      .append("text")
      .attr("class","label")
      .attr("x", (function(d) { return xScale(d.food) + xScale.rangeBand() / 2 ; }  ))
      .attr("y", function(d) { return yScale(d.quantity) + 1; })
      .attr("dy", ".75em")
      .text(function(d) { return d.quantity; });      
*/
})