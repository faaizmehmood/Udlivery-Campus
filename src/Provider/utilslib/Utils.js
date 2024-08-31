import {config} from '../configProvider';
import {notification} from '../NotificationProvider';
import {Dimensions} from 'react-native';
import {localStorage} from '../localStorageProvider';
import {Lang_chg} from '../Language_provider';
import {consolepro} from '../Messageconsolevalidationprovider/Consoleprovider';
import {
  msgProvider,
  msgTitle,
  msgText,
} from '../Messageconsolevalidationprovider/messageProvider';
import {validation} from '../Messageconsolevalidationprovider/Validation_provider';
import Cameragallery from '../Mediaprovider/Cameragallery';
import {mediaprovider} from '../Mediaprovider/Mediaprovider';
import {apifuntion} from '../Apicallingprovider/apiProvider';
import {Colors, Font} from '../Colorsfont';
import Otpprovider from '../Otpprovider';
import {localimag} from '../Localimageprovider/Localimage';
import {pushnotification} from '../Pushnotificationredirection';
import Common_Button from '../../CommonComponent/Common_Button';
import {firebaseprovider} from '../FirebaseProvider';
import {SocialLogin} from '../Apicallingprovider/SocialLoginProvider';
const mobileH = Math.round(Dimensions.get('window').height);
const mobileW = Math.round(Dimensions.get('window').width);
import {
  scale,
  verticalScale,
  scaleFont,
  fullHeight,
  fullWidth,
} from '../Scale_utility';
export {
  config,
  Common_Button,
  Otpprovider,
  localimag,
  apifuntion,
  Colors,
  Font,
  validation,
  mobileH,
  mobileW,
  Cameragallery,
  localStorage,
  Lang_chg,
  consolepro,
  msgProvider,
  msgTitle,
  msgText,
  mediaprovider,
  notification,
  firebaseprovider,
  pushnotification,
  SocialLogin,
};
