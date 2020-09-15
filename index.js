const axios = require("axios");
const http = require("http");
const fs = require("fs");
const url = require("url");

const url_clientes =
  "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";
const url_proveedores =
  "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";

let fillRowsClientes = (data) => {
  let ans = "";
  data.forEach((element) => {
    ans += "<tr>";
    ans += "<td>" + element.idCliente + "</td>";
    ans += "<td>" + element.NombreCompania + "</td>";
    ans += "<td>" + element.NombreContacto + "</td>";
    ans += "</tr>";
  });
  return ans;
};

let fillRowsProveedores = (data) => {
  let ans = "";
  data.forEach((element) => {
    ans += "<tr>";
    ans += "<td>" + element.idproveedor + "</td>";
    ans += "<td>" + element.nombrecompania + "</td>";
    ans += "<td>" + element.nombrecontacto + "</td>";
    ans += "</tr>";
  });
  return ans;
};

let modifyHTML = (pathname, pageContent, responseData) => {
  if (pathname == "/api/clientes") {
    pageContent = pageContent.replace("{{header}}", "Listado de Clientes");
    let rows = fillRowsClientes(responseData);
    pageContent = pageContent.replace("{{body}}", rows);
    return pageContent;
  } else if (pathname == "/api/proveedores") {
    pageContent = pageContent.replace("{{header}}", "Listado de Proveedores");
    let rows = fillRowsProveedores(responseData);
    pageContent = pageContent.replace("{{body}}", rows);
    return pageContent;
  }
};

let readData = (pathname, callback) => {
  if (pathname == "/api/clientes") {
    axios
      .get(url_clientes)
      .then((response) => callback(response.data))
      .catch((error) => console.log(error));
  } else if (pathname == "/api/proveedores") {
    axios
      .get(url_proveedores)
      .then((response) => callback(response.data))
      .catch((error) => console.log(error));
  }
};

let readFile = (pathname, callback) => {
  fs.readFile("index.html", (err, data) => {
    let pageContent = data.toString();
    readData(pathname, (data) => {
      pageContent = modifyHTML(pathname, pageContent, data);
      callback(pageContent);
    });
  });
};

http
  .createServer(function (req, res) {
    readFile(url.parse(req.url, true).pathname, (data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data.toString());
    });
  })
  .listen(8081);
