import { object_species } from "./global.js";

function generateChart(list, count) {
  const ctx = document.getElementById("myChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: [...list],
      datasets: [
        {
          label: "Species in Tree",
          backgroundColor: "#89df818f",
          data: [...count.map((a) => a[2])],
          borderWidth: 1,
        },
        {
          label: "Species in Data Base",
          data: [...count.map((a) => a[1])],
          backgroundColor: "#54cda38f",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

fetch("../species_data/")
  .then((response) => response.json())
  .then((data) => {
    function getNames(obj) {
      let names = [];
      if (obj.name) {
        names.push(obj.name);
      }
      if (obj.children) {
        obj.children.forEach((child) => {
          names.push(...getNames(child));
        });
      }
      return names;
    }

    const species_list = getNames(object_species).sort();

    let speciesDB = [];
    let listCount = [];

    data.forEach((d) => {
      speciesDB.push(d.name);
    });

    function countChild(obj) {
      let countDB = 0;
      let countTree = 0;

      if (speciesDB.includes(obj.name)) {
        countDB++;
        countTree++;
      } else {
        countTree++;
      }

      if (obj.children) {
        obj.children.forEach((child) => {
          if (
            speciesDB.includes(child.name) &&
            JSON.stringify(child.children) != JSON.stringify([])
          ) {
            countDB++;
          }

          if (child.children) {
            countDB += countChild(child)[0];
            countTree += countChild(child)[1];
          }
        });
      }

      return [countDB, countTree];
    }

    function verifyDB(obj) {
      if (species_list.includes(obj.name) && firstObj) {
        firstObj = false;
        const [countDB, countTree] = countChild(obj);
        listCount.push([obj.name, countDB - 1, countTree]);
      }
      obj.children.forEach((child) => {
        if (species_list.includes(child.name)) {
          const [countDB, countTree] = countChild(child);
          listCount.push([child.name, countDB, countTree]);
        }

        if (child.children) verifyDB(child);
      });
    }

    let firstObj = true;

    verifyDB(object_species);

    listCount.sort();

    console.log(listCount);

    generateChart(species_list, listCount);
  });
