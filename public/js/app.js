console.log('Client side javascript file is loaded!');

const form = document.querySelector('form');
const search = document.querySelector('#upload');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');
const width = document.querySelector('#width');
const height = document.querySelector('#height');
let formData;
let file;
const reader = new FileReader();
const handleImageUpload = event => {
    reader.addEventListener('load', () => {
       
    })
    reader.readAsDataURL(event.target.files[0]);
    file = event.target.files[0];
}
document.querySelector('input').addEventListener('change', event => {
    handleImageUpload(event)
})
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    fetch('/uploadImage', {
        method: 'POST',
        body: JSON.stringify({data: reader.result, 
            fileName: file.name, 
            dimension: {
                width: Number(width.value),
                height: Number(height.value)
            }
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json()
    }).then(data => {
        const downloadLink = document.createElement("a");
        const fileName = file.name;
    
        downloadLink.href = data.imgSrc;
        downloadLink.download = fileName;
        downloadLink.innerHTML = 'Download';
        downloadLink.id = 'download-link';
        form.appendChild(downloadLink);
        document.getElementById("output-image").src = data.imgSrc;
        console.log(data);
    })
    .catch(err =>{
        console.log(err);
    })
})