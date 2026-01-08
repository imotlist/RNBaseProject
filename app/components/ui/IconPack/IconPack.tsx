/**
 * IconPack component
 * Unified icon component supporting both IconSax and Tabler icons
 */

import React from "react"
import { View, ViewStyle } from "react-native"
import * as Iconsax from "iconsax-react-native"

// IconSax types
export type IconSaxName =
  | "user"
  | "home"
  | "setting"
  | "search"
  | "close"
  | "check"
  | "arrow-left"
  | "arrow-left2"
  | "arrow-right"
  | "arrow-down"
  | "arrow-down2"
  | "arrow-up"
  | "heart"
  | "notification"
  | "message"
  | "camera"
  | "image"
  | "document"
  | "location"
  | "menu"
  | "logout"
  | "edit"
  | "trash"
  | "add"
  | "minus"
  | "filter"
  | "sort"
  | "refresh"
  | "more"
  | "share"
  | "download"
  | "upload"
  | "link"
  | "copy"
  | "scan"
  | "barcode"
  | "qr-code"
  | "security"
  | "lock"
  | "unlock"
  | "eye"
  | "eye-off"
  | "star"
  | "star-filled"
  | "bookmark"
  | "bookmark-filled"
  | "info"
  | "warning"
  | "error"
  | "success"
  | "help"
  | "grid"
  | "list"
  | "calendar"
  | "clock"
  | "send"
  | "attach"
  | "folder"
  | "video"
  | "audio"
  | "volume-high"
  | "volume-low"
  | "volume-off"
  | "wifi"
  | "wifi-off"
  | "bluetooth"
  | "battery-charging"
  | "battery-full"
  | "battery-half"
  | "battery-low"
  | "zoom-in"
  | "zoom-out"
  | "resize"

export type IconType = "iconSax" | "tabler"

export interface IconPackProps {
  /**
   * Icon name
   */
  name: IconSaxName
  /**
   * Icon type/library
   */
  type?: IconType
  /**
   * Icon size
   */
  size?: number
  /**
   * Icon color
   */
  color?: string
  /**
   * Icon variant (for IconSax)
   */
  variant?: "Linear" | "Bold" | "Broken" | "Bulk" | "Outline" | "TwoTone"
  /**
   * Container style
   */
  containerStyle?: ViewStyle
  /**
   * Whether icon is disabled
   */
  disabled?: boolean
}

/**
 * IconPack component that abstracts multiple icon libraries
 */
export const IconPack: React.FC<IconPackProps> = ({
  name,
  type = "iconSax",
  size = 24,
  color = "#000",
  variant = "Linear",
  containerStyle,
  disabled = false,
}) => {
  const opacity = disabled ? 0.5 : 1

  // Icon component mapping for IconSax
  const iconComponents: Record<IconSaxName, React.ComponentType<any>> = {
    user: Iconsax.User,
    home: Iconsax.Home,
    setting: Iconsax.Setting,
    search: Iconsax.SearchNormal,
    close: Iconsax.CloseCircle,
    check: Iconsax.TickCircle,
    "arrow-left": Iconsax.ArrowLeft,
    "arrow-left2": Iconsax.ArrowLeft2,
    "arrow-right": Iconsax.ArrowRight,
    "arrow-down": Iconsax.ArrowDown,
    "arrow-down2": Iconsax.ArrowDown2,
    "arrow-up": Iconsax.ArrowUp,
    heart: Iconsax.Heart,
    notification: Iconsax.Notification,
    message: Iconsax.Message,
    camera: Iconsax.Camera,
    image: Iconsax.Image,
    document: Iconsax.Document,
    location: Iconsax.Location,
    menu: Iconsax.Menu,
    logout: Iconsax.Logout,
    edit: Iconsax.Edit,
    trash: Iconsax.Trash,
    add: Iconsax.Add,
    minus: Iconsax.Minus,
    filter: Iconsax.Filter,
    sort: Iconsax.Sort,
    refresh: Iconsax.Refresh,
    more: Iconsax.More,
    share: Iconsax.Send,
    download: Iconsax.DocumentDownload,
    upload: Iconsax.DocumentUpload,
    link: Iconsax.Link,
    copy: Iconsax.Copy,
    scan: Iconsax.Scan,
    barcode: Iconsax.Barcode,
    "qr-code": Iconsax.Scan,
    security: Iconsax.Shield,
    lock: Iconsax.Lock,
    unlock: Iconsax.Unlock,
    eye: Iconsax.Eye,
    "eye-off": Iconsax.EyeSlash,
    star: Iconsax.Star,
    "star-filled": Iconsax.Star,
    bookmark: Iconsax.Bookmark,
    "bookmark-filled": Iconsax.Bookmark,
    info: Iconsax.InfoCircle,
    warning: Iconsax.Danger,
    error: Iconsax.CloseCircle,
    success: Iconsax.TickCircle,
    help: Iconsax.MessageQuestion,
    grid: Iconsax.Grid1,
    list: Iconsax.Category,
    calendar: Iconsax.Calendar,
    clock: Iconsax.Clock,
    send: Iconsax.Send,
    attach: Iconsax.Paperclip,
    folder: Iconsax.Folder,
    video: Iconsax.Video,
    audio: Iconsax.Music,
    "volume-high": Iconsax.VolumeHigh,
    "volume-low": Iconsax.VolumeLow,
    "volume-off": Iconsax.VolumeSlash,
    wifi: Iconsax.Wifi,
    "wifi-off": Iconsax.Wifi,
    bluetooth: Iconsax.Bluetooth,
    "battery-charging": Iconsax.BatteryCharging,
    "battery-full": Iconsax.BatteryFull,
    "battery-half": Iconsax.BatteryEmpty,
    "battery-low": Iconsax.BatteryEmpty,
    "zoom-in": Iconsax.SearchZoomIn,
    "zoom-out": Iconsax.SearchZoomOut,
    resize: Iconsax.Maximize,
  }

  const IconComponent = iconComponents[name]

  if (!IconComponent) {
    return <View style={[{ width: size, height: size, opacity }, containerStyle]} />
  }

  return (
    <View style={[{ opacity }, containerStyle]}>
      <IconComponent
        size={size}
        color={color}
        variant={variant as any}
      />
    </View>
  )
}

/**
 * Icon name mapping for different libraries
 */
export const ICON_MAPPINGS: Record<IconSaxName, { iconSax?: string; tabler?: string }> = {
  user: { iconSax: "user", tabler: "user" },
  home: { iconSax: "home", tabler: "home" },
  setting: { iconSax: "setting", tabler: "settings" },
  search: { iconSax: "search", tabler: "search" },
  close: { iconSax: "close", tabler: "x" },
  check: { iconSax: "check", tabler: "check" },
  "arrow-left": { iconSax: "arrow-left", tabler: "arrow-left" },
  "arrow-left2": { iconSax: "arrow-left2", tabler: "arrow-left" },
  "arrow-right": { iconSax: "arrow-right", tabler: "arrow-right" },
  "arrow-down": { iconSax: "arrow-down", tabler: "arrow-down" },
  "arrow-down2": { iconSax: "arrow-down2", tabler: "arrow-down" },
  "arrow-up": { iconSax: "arrow-up", tabler: "arrow-up" },
  heart: { iconSax: "heart", tabler: "heart" },
  notification: { iconSax: "notification", tabler: "bell" },
  message: { iconSax: "message", tabler: "message" },
  camera: { iconSax: "camera", tabler: "camera" },
  image: { iconSax: "image", tabler: "photo" },
  document: { iconSax: "document", tabler: "file-text" },
  location: { iconSax: "location", tabler: "map-pin" },
  menu: { iconSax: "menu", tabler: "menu-2" },
  logout: { iconSax: "logout", tabler: "logout" },
  edit: { iconSax: "edit", tabler: "edit" },
  trash: { iconSax: "trash", tabler: "trash" },
  add: { iconSax: "add", tabler: "plus" },
  minus: { iconSax: "minus", tabler: "minus" },
  filter: { iconSax: "filter", tabler: "filter" },
  sort: { iconSax: "sort", tabler: "sort-ascending" },
  refresh: { iconSax: "refresh", tabler: "refresh" },
  more: { iconSax: "more", tabler: "dots" },
  share: { iconSax: "share", tabler: "share" },
  download: { iconSax: "download", tabler: "download" },
  upload: { iconSax: "upload", tabler: "upload" },
  link: { iconSax: "link", tabler: "link" },
  copy: { iconSax: "copy", tabler: "copy" },
  scan: { iconSax: "scan", tabler: "scan" },
  barcode: { iconSax: "barcode", tabler: "barcode" },
  "qr-code": { iconSax: "qr-code", tabler: "qr-code" },
  security: { iconSax: "security", tabler: "shield" },
  lock: { iconSax: "lock", tabler: "lock" },
  unlock: { iconSax: "unlock", tabler: "unlock" },
  eye: { iconSax: "eye", tabler: "eye" },
  "eye-off": { iconSax: "eye-slash", tabler: "eye-off" },
  star: { iconSax: "star", tabler: "star" },
  "star-filled": { iconSax: "star-filled", tabler: "star-filled" },
  bookmark: { iconSax: "bookmark", tabler: "bookmark" },
  "bookmark-filled": { iconSax: "bookmark-filled", tabler: "bookmark-filled" },
  info: { iconSax: "info", tabler: "info-circle" },
  warning: { iconSax: "warning", tabler: "alert-triangle" },
  error: { iconSax: "danger", tabler: "alert-circle" },
  success: { iconSax: "tick-circle", tabler: "check-circle" },
  help: { iconSax: "question", tabler: "help-circle" },
  grid: { iconSax: "grid", tabler: "grid" },
  list: { iconSax: "category", tabler: "list" },
  calendar: { iconSax: "calendar", tabler: "calendar" },
  clock: { iconSax: "clock", tabler: "clock" },
  send: { iconSax: "send", tabler: "send" },
  attach: { iconSax: "attach", tabler: "paperclip" },
  folder: { iconSax: "folder", tabler: "folder" },
  video: { iconSax: "video", tabler: "video" },
  audio: { iconSax: "music", tabler: "music" },
  "volume-high": { iconSax: "volume-high", tabler: "volume" },
  "volume-low": { iconSax: "volume-low", tabler: "volume-2" },
  "volume-off": { iconSax: "volume-slash", tabler: "volume-3" },
  wifi: { iconSax: "wifi", tabler: "wifi" },
  "wifi-off": { iconSax: "wifi-slash", tabler: "wifi-off" },
  bluetooth: { iconSax: "bluetooth", tabler: "bluetooth" },
  "battery-charging": { iconSax: "battery-charging", tabler: "charging" },
  "battery-full": { iconSax: "battery-full", tabler: "battery" },
  "battery-half": { iconSax: "battery-half", tabler: "battery-2" },
  "battery-low": { iconSax: "battery-low", tabler: "battery-3" },
  "zoom-in": { iconSax: "zoom-in", tabler: "zoom-in" },
  "zoom-out": { iconSax: "zoom-out", tabler: "zoom-out" },
  resize: { iconSax: "resize", tabler: "maximize" },
}

export default IconPack
