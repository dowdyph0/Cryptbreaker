import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import MUIDataTable from "mui-datatables";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import VPNKeyIcon from "@material-ui/icons/VpnKey";
import PolicyIcon from '@material-ui/icons/Policy';
import Assessment from "@material-ui/icons/Assessment";
import ImportExportIcon from "@material-ui/icons/ImportExportRounded"
import Tooltip from "@material-ui/core/Tooltip";
import LinearProgress from '@material-ui/core/LinearProgress';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Hashes, HashFiles, HashCrackJobs } from '/imports/api/hashes/hashes.js';
import CustomToolbarSelect from "./CustomToolbarSelect";
import ReactDOM from 'react-dom';
import { AWSCOLLECTION } from '/imports/api/aws/aws.js'
import Spinner from '/imports/ui/components/Spinner';
import Swal from 'sweetalert2'

import './Landing.scss';
import { HashFileUploadJobs } from '../../../api/hashes/hashes';
import HashFileUploadStatus from '../../components/HashFileUploadStatus'

class Landing extends React.Component {

  state = {
    searchText: ''
  };
  
  componentWillMount() {
    if (!this.props.loggedIn) {
      return this.props.history.push('/login');
    }
    return true;
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.loggedIn) {
      nextProps.history.push('/login');
      return false;
    }
    return true;
  }

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          backgroundColor: "#FFF",
          width: "20em"
        }
      }
    }
  })

  handleClickReport = () => {
    let id = ''
    if(typeof event.target.getAttribute('rowid') === 'string'){
      id = event.target.getAttribute('rowid')
    } else if (event._targetInst){
      if(typeof event._targetInst.pendingProps.rowid === 'string') {
        id = event._targetInst.pendingProps.rowid
      } else {
        id = event._targetInst.stateNode.ownerSVGElement.getAttribute('rowid')
      }
    } else if (typeof event.target.ownerSVGElement.getAttribute('rowid') === 'string'){
      id = event.target.ownerSVGElement.getAttribute('rowid')
    } else {
      console.log(event)
      return
    }
    // let id = event.target.getAttribute('rowid') ? event.target.getAttribute('rowid') : (event._targetInst.pendingProps.rowid ? event._targetInst.pendingProps.rowid : event._targetInst.stateNode.ownerSVGElement.getAttribute('rowid'))
    window.open(`/report/${id}`)
    // console.log(id)
    // console.log(event)

    // console.log(event.target.getAttribute('rowid'))
    // console.log(event._targetInst.pendingProps.rowid)
    // console.log(event._targetInst.stateNode.ownerSVGElement.getAttribute('rowid'))
    return
  };

  handleClickPolicy = () => {
    let id = ''
    if(typeof event.target.getAttribute('rowid') === 'string'){
      id = event.target.getAttribute('rowid')
    } else if (event._targetInst){
      if(typeof event._targetInst.pendingProps.rowid === 'string') {
        id = event._targetInst.pendingProps.rowid
      } else {
        id = event._targetInst.stateNode.ownerSVGElement.getAttribute('rowid')
      }
    } else if (typeof event.target.ownerSVGElement.getAttribute('rowid') === 'string'){
      id = event.target.ownerSVGElement.getAttribute('rowid')
    } else {
      console.log(event)
      return
    }
    // let id = event.target.getAttribute('rowid') ? event.target.getAttribute('rowid') : (event._targetInst.pendingProps.rowid ? event._targetInst.pendingProps.rowid : event._targetInst.stateNode.ownerSVGElement.getAttribute('rowid'))
    (async () => {
      const { value: advancedOptions } = await Swal.fire({
        title: 'Password Policy',
        html:
          '<input type="checkbox" id="length_requirement" name="length_requirement" value="length_requirement" checked><p style="display:inline-block;">At least&nbsp</p><input size="1" type="text" pattern="[0-9]*" id="minimum_length" name="minimum_length" value="8"><p style="display:inline-block;">&nbspcharacters</p><br/>'+
          '<input type="checkbox" id="uppercase_requirement" name="uppercase_requirement" value="uppercase_requirement" checked><p style="display:inline-block;">At least&nbsp</p><input size="1" type="text" pattern="[0-9]*" id="count_upper_required" name="count_upper_required" value="2"><p style="display:inline-block;">&nbspuppercase characters</p><br/>'+
          '<input type="checkbox" id="lowercase_requirement" name="lowercase_requirement" value="lowercase_requirement" checked><p style="display:inline-block;">At least&nbsp</p><input size="1" type="text" pattern="[0-9]*" id="count_lower_required" name="count_lower_required" value="2"><p style="display:inline-block;">&nbsplowercase characters</p><br/>'+
          '<input type="checkbox" id="symbols_requirement" name="symbols_requirement" value="symbols_requirement" checked><p style="display:inline-block;">At least&nbsp</p><input size="1" type="text" pattern="[0-9]*" id="count_symbols_required" name="count_symbols_required" value="2"><p style="display:inline-block;">&nbspspecial characters</p><br/>'+
          '<input type="checkbox" id="numbers_requirement" name="numbers_requirement" value="numbers_requirement" checked><p style="display:inline-block;">At least&nbsp</p><input size="1" type="text" pattern="[0-9]*" id="count_numbers_required" name="count_numbers_required" value="2"><p style="display:inline-block;">&nbspnumerical characters</p><br/>'+
          '<input type="checkbox" id="no_username_in_password" name="no_username_in_password" value="no_username_in_password" checked><p style="display:inline-block;">Check for username in password</p><br/>',
        focusConfirm: false,
        preConfirm: () => {
          return {
            hasLengthRequirement:document.getElementById('length_requirement').checked,
            lengthRequirement:parseInt(document.getElementById('minimum_length').value,10),
            hasUpperRequirement:document.getElementById('uppercase_requirement').checked,
            upperRequirement:parseInt(document.getElementById('count_upper_required').value,10),
            hasLowerRequirement:document.getElementById('lowercase_requirement').checked,
            lowerRequirement:parseInt(document.getElementById('count_lower_required').value,10),
            hasSymbolsRequirement:document.getElementById('symbols_requirement').checked,
            symbolsRequirement:parseInt(document.getElementById('count_symbols_required').value,10),
            hasNumberRequirement:document.getElementById('numbers_requirement').checked,
            numberRequirement:parseInt(document.getElementById('count_numbers_required').value,10),
            hasUsernameRequirement:document.getElementById('no_username_in_password').checked
          }
        }
      })
      if(advancedOptions) {
        Meteor.call('configurePasswordPolicy', id, advancedOptions, (err)=>{
          if(err){
            Swal.fire({
              title: 'Configure Policy Failed',
              type: 'error',
              timer:3000,
              toast:true,
              position:'top-right',
              animation:false,
            })
          }
          else {
            Swal.fire({
              title: 'Configure Policy Success',
              type: 'success',
              timer:3000,
              toast:true,
              position:'top-right',
              animation:false,
            })
          }
        })
      }
    })();
    return
  };

  handleClickCrack = () => {
    let id = ''
    if(typeof event.target.getAttribute('rowid') === 'string'){
      id = event.target.getAttribute('rowid')
    } else if (event._targetInst){
      if(typeof event._targetInst.pendingProps.rowid === 'string') {
        id = event._targetInst.pendingProps.rowid
      } else {
        id = event._targetInst.stateNode.ownerSVGElement.getAttribute('rowid')
      }
    } else if (typeof event.target.ownerSVGElement.getAttribute('rowid') === 'string'){
      id = event.target.ownerSVGElement.getAttribute('rowid')
    } else {
      console.log(event)
      return
    }
    let ids = [];
    ids.push(id);
    // console.log(ids)
    // return
    let instanceType = '';
    let duration = 1;
    // Before cracking hashes... we ned to ask a few questions (instance type decision, maximum price willing to pay/hour, time to run (in hours) )
    // First refresh the known spot prices...
    Swal.fire({
        title: 'Retrieving Price Data',
        text: 'Please wait while we retrieve the latest Spot Pricing information',
        type: 'info',
        animation:false,
        showConfirmButton:false,
      })
    Meteor.call('getSpotPricing', (err, res)=>{
        if(err){
          Swal.fire({
            title: 'Spot Price Check Failed',
            text:err.details,
            type: 'error',
            animation:false,
            showConfirmButton:true,
          })
        }
        else {
          console.log(this)
          Swal.fire({
            title: 'Pricing Data Updated',
            text:this.props.awsPricing[0].data,
            type: 'success',
            animation:false,
            showConfirmButton:true,
            confirmButtonText:"Continue",
          })
          let inputOptions = {
          }
          for (let [key, value] of Object.entries(this.props.awsPricing[0].data)) {
            // console.log(`${key}: ${value}`);
            if(key === 'p3_2xl'){
                inputOptions.p3_2xl = `${key} - $${value.cheapest}/hr (${value.az})`
            } 
            else if(key === 'p3_8xl'){
                inputOptions.p3_8xl = `${key} - $${value.cheapest}/hr (${value.az})`
            } 
            else if(key === 'p3_16xl'){
                inputOptions.p3_16xl = `${key} - $${value.cheapest}/hr (${value.az})`
            } 
            else if(key === 'p3dn_24xl'){
                inputOptions.p3dn_24xl = `${key} - $${value.cheapest}/hr (${value.az})`
            } 
          } 
          Swal.fire({
            title: 'Select an Instance Type',
            input: 'select',
            // inputOptions: {
            //   apples: 'Apples',
            //   bananas: 'Bananas',
            //   grapes: 'Grapes',
            //   oranges: 'Oranges'
            // },
            inputOptions: inputOptions,
            inputPlaceholder: 'Instance Type',
            showCancelButton: true,
            // inputValidator: (value) => {
            //   return new Promise((resolve) => {
            //     if (value === 'oranges') {
            //       resolve()
            //     } else {
            //       resolve('You need to select oranges :)')
            //     }
            //   })
            // }
          }).then((result) => {
            // console.log(result);
            if (result.value) {
                let rate = ''
                if(result.value === 'p3_2xl'){
                    rate = this.props.awsPricing[0].data.p3_2xl.cheapest
                } 
                else if(result.value === 'p3_8xl'){
                    rate = this.props.awsPricing[0].data.p3_8xl.cheapest
                } 
                else if(result.value === 'p3_16xl'){
                    rate = this.props.awsPricing[0].data.p3_16xl.cheapest
                } 
                else if(result.value === 'p3dn_24xl'){
                    rate = this.props.awsPricing[0].data.p3dn_24xl.cheapest
                } 
                instanceType = result.value;
                // Here is the more detailed prompt for no redaction/class level/length
                (async () => {
                  const { value: formValues } = await Swal.fire({
                    title: 'Redaction Settings',
                    html:
                      '<br/><p>Please choose a level of redaction<br/>Example: if the pasword is Summer2019!</p>'+
                      '<table style="width:100%"><tr><th>Redaction Level</th><th>Results sent out of EC2 instance</th></tr>'+
                      '<tr><td><input type="radio" id="redaction_none" name="redaction" value="redaction_none" checked><label for="redaction_none">&nbspNone</label></td><td>Summer2019!</td></tr>'+
                      '<tr><td><input type="radio" id="redaction_character" name="redaction" value="redaction_character"><label for="redaction_character">&nbspCharacter</label></td><td>Ulllll0000*</td></tr>'+
                      '<tr><td><input type="radio" id="redaction_length" name="redaction" value="redaction_length"><label for="redaction_length">&nbspLength</label></td><td>**********</td></tr>'+
                      '<tr><td><input type="radio" id="redaction_full" name="redaction" value="redaction_full"><label for="redaction_full">&nbspFull</label></td><td>cracked</td></tr></table>'+
                      '<br/><input type="checkbox" id="advanced_options" name="advancedOptions"><label for="advanced_options">&nbspConfigure Advanced Cracking Options</label>',                    
                    focusConfirm: false,
                    preConfirm: () => {
                      return {
                        redactionNone:document.getElementById('redaction_none').checked,
                        redactionCharacter:document.getElementById('redaction_character').checked,
                        redactionLength:document.getElementById('redaction_length').checked,
                        redactionFull:document.getElementById('redaction_full').checked,
                        configureAdvanced:document.getElementById('advanced_options').checked
                      }
                    }
                  })
                  if (formValues) {
                    // console.log(formValues)
                    let redactionText = ''
                    if(formValues.redactionNone){
                      redactionText = "No redaction will be performed prior to passwords leaving the EC2 instance"
                    } else if(formValues.redactionCharacter){
                      redactionText = "Character masking will occur prior to passwords leaving the EC2 instance."
                    } else if(formValues.redactionLength){
                      redactionText = "Passwords will be fully masked prior to leaving the EC2 instance."
                    } else if(formValues.redactionFull){
                      redactionText = "No form of password information will leave the EC2 instance, you will just know IF the password was able to be cracked."
                    } 
                    if(formValues.configureAdvanced){
                        const { value: advancedOptions } = await Swal.fire({
                          title: 'Advanced Configuration',
                          html:
                            '<input type="checkbox" id="use_dictionaries" name="dictionaries" value="use_dictionaries" checked><label for="use_dictionaries">&nbspPerform Dictionary Attack</label>'+
                            '<br/><input size="1" type="text" pattern="[0-9]*" id="brute_length" name="brute_length" value="7"><label for="brute_length">&nbspBrute Force Limit (0 to disable)</label>',
                          focusConfirm: false,
                          preConfirm: () => {
                            return {
                              dictionaries:document.getElementById('use_dictionaries').checked,
                              bruteforce:document.getElementById('brute_length').value
                            }
                          }
                        })
                      if(advancedOptions){
                        let advancedText = ''
                        if(advancedOptions.dictionaries && (advancedOptions.bruteforce === "0" || advancedOptions.bruteforce === "")){
                          advancedText = "dictionary attacks only"
                        } else if(!advancedOptions.dictionaries && !(advancedOptions.bruteforce === "0" || advancedOptions.bruteforce === "")){
                          advancedText = `brute force only (limit: ${advancedOptions.bruteforce} characters)`
                        } else {
                          let charLim = (advancedOptions.bruteforce !== "0" && advancedOptions.bruteforce !== "") ? advancedOptions.bruteforce : "7" 
                          advancedOptions.bruteforce = charLim
                          advancedOptions.dictionaries = true
                          advancedText = `dictionary and brute force attacks (limit: ${advancedOptions.bruteforce} characters)`
                        }
                        // console.log(advancedOptions)
                        Swal.fire({
                          title: 'Verify Choices before Queuing',
                          html: `<p>You have selected to perform cracking with an <b>${instanceType}</b> instance at a rate of <b>$${rate}/hr</b> using <b>${advancedText}</b></p>`+
                          `<p>In order to ensure that our bid is met we will add <b>$0.25</b> to the current spot price for a maximum hourly rate of <b>$${(parseFloat(rate)+.25).toFixed(2)}</b></p>`+
                          `<p><b>${redactionText}</b></p><p>If this is correct please press launch below, otherwise cancel</p>`,
                          type: 'warning',
                          animation:false,
                          showConfirmButton:true,
                          showCancelButton:true,
                          confirmButtonText:"Launch",        
                      }).then((result) =>{
                          if(result.value){
                            let location = ''
                            let rate = ''
                            if(instanceType === 'p3_2xl'){
                                location = this.props.awsPricing[0].data.p3_2xl.az
                                rate = this.props.awsPricing[0].data.p3_2xl.cheapest
                            } 
                            else if(instanceType === 'p3_8xl'){
                                location = this.props.awsPricing[0].data.p3_8xl.az
                                rate = this.props.awsPricing[0].data.p3_8xl.cheapest
                            } 
                            else if(instanceType === 'p3_16xl'){
                                location = this.props.awsPricing[0].data.p3_16xl.az
                                rate = this.props.awsPricing[0].data.p3_16xl.cheapest
                            } 
                            else if(instanceType === 'p3dn_24xl'){
                                location = this.props.awsPricing[0].data.p3dn_24xl.az
                                rate = this.props.awsPricing[0].data.p3dn_24xl.cheapest
                            } 
            
                              Meteor.call('crackHashes',{ids:ids,duration:duration,instanceType:instanceType, availabilityZone:location, rate:rate, maskingOption:formValues, useDictionaries:advancedOptions.dictionaries, bruteLimit:advancedOptions.bruteforce}, (err) =>   {
                                  if(typeof err !== 'undefined'){
                                    // If we had an error...
                                    Swal.fire({
                                    title: 'Could not crack hash files requested',
                                    type: 'error',
                                    showConfirmButton: false,
                                    toast:true,
                                    position:'top-right',
                                    timer:3000,
                                    animation:false,
                                    })
                                  } else {
                                    Swal.fire({
                                    title: 'hashes queued for cracking',
                                    type: 'success',
                                    showConfirmButton: false,
                                    toast:true,
                                    position:'top-right',
                                    timer:3000,
                                    animation:false,
                                    })
                                  }
                              })
                          }
                      })
                      }
                  
                    } else {
                      Swal.fire({
                        title: 'Verify Choices before Queuing',
                        html: `<p>You have selected to perform cracking with an <b>${instanceType}</b> instance at a rate of <b>$${rate}/hr</b></p>`+
                        `<p>In order to ensure that our bid is met we will add <b>$0.25</b> to the current spot price for a maximum hourly rate of <b>$${(parseFloat(rate)+.25).toFixed(2)}</b></p>`+
                        `<p><b>${redactionText}</b></p><p>If this is correct please press launch below, otherwise cancel</p>`,
                        type: 'warning',
                        animation:false,
                        showConfirmButton:true,
                        showCancelButton:true,
                        confirmButtonText:"Launch",        
                    }).then((result) =>{
                        if(result.value){
                          let location = ''
                          let rate = ''
                          if(instanceType === 'p3_2xl'){
                              location = this.props.awsPricing[0].data.p3_2xl.az
                              rate = this.props.awsPricing[0].data.p3_2xl.cheapest
                          } 
                          else if(instanceType === 'p3_8xl'){
                              location = this.props.awsPricing[0].data.p3_8xl.az
                              rate = this.props.awsPricing[0].data.p3_8xl.cheapest
                          } 
                          else if(instanceType === 'p3_16xl'){
                              location = this.props.awsPricing[0].data.p3_16xl.az
                              rate = this.props.awsPricing[0].data.p3_16xl.cheapest
                          } 
                          else if(instanceType === 'p3dn_24xl'){
                              location = this.props.awsPricing[0].data.p3dn_24xl.az
                              rate = this.props.awsPricing[0].data.p3dn_24xl.cheapest
                          } 
          
                            Meteor.call('crackHashes',{ids:ids,duration:duration,instanceType:instanceType, availabilityZone:location, rate:rate, maskingOption:formValues,useDictionaries:true, bruteLimit:"7"}, (err) =>   {
                                if(typeof err !== 'undefined'){
                                  // If we had an error...
                                  Swal.fire({
                                  title: 'Could not crack hash files requested',
                                  type: 'error',
                                  showConfirmButton: false,
                                  toast:true,
                                  position:'top-right',
                                  timer:3000,
                                  animation:false,
                                  })
                                } else {
                                  Swal.fire({
                                  title: 'hashes queued for cracking',
                                  type: 'success',
                                  showConfirmButton: false,
                                  toast:true,
                                  position:'top-right',
                                  timer:3000,
                                  animation:false,
                                  })
                                }
                            })
                        }
                    })
                    }
                    
                  }
                })();
                
            }
          })
        }
      }) 
    return
    
  };

  handleImportExport = (event) => {
    let id = ''
    if(typeof event.target.getAttribute('rowid') === 'string'){
      id = event.target.getAttribute('rowid')
    } else if (event._targetInst){
      if(typeof event._targetInst.pendingProps.rowid === 'string') {
        id = event._targetInst.pendingProps.rowid
      } else {
        id = event._targetInst.stateNode.ownerSVGElement.getAttribute('rowid')
      }
    } else if (typeof event.target.ownerSVGElement.getAttribute('rowid') === 'string'){
      id = event.target.ownerSVGElement.getAttribute('rowid')
    } else {
      console.log(event)
      return
    }    // console.log(id)
    // console.log(event.target.getAttribute('rowid'))
    // console.log(event._targetInst.pendingProps.rowid)
    // console.log(event._targetInst.stateNode.ownerSVGElement.getAttribute('rowid'))
    // return
    // let ids = this.getIdsFromSelection();
    Swal.fire({
      title: 'Choose Export Type',
      input: 'select',
      // inputOptions: {
      //   apples: 'Apples',
      //   bananas: 'Bananas',
      //   grapes: 'Grapes',
      //   oranges: 'Oranges'
      // },
      inputOptions: {
        exportUncracked:"Export Uncracked Hashes",
        exportCracked: "Export Cracked Hashes"
      },
      inputPlaceholder: '',
      showCancelButton: true,
    }).then((result) => {
      if (result.value === "exportUncracked") {
        console.log("Export uncracked")
        // console.log(ids)
        // find all cracked hashes and create output of HASH:Plaintext
        let uncrackedHashes = Hashes.find({ $and: [{'meta.source':`${id}`},{'meta.cracked':{$not: true}}] },{'fields':{'data':1,'meta.type':1 }}).fetch()
        let dataToDownloadLM = ''
        let dataToDownloadNTLM = ''
        _.forEach(uncrackedHashes,(hash) => {
          if(hash.meta.type === "LM"){
            dataToDownloadLM +=  `${hash.data}\r\n`
          } else if(hash.meta.type === "NTLM") {
            dataToDownloadNTLM +=  `${hash.data}\r\n`
          }
          
        })
        if(dataToDownloadLM.length > 2) {
          var element = document.createElement('a');
          element.setAttribute('href', 'data:text/plaintext;charset=utf-8,' + encodeURIComponent(dataToDownloadLM));
          element.setAttribute('download', `${id}-LM-Uncracked.txt`);

          element.style.display = 'none';
          document.body.appendChild(element);

          element.click();

          document.body.removeChild(element);
        }
        if(dataToDownloadNTLM.length > 2) {
          var element = document.createElement('a');
          element.setAttribute('href', 'data:text/plaintext;charset=utf-8,' + encodeURIComponent(dataToDownloadNTLM));
          element.setAttribute('download', `${id}-NTLM-Uncracked.txt`);

          element.style.display = 'none';
          document.body.appendChild(element);

          element.click();

          document.body.removeChild(element);
        }
         
        
      } else if (result.value === "exportCracked"){
        // only single file supported
        // find all cracked hashes and create output of HASH:Plaintext
        let crackedHashes = Hashes.find({ $and: [{'meta.source':`${id}`},{'meta.cracked': true}] },{'fields':{'data':1,'meta.plaintext':1 }}).fetch()
        // console.log(crackedHashes)
        let dataToDownload = ''
        _.forEach(crackedHashes,(hash) => {
          console.log(hash)
          dataToDownload +=  `${hash.data.trim()}:${hash.meta.plaintext.trim()}\r\n`
        })
        // console.log(dataToDownload)
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plaintext;charset=utf-8,' + encodeURIComponent(dataToDownload));
        element.setAttribute('download', `${id}-cracked-hashes.potfile`);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      }
    })
  };

  render() {
    if (this.props.loggedIn && this.props.userReady ) {
      const getMuiTheme = () => createMuiTheme({
        overrides: {
          MUIDataTableHeadCell: {
            fixedHeader: {
              zIndex: 98
            }
          },
          MUIDataTable: {
            paper: {
            }
          }
        }
      });
      const columns = [
        {
          name:"_id",
          options:{
            display:false,
            filter:false,
          }
        },
        {
          name: "name",
          label:"File",
          options:{
            filter:false,
            customBodyRender: (value, tableMeta, updateValue) => {
              // console.log(tableMeta)
              let linkUrl = `/file/${tableMeta.rowData[0]}`
              return (
                <a href={linkUrl} target="_blank">{value}</a>
              );
            }  
          },
        },
        {
          name: "crackCount",
          label:"Hashes Cracked",
          options:{
            filter:false,
          },
        },
        {
          name: "distinctCount",
          label:"Different Hashes",
          options:{
            filter:false,
          },
        },
        {
          name: "hashCount",
          label:"Total Hashes",
          options:{
            filter:false,
          },
        },
        {
          name:"uploadDate",
          label:"Date Uploaded",
          options:{
            filter:false,
          },
        },
        {
          name:"actions",
          label:"Actions",
          options:{
            filter:false,
          },
        }      
      ];
  
      const hcjColumns = [
        {
          name:"uuid",
          label:"Job ID",
          options:{
            display:true,
            filter:false,
          }
        },
        {
          name: "status",
          label:"Status",
          options:{
            filter:true,
          },
        },
        {
          name: "duration",
          label:"Duration",
          options:{
            filter:false,
          },
        },
        {
          name: "instanceType",
          label:"Instance Type",
          options:{
            filter:false,
          },
        },
        {
          name:"availabilityZone",
          label:"Availability Zone",
          options:{
            filter:false,
          },
        }      
      ];
  
      let data = HashFiles.find().fetch();
      _.each(data,(item) => {
        item.uploadDate = item.uploadDate.toLocaleString().split(',')[0];
        item.actions = 
        <>
          <Tooltip rowid={item._id} title={"Attempt to Crack"}>
            <VPNKeyIcon  rowid={item._id} onClick={this.handleClickCrack} className="rotatedIcon" />
          </Tooltip>
          <Tooltip rowid={item._id} title={"Configure Password Policy"}>
            <PolicyIcon  rowid={item._id} onClick={this.handleClickPolicy} />
          </Tooltip>
          <Tooltip rowid={item._id} title={"Export Hash Data"} >
            <ImportExportIcon rowid={item._id} onClick={this.handleImportExport}/>
          </Tooltip>
          <Tooltip rowid={item._id} title={"View Report"}>
            <Assessment rowid={item._id} className="rotatedIcon" onClick={this.handleClickReport} />
          </Tooltip>
        </>
      })
  
      let hcjData = HashCrackJobs.find().fetch();
      _.each(hcjData, (item) =>{
        if(typeof item.spotInstanceRequest !== 'undefined' && (item.status === "Hashes Uploaded" || item.status === "cancelled")){
          if(item.spotInstanceRequest.Status.Code === "pending-evaluation"){
            item.status = "Spot Request Pending"
          } 
          else if(item.spotInstanceRequest.Status.Code === "capacity-not-available"){
            if(item.status == "cancelled"){
              item.status = "Spot Request Cancelled due to Lack of Capacity"
            }else {
              item.status = "Spot Request Capacity Not Available, Cancelling"
            }
          }
          else if(item.spotInstanceRequest.Status.Code === "fulfilled"){
            item.status = "Upgrading and Installing Necessary Software"
          }
        }
      })
      // _.each(data,(item) => {
      //   item.uploadDate = item.uploadDate.toLocaleString().split(',')[0];
      // })
  
      let innerColumns = [
        {
        name:"data",
        Label:"Hash",
        options:{
          display:true,
          filter:false,
        }
      },
      {
        name: "meta.type",
        label:"Type",
        options:{
          filter:true,
          sortDirection: 'desc',
        },
      },
      {
        name: "cracked",
        label:"Cracked",
        options:{
          filter:true,
        },
      },
    ];
      if (Roles.userIsInRole(Meteor.userId(), 'admin', Roles.GLOBAL_GROUP) === true) {
        innerColumns.push(
        {
          name: "meta.plaintext",
          label:"Password",
          options:{
            display:false,
            filter:false,
          },
        })
        innerColumns.push(
        {
          name: "meta.username",
          label:"Username",
          options:{
            display:false,
            filter:false,
          },
        })
        innerColumns.push(
        {
          name: "meta.lists",
          label:"Lists",
          options:{
            display:false,
            filter:false,
          },
        })
      }
      innerColumns.push(
      {
        name: "meta.inLists",
        label:"In Public List",
        options:{
          filter:true,
          sortDirection: 'desc',
        },
      })

      const options = {
        download:false,
        filter:false,
        print:false,
        viewColumns:false,
        expandableRows: false,
        expandableRowsOnClick: false,
        renderExpandableRow: (rowData, rowMeta) => {
          let fileUploadProcessing = false
          _.each(this.props.hashFileUploadJobs, (hashUploadJob) => {
            if(hashUploadJob.uploadStatus >= 0 && hashUploadJob.uploadStatus < 100 && hashUploadJob.hashFileID === rowData[0]){
              fileUploadProcessing = true
            }
          })
          let innerData = Hashes.find({'meta.source':rowData[0]}).fetch()
          let rowSourceID = rowData[0];
          _.each(innerData, (item) => {
            // console.log(item)
            if(item.meta.cracked === true){
              item.cracked = "yes"
            } else {
              item.cracked = "no"
            }
            if(typeof item.meta.lists !== 'undefined'){
              // if we have lists
              item.meta.inLists = "yes"
            } else {
              item.meta.inLists = "no"
            }
          })

          let innerOptions = {
            download:true,
            onDownload:  (buildHead, buildBody, columns,data) => {
              
              const realHandleDownload = async (buildHead, buildBody, columns,data, htmlValues, valuesCount) => {
                // first have UI popup similar to the 'start crack' flow
                
                const { value: formValues } = await Swal.fire({
                  title: 'Choose Columns to Export',
                  html: htmlValues,
                  focusConfirm: false,
                  preConfirm: () => {
                    let values = []
                    let i;
                    for (i = 0; i < htmlAndIndex[1]; i++) {
                      let element = document.getElementById(`swal-input${i}`)
                      values.push({value: element.value, isChecked: element.checked})
                    }
                    return values
                  }
                })
                
                if (formValues) {
                  const replaceDoubleQuoteInString = columnData =>
                  typeof columnData === 'string' ? columnData.replace(/\"/g, '""') : columnData;

                  const getArrayContents = columnData => {
                    if (typeof columnData === 'object'){                
                      return Object.values(columnData).join(",")
                    } else {
                      return columnData;
                    }
                  }

                  let newColumns = columns
                  _.forEach(newColumns, (column) => {
                    _.forEach(formValues, (value) => {
                      if(value.value === column.label) {
                        column.download = value.isChecked
                      }
                    })
                  })
                  
                  let reducedData = data.reduce(
                    (soFar, row) => 
                      soFar +
                      '"' +
                      row.data
                        .filter((_, index) => columns[index].download)
                        .map(columnData => getArrayContents(columnData))
                        .map(columnData => replaceDoubleQuoteInString(columnData))
                        .join('"' + ',' + '"') +
                      '"\r\n',
                    '',
                  ).trim()
                  
                  //console.log(columns)
                  //console.log(`reducedData ${reducedData}`)
                  // return false;
                  var element = document.createElement('a');
                  element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(buildHead(newColumns) + reducedData));
                  element.setAttribute('download', "export.csv");

                  element.style.display = 'none';
                  document.body.appendChild(element);

                  element.click();

                  document.body.removeChild(element);
                  // return buildHead(columns) + reducedData;
                }
              }

              const generateOptions = (columns) => {
                let htmlValues = '<div id="generatedSwalSelection">'
                let index = 0
                  // '<input id="swal-input1" class="swal2-check">' +
                  // '<input id="swal-input2" class="swal2-input">'
                _.forEach(columns, (column) => {
                  htmlValues += `<div class="dataExportOption"><input type="checkbox" id="swal-input${index}" value="${column.label}" checked>${column.label}</input></div>`
                  index++
                })
                htmlValues += '</div>'
                return [htmlValues, index]
              }

              let htmlAndIndex = generateOptions(columns)
              realHandleDownload(buildHead, buildBody, columns,data, htmlAndIndex[0], htmlAndIndex[1])              
              return false;
            },
            downloadOptions: {
              filterOptions:{
                useDisplayedRowsOnly:true
              }
            },
            filter:true,
            print:false,
            viewColumns:false,
          }
  
          if(Roles.userIsInRole(Meteor.userId(), 'admin')){
            innerOptions.searchText = this.state.searchText
            innerOptions.customSearch = (searchQuery, currentRow, columns) => {
              let isFound = false;
              //custom 'filter:' logic
              if(searchQuery.toLowerCase().split(':').length > 1 && searchQuery.toLowerCase().split(':')[0] == 'filter'){
                // passLength query
                if(searchQuery.toLowerCase().split(':')[1].includes('password.length')){
                  if(currentRow[2] == "yes" && currentRow[3].length > 0){
                    let splitVal = searchQuery.toLowerCase().split(':')[1].split(' ')
                    if(splitVal.length > 2){
                      if(["<",">","==","<=",">="].includes(splitVal[1])){
                        switch(splitVal[1]){
                          case "<":
                            if(currentRow[3].length < splitVal[2]) {
                              isFound = true
                            }
                            break
                          case ">":
                            if(currentRow[3].length > splitVal[2]) {
                              isFound = true
                            }
                            break
                          case "<=":
                            if(currentRow[3].length <= splitVal[2]) {
                              isFound = true
                            }
                            break
                          case ">=":
                            if(currentRow[3].length >= splitVal[2]) {
                              isFound = true
                            }
                            break
                          case "==":
                            if(currentRow[3].length == splitVal[2]) {
                              isFound = true
                            }
                            break
                        }
                      }
                    }
                    // console.log(currentRow[3])
                  }
                }
              } 
              currentRow.forEach(col => {
                if(typeof col !== 'undefined'){
                  //if (col.toString().indexOf(searchQuery) >= 0) {
                  if (JSON.stringify(col).indexOf(searchQuery) >= 0) {
                      isFound = true;
                  }
                }
              });
              return isFound;
            },
            innerOptions.expandableRows = true
            innerOptions.expandableRowsOnClick= true
            innerOptions.renderExpandableRow = (rowData, rowMeta) => {
              // console.log(rowData)
              return(
                <TableRow>
                  <TableCell style={{padding:'2em'}} colSpan={colSpan}>
                    { rowData[4][0] === "" ? (null) : (<><h4>Users</h4>{rowData[4][rowSourceID].map((user, i) => <p style={{paddingBottom:'.5em', marginBottom:'0em'}} >{user}</p>)}</>)}
                    {rowData[2] === "yes" ? (<><h4>Password:</h4><p style={{paddingBottom:'0em', marginBottom:'0em'}} >{rowData[3]}</p> </>) : (<><h4>Password:</h4><p style={{paddingBottom:'0em', marginBottom:'0em'}} >Not Yet Cracked</p> </>)}
                    {rowData[6] === "yes" ? (<><h4>Lists:</h4>{rowData[5].map((list, i) => <p style={{paddingBottom:'.5em', marginBottom:'0em'}} >{list}</p>)}</>) : (null)}
                  </TableCell>
                </TableRow>
              )
              
            }
          }
  
          const colSpan = rowData.length + 1;
          
          return (
            <TableRow>
              <TableCell style={{padding:'2em'}} colSpan={colSpan}>
                {/* <h4>Affected Hosts:</h4> */}
                <MuiThemeProvider theme={getMuiTheme()}>
                  <MUIDataTable
                      title={"Hashes"}
                      data={innerData}
                      columns={innerColumns}
                      options={innerOptions}
                      fullWidth
                    />
                </MuiThemeProvider>
              </TableCell>
            </TableRow>
          );
        },
        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
          <CustomToolbarSelect selectedRows={selectedRows} displayData={displayData} setSelectedRows={setSelectedRows} pricing={this.props.awsPricing}  />
        ),
      };
  
      
      
      const hcjOptions = {
        download:false,
        filter:true,
        print:false,
        viewColumns:false,
        onRowClick: (rowData, rowState) => {

          if(rowData[1].toLowerCase().includes("configure spot instances")) {
            /* From AWS:
            By default, there is an account limit of 20 Spot Instances per Region. If you terminate your Spot Instance but do not cancel the request, the request counts against this limit until Amazon EC2 detects the termination and closes the request.
            Spot Instance limits are dynamic. When your account is new, your limit might be lower than 20 to start, but can increase over time. In addition, your account might have limits on specific Spot Instance types. If you submit a Spot Instance request and you receive the error Max spot instance count exceeded, you can complete the AWS Support Center Create case form to request a Spot Instance limit increase. For Limit type, choose EC2 Spot Instances. For more information, see Amazon EC2 Service Limits.
            */
           Swal.fire({
            title: 'Spot Request Limits',
            type: 'info',
            animation:false,
            html: 'Spot Instance limits are dynamic. When your account is new, your limit might be lower than 20 to start, but can increase over time. In addition,'+
                  ' your account might have limits on specific Spot Instance types. If you submit a Spot Instance request and you receive the error Max spot instance'+
                  ' count exceeded, you can complete the AWS Support Center Create case form to request a Spot Instance limit increase. For Limit type, choose EC2 Spot'+
                  ' Instances. For more information, see Amazon EC2 Service Limits.<br><br>'+
                  `In order for this request to work you will need to sign into your AWS console, click 'Support' in the top right and 'Support Center'`+
                  `Then 'Create case' and choose 'Service Limit Increase'. For 'Limit Type' choose 'EC2 Spot Instances' then request the each of the regions and choose instance `+
                  `type of ${rowData[3]} and choose a limit value of something greater than 0. Do this for each region that has the instance type in question (except GovCloud) and give a reason in you caae description and click submit<br><br>`+
                  `Once the request is submitted it can take 12-48 hours before the request is completed (though sometimes longer and sometimes shorter)`
          })
           
          }
        }
      };

      return (
          <div style={{marginTop:'2%'}} className="landing-page">          
            {this.props.subsReady ? (
              <>
              <HashFileUploadStatus hashUploadJobs={this.props.hashFileUploadJobs} />
              <MUIDataTable
                className={"hashTable"}
                title={"Hash Files Uploads"}
                data={data}
                columns={columns}
                options={options}
              />
              <div className="break"></div>
              <MUIDataTable
                className={"hashCrackJobsTable"}
                title={"Hash Crack Jobs"}
                data={hcjData}
                columns={hcjColumns}
                options={hcjOptions}
              />
            </>
          ) : (
            <>
              <Spinner title={"Loading Hashes"} />
            </>
          ) }        

        </div>
      );
    }
    return (
      <div className="landing-page">
        <h1>Landing Page</h1>
      </div>
    );
  }
}

Landing.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withTracker(() => {
  const hashFilesSub = Meteor.subscribe('hashFiles.all');
  const hashFiles = HashFiles.find().fetch();
  const hashCrackJobsSub = Meteor.subscribe('hashCrackJobs.all');
  const hashCrackJobs = HashCrackJobs.find().fetch();
  const hashFileUploadJobsSub = Meteor.subscribe('hashFileUploadJobs.all');
  const hashFileUploadJobs = HashFileUploadJobs.find().fetch()
  const awsPricingSub = Meteor.subscribe('aws.getPricing');
  const hashesSub = Meteor.subscribe('hashes.all');
  //const hashes = Hashes.find();
  const awsPricing = AWSCOLLECTION.find({type:'pricing'}).fetch();
  const subsReady = hashFilesSub.ready() && awsPricingSub.ready() && hashCrackJobsSub.ready() && hashesSub.ready() && hashFileUploadJobsSub.ready() && hashFiles && awsPricing && hashCrackJobs && hashFileUploadJobs;
  return {
    subsReady,
    hashFiles,
    awsPricing,
    hashCrackJobs,
    hashFileUploadJobs,
    //hashes,
  };
})(Landing);