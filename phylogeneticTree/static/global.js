const openOptions = document.getElementById("open-options");

openOptions.addEventListener("click", () => {
  document.querySelector(".options").classList.toggle("open");
});

function parse(newick) {
  let nextid = 0;
  const regex = /([^:;,()\s]*)(?:\s*:\s*([\d.]+)\s*)?([,);])|(\S)/g;
  newick += ";";

  return (function recurse(parentid = -1) {
    const children = [];
    let name,
      length,
      delim,
      ch,
      node,
      all,
      id = nextid++;

    [all, name, length, delim, ch] = regex.exec(newick);
    if (ch == "(") {
      while ("(,".includes(ch)) {
        [node, ch] = recurse(id);
        children.push(node);
      }
      [all, name, length, delim, ch] = regex.exec(newick);
    }

    return [{ name, length: Number(length ?? 0), children }, delim];
  })()[0];
}

var newick = "((B:0.2,(C:0.3,D:0.4)E:0.5)F:0.1)A;";
var object_species = parse(newick);

export { object_species };
