import { useSelector } from 'react-redux';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import QueBox from "../forms/queBox";
import PdfDumpForm from 'forms/pdfDumpForm ';
const Main: React.FC = () => {
    const { pdfInd, pdfs,tagPdf } = useSelector(state => state.auth);
    const width = "100%"
    const height = "100%"
    return (
        <>            
            <QueBox />
            <div className="viewer">
                {pdfs[0] && pdfInd === 0 ?
                    <embed
                        src={`data:application/pdf;base64,${pdfs[0]['data']}#zoom=60`}
                        type="application/pdf"
                        width={width}
                        height={height}
                    /> :
                    pdfs[1] && pdfInd === 1 ?
                    <embed
                        src={`data:application/pdf;base64,${pdfs[1]['data']}#zoom=60`}
                        type="application/pdf"
                        width={width}
                        height={height}
                    /> 
                    :
                    pdfs[2] && pdfInd === 2 ?
                    <embed
                        src={`data:application/pdf;base64,${pdfs[2]['data']}#zoom=60`}
                        type="application/pdf"
                        width={width}
                        height={height}
                    /> 
                    :
                    pdfs[3] && pdfInd === 3 ?
                    <embed
                        src={`data:application/pdf;base64,${pdfs[3]['data']}#zoom=60`}
                        type="application/pdf"
                        width={width}
                        height={height}
                    /> 
                    :
                    tagPdf[0] && pdfInd === 4 ?
                    <embed
                        src={`data:application/pdf;base64,${tagPdf[0]['data']}#zoom=60`}
                        type="application/pdf"
                        width={width}
                        height={height}
                    /> 
                    : null}
            </div>
            <PdfDumpForm/>
        </>
    )
}
export default Main