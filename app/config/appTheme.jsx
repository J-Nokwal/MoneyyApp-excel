import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper'
import colors from './colors'

import React from 'react'
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';


// const appheme= {
//     ...DefaultTheme,
//     primary: colors.primary,
//     accent: colors.secondary,
//     colors: {
//         primary: colors.primary,
//         accent: colors.secondary,
        
//     }
// } 

 const AppPaperProvider = ({children}) => {
    const { theme } = useMaterial3Theme();

  return (
    <PaperProvider theme={{
        ...DefaultTheme,
        primary: colors.primary,
        accent: colors.secondary,
        colors: {
            ...theme.light,
            primary: colors.primary,
            accent: colors.secondary,
            primaryContainer: colors.primaryContainer,
            tertiary: colors.tertiary,
            tertiaryContainer: colors.tertiaryContainer,
        }
      }}>
        {children}
      </PaperProvider>
  )
}
export default AppPaperProvider