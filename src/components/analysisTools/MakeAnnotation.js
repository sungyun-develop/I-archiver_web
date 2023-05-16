import * as d3Annotation from "d3-svg-annotation";

function MakeAnnotations(x, y, idx) {
  const type = d3Annotation.annotationCalloutElbow;
  const annotations = [
    {
      note: {
        label: "example text",
        bgPadding: 20,
        title: "example title",
      },
      x: x,
      y: y,
      dx: 50,
      dy: 50,
      idx: idx,
    },
  ];

  const makeAnnotations = d3Annotation
    .annotation()
    .editMode(true)
    .type(type)
    .annotations(annotations);
}

export default MakeAnnotations;
