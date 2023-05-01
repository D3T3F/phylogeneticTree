import { object_species } from "./global.js";

function calculateX(d) {
  const scaleFactor = window.innerWidth / 2000;
  return (d.parent?.y ?? 0) + d.y * d.data.length * scaleFactor;
}

function drawTree() {
  let root = d3.hierarchy(object_species);
  let tree = d3.tree().size([500, 700]);
  let nodes = tree(root);

  let svg = d3
    .select(".tree-container")
    .attr("height", window.innerHeight - 60);
  let g = svg
    .append("g")
    .attr("transform", "translate(100,50)")
    .attr("viewBox", `0 0 100% 100%`);

  let link = g
    .selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter()
    .append("polyline")
    .attr("class", "link")
    .attr("fill", "none")
    .attr("stroke", "#708090")
    .attr("stroke-width", 3)
    .attr("points", (d) => {
      d.y = calculateX(d);

      return (
        d.parent.y +
        "," +
        d.parent.x +
        " " +
        d.parent.y +
        "," +
        d.x +
        " " +
        d.y +
        "," +
        d.x
      );
    });

  let node = g
    .selectAll(".node")
    .data(nodes.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => {
      return "translate(" + d.y + "," + d.x + ")";
    });

  node
    .append("circle")
    .attr("class", (d) => {
      return d.data.name + " window-flag";
    })
    .attr("r", 4)
    .attr("fill", "#89df81");

  node
    .append("text")
    .attr("class", (d) => {
      return d.data.name + " window-flag";
    })
    .attr("dy", ".35em")
    .attr("x", (d) => {
      return d.children ? -5 : 10;
    })
    .attr("y", (d) => {
      return d.children ? -10 : -10;
    })
    .style("text-anchor", function (d) {
      return d.children ? "end" : "start";
    })
    .style("user-select", "none")
    .text((d) => {
      return d.data.name;
    });
}

fetch("species_data/")
  .then((response) => response.json())
  .then((data) => {
    drawTree();

    data.forEach((d) => {
      d3.selectAll("." + d.name)
        .attr("cursor", "pointer")
        .on("click", () => {
          let position = d3
            .select("." + d.name)
            .node()
            .getBoundingClientRect();

          let window = d3.select("body").append("div");

          if (opened) {
            d3.selectAll(".window").remove();
            opened = false;
          } else {
            window
              .attr("class", "window window-flag")
              .style("top", position.top + 10 + "px")
              .style("left", position.left + 10 + "px");
            window
              .append("h1")
              .attr("class", "window-flag")
              .text("Specie " + d.name);
            window.append("p").attr("class", "window-flag").text(d.description);
            window
              .append("a")
              .attr("href", "/" + d.name)
              .attr("class", "window-flag")
              .text("view page...");

            opened = true;
          }
        });
    });
  });

let opened = false;
document.addEventListener("click", (e) => {
  if (![...e.target.classList].includes("window-flag")) {
    d3.selectAll(".window").remove();
    opened = false;
  }
});
