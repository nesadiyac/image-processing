const form = document.querySelector('form');
const controlBtns = document.querySelector('#controlBtns');
const search = document.querySelector('#upload');
const fileSize = document.querySelector('#fileSize');
const maxHeightWidth = document.querySelector('#maxWidthOrHeight');
let file;
document.querySelector('input').addEventListener('change', event => {
    file = event.target.files[0];
    const { name: fileName, size } = file;
    const fileSize = (size / 1000).toFixed(2);
  // Set the text content
  const fileNameAndSize = `${fileName} - ${fileSize}KB`;
  document.querySelector('.file-name').textContent = fileNameAndSize;
})
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (file) {
        const downloadLink = document.getElementById("download-link");
        if (downloadLink) {
          controlBtns.removeChild(downloadLink);
        }
        handleImageUpload(file);
    } else {
        alert('please upload an image');
    }
})
function handleImageUpload(file) {

    var imageFile = file;
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
  
    var options = {
      maxSizeMB: fileSize.value || 1,
      maxWidthOrHeight: maxHeightWidth.value || 1920,
      useWebWorker: true
    }
    imageCompression(imageFile, options)
      .then(function (compressedFile) {
        const urlCreator = window.URL || window.webkitURL;
        document.getElementById("output-image").src = urlCreator.createObjectURL(compressedFile);
        document.getElementById("output-image").style.height = '50vh';
        document.getElementById("input-image").src = urlCreator.createObjectURL(file);
        document.getElementById("input-image").style.height = '50vh';
        document.getElementById("input-size").innerHTML = `Input file size: ${(file.size/1000000).toFixed(2)} MB`;
        document.getElementById("output-size").innerHTML = `Compressed file size: ${(compressedFile.size/1000000).toFixed(2)} MB`;
        const downloadLink = document.createElement("a");
        const fileName = compressedFile.name;
    
        downloadLink.href = urlCreator.createObjectURL(compressedFile);
        downloadLink.download = fileName;
        downloadLink.innerHTML = 'Download';
        downloadLink.id = 'download-link';
        controlBtns.appendChild(downloadLink);
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }