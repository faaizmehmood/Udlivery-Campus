import NetInfo from '@react-native-community/netinfo';

class ApiContainer {

  getApi = async (url,status) => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          if(status!=1)
          {
            global.props.showLoader();
          }
         // global.props.showLoader();
          fetch(url, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
               Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
             },
           }).then((response) => response.json())
            .then((obj) => {
              global.props.hideLoader();
              resolve(obj);
            })
            .catch((error) => {
              global.props.hideLoader();
              reject(error);
            });
        }else {
          global.props.hideLoader();
          reject('noNetwork');
        }
      })
    })
  }
  postApi = async (url,data,status) => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          if(status!=1)
          {
            global.props.showLoader();
          }
          // global.props.showLoader();
          fetch(url, {
            method: 'POST',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
               Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
             },
             body:data
           }).then((response) => response.json())
            .then((obj) => {
              global.props.hideLoader();
              resolve(obj);
            })
            .catch((error) => {
              global.props.hideLoader();
              reject(error);
            });
        }else {
          global.props.hideLoader();
          reject('noNetwork');
        }
      })
    })
  }
}
//--------------------------- Config Provider End -----------------------
export const apifuntion = new ApiContainer();
