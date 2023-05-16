function CrossHair(x, y) {
  svgContent
    .append("line")
    .attr("class", "crosshair")
    .attr("x1", xScale.range()[0])
    .attr("y1", y)
    .attr("x2", xScale.range()[1])
    .attr("y2", y)
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  svgContent
    .append("line")
    .attr("class", "crosshair")
    .attr("x1", x)
    .attr("y1", yScale.range()[0])
    .attr("x2", x)
    .attr("y2", yScale.range()[1])
    .attr("stroke", "black")
    .attr("stroke-width", 1);
}
