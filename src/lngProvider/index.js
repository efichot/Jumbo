import enLang from './entries/en-US';
import frLang from './entries/fr_FR';
import { addLocaleData } from 'react-intl';

const AppLocale = {
  en: enLang,
  fr: frLang
};
addLocaleData(AppLocale.en.data);
addLocaleData(AppLocale.fr.data);

export default AppLocale;
