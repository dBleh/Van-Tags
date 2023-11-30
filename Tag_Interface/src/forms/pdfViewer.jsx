const PDFViewer = ({ data }) => {
  const pdfData = data;
  return (
    <embed
      src={`data:application/pdf;base64,${pdfData}`}
      type="application/pdf"
      width="100%"
      height="600"
    />
  );
};

export default PDFViewer;