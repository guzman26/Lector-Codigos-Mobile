/**
 * Inventory move constants - single source of truth for locations and code lengths.
 * Used by movePallet, moveCart and related UI (SendPalletToTransit, SendCartToTransit).
 */

export const VALID_INVENTORY_LOCATIONS = [
  'PACKING',
  'TRANSITO',
  'BODEGA',
  'PREVENTA',
  'VENTA',
  'RECHAZO',
  'CUARENTENA',
  'SOLD',
  'UNSUBSCRIBED',
] as const;

export type InventoryLocation = (typeof VALID_INVENTORY_LOCATIONS)[number];

export const PALLET_CODE_LENGTH = 14;
export const CART_CODE_LENGTH = 16;

/** Default destination for "send to transit" screens */
export const TRANSIT_LOCATION = 'TRANSITO' as const;
