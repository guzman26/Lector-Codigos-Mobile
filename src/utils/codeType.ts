export const apiTypeToUiType = (pkTipo: 'BOX' | 'PALLET'): 'caja' | 'pallet' =>
  pkTipo === 'BOX' ? 'caja' : 'pallet';

export const uiTypeToApiType = (tipo: 'caja' | 'pallet'): 'BOX' | 'PALLET' =>
  tipo === 'caja' ? 'BOX' : 'PALLET';