function getPDFFileButton () {
    // Select which div with id that need to be printed
    // to print body $('body')
    // here printing div with content id $("#content")
    // using html canvas to save as required pdf to image to preserve css
    return html2canvas($('#content'), {
        background: "#ffffff",
        onrendered: function(canvas) {
            var myImage = canvas.toDataURL("image/png");
            // Adjust width and height
            var imgWidth = (canvas.width * 40) / 240;
            var imgHeight = (canvas.height * 40) / 240;
            // jspdf changes
            var pdf = new jsPDF();
            pdf.addImage(myImage, 'JPEG', -10, 0, imgWidth, imgHeight); // 2: 19
            pdf.save('Kenway Medicals(Daily income report).pdf');
        }
    });

}
