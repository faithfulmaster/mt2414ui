/**
 * @module src/DownloadTokens
 *
 * Component that display SourceDocument
 * Accepts the following properties:
 *  - language: Ethnologue code of the language
 *  - version: Version of the language
 *  - revision: Autogenerated for each updation of this same source
*/

import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import { FormControl } from 'react-bootstrap';
import SourceLanguages from './SourceLanguages';
import $ from 'jquery';
import GlobalURL from './GlobalURL';


class DownloadTokens extends Component {
  constructor(props) {
    super(props);

    this.state = {
      language: 'tam',
      version: '',
      revision: '',
      uploaded:'uploadingStatus',
      message: ''
    }
      // Upload file specific callback handlers
      this.onSelect = this.onSelect.bind(this);
      this.downloadTokenWords = this.downloadTokenWords.bind(this);
      this.parseJSONToXLS = this.parseJSONToXLS.bind(this);
  }
  
  onSelect(e) {
    this.setState({
      [e.target.name]: e.target.value });
  }

// For Downloads Token words
  downloadTokenWords(e){
    e.preventDefault();
    var _this = this
    var data = { 
        "language": this.state.language, "version": this.state.version, "revision": this.state.revision 
    }
    let accessToken = JSON.parse(window.localStorage.getItem('access_token'))
    $.ajax({
      url: GlobalURL["hostURL"]+"/v1/autotokens",
      contentType: "application/json; charset=utf-8",
      data : JSON.stringify(data),
      method : "POST",
      headers: {
                "Authorization": "bearer " + JSON.stringify(accessToken['access_token']).slice(1,-1),
      },
      success: function (result) {
        if (result){
         _this.parseJSONToXLS(result);
        }
        _this.setState({message: result.message, uploaded: 'success'})
      },
      error: function (error) {
       _this.setState({message: error.message, uploaded: 'failure'})
      }
    });  
  }

  // for parse JSON to XLS
  parseJSONToXLS(jsonData) {
      var jsonData1 = '';
       var dataUri1 = '';
      jsonData = JSON.parse(jsonData)
      $.each(jsonData, function(key, value) {
        var newLine = JSON.stringify(JSON.parse(JSON.stringify(jsonData[key]))).replace(/(?:\\[rn]|[\r\n]+)+/g, '\n');
        // var newLineLength = newLine.length;
        // var newLineBefore = '';
        // for( var i = 0; i < newLineLength; i++) {
        //   newLineBefore += newLine[i];
        // }
        jsonData1 = key + '\t \t' + newLine  + '\n'
        dataUri1 = jsonData1 + dataUri1;
      });
        let dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(dataUri1);
        let exportFileDefaultName = this.state.language + this.state.version + 'Tokens.xls';    
        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
  }


  render() {
    return(
      <div className="container">
        <Header/ >
            <h1 className="source-header">Download Tokens & Concordances</h1>&nbsp;
            <div className={"alert " + this.state.uploaded === 'success'? 'alert-success' : 'invisible'}>
                <strong>{this.state.message}</strong>
            </div>
            <div className={"alert " + this.state.uploaded === 'failure'? 'alert-danger': 'invisible' }>
                <strong>{this.state.message}</strong>
            </div>
          <div className="row">
            <form className="col-lg-4 uploader" encType="multipart/form-data">
              <div className="form-group">
                <lable className="control-label"> <strong> Language Name </strong> </lable>
                    <FormControl value={this.state.language} onChange={this.onSelect} name="language" componentClass="select" placeholder="select">
                      {SourceLanguages.map((language, i) => <option  key={i} value={language.code}>{language.value}</option>)}
                    </FormControl>
              </div>&nbsp;
              <div className="form-group">
                <lable className="control-lable"> <strong> Version </strong> </lable>
                    <input value={this.state.version} onChange={this.onSelect} name="version" type="text"  placeholder="version" className="form-control"/> 
              </div>&nbsp;
              <div className="form-group">
                <lable className="control-lable"> <strong> Revision </strong> </lable>
                    <input value={this.state.revision} onChange={this.onSelect} name="revision" type="text" placeholder="revision" className="form-control"/> 
              </div>&nbsp;
              <div className="form-group">
                <div className="form-group">
                  <button id="button" type="button" className="btn btn-success" onClick={this.downloadTokenWords}><span className="glyphicon glyphicon-download-alt">&nbsp;</span>Download Token & Concordances</button>&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
              </div>
            </form>
            <div className="col-lg-4">
              <h1>66 Books</h1>
            </div>
            <div className="col-lg-4">
              <h1>Result of 66 book</h1>
            </div>
          </div>
        <Footer/>
      </div>
      );
    }
}

export default DownloadTokens;