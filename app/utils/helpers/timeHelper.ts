/**
 * timeHelper.ts
 * Helper functions for time and date formatting
 */

import { format, formatDistanceToNow, differenceInMinutes, differenceInHours, differenceInDays } from "date-fns"
import { I18n } from "@/i18n"

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date | string | number, formatStr: string = "PPP"): string => {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  return format(dateObj, formatStr)
}

/**
 * Format a date to a time string
 */
export const formatTime = (date: Date | string | number, formatStr: string = "p"): string => {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  return format(dateObj, formatStr)
}

/**
 * Format a date to a date and time string
 */
export const formatDateTime = (date: Date | string | number): string => {
  return formatDate(date, "Pp")
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date | string | number): string => {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

/**
 * Get time ago in a simplified format
 */
export const getTimeAgo = (date: Date | string | number): string => {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  const now = new Date()
  const minutes = differenceInMinutes(now, dateObj)
  const hours = differenceInHours(now, dateObj)
  const days = differenceInDays(now, dateObj)

  if (minutes < 1) {
    return "Just now"
  } else if (minutes < 60) {
    return `${minutes}m ago`
  } else if (hours < 24) {
    return `${hours}h ago`
  } else if (days < 7) {
    return `${days}d ago`
  } else {
    return formatDate(dateObj, "MMM d, yyyy")
  }
}

/**
 * Format duration in seconds to readable string
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  } else if (minutes > 0) {
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  } else {
    return `0:${secs.toString().padStart(2, "0")}`
  }
}

/**
 * Format timestamp to ISO string
 */
export const toISOString = (date: Date | string | number): string => {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  return dateObj.toISOString()
}

/**
 * Check if date is today
 */
export const isToday = (date: Date | string | number): boolean => {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  const today = new Date()
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  )
}

/**
 * Check if date is yesterday
 */
export const isYesterday = (date: Date | string | number): boolean => {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  )
}

/**
 * Check if date is this week
 */
export const isThisWeek = (date: Date | string | number): boolean => {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  const now = new Date()
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return dateObj >= weekAgo && dateObj <= now
}

/**
 * Get date range string
 */
export const getDateRange = (startDate: Date | string | number, endDate: Date | string | number): string => {
  const start = typeof startDate === "string" || typeof startDate === "number" ? new Date(startDate) : startDate
  const end = typeof endDate === "string" || typeof endDate === "number" ? new Date(endDate) : endDate

  if (formatDate(start, "MMM yyyy") === formatDate(end, "MMM yyyy")) {
    return `${formatDate(start, "MMM d")} - ${formatDate(end, "d, yyyy")}`
  } else {
    return `${formatDate(start, "MMM d, yyyy")} - ${formatDate(end, "MMM d, yyyy")}`
  }
}

export default {
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  getTimeAgo,
  formatDuration,
  toISOString,
  isToday,
  isYesterday,
  isThisWeek,
  getDateRange,
}
