import { app, db } from '../ChatProvider/Config1';
import { get, getDatabase, off, onChildAdded, onChildChanged, onChildRemoved, ref, set, on, update, push } from 'firebase/database';

import { msgProvider, localStorage, consolepro, config } from './utilslib/Utils';
global.FirebaseUserJson = [];
global.FirebaseGroupJson = [];
global.FirebaseInboxJson = [];
global.update_firebase_check = 0;
global.count_inbox = 0;
global.inboxoffcheck = 0;
class FirebaseProvider {
  //-------------------
  blockUserFunction = async (user_id, other_user_id, status) => {
    const user_id_send = `u_${user_id}`;
    const other_user_id_send = `u_${other_user_id}`;
    const inbox_id_me = `u_${other_user_id}`;
    const inbox_id_other = `u_${user_id}`;

    const find_inbox_index = FirebaseInboxJson.findIndex(x => x.user_id === other_user_id);

    if (find_inbox_index !== -1) {
      const jsonUserDataMe = {
        block_status: status,
      };

      await UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);
    }
  };

  getAllUsers = async () => {
    const firebaseUserJson = [];

    const usersRef = ref(db, 'users');

    const childAddedCallback = (snapshot) => {
      const data = snapshot.val();
      firebaseUserJson.push(data);
    };

    const childChangedCallback = (snapshot) => {
      const data = snapshot.val();
      const { user_id, name, email, image, onlineStatus, player_id, chat_room_id, user_type, myInbox, login_type } = data;

      const foundIndex = firebaseUserJson.findIndex(user => user.user_id === user_id);
      if (foundIndex !== -1) {
        firebaseUserJson[foundIndex] = {
          ...firebaseUserJson[foundIndex],
          name,
          email,
          login_type,
          image,
          myInbox,
          onlineStatus,
          player_id,
          chat_room_id,
          user_type
        };
      }
    };

    onChildAdded(usersRef, childAddedCallback);
    onChildChanged(usersRef, childChangedCallback);

    // Ensure to unsubscribe when component unmounts to avoid memory leaks
    const unsubscribeChildAdded = () => off(usersRef, 'child_added', childAddedCallback);
    const unsubscribeChildChanged = () => off(usersRef, 'child_changed', childChangedCallback);

    return { firebaseUserJson, unsubscribeChildAdded, unsubscribeChildChanged };
  };

  DeleteAllFirebaseData = async () => {
    try {
      const database = getDatabase();

      const userRef = ref(db, 'users');
      await remove(userRef);

      const userMsgRef = ref(db, 'message');
      await remove(userMsgRef);

      console.log('Firebase data deleted successfully.');
    } catch (error) {
      console.error('Error deleting Firebase data:', error.message);
    }
  };

  messagecountforfooter = async () => {
    try {
      // Fetch user data from local storage
      const userdata = await getItemObject('user_arr');

      if (userdata) {
        const id = `u_${userdata.user_id}`;

        // Unsubscribe previous listener if inboxoffcheck is greater than 0
        if (inboxoffcheck > 0) {
          const queryOffinbox = ref(db, `users/${id}/myInbox/${userChatIdGlobal}`);
          off(queryOffinbox, 'child_changed');
        }

        // Subscribe to 'child_changed' event for myInbox
        const queryUpdatemyinbox = ref(db, `users/${id}/myInbox/`);
        on(queryUpdatemyinbox, 'child_changed', (data) => {
          // Call the function to update the inbox count
          firebaseUserGetInboxCount();
        });
      }
    } catch (error) {
      console.error('Error in messagecountforfooter:', error);
    }
  };

  getMyInboxAllData = async () => {
    try {
      const userdata = await localStorage.getItemObject('user_arr');

      if (!userdata) {
        return;
      }

      const id = `u_${userdata.user_id}`;
      const inboxRef = ref(getDatabase(), `users/${id}/myInbox/`);

      // Unsubscribe previous listeners
      off(inboxRef, 'child_added');
      off(inboxRef, 'child_changed');
      off(inboxRef, 'child_removed');

      // Get inbox data on 'child_added'
      onChildAdded(inboxRef, (snapshot) => {
        FirebaseInboxJson.push(snapshot.val());
      });

      // Update inbox data on 'child_changed'
      onChildChanged(inboxRef, (snapshot) => {
        const { count, lastMsg, lastMsgTime, lastMessageType, user_id, block_status } = snapshot.val();

        const index = FirebaseInboxJson.findIndex((item) => item.user_id === user_id);
        if (index !== -1) {
          FirebaseInboxJson[index] = {
            ...FirebaseInboxJson[index],
            count,
            lastMsg,
            lastMsgTime,
            lastMessageType,
            block_status,
            user_id
          };
        }
      });

      // Handle 'child_removed'
      onChildRemoved(inboxRef, (snapshot) => {
        const user_id = snapshot.val().user_id;
        const indexToRemove = FirebaseInboxJson.findIndex((item) => item.user_id === user_id);

        if (indexToRemove !== -1) {
          FirebaseInboxJson.splice(indexToRemove, 1);
        }
      });
    } catch (error) {
      console.error('Error in getMyInboxAllData:', error);
    }
  };


  getMyInboxAllDataBooking = async () => {
    try {
      FirebaseInboxJson = [];
      FirebaseUserJson = [];
      const userdata = await localStorage.getItemObject('user_arr');

      if (!userdata) {
        return;
      }

      const id = `u_${userdata.user_id}`;
      const inboxRef = ref(getDatabase(), `users/${id}/myInbox/`);

      // Unsubscribe previous listener
      off(inboxRef, 'child_added');

      // Get inbox data on 'child_added'
      onChildAdded(inboxRef, (snapshot) => {
        FirebaseInboxJson.push(snapshot.val());
      });

      // Update inbox data on 'child_changed'
      onChildChanged(inboxRef, (snapshot) => {
        const {
          count,
          lastMsg,
          lastMsgTime,
          lastMessageType,
          block_status,
          booking_id,
          booking_number
        } = snapshot.val();

        const indexToUpdate = FirebaseInboxJson.findIndex(item => item.booking_id === booking_id);

        if (indexToUpdate !== -1) {
          FirebaseInboxJson[indexToUpdate] = {
            ...FirebaseInboxJson[indexToUpdate],
            count,
            lastMsg,
            lastMsgTime,
            lastMessageType,
            block_status,
            booking_id,
            booking_number
          };
        }
      });

      // Handle 'child_removed'
      onChildRemoved(inboxRef, (snapshot) => {
        const booking_id = snapshot.val().booking_id;
        const indexToRemove = FirebaseUserJson.findIndex(user => user.booking_id === booking_id);

        if (indexToRemove !== -1) {
          FirebaseUserJson.splice(indexToRemove, 1);
        }
      });
    } catch (error) {
      console.error('Error in getMyInboxAllDataBooking:', error);
    }
  };


  getMyInboxAllDataNew = async () => {
    FirebaseInboxJson = [];

    try {
      const userdata = await localStorage.getItemObject('user_arr')

      if (!userdata) {
        return;
      }

      const id = `u_${userdata.user_id}`;

      // Unsubscribe previous listener
      const queryOffLogin = ref(db, `users/${id}/myInbox/`);
      off(queryOffLogin, 'child_added');

      // Get inbox data on 'child_added'
      const query = ref(db, `users/${id}/myInbox/`);
      on(query, 'child_added', (data) => {
        FirebaseInboxJson.push(data.toJSON());
      });

      // Update inbox data on 'child_changed'
      const queryUpdate = ref(db, `users/${id}/myInbox/`);
      on(queryUpdate, 'child_changed', (data) => {
        const {
          count,
          lastMsg,
          lastMsgTime,
          lastMessageType,
          user_id,
          block_status
        } = data.val();

        for (let i = 0; i < FirebaseInboxJson.length; i++) {
          if (FirebaseInboxJson[i].user_id === user_id) {
            FirebaseInboxJson[i] = {
              ...FirebaseInboxJson[i],
              count,
              lastMsg,
              lastMsgTime,
              lastMessageType,
              block_status
            };
            break;
          }
        }
      });

      // Handle 'child_removed'
      const queryData = ref(db, `users/${id}/myInbox/`);
      on(queryData, 'child_removed', (data) => {
        const user_id = data.val().user_id;
        const indexToRemove = FirebaseUserJson.findIndex(user => user.user_id === user_id);

        if (indexToRemove !== -1) {
          FirebaseUserJson.splice(indexToRemove, 1);
        }
      });
    } catch (error) {
      console.error('Error in getMyInboxAllDataNew:', error);
    }
  };

  firebaseUserCreate = async () => {
    try {
      const user_arr = await localStorage.getItemObject('user_arr')

      if (!user_arr) {
        return;
      }

      const {
        user_id,
        name,
        notification_status,
        user_type,
        email,
        image,
        login_type
      } = user_arr;

      const player_id_me = config.playerID;
      const id = `u_${user_id}`;

      const jsonUserDataMe = {
        name,
        email,
        image,
        onlineStatus: 'true',
        player_id: player_id_me,
        user_id: parseInt(user_id),
        user_type,
        notification_status,
        chat_room_id: 'no',
        login_type
      };

      // this.CreateUser(id, jsonUserDataMe);
      this.CreateUserInformation(id, jsonUserDataMe);
    } catch (error) {
      console.error('Error in firebaseUserCreate:', error);
    }
  };

  CreateUser = (id, userData) => {
    const database = getDatabase();
    const userRef = ref(db, `users/${id}`);
    set(userRef, userData)
      .then(() => {
        console.log('User created successfully.');
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  };

  CreateUserInformation = (id, userData) => {
    const database = getDatabase();
    const userRef = ref(db, `user-information/${id}`);
    set(userRef, userData)
      .then(() => {
        console.log('User created successfully.');
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  };

  CreateGroup = async (id, jsonUserData, jsonUserDataMe, user_id_me) => {
    try {
      const database = getDatabase();

      // Update group data
      const groupRef = ref(db, `groups/${id}`);
      await update(groupRef, jsonUserData);

      // Add group to the user's inbox
      const userInboxDataMe = {
        [id]: {
          group_id: id,
          count: 0,
          group_joining_time: Firebase.database.ServerValue?.TIMESTAMP || '2023',
          type: "group"
        }
      };
      await this.CreateUserInbox(user_id_me, userInboxDataMe);

      // Add group to all users' inbox
      for (const value_ass of jsonUserDataMe) {
        const user_id_new = `u_${value_ass.user_id}`;
        const userInboxDataNew = {
          [id]: {
            group_id: id,
            count: 0,
            group_joining_time: Firebase.database.ServerValue?.TIMESTAMP || '2023',
            type: "group"
          }
        };
        await this.CreateUserInbox(user_id_new, userInboxDataNew);
      }
    } catch (error) {
      console.error('Error in CreateGroup:', error);
    }
  };

  CreateUserInbox = async (user_id, inboxData) => {
    try {
      const database = getDatabase();
      const userInboxRef = ref(db, `user_inbox/${user_id}`);
      await update(userInboxRef, inboxData);
    } catch (error) {
      console.error('Error in CreateUserInbox:', error);
    }
  };

  getAllGroups = async () => {
    try {
      FirebaseGroupJson = [];

      const groupsRef = ref(db, 'groups');

      const childAddedCallback = (snapshot) => {
        FirebaseGroupJson.push(snapshot.val());
      };

      const childChangedCallback = (snapshot) => {
        const data = snapshot.val();
        const {
          group_id,
          active_flag,
          count,
          lastMsgType,
          lastMsg,
          lastMsgTime,
          members,
          user_id
        } = data;

        const index = FirebaseGroupJson.findIndex((group) => group.group_id === group_id);
        if (index >= 0) {
          FirebaseGroupJson[index] = {
            ...FirebaseGroupJson[index],
            active_flag,
            count,
            lastMsgType,
            lastMsg,
            lastMsgTime,
            members,
            user_id
          };
        }
      };

      const childRemovedCallback = (snapshot) => {
        const group_id = snapshot.val().group_id;
        FirebaseGroupJson = FirebaseGroupJson.filter((group) => group.group_id !== group_id);
        $(`#group_id_${group_id}`).hide().remove();
      };

      onChildAdded(groupsRef, childAddedCallback);
      onChildChanged(groupsRef, childChangedCallback);
      onChildRemoved(groupsRef, childRemovedCallback);
    } catch (error) {
      console.error('Error in getAllGroups:', error);
    }
  };

  //getAllGroups();

  firebaseUserGetInboxCount = async () => {
    try {
      const user_arr = await localStorage.getItemObject('user_arr');
      console.log('user_arr', user_arr);

      if (user_arr != null && user_arr !== 'null') {
        const user_id = user_arr.user_id;
        const user_id_me = user_arr.user_id;

        let global_count_inbox = 0;
        count_inbox = 0;

        const id = 'u_' + user_id_me;
        const queryAllUser = ref(db, 'users/' + id + '/myInbox');
        const dataSnapshot = await get(queryAllUser);

        if (dataSnapshot.exists()) {
          const allUserArr = Object.values(dataSnapshot.val() || {});

          allUserArr.forEach((keyValue) => {
            const count = keyValue.count;
            global_count_inbox += parseInt(count);
          });
        }

        if (global_count_inbox > 0) {
          count_inbox = Math.min(global_count_inbox, 10);
        } else {
          count_inbox = 0;
        }
      }
    } catch (error) {
      console.error('Error in firebaseUserGetInboxCount:', error);
    }
  };

  firebaseUserCreateUpdatePlayerId = async () => {
    try {
      const user_arr = await localStorage.getItemObject('user_arr');
      const user_id = user_arr.user_id;
      const update_firebase_check = 1;
      const user_id_me = user_id;
      const player_id_me = player_id_me1;

      const queryAllUser = ref(db, 'users');
      const dataSnapshot = await get(queryAllUser);

      if (dataSnapshot.exists()) {
        const allUserArr = Object.values(dataSnapshot.val());

        const find_inbox_index = allUserArr.findIndex((x) => x.player_id === player_id_me);

        if (find_inbox_index >= 0) {
          const other_user_id = allUserArr[find_inbox_index].user_id;
          const player_id_other = allUserArr[find_inbox_index].player_id;

          if (user_id_me !== other_user_id && player_id_me === player_id_other) {
            const id = 'u_' + other_user_id;
            const jsonUserDataMe = {
              player_id: 'no',
            };
            CreateUser(id, jsonUserDataMe); // Assuming CreateUser is a function in your code.
          }
        }
      }
    } catch (error) {
      console.error('Error in firebaseUserCreateUpdatePlayerId:', error);
    }
  };


  CreateUserInboxOther = async (id, jsonUserData) => {
    try {
      const inboxRef = ref(db, `users/${id}/myInbox/`);
      await update(inboxRef, jsonUserData);
      //consolepro.consolelog("Update inbox succeeded.");

      
    } catch (error) {
      console.error('Error CreateUserInboxOther:', error.message);
      // msgProvider.alert('Error CreateUserInboxOther', error.message);
    }
  };

  UpdateUserInboxMe = async (id, otherId, jsonUserData) => {
    try {
      const inboxRef = ref(db, `users/${id}/myInbox/${otherId}`);
      await update(inboxRef, jsonUserData);
      consolepro.consolelog("Update inbox me succeeded.");

    } catch (error) {
      console.error('Error UpdateUserInboxMe:', error.message);
      // msgProvider.alert('Error UpdateUserInboxMe', error.message);
    }
  };


  // SendUserMessage
  UpdateGroupDataMember = async (id, jsonUserData, member_id) => {
    try {
      const groupMemberRef = ref(db, `groups/${id}/members/${member_id}`);
      await update(groupMemberRef, jsonUserData);
      //console.log("Update groups jsonUserData.", jsonUserData);
      //console.log("Update groups succeeded.");
    } catch (error) {
      console.error('Error updating group member:', error.message);
      //console.log("Update Inbox failed: " + error.message);
    }
  };

  getJsonSearch = (obj, key, val) => {
    const objects = [];

    const searchInObject = (o) => {
      if (o[key] === val || (val === '' && o.hasOwnProperty(key))) {
        objects.push(o);
      }

      for (const prop in o) {
        if (o[prop] !== null && typeof o[prop] === 'object') {
          searchInObject(o[prop]);
        }
      }
    };

    searchInObject(obj);
    return objects;
  };


  SendUserMessage = async (messageId, messageJson, messageType, inputId) => {
    try {
      const database = getDatabase();
      const messagesRef = ref(database, `message/${messageId}`);
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, messageJson);
      console.log('SendUserMessage succeeded.');

      let userData = await localStorage.getItemObject('user_arr');

      if (messageId.split('_')[1] == userData?.user_id) {
        const tempChatRef = ref(db, 'temp-message');
        await push(tempChatRef, messageJson);
      }
    } catch (error) {
      console.error('Error sending message:', error.message);
      msgProvider.alert('Error SendUserMessage', error.message);
    }

    // Handle messageType 'text' if needed
    if (messageType === 'text') {
      // $('#'+inputId).val('');
      // $('#'+inputId).focus();
    }
  };

  UpdateUserInboxOther = (id, otherId, jsonUserData2) => {
    const inboxRef = ref(getDatabase(), `users/${id}/myInbox/${otherId}`);
    update(inboxRef, jsonUserData2)
      .then(() => {
        console.log('Update inbox succeeded.');
      })
      .catch((error) => {
        console.error('Error updating user inbox:', error.message);
        msgProvider.alert('Error UpdateUserInboxOther', error.message);
      });
  };


  convertTimeAllFormat = (time11, format) => {
    time11 = parseInt(time11);

    const date1 = new Date(time11);

    let hours = date1.getHours();
    const minutes = date1.getMinutes();

    if (format === 24) {
      hours = hours < 10 ? `0${hours}` : hours;
      const strTime = `${hours}:${minutes}`;
      return strTime;
    }

    // Handle other formats if needed

    return ''; // Return an appropriate value for unsupported formats
  };


  firebaseUserDeleteCase = async () => {
    console.log('firebaseUserCreate');
    const userArr = await localStorage.getItemObject('user_arr');
    const { user_id, name, email, image, user_type, login_type } = userArr;
    const player_id_me = 'no';
    const id = `u_${user_id}`;

    const jsonUserDataMe = {
      name,
      email,
      image,
      onlineStatus: 'true',
      player_id: player_id_me,
      user_id: parseInt(user_id),
      user_type,
      notification_status: 0,
      chat_room_id: 'no',
      login_type,
    };

    createUser(id, jsonUserDataMe);
  };


}

export const firebaseprovider = new FirebaseProvider();

