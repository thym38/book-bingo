// import React from 'react';
import React, { useState, useEffect } from "react";
import { Page, Text, View, Document, StyleSheet, Image, Font} from '@react-pdf/renderer';


import Banner from './assets/banner.jpg';

//  REFS

// https://react-pdf.org/rendering-process
// table: https://github.com/diegomura/react-pdf/issues/487#issuecomment-497530466
//

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
  });

// Create styles
const styles = StyleSheet.create({
    table: { 
      display: "table", 
      width: "190mm", 
      height: "240mm",
      borderStyle: "solid", 
      borderWidth: 1, 
      borderRightWidth: 0, 
      borderBottomWidth: 0, 
      left: "10mm",
      top: "5mm"
    }, 
    tableRow: { 
      margin: "auto", 
      flexDirection: "row",
      height: "20%", 
      width: "100%"
    }, 
    tableCol: { 
      width: "20%",
      borderStyle: "solid", 
      borderWidth: 1, 
      borderLeftWidth: 0, 
      borderTopWidth: 0 
    }, 
    tableCell: { 
      margin: "auto", 
      padding: 3,
      fontSize: 8,
      textAlign: 'center',
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      fontFamily: 'Oswald',
    },
    logo: {
        height: 37,
        width: 30,
        left: "30mm",
      },
    content: {
        padding: 10,
        flexDirection: 'row',
        top: '5mm',
    },
    banner: {
        width: "190mm", 
        height: '65px',
        overflow: 'hidden',
        left: '10mm',
        top: '5mm',
    },
  });


// Create Document Component
const MyDocument = ({clicked, images, authors, titles}) => {
    const[ourProps, setOurProps] = useState([]);

    const blank = <View style={styles.tableCol}><Text style={styles.tableCell}> </Text></View>

    useEffect(() => {
        setOurProps([{clicked, images, authors, titles}]);
    }, []);

    if (images) {
        let imageUrl = './assets/banner.jpg';
        // let imageUrl = 'https://styles.redditmedia.com/t5_2qknd/styles/bannerBackgroundImage_ea8oj3m43q101.jpg';
    return (   
        <Document>
            <Page size="A4" style={styles.page}>

            <Image style={styles.banner} src={Banner}/>
            
            {/* <Image src={{uri:imageUrl, method: 'GET', headers:{'Access-Control-Allow-Origin': '*'}}}/> */}



            <View style={styles.content}>
            {/* <Image style={styles.banner} src='https://styles.redditmedia.com/t5_2qknd/styles/bannerBackgroundImage_ea8oj3m43q101.jpg'/> */}

                <Image style={styles.logo} src='https://i.imgur.com/IDNH5yu.jpg'/>
                <Text style={styles.title}>r/Fantasy Book Bingo Challenge 2021</Text> 
            </View>
            
            
            <View style={styles.table}> 

                {[0,1,2,3,4].map(row => 
                <View style={styles.tableRow}> 
                    {[0,1,2,3,4].map(col => {
                        let cell = row*5 + col;
                        return (images[cell] === '') ? 
                            <View style={styles.tableCol} key={cell}> 
                                <Text style={styles.tableCell}>{titles[cell]}</Text> 
                                <Text style={styles.tableCell}>{authors[cell]}</Text> 
                            </View> :
                            <View style={styles.tableCol} key={cell}> 
                                <Text style={[styles.tableCell, {margin: "5px 5px 0px 5px"}]}>{titles[cell]}</Text> 
                                <Text style={[styles.tableCell, {margin: "0px 5px 0px 5px"}]}>{authors[cell]}</Text> 
                                <Image src={images[cell]} style={[styles.tableCell, { height: '30mm', width:'20mm'}]}/>
                            </View>
                    })}
                </View>
                )}

            </View>
            </Page>
        </Document>          
    );
    } 
    else {
        return (
            <Document>
            <Page size="A4" style={styles.page}>
            </Page>
            </Document>  
        );
    }
};

export default MyDocument