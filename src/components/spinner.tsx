import { Modal, StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useRef } from 'react'
import WebView from 'react-native-webview'

const Spinner = ({
  loadingText,
  visible,
}: {
  loadingText: string
  visible: boolean
}) => {
  const webview = useRef(null)

  return (
    <Modal transparent={true} visible={visible} animationType={'fade'}>
      <View style={styles.container}>
        <WebView
          source={{
            html: `
                <!DOCTYPE html>
                <html>
                    <head>
                        <style>
                          @keyframes spin {
                              from {transform:rotate(0deg);}
                              to {transform:rotate(360deg);}
                          }                          
                          svg {
                            display: block;
                            margin: auto;
                          }
                          
                          #spinner {
                            animation: spin 4s infinite linear;
                          }
                        </style>
                  </head>
                  <body id="container">
                      <svg id="spinner" width="400" height="400" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="-1" y="-1" width="202" height="202">
                        <path d="M94 100V0L164 27.451L187 73.5294L200 112.745L182 190.196L94 200L28.5 185.294L0 138.235V79.4118L28.5 35.7843L94 100Z" fill="#C4C4C4" stroke="black" stroke-linejoin="round"/>
                        </mask>
                        <g mask="url(#mask0)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M100.5 187C148.825 187 188 147.825 188 99.5C188 51.1751 148.825 12 100.5 12C52.1751 12 13 51.1751 13 99.5C13 147.825 52.1751 187 100.5 187Z" stroke="url(#paint0_linear)" stroke-width="4" stroke-linejoin="round"/>
                        </g>
                        <defs>
                        <linearGradient id="paint0_linear" x1="13" y1="97.9091" x2="188" y2="97.9091" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#9C55F6"/>
                        <stop offset="1" stop-color="#2CD2CA"/>
                        </linearGradient>
                        </defs>
                      </svg>
                  </body>
                </html>
`,
          }}
          ref={webview}
          style={{
            marginTop: Dimensions.get('window').height / 2 - 100,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: 'transparent',
          }}
        />
        <View style={styles.loadingView}>
          <Text style={styles.loadingText}>Loading</Text>
          <Text style={styles.loadingTextDetails}>{loadingText}</Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    opacity: 0.9,
  },
  loadingView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
  },
  loadingTextDetails: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 11,
  },
})

export default Spinner
