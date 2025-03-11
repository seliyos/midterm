import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.0.0/jspdf.es.js";

export class GeneratePdf {
  pdfDoc;
  position = {
    y: 20,
    x: 10,
  };

  margin = {
    y: 20,
    x: 10,
  };

  pageCounter = 1;
  domRef = "";

  /**
   *
   * @param {string} domRefId The id of the iframe used for rendering the pdf
   */
  constructor(domRefId) {
    this.pdfDoc = new jsPDF();
    this.pdfDoc.setFontSize(11);
    if (domRefId) {
      this.domRef = document.querySelector(`#${domRefId}`);
    }
  }

  downloadPdf() {
    this.pdfDoc.save("This file.pdf");
  }

  getPdfUrl() {
    return this.pdfDoc.output("bloburl") + "#toolbar=1";
  }

  /**
   *
   * @param {string} text Content displayed in header
   * @param {string} color Text color for header
   */
  addHeader(text, color = "black") {
    this.pdfDoc.setFontSize(16);
    this.pdfDoc.setTextColor(color);
    this.pdfDoc.text(text, this.position.x, this.position.y);
    this.position.y += 8;
    this.pdfDoc.setTextColor("black");
    this.pdfDoc.setFontSize(11);
  }

  /**
   *
   * @param {string} text Content for the paragraph
   * @param {string} color Text color for paragraph
   */
  addText(text, color = "black") {
    this.pdfDoc.setTextColor(color);
    this.pdfDoc.text(text, this.position.x, this.position.y);
    this.pdfDoc.setTextColor("black");
    this.position.y += 5.5;
  }

  resetPdf() {
    for (let i = this.pageCounter; i > 0; i--) {
      this.pdfDoc.deletePage(i);
    }
    this.pageCounter = 1;
    this.pdfDoc.addPage();

    this.showPdf();
  }

  newPage() {
    this.position = { ...this.margin };
    this.pdfDoc.addPage();
    this.pageCounter++;
  }

  showPdf() {
    if (this.domRef) {
      this.domRef.src = this.getPdfUrl();
    }
  }
}

