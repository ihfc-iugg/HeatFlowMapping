export const CLASSIFIER = Object.freeze({
  quantil: {
    name: 'quantil',
    title: 'Quantil',
    desc: 'Each class contains an equal number of features',
    src: 'https://pro.arcgis.com/en/pro-app/latest/help/mapping/layer-properties/data-classification-methods.htm#ESRI_SECTION1_1BDD383C17164B948BF546CEADDA70E9'
  },
  equal: {
    name: 'equal',
    title: 'Equal interval',
    desc: 'Each class has the same range of values',
    src: 'https://pro.arcgis.com/en/pro-app/latest/help/mapping/layer-properties/data-classification-methods.htm#ESRI_SECTION1_B47C458CFF6A4EEC933A8C7612DA558B'
  }
  // TODO: find alternative to geostats getjenks -> method slow
  // jenks: {
  //   name: 'jenks',
  //   title: 'Jenks',
  //   desc: 'Class breaks are created in a way that best groups similar values together and maximizes the differences between classes',
  //   src: 'https://pro.arcgis.com/en/pro-app/latest/help/mapping/layer-properties/data-classification-methods.htm#ESRI_SECTION1_B47C458CFF6A4EEC933A8C7612DA558B'
  // }
})
