import React, { Component } from "react"
import { SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Font, mediaprovider } from '../utilslib/Utils';
import AppLoader from './AppLoader'
import * as Animatable from 'react-native-animatable';
import NetInfo from '@react-native-community/netinfo';

const AppContext = React.createContext({})
export const AppConsumer = AppContext.Consumer

export class AppProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      isConnected: false,
      backonline: false,

    }

  }
  componentDidMount() {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type: ", state.type);
      console.log("Is connected? = ", `${state.isConnected}`);
      this.setState({ isConnected: state.isConnected })
      if (state.isConnected == false) {
        this.checkconnection()
      }
    });
  }
  showProgress = () => this.setState({ loading: true })
  hideProgress = () => this.setState({ loading: false })

  checkconnection = () => {
    const mytimer = setInterval(() => {
      this.checkconnection2(mytimer)
    }, 300);

  }
  checkconnection2 = (mytimer) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
        clearInterval(mytimer);
        this.setState({ backonline: true })
      }
    })
  }

  selectcamerimage = async () => {
    await mediaprovider.launchCamera().then((res) => {
      this.setState({ mediaopen: false });
      return Mediaresult = res;
    }).catch((error) => {
      Mediaresult = error
    });
  }
  render() {
    const { loading } = this.state
    const funcs = {
      showLoader: this.showProgress,
      hideLoader: this.hideProgress,

    }

    return (
      <AppContext.Provider
        value={{ ...funcs }}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.Red1 }}>
          <StatusBar
            hidden={false}
            StatusBarStyle='dark-content'
            backgroundColor={Colors.Red1}
            translucent={false}
            networkActivityIndicatorVisible={true}
            barStyle="dark-content"
          >
          </StatusBar>

          {this.props.children}
          <AppLoader loading={loading} />


          {!this.state.isConnected && <View style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'red' }}>
            <Text style={{ textAlign: 'center', paddingVertical: 5, fontSize: 14, color: 'white' }} >No Internet connection</Text>
          </View>}
          {this.state.backonline && <View style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#32cd32' }}>
            <TouchableOpacity disabled={true} onPress={setTimeout(() => { this.setState({ backonline: false }) }, 5000)}>
              <Text animation='zoomIn' duration={3000} iterationCount='infinite' style={{ textAlign: 'center', color: 'white', paddingVertical: 5, fontSize: 14 }} >Back online</Text>
            </TouchableOpacity>
          </View>}

        </SafeAreaView>
      </AppContext.Provider>
    )
  }
}
