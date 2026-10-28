export const GHFDB = Object.freeze({
  r2024: {
    id: 'ghfdb_r_2024',
    name: 'Global Heat Flow Database r24',
    release: 2024,
    parentProperties: [
      'q',
      'q_uncertainty',
      'name',
      'elevation',
      'environment',
      'p_comment',
      'corr_HP_flag',
      'total_depth_MD',
      'total_depth_TVD',
      'explo_method',
      'explo_purpose',
      'ID',
      'ID_parent',
      'Quality_Code'
    ],
    url: 'https://raw.githubusercontent.com/ihfc-iugg/ghfdb-portal/refs/heads/main/assets/ghfdb/IHFC_2024_GHFDB.zip'
  },
  r2027: {
    id: 'ghfdb_r_2027',
    name: 'Global Heat Flow Database r27',
    release: 2027,
    parentProperties: [
      'q',
      'q_uncertainty',
      'name',
      'elevation',
      'environment',
      'p_comment',
      'corr_HP_flag',
      'total_depth_MD',
      'total_depth_TVD',
      'explo_method',
      'explo_purpose',
      'ID',
      'ID_parent',
      'Quality_Code'
    ],
    url: 'https://raw.githubusercontent.com/ihfc-iugg/ghfdb-portal/refs/heads/main/assets/ghfdb/IHFC_2024_GHFDB.zip'
  }
})

export const SCHEMA = Object.freeze({
  r2024: {
    id: 'schema_r_2024',
    url: '@/shared/assets/data/Heatflow_worldAPI_Hardcoded.yaml'
  }
  // r2027: {
  //   id: 'ghfdb_r_2027',
  //   url: ''
  // }
})
