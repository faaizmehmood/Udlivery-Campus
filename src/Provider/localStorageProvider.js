import AsyncStorage  from "@react-native-async-storage/async-storage";

class localStorageProvider {
    setItemString(key, value) {
        //console.log('setItemString key',key);
         try {
               AsyncStorage.setItem(key, value);
             } catch (error) {
               console.log('Error13',error);
        }
    }

    getItemString(key) {
        //console.log('getItemObject key',key);
        var item = AsyncStorage.getItem(key);
        return item;
    }

    async setItemObject(key, item) {
        //console.log('setItemObject key',key);
        //console.log('setItemObject item',item);
        try {
            await AsyncStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.log('Error12',error);
        }
    }

    async getItemObject(key) {
        //console.log('getItemObject key',key);
        var item = await AsyncStorage.getItem(key);
        return JSON.parse(item);
    }

    async removeItem(key) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.log('Error ' + error.value);
        }
    }

    async clear() {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.log('Error ' + error.value);
        }
    }
}

export const localStorage = new localStorageProvider();


// localStorage.getItemString('name').then((result) => {
//     if (result !== null) {
//         alert("First: " + result);
//     } else {
//         alert("Not saved");
//     }
// });

// var user_id = 0;

// var user_arr = localStorage.getItemObject('user_arr').then((result) => {
//     if (result !== null) {
//         user_id = result.user_id;
//         //alert("user_id: " + result.user_id);
//     } else {
//       user_id = 0;
//         //alert("Not saved");
//     }
// });
