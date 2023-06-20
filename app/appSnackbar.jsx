import { createContext, useContext, useState } from "react";
 import { Snackbar } from 'react-native-paper';
export const SnackBarContext = createContext({
    visible: false,
    showSnackBar: (s) => {},
  });
  
export const useSnackBar = () => {
    return useContext(SnackBarContext);
}

export const AppSnackBar = ({children}) => {
    const [visible, setvisible] = useState(false)
    const [text, settext] = useState("")
    return (
    //   <SnackBarContext.Consumer>
    //     {({ visible, hideSnackBar }) => (
    //       <>
    //       {children}
    //       <Snackbar
    //         visible={visible}
    //         onDismiss={hideSnackBar}
    //         action={{
    //           label: 'Undo',
    //           onPress: () => {
    //             // Do something
    //           },
    //         }}
    //         >
    //       </Snackbar>
    //         </>
    //     )}
    //   </SnackBarContext.Consumer>
    <>
    <SnackBarContext.Provider value={{visible: visible, showSnackBar: (s) => {
        setvisible(true)
        settext(s)
    }}}>
        {children}
        <Snackbar
            visible={visible}
            // onDismiss={hideSnackBar}
            onDismiss={()=>setvisible(false)}
            duration={1000}
            >
                {text}
          </Snackbar>
    </SnackBarContext.Provider>
    </>
  
    )
  }