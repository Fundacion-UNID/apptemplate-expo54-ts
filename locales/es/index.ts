// locales/es/index.js
import appCommon from './appCommon';
import appOrganization from './appOrganization';
import appFamily from './appFamily';
import roles from './roles';

export default {
  common: { ...appCommon },
  ...appCommon,
  ...roles,
  organization: appOrganization,
  family: appFamily,
};
