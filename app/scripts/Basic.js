import classnames from 'classnames'
import _ from 'lodash'
import React from 'react'
import Dropzone from 'react-dropzone'
import XLSX from 'xlsx'
import LoadDoc from './LoadDoc'

const cls = s => s ? `Basic-${s}` : 'Basic'

export default class Basic extends React.Component {
  state = {
    files: [],
  }

  parserToJS (workbook) {
    var result = {};
    workbook.SheetNames.forEach(sheetName => {
      var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
      if(roa.length > 0){
        result[sheetName] = roa
      }
    })
    return result;
  }

  fixdata (data) {
    var o = '', l = 0, w = 10240;
    for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
    o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
    return o;
  }

  onDrop (files) {
    console.log(files)
    const rABS = false // true: readAsBinaryString ; false: readAsArrayBuffer
    let i,f
    let jsonFiles = []
    for (i = 0; i != files.length; ++i) {
    f = files[i];
    var reader = new FileReader();
    var name = f.name;
    reader.onload = e => {
      var data = e.target.result;
      var workbook;
      if(rABS) {
        /* if binary string, read with type 'binary' */
        workbook = XLSX.read(data, {type: 'binary'});
        const json = this.parserToJS(workbook)
        jsonFiles.push(json)
      } else {
        /* if array buffer, convert to base64 */
        var arr = this.fixdata(data)
        workbook = XLSX.read(btoa(arr), {type: 'base64'});
        const json = this.parserToJS(workbook)
        jsonFiles.push(json)
      }
      /* DO SOMETHING WITH workbook HERE */
    };
    if(rABS) reader.readAsBinaryString(f);
    else reader.readAsArrayBuffer(f);
  }
    this.setState({
      files,
      jsonFiles
    });
  }

  getLoadDoc () {
    if (_.isNil(this.state.jsonFiles)) {
      return null
    }
    return <LoadDoc data={this.state.jsonFiles}/>
  }
  render() {
    const className = classnames(cls(), {
      [cls('-loaded')]: this.state.files.length !== 0,
    })
    console.log(this.state.jsonFiles)
    return (
      <div className={className}>
        <div className={cls('excel')}>
          <Dropzone onDrop={this.onDrop.bind(this)}>
            Excel
          </Dropzone>
          <h3>Excel caricato</h3>
          <o>
            {
              this.state.files.map(f => <span key={f.name}>{f.name} - {(f.size / 1024).toFixed(2)} kb</span>)
            }
          </o>
        </div>
        {this.getLoadDoc()}
      </div>
    )
  }
}
