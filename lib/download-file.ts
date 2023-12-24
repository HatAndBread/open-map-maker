export default (filename: string, fileContent: string, fileType: "gpx" | "geojson") => {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/${fileType};charset=utf-8,` + encodeURIComponent(fileContent));
  element.setAttribute('download', `${filename}.${fileType}`);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
