import * as catalogs from './catalog/index';
import * as sections from './sectionDefinitions';

const sectionsCategories = Object.values(catalogs).map((param) => param.sectionsCategories || []).flat();
const headerActionOptions = Object.values(catalogs).map((param) => param.headerActionOptions || []).flat();
const sectionDefinitions = Object.values(sections).flat();
export const mockedSectionDefinitions = {sectionDefinitions};
export const mockedCatalog = {sectionsCategories, headerActionOptions};