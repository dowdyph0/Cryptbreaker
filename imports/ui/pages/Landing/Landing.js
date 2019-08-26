import React from 'react';
import { Roles } from 'meteor/alanning:roles';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import MUIDataTable from "mui-datatables";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { Hashes, HashFiles, HashCrackJobs } from '/imports/api/hashes/hashes.js';
import CustomToolbarSelect from "./CustomToolbarSelect";
import ReactDOM from 'react-dom';
import { AWSCOLLECTION } from '/imports/api/aws/aws.js'
import Spinner from '/imports/ui/components/Spinner';

import './Landing.scss';

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
        expandableRows: true,
        expandableRowsOnClick: true,  
        renderExpandableRow: (rowData, rowMeta) => {
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
            download:false,
            filter:true,
            print:false,
            viewColumns:false,
          }
  
          if(Roles.userIsInRole(Meteor.userId(), 'admin')){
            innerOptions.searchText = this.state.searchText
            innerOptions.customSearch = (searchQuery, currentRow, columns) => {
              let isFound = false;
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
                {/* <table style={{width:'25em',padding:'.5em'}}>
                  <tr>
                    <th>IP</th>
                    <th>Port(s)</th>
                  </tr>
                  {affectedHosts.map((host, i) => <tr><td>{host.split(' ')[1]}</td><td>{host.split(':')[2]}</td></tr>)}
                </table> */}
                {/* {affectedHosts.map((host, i) => <p style={{paddingBottom:'0em', marginBottom:'0em'}} >{host}</p>)}
                <h4 style={{paddingTop:'.5em'}}>Synopsis</h4>
                {details[0].synopsis}
                <h4 style={{paddingTop:'.5em'}}>Description</h4>
                {rowData[6]}
                <h4 style={{paddingTop:'.5em'}}>Solution</h4>
                {details[0].solution}
      
                { (details[0].output.length > 0 && !isGrouping) ? ( <><h4 style={{paddingTop:'.5em'}}>Output</h4>
                <pre style={{marginTop:'-15px',paddingTop:'0em'}}>{details[0].output}</pre></> ): (null) }
                { isGrouping ? (
                  <><h4 style={{paddingTop:'.5em'}}>Related Findings</h4>
                  <MuiThemeProvider theme={getMuiTheme()}>
                  <MUIDataTable
                    data={innerRows}
                    columns={columns}
                    options={innerOptions}
                    fullWidth
                  />
                </MuiThemeProvider></>) : (null)}
                 */}
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
      };
      return (
          <div style={{marginTop:'2%'}} className="landing-page">          
            {this.props.subsReady ? (
              <>
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
  const awsPricingSub = Meteor.subscribe('aws.getPricing');
  const hashesSub = Meteor.subscribe('hashes.all');
  //const hashes = Hashes.find();
  const awsPricing = AWSCOLLECTION.find({type:'pricing'}).fetch();
  const subsReady = hashFilesSub.ready() && awsPricingSub.ready() && hashCrackJobsSub.ready() && hashesSub.ready() && hashFiles && awsPricing && hashCrackJobs;
  return {
    subsReady,
    hashFiles,
    awsPricing,
    hashCrackJobs,
    //hashes,
  };
})(Landing);