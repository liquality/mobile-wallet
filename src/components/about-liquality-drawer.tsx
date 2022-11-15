import React, { FC } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types'
import { Box, GRADIENT_STYLE, Text, ABOUT_GRADIETN_COLORS } from '../theme'
import { useHeaderHeight } from '@react-navigation/elements'
import { ScrollView, StyleSheet } from 'react-native'
import { scale } from 'react-native-size-matters'
import LinearGradient from 'react-native-linear-gradient'
import { AppIcons } from '../assets'
import { TabView } from 'react-native-tab-view'
import { IconType, SCREEN_WIDTH } from '../utils'
import { TxKeyPath } from '../i18n'

const {
  LogoFull,
  OneWalletAllChains,
  FirstMultichainWalletIcon,
  SwapAcrossIcon,
  TransferNFT_Icon,
} = AppIcons

type TabViewContentProp = {
  icon: IconType
  customView: React.ElementType
  description: TxKeyPath
}

const TabViewContent = (props: TabViewContentProp) => {
  const { icon: Icon, customView: CustomView, description } = props
  return (
    <>
      <Icon />
      <CustomView />
      <Text
        color={'white'}
        tx={description}
        variant={'h7'}
        marginTop="xl"
        lineHeight={scale(22)}
      />
    </>
  )
}

const MultichainWalletHeading = () => {
  return (
    <Box marginTop={'mxxl'}>
      <Text
        variant="h1"
        color={'white'}
        style={styles.titleStyle}
        tx="theFirst"
      />
      <Text
        variant="h1"
        color={'white'}
        style={styles.titleStyle}
        tx="multichain"
      />
      <Text
        variant="h1"
        color={'white'}
        style={styles.titleStyle}
        tx="header.wallet"
      />
    </Box>
  )
}

const EasilySwapHeading = () => {
  return (
    <Box marginTop={'mxxl'}>
      <Text
        variant="h1"
        color={'white'}
        style={styles.titleStyle}
        tx="easilySwap"
      />
      <Text
        variant="h1"
        color={'white'}
        style={styles.titleStyle}
        tx="across"
      />
      <Text
        variant="h1"
        color={'white'}
        style={styles.titleStyle}
        tx="blockchains"
      />
    </Box>
  )
}

const TransferNFT = () => {
  return (
    <Box marginTop={'mxxl'}>
      <Text
        variant="h1"
        color={'white'}
        style={styles.titleStyle}
        tx="viewAnd"
      />
      <Text
        variant="h1"
        color={'white'}
        style={styles.titleStyle}
        tx="transferNFTs"
      />
    </Box>
  )
}

type Props = NativeStackScreenProps<RootStackParamList, 'AboutLiqualityDrawer'>
const AboutLiqualityDrawer: FC<Props> = ({ navigation }) => {
  const headerHeight = useHeaderHeight()
  const [index, setIndex] = React.useState(0)

  const routes = [
    { key: 'multichain', title: 'Multichain' },
    { key: 'swap', title: 'Swap' },
    { key: 'transfer', title: 'Transfer' },
  ]

  const onIndexChange = (num: number) => {
    setIndex(num)
    navigation.setParams({ showDoneBtn: num === 2 })
  }

  return (
    <LinearGradient
      colors={ABOUT_GRADIETN_COLORS}
      style={[GRADIENT_STYLE, { paddingTop: headerHeight }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: scale(20),
        }}>
        <Box marginTop={'s'}>
          <LogoFull width={scale(100)} />
        </Box>
        <OneWalletAllChains width={scale(165)} />
        <Text
          variant={'amountMedium'}
          marginTop={'s'}
          tx="swapCryptoExplore"
          color={'white'}
          lineHeight={scale(28)}
        />
        <Box marginTop={'xl'} height={scale(420)}>
          <TabView
            key={0}
            renderTabBar={() => null}
            navigationState={{ index, routes }}
            renderScene={({ route }) => {
              switch (route.key) {
                case routes[0].key:
                  return (
                    <TabViewContent
                      icon={FirstMultichainWalletIcon}
                      customView={MultichainWalletHeading}
                      description="sendReceiveSwap"
                    />
                  )
                case routes[1].key:
                  return (
                    <TabViewContent
                      icon={SwapAcrossIcon}
                      customView={EasilySwapHeading}
                      description="swapNativeAssets"
                    />
                  )
                case routes[2].key:
                  return (
                    <TabViewContent
                      icon={TransferNFT_Icon}
                      customView={TransferNFT}
                      description="seeAllYourValued"
                    />
                  )
              }
            }}
            swipeEnabled
            onIndexChange={onIndexChange}
            initialLayout={{ width: SCREEN_WIDTH - scale(30) }} //approx to horizontal patting
          />
        </Box>
        <Box
          marginVertical={'mxxl'}
          flexDirection="row"
          alignItems={'center'}
          justifyContent={'space-evenly'}>
          {routes.map((item, i) => (
            <Box
              key={item.key}
              flex={0.32}
              height={scale(index === i ? 2 : 1)}
              backgroundColor="white"
            />
          ))}
        </Box>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  titleStyle: {
    height: scale(39),
  },
})

export default AboutLiqualityDrawer
