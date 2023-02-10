import { NativeBaseProvider as BaseProvider, NativeBaseProviderProps } from 'native-base';
import React, { ReactElement } from 'react';
import { Helmet } from "react-helmet";

import { chain, keys, mapValues, omit, pick, toLower } from 'lodash';
import { fontConfig, FontID, getFamiliesUrl } from './fonts';

type ILoadFonts = {
  [fontId in FontID]?: boolean;
}; 

const FAMILIES = chain(fontConfig)
  .mapValues(getFamiliesUrl)
  .mapKeys((_, key) => toLower(key) as FontID)
  .value();

const FAMILIES_AVAILABLE = keys(FAMILIES);  
const DEFAULT_FAMILIES = mapValues(FAMILIES, () => true);

export const NativeBaseProvider = ({ children, ...props }: NativeBaseProviderProps & ILoadFonts): ReactElement => {
  const rest = omit(props, FAMILIES_AVAILABLE);
  
  const loadFonts = chain(DEFAULT_FAMILIES)
    .clone()
    .assign(pick(props, FAMILIES_AVAILABLE))
    .pickBy()
    .keys()
    .value();
  
  return <BaseProvider {...rest}>
    <Helmet>
      {loadFonts.length && ([
        <link key="gapis" rel="preconnect" href="//fonts.googleapis.com"/>,
        <link key="gstatic" rel="preconnect" href="//fonts.gstatic.com" crossOrigin="crossorigin"/>
      ])}
      {loadFonts.map((fontID, index) => <link key={fontID+index} href={FAMILIES[fontID]} rel="stylesheet"/>)}
    </Helmet>
    {children}
  </BaseProvider>
};
