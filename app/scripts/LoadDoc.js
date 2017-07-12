import I from 'immutable'
import moment from 'moment'

import React from 'react'
import Dropzone from 'react-dropzone'
import FileSaver from 'file-saver'
import JSZip from 'jszip'
import Docxtemplater from 'docxtemplater'
import path from 'path'

const cls = s => s ? `LoadDoc-${s}` : 'LoadDoc'

export default class LoadDoc extends React.Component {

  static propTypes = {
    data: React.PropTypes.any,
  }

  _fixNumber (number) {
    const parsedNumber = _.replace(_.trim(number), ',', '.')
    const hasDecimal = !_.isNil(parsedNumber.match(/[.]\d{1,2}$/))
    const decimal = hasDecimal && parsedNumber.match(/[.]\d{1,2}$/)[0].replace('.', ',')
    const integer = parsedNumber.replace(/[.]\d{1,2}$/, '')
    return hasDecimal ? integer.concat(decimal) : integer
  }

  getDocFiles (event) {
    const data = this.props.data
    const zip = new JSZip()
    const fatture = I.List(data[0].Fatture)
    console.log(fatture.size, 'numero fatture totali')
    let fattureCount = 0
    I.List(data[0].Soggetti).map((s, i) => {
      const key = i + 1
      const data = event.target.result
      const zipData = new JSZip(data)
      const doc = new Docxtemplater()
      doc.loadZip(zipData)
      const fattureRelative = fatture.filter(f => f.codice_univoco === s.codice_univoco)
      fattureCount += fattureRelative.size
      const fattureScadenza = []
      fattureRelative.forEach(f => {
        fattureScadenza.push(` ${f.codice_fattura} con scadenza al ${moment(f.data_scadenza).format('DD/MM/YYYY')}`)
      })
      this._fixNumber(s.interessi)
      doc.setData({
        data: moment().format('DD/MM/YYYY'),
        ragione_sociale: s.ragione_sociale,
        città: s.città,
        via: s.via,
        cap: s.cap,
        provincia: s.provincia,
        pec: s.pec,
        codice_univoco: s.codice_univoco,
        codici_contratto: _.trimEnd(s.codici_contratto),
        fornitura: s.fornitura,
        credito_netto: this._fixNumber(s.credito_netto),
        interessi: this._fixNumber(s.interessi),
        totale: this._fixNumber(s.totale),
        codice_fattura_scadenza: fattureScadenza,
        totale_complessivo: this._fixNumber(s.totale_complessivo)
      })
      try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render()
      }
      catch (error) {
        var e = {
          message: error.message,
          name: error.name,
          stack: error.stack,
          properties: error.properties,
        }
        console.log(JSON.stringify({ error: e }));
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
        throw error;
      }
      const buf = doc.getZip().generate({ type: 'ArrayBuffer' })
      zip.file(`documento${key}.docx`, buf)
    })
    console.log(fattureCount)
    const zipToSave = zip.generate({type:"blob"})
    FileSaver.saveAs(zipToSave, "ex.zip")
  }

  onDrop (files) {
    let i,f
    for (i = 0; i != files.length; ++i) {
      f = files[i]
      const reader = new FileReader()
      const name = f.name
      reader.onload = e => {
        {this.getDocFiles(e)}
      }
      reader.readAsBinaryString(f)
    }
  }

  render () {
    const data = this.props.data
    return (
      <div className={cls()}>
        <Dropzone onDrop={this.onDrop.bind(this)}>
          Word
        </Dropzone>
      </div>
    )
  }
}
