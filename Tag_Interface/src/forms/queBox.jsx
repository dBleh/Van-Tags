import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ControlledInput from './controlledInput'
import { pdfToExtract, editItem, changeInd, getPdfData, removePdfData, getTagPdf, getSel } from '../features/authSlice'
import Search from "../forms/searchForm";

function QueBox() {
  const { items, pdfData} = useSelector(state => state.auth);
  const [queue, setQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch()
  //Called when users click on the Clear button, removes all values from selected item index
  const onRemove = (index) => {
    const newItems = [...items];
    newItems[index] = ['', '', '', '', '', '', ''];
    dispatch(editItem(newItems));
  }
  //Adds dispatch calls for Nanonets to the a queue
  const addToQueue = (item) => {
    setQueue([...queue, item]);
  };
  //Processes queue 
  const processQueue = async () => {
    if (queue.length > 0 && !isProcessing) {
      setIsProcessing(true);
      const item = queue[0];
      dispatch(pdfToExtract(item));
      setQueue(queue.slice(1));
      setIsProcessing(false);
    }
  };
  //Continuously manages queue
  useEffect(() => {
    processQueue();
  }, [queue]);
  //Called by Preview button. Changes pdf view index to tag pdf. 
  const onSubmit = async () => {
    dispatch(changeInd(4));
    addToQueue(items);
    await processQueue(); // Wait for the queue to finish processing before dispatching the next action
    dispatch(getTagPdf(items));
  };
 //Called on input changes. Handles edits.
  const onEdit = (index, prop, val) => {
    const newItems = items.map((item, i) => {
      if (i === index) {
        if (prop === 'size') {
          return [item[0], val, item[2], item[3], item[4], item[5], item[6]];
        } else if (prop === 'bulbs') {
          return [item[0], item[1], val, item[3], item[4], item[5], item[6]];
        } else if (prop === 'detailsFirst') {
          return [item[0], item[1], item[2], val, item[4], item[5], item[6]];
        } else if (prop === 'detailsSecond') {
          return [item[0], item[1], item[2], item[3], val, item[5], item[6]];
        } else if (prop === 'detailsThird') {
          return [item[0], item[1], item[2], item[3], item[4], val, item[6]];
        } else if (prop === 'price') {
          return [item[0], item[1], item[2], item[3], item[4], item[5], val];
        }
        else if (prop === 'itemCode')
          return [val, item[1], item[2], item[3], item[4], item[5], item[6]];
      }
      return item;
    });
    dispatch(editItem(newItems));
  };
  //Handles pdf index changes.
  const onSwitch = (e) => {
    dispatch(changeInd(e));
  }
  //Handles item code changes.
  const itemChange = (value, index) => {
    onEdit(index, 'itemCode', value)
  }
  //Handles item selection from search input dropdown
  const handleItemAdd = (value, index) => {
    var newItems = [index, value]
    dispatch(getPdfData(newItems));
    dispatch(getSel(newItems))
    onEdit(index, 'itemCode', value)
  };
  //Modifies input data based on returned information from Nanonets parsing
  if (pdfData !== null) {
    if (pdfData.length !== 0) {
      var temp = []
      for (var i = 0; i < pdfData.length; i++) {
        temp.push([items[i][0],
        pdfData[i].size,
        pdfData[i].bulbs,
        pdfData[i].detailsFirst,
        pdfData[i].detailsSecond,
        pdfData[i].detailsThird,
          'price'
        ])
      }
      dispatch(editItem(temp))
      dispatch(removePdfData())
    }
  }

  return (
    <>
      <div className='queuedBox'>
        <div className='innerBox'>
          {items.map((item, index) => (
            <div className='mainBox' key={index}>
              {item.length === 7 ?
                <div>
                  <button className='removeItem' style={{ display: "inline-block" }} onClick={() => onRemove(index, item)}>Clear</button>
                  <div className="vertical-line"></div>
                  <Search
                    onItemAdd={(item) => handleItemAdd(item, index)}
                    onChangeAdd = {(item) => itemChange(item, index)}
                  />
                  <label className='sizeLabel'>
                    Size
                    <ControlledInput
                      className="size"
                      type="text"
                      value={item[1]}
                      onChange={(event) => onEdit(index, 'size', event.target.value)}
                    ></ControlledInput>
                  </label>
                  <label className='bulbsLabel'>
                    Bulbs
                    <ControlledInput
                      className="bulbs"
                      type="text"
                      value={item[2]}
                      onChange={(event) => onEdit(index, 'bulbs', event.target.value)}
                    ></ControlledInput>
                  </label>
                  <label className='detailsFirstLabel'>
                    Details
                    <ControlledInput
                      className="details"
                      type="text"
                      value={item[3]}
                      onChange={(event) => onEdit(index, 'detailsFirst', event.target.value)}
                    ></ControlledInput>
                  </label>
                  <label className='detailsSecondLabel'>
                    Details
                    <ControlledInput
                      className="details"
                      type="text"
                      value={item[4]}
                      onChange={(event) => onEdit(index, 'detailsSecond', event.target.value)}
                    ></ControlledInput>
                  </label>
                  <label className='detailsThirdLabel'>
                    Details
                    <ControlledInput
                      className="details"
                      type="text"
                      value={item[5]}
                      onChange={(event) => onEdit(index, 'detailsThird', event.target.value)}
                    ></ControlledInput>
                  </label>
                  <label className='priceLabel'>
                    Price
                    <ControlledInput
                      className="price"
                      type="text"
                      value={item[6]}
                      onChange={(event) => onEdit(index, 'price', event.target.value)}
                    ></ControlledInput>
                  </label>

                  <button className='changePdf' onClick={() => onSwitch(index)}>View</button>
                </div> : <></>
              }
            </div>
          ))}
        </div>
        <button className = 'previewButton' onClick={onSubmit}>Preview</button>
      </div>
    </>
  )
}

export default QueBox