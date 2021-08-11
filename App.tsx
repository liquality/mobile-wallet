/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { Client } from "@liquality/client";
import { EthereumNetworks } from "@liquality/ethereum-networks";
import { EthereumJsWalletProvider } from "@liquality/ethereum-js-wallet-provider";
import { EthereumRpcProvider } from "@liquality/ethereum-rpc-provider";


const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

 const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const initWallet = async (): void => {
      console.log('initting wallet...1');
      const client = new Client();

      client.addProvider(
          new EthereumRpcProvider({ uri: "https://main-light.eth.linkpool.io/" })
      ); // Or infura
      client.addProvider(
          new EthereumJsWalletProvider({
              mnemonic:
                  "attack badge upper mule connect upper obey skin oppose brave term feed",
              derivationPath: `m/44'/60'/0'/0/0`,
              network: EthereumNetworks.ethereum_mainnet
          })
      );
      console.log('initting wallet...2');
      client.chain.getBalance([
          "0x1ad91ee08f21be3de0ba2ba6918e714da6b45836"
      ]).then(randomBalance => {
          client.wallet.getAddresses().then(myAddresses => {
              console.log('initting wallet...3');
              console.log({
                  balance: `${randomBalance.div(1e18)} ETH`,
                  myAddress: `0x${myAddresses[0].address}`
              });
          }).catch(error => {
              console.log('error: ', error);
          })

      }).catch(error => {
          console.log('error -->', error);
      })

  }

  useEffect(() => {
      initWallet();
  });

     return (
      <SafeAreaView style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}/>
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={backgroundStyle}>
          <Header/>
          <View
              style={{
                backgroundColor: isDarkMode ? Colors.black : Colors.white,
              }}>
            <Section title="Step One">
              Edit <Text style={styles.highlight}>App.js</Text> to change this
              screen and then come back to see your edits.
            </Section>
            <Section title="See Your Changes">
              <ReloadInstructions/>
            </Section>
            <Section title="Debug">
              <DebugInstructions/>
            </Section>
            <Section title="Learn More">
              Read the docs to discover what to do next:
            </Section>
            <LearnMoreLinks/>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
