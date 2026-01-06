/**
 * hooks/index.ts
 * Export all custom hooks
 */

export { useBottomSheet } from "./useBottomSheet"
export { useFlashMessage, useFlashMessage as default } from "./useFlashMessage"
export type { FlashMessageOptions, FlashMessageType } from "./useFlashMessage"
export { useFormikSubmit } from "./useFormikSubmit"
export type { UseFormikSubmitOptions, FormikSubmitHandler } from "./useFormikSubmit"
export { useInfiniteScroll } from "./useInfiniteScroll"
export type { InfiniteScrollOptions, InfiniteScrollResult } from "./useInfiniteScroll"
export { useInfiniteList } from "./useInfiniteList"
export type {
  UseInfiniteListOptions,
  UseInfiniteListReturn,
  InfiniteListFetchOptions,
  InfiniteListFetchResult,
} from "./useInfiniteList"
export { useInternetConnection, useConnectionChange } from "./useInternetConnection"
export type { ConnectionStatus, UseConnectionChangeOptions } from "./useInternetConnection"
export { useAppPermission, useCameraPermission, useLocationPermission, usePhotoLibraryPermission, useStoragePermission, useNotificationPermission } from "./usePermissions"
export type { PermissionResult } from "./usePermissions"
