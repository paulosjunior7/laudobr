import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "./global.css";

const App = () => {
  const [images, setImages] = useState([]);
  const [captions, setCaptions] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
    setCaptions([...captions, ...newImages.map(() => "")]);
  };

  const handleCaptionChange = (index, newCaption) => {
    const updatedCaptions = [...captions];
    updatedCaptions[index] = newCaption;
    setCaptions(updatedCaptions);
  };

  const generatePDF = () => {
    const data = ref.current;

    const dataBtoa = btoa(encodeURIComponent(data.innerHTML));
    const htmlClonadoBtoa = btoa(
      encodeURIComponent(data.cloneNode(true).innerHTML)
    );

    dataBtoa === htmlClonadoBtoa &&
      html2canvas(data, { scrollY: 0 }).then((canvas) => {
        // Definir tamanho A4 em mm
        const a4Width = 210;
        const a4Height = 298;

        // Criar PDF com tamanho A4
        const pdf = new jsPDF({
          orientation: "portrait", // ou "landscape" dependendo da orientação desejada
          unit: "mm",
          format: "a4", // Usar o formato A4
        });

        // Redimensionar o canvas para se ajustar à página A4
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const scale = Math.min(a4Width / canvasWidth, a4Height / canvasHeight);

        const pdfWidth = canvasWidth * scale;
        const pdfHeight = canvasHeight * scale;

        // Adicionar a imagem do canvas ao PDF
        pdf.addImage(canvas, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("teste.pdf");
      });
  };

  const ref = useRef();

  return (
    <div className="bg-slate-50 py-20">
      <div className="container mx-auto p-4 gap-6 flex flex-col">
        <h1 className="font-bold text-base">Anexar Fotos com Legenda</h1>
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          className=" max-w-sm"
        />

        {/* Visualização das imagens antes de gerar o PDF */}
        <div className="p-12 grid grid-cols-2 gap-6  shadow-md" ref={ref}>
          <h2 className="col-span-2 font-bold text-base">Anexos</h2>
          {images.map((image, index) => (
            <div key={index} className=" flex flex-col">
              <img
                src={image}
                alt={`Foto ${index + 1}`}
                className="bg-cover w-full h-full bg-no-repeat"
              />
              <input
                type="text"
                placeholder="Legenda"
                className={`border mb-2 p-2 w-full ${
                  captions[index] !== "" && " border-none bg-transparent"
                }`}
                value={captions[index]}
                onChange={(e) => handleCaptionChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={generatePDF}
        >
          Gerar PDF
        </button>
      </div>
    </div>
  );
};

export default App;
