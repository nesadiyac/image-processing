console.log('Client side javascript file is loaded!');

const form = document.querySelector('form');
const controlBtns = document.querySelector('#controlBtns');
const search = document.querySelector('#upload');
const rotate = document.querySelector('#rotate');
const backgroundColor = document.querySelector('#backgroundColor');
let formData;
let file;
const reader = new FileReader();
const handleImageUpload = event => {
    reader.addEventListener('load', () => {
       
    })
    reader.readAsDataURL(event.target.files[0]);
    file = event.target.files[0];
    const { name: fileName, size } = file;
    const fileSize = (size / 1000).toFixed(2);
  // Set the text content
  const fileNameAndSize = `${fileName} - ${fileSize}KB`;
  document.querySelector('.file-name').textContent = fileNameAndSize;
}
document.querySelector('input').addEventListener('change', event => {
    handleImageUpload(event)
})
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    fetch('/rotateImg', {
        method: 'POST',
        body: JSON.stringify({data: reader.result, 
            fileName: file.name, 
            rotate: Number(rotate.value),
            background: backgroundColor.value
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json()
    }).then(data => {
        const download = document.getElementById("download-link");
        if (download) {
          controlBtns.removeChild(download);
        }
        const downloadLink = document.createElement("a");
        const fileName = file.name;
    
        downloadLink.href = data.imgSrc;
        downloadLink.download = fileName;
        downloadLink.innerHTML = 'Download';
        downloadLink.id = 'download-link';
        controlBtns.appendChild(downloadLink);
        document.getElementById("output-image").src = data.imgSrc;
        console.log(data);
    })
    .catch(err =>{
        console.log(err);
    })
})